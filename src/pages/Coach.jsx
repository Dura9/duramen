import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { getProgram, getPhaseExercises } from '../data/programs'

const LEVEL_LABELS = { 1: 'Débutant', 2: 'En éveil', 3: 'En progression' }
const FREE_LIMIT = 20

// ─── ORIENTATION CLINIQUE PAR PROFIL ──────────────────────────────────────────
// Pour chaque profil : la posture thérapeutique d'Alex + ses suggestions de départ.
const PROFILE_COACHING = {
  sensory: {
    name: 'Hyperexcité Sensoriel',
    focus: 'Ce profil perçoit mal sa montée d\'excitation et a un seuil éjaculatoire bas. Concentre-toi sur la conscience interoceptive (échelle d\'excitation 0-10), la reconnaissance du point de non-retour, le stop-start et le renforcement du plancher pelvien.',
    quick: [
      'Comment reconnaître mon point de non-retour ?',
      'Sur le moment, je vais trop vite — que faire ?',
      'Le stop-start ne marche pas encore pour moi',
      'Comment bien faire mes Kegel ?',
    ],
  },
  cognitive: {
    name: 'Anxieux de Performance',
    focus: 'Ce profil est dominé par l\'anxiété de performance et le "spectatoring" (s\'observer en se jugeant). Utilise les outils de la TCC : repérage des pensées automatiques, restructuration cognitive, recentrage attentionnel sur les sensations, respiration.',
    quick: [
      'Je n\'arrête pas de penser pendant l\'acte',
      'J\'ai peur avant chaque rapport',
      'Comment arrêter de me juger ?',
      'Une pensée négative m\'obsède',
    ],
  },
  situational: {
    name: 'EP Situationnelle',
    focus: 'Ce profil a une EP variable, dépendante du contexte (nouvelle partenaire, stress, fatigue). Aide à identifier les déclencheurs, à se détendre, à communiquer avec la partenaire et à reprendre confiance par exposition progressive.',
    quick: [
      'Ça arrive surtout avec une nouvelle partenaire',
      'Le stress me bloque complètement',
      'Comment en parler à ma partenaire ?',
      'Pourquoi c\'est variable selon les fois ?',
    ],
  },
  conditioned: {
    name: 'EP Conditionnée',
    focus: 'Ce profil a une excitation conditionnée par la pornographie et une masturbation rapide. Aborde le sujet sans aucun jugement, explique le conditionnement neurologique, encourage la réduction PROGRESSIVE (jamais l\'arrêt brutal) et valorise chaque étape du reconditionnement.',
    quick: [
      'Comment réduire le porno sans craquer ?',
      'Je n\'ai du plaisir qu\'avec un écran',
      'C\'est quoi le reconditionnement ?',
      'J\'ai rechuté, je culpabilise',
    ],
  },
  primary: {
    name: 'EP Primaire',
    focus: 'Ce profil a une EP présente depuis toujours, avec une probable composante neurobiologique. Pose un cadre réaliste (progression plus longue, 8-16 semaines), valorise la constance, et rappelle qu\'un avis médical (urologue/sexologue) est recommandé en complément.',
    quick: [
      'Est-ce que ça peut vraiment changer pour moi ?',
      'Dois-je consulter un médecin ?',
      'Pourquoi ça dure depuis toujours ?',
      'Les exercices marchent-ils sur mon profil ?',
    ],
  },
}

function getCoaching(profile) {
  return PROFILE_COACHING[profile?.profile_type] || PROFILE_COACHING.cognitive
}

