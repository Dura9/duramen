import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'


const LEVEL_LABELS = { 1: 'Débutant', 2: 'En éveil', 3: 'En progression' }
const FREE_LIMIT = 20

function buildSystemPrompt(profile) {
  return `Tu es Alex, le coach personnel de l'application Duramen, spécialisé en bien-être sexuel masculin. Tu accompagnes les hommes qui souhaitent mieux gérer l'éjaculation précoce, avec la posture d'un thérapeute sexologue clinicien formé aux thérapies cognitivo-comportementales (TCC).

CONTEXTE UTILISATEUR :
- Prénom : ${profile.first_name}
- Niveau diagnostiqué : ${LEVEL_LABELS[profile.level] || 'Débutant'}
- Semaine du programme : ${profile.program_week}
- Phase actuelle : ${profile.program_phase}
- Streak actuel : ${profile.streak || 0} jours consécutifs
- Situation : ${profile.situation === 'couple' ? 'En couple' : 'Célibataire'}
- Objectif : ${profile.goal || 'contrôle'}
- Profil conditionné : ${profile.flag_conditioned_high ? 'EP conditionnée confirmée (pornographie + masturbation rapide)' : profile.flag_conditioned_moderate ? 'EP conditionnée possible' : 'Non applicable'}

TON RÔLE :
- Accueillir avec bienveillance, sans jugement
- Guider des exercices (stop-start, squeeze, Kegel, respiration, pleine conscience)
- Aider à réduire l'anxiété de performance
- Adapter le discours selon la situation (seul ou en couple)
- Orienter vers un professionnel quand nécessaire

TON TON :
- Chaleureux, empathique, direct — jamais condescendant
- Tutoyement naturel et bienveillant
- Vocabulaire médical clair, jamais vulgaire ni explicitement sexuel
- Tu dédramatises : l'EP touche 20-30% des hommes et se traite très bien
- Tu valorises chaque effort, chaque séance complétée

FORMAT DES RÉPONSES :
- Réponse générale : 3 à 5 phrases maximum, claire et directe
- Pour les exercices : format structuré étape par étape avec durées précises
- Ne commence jamais par "Bien sûr !", "Absolument !" ou tout marqueur artificiel
- Réponds en ${profile.language === 'en' ? 'anglais' : 'français'} uniquement

SI PROFIL CONDITIONNÉ CONFIRMÉ OU POSSIBLE :
- Aborder le sujet de la pornographie sans jugement
- Expliquer le mécanisme de conditionnement neurologique avec bienveillance
- Encourager la réduction progressive et non l'arrêt brutal
- Valoriser chaque étape du reconditionnement

CE QUE TU NE FAIS PAS :
- Tu ne poses pas de diagnostic médical
- Tu ne prescris pas de médicaments
- Tu ne produis aucun contenu sexuellement explicite ou érotique
- Tu n'inventes jamais de statistiques ou de sources

SITUATIONS SENSIBLES :
- Détresse psychologique importante → orienter vers un professionnel de santé mentale
- Douleurs physiques mentionnées → recommander de consulter un urologue
- Utilisateur semble mineur → refuser l'accompagnement

DISCLAIMER : Tu rappelles une fois par conversation que tu es un outil de bien-être, pas un substitut médical.`
}

const QUICK_QUESTIONS = [
  'Comment faire les Kegel correctement ?',
  'Je ne vois pas de progrès...',
  'Comment gérer l\'anxiété ?',
  'Quand voir des résultats ?',
]