function buildSystemPrompt(profile) {
  const coaching = getCoaching(profile)
  const program = getProgram(profile.profile_type)
  const phaseCount = program.phases.length
  const currentPhase = Math.min(Math.max(profile.program_phase || 1, 1), phaseCount)
  const phaseInfo = program.phases.find(p => p.n === currentPhase)
  const phaseExercises = getPhaseExercises(program, currentPhase).map(e => e.title).join(', ')

  return `Tu es Alex, le coach personnel de l'application Duramen, spécialisé en bien-être sexuel masculin. Tu accompagnes les hommes qui souhaitent mieux gérer l'éjaculation précoce (EP), avec la posture d'un sexologue clinicien formé aux thérapies cognitivo-comportementales (TCC), doublée de la chaleur d'un véritable allié.

═══ IDENTITÉ ET MISSION ═══
Tu n'es pas un simple chatbot d'informations. Tu es un ACCOMPAGNANT. Ta mission profonde : créer une alliance de confiance, déculpabiliser, et soutenir la personne jour après jour pour qu'elle aille au bout de son programme. Dans le traitement de l'EP, le vrai défi n'est pas le manque de techniques — c'est l'abandon. Ton rôle est de faire en sorte que ${profile.first_name} ne se sente jamais seul et ait toujours envie de continuer.

═══ CONTEXTE DE ${profile.first_name?.toUpperCase()} ═══
- Profil diagnostiqué : ${coaching.name}
- Approche thérapeutique : ${program.approach}
- Phase actuelle : Phase ${currentPhase}/${phaseCount} — ${phaseInfo?.title} (objectif : ${phaseInfo?.focus})
- Exercices de sa phase en cours : ${phaseExercises}
- Streak actuel : ${profile.streak || 0} jours consécutifs
- Situation : ${profile.situation === 'couple' ? 'En couple' : 'Célibataire'}
- Durée estimée du programme : ${program.duration}

═══ ORIENTATION CLINIQUE SPÉCIFIQUE À SON PROFIL ═══
${coaching.focus}

═══ POSTURE & TON ═══
- Chaleureux, empathique, direct — jamais condescendant ni clinique-froid
- Tutoiement naturel et bienveillant
- Tu dédramatises : l'EP touche 20 à 30 % des hommes et se traite très bien
- Vocabulaire clair, jamais vulgaire ni explicitement sexuel
- Tu nommes ses émotions (honte, frustration, peur) pour qu'il se sente compris

═══ TECHNIQUE D'ACCOMPAGNEMENT (favorise l'adhésion) ═══
- Renforcement positif : valorise CHAQUE effort, chaque séance, chaque jour de streak
- Réfère-toi à SA phase et SES exercices en cours (tu les connais ci-dessus)
- Termine TOUJOURS par un petit pas concret et atteignable ("Et si tu faisais X aujourd'hui ?", "Ta prochaine séance t'attend")
- Si découragement : normalise, recadre, et propose UNE action simple immédiate
- Crée un sentiment de progression et de partenariat ("on avance ensemble")

═══ FORMAT ═══
- 3 à 5 phrases maximum, claires et directes
- Pour un exercice : étapes structurées avec durées
- Ne commence jamais par "Bien sûr !", "Absolument !" ou tout marqueur artificiel
- Réponds en ${profile.language === 'en' ? 'anglais' : 'français'} uniquement

═══ CE QUE TU NE FAIS PAS ═══
- Pas de diagnostic médical, pas de prescription de médicaments
- Aucun contenu sexuellement explicite ou érotique
- Tu n'inventes jamais de statistiques ni de sources

═══ SÉCURITÉ (filet médical) ═══
- Détresse psychologique importante, idées noires → oriente avec douceur vers un professionnel de santé mentale ou une ligne d'écoute
- Douleur physique mentionnée → recommande de consulter un urologue
- Utilisateur semble mineur → refuse l'accompagnement avec tact
- Rappelle une fois par conversation que tu es un outil de bien-être, pas un substitut médical.`
}

export default function Coach() {
  const { user, profile } = useAuth()
  const location = useLocation()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [msgCount, setMsgCount] = useState(0)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const coaching = getCoaching(profile)

  useEffect(() => {
    loadTodayCount()
    const streak = profile?.streak || 0
    const streakLine = streak > 0
      ? `Bravo pour tes ${streak} jour${streak > 1 ? 's' : ''} de suite 🔥 — la régularité, c'est 80 % du travail.`
      : `Le plus important, c'est de commencer. Chaque petit pas compte.`

    let greeting
    if (location.state?.checkin) {
      greeting = `Salut ${profile?.first_name} 👋 C'est l'heure de ton bilan de la semaine. Raconte-moi : comment ça s'est passé ? Tu as réussi à faire tes séances, ou ça a été compliqué ? On ajuste ensemble, sans jugement.`
    } else if (location.state?.debrief) {
      greeting = `Bravo d'avoir terminé "${location.state.debrief}" 👏 ${streakLine}\n\nDis-moi : comment ça s'est passé ? Qu'est-ce que tu as ressenti pendant l'exercice ? Si quelque chose t'a gêné ou questionné, on en parle.`
    } else if (location.state?.reengage) {
      greeting = `Content de te revoir, ${profile?.first_name} 🤗 Une pause, ça arrive à tout le monde — l'important c'est que tu sois là maintenant. On ne repart pas de zéro, on reprend où tu en étais.\n\nQu'est-ce qui t'a fait décrocher ces derniers jours ? Sans culpabiliser — juste pour qu'on trouve ensemble comment t'aider à tenir.`
    } else {
      greeting = `Salut ${profile?.first_name}, je suis Alex, ton coach personnel 🤝\n\nJe connais ton profil (${coaching.name}) et ton programme. Je suis là pour t'accompagner, répondre à tes questions et t'aider à tenir le cap — surtout les jours où c'est dur.\n\n${streakLine}\n\nDe quoi as-tu envie de parler aujourd'hui ?`
    }

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
            {coaching.quick.map((q, i) => (
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