export default function Coach() {
  const { user, profile } = useAuth()
  const location = useLocation()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [msgCount, setMsgCount] = useState(0)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    loadTodayCount()
    const greeting = location.state?.checkin
      ? `Bonjour ${profile?.first_name} ! C'est le moment de ton check-in hebdomadaire. Comment s'est passée ta semaine ? Tu as réussi à faire tes séances ?`
      : `Bonjour ${profile?.first_name} ! Je suis Alex, ton coach personnel sur Duramen. Je suis là pour t'accompagner avec bienveillance.\n\n⚠️ Je suis un assistant IA spécialisé, pas un médecin. Tout ce que je partage est à titre éducatif. Pour un diagnostic médical, consulte un médecin ou un sexologue.\n\nTu es en semaine ${profile?.program_week}, ${LEVEL_LABELS[profile?.level] || 'Débutant'}. Par quoi veux-tu commencer ?`

    setMessages([{ role: 'assistant', content: greeting }])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function loadTodayCount() {
    const today = new Date().toDateString()
    const stored = localStorage.getItem(`duramen_msg_${user.id}_${today}`)
    setMsgCount(stored ? parseInt(stored) : 0)
  }

  async function send(text) {
    if (!text.trim() || loading) return
    if (msgCount >= FREE_LIMIT) return

    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    const today = new Date().toDateString()
    const newCount = msgCount + 1
    setMsgCount(newCount)
    localStorage.setItem(`duramen_msg_${user.id}_${today}`, newCount)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'google/gemma-4-31b-it:free',
          messages: [
            { role: 'system', content: buildSystemPrompt(profile) },
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
          ],
          max_tokens: 600,
          temperature: 0.7,
        }),
      })

      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || 'Désolé, je n\'ai pas pu répondre. Réessaie.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])

      await supabase.from('chat_messages').insert({
        user_id: user.id,
        role: 'user',
        content: text,
        created_at: new Date().toISOString(),
      })
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        role: 'assistant',
        content: reply,
        created_at: new Date().toISOString(),
      })
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Une erreur s\'est produite. Vérifie ta connexion et réessaie.' }])
    }

    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send(input)
    }
  }

  const remaining = FREE_LIMIT - msgCount

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)', paddingBottom: 'calc(70px + env(safe-area-inset-bottom, 0px))' }}>

      {/* ── HEADER GRADIENT ──────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, var(--primary) 0%, #3a6359 100%)',
        padding: '52px 20px 18px',
        flexShrink: 0,
        position: 'relative', overflow: 'hidden',
        borderRadius: '0 0 24px 24px',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🧠</div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: '#4ADE80', border: '2px solid #3a6359' }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 600, color: '#fff' }}>Alex</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Coach Duramen · En ligne</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '5px 12px', fontSize: 12, color: '#fff', fontWeight: 500, flexShrink: 0 }}>
            {remaining} msg
          </div>
        </div>
      </div>

      {/* ── MESSAGES ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 20 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: 8, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            {msg.role === 'assistant' && (
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🧠</div>
            )}
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? 'var(--primary)' : 'var(--bg-card)',
              color: msg.role === 'user' ? '#fff' : 'var(--text)',
              fontSize: 14,
              lineHeight: 1.6,
              boxShadow: 'var(--shadow)',
              whiteSpace: 'pre-wrap',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🧠</div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '18px 18px 18px 4px', padding: '14px 16px', display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-muted)', animation: 'blink 1.2s infinite', animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
          </div>
        )}

        {remaining === 0 && (
          <div style={{ background: 'var(--accent-light)', border: '1px solid #e8c97a', borderRadius: 14, padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#7a5c00', marginBottom: 4 }}>Limite quotidienne atteinte</div>
            <div style={{ fontSize: 13, color: '#9a7a20' }}>Tu as utilisé tes {FREE_LIMIT} messages d'aujourd'hui. Reviens demain ! 🌙</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── BARRE DE SAISIE ──────────────────────────────────────────── */}
      <div style={{ padding: '12px 16px 20px', background: 'var(--bg)', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        {messages.length <= 2 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
            {QUICK_QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => send(q)} style={{ fontSize: 12, padding: '7px 13px', border: '1px solid var(--border)', borderRadius: 20, background: 'var(--bg-card)', color: 'var(--primary)', cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s' }}>
                {q}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={remaining === 0 ? 'Limite atteinte pour aujourd\'hui...' : 'Pose une question à Alex...'}
            disabled={remaining === 0 || loading}
            rows={1}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: 22, border: '1px solid var(--border)',
              fontSize: 14, background: 'var(--bg-card)', color: 'var(--text)',
              outline: 'none', resize: 'none', maxHeight: 100,
              opacity: remaining === 0 ? 0.5 : 1,
            }}
            onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px' }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading || remaining === 0}
            style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: (!input.trim() || loading || remaining === 0) ? 0.5 : 1, cursor: 'pointer', transition: 'opacity 0.15s' }}
          >
            <i className="ti ti-send" style={{ fontSize: 18, color: '#fff' }}></i>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 60%, 100% { opacity: 0.2; }
          30% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
