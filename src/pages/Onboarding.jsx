import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const STEPS = [
  {
    id: 'welcome',
    type: 'text_input',
    question: 'Commençons par faire connaissance.',
    label: 'Quel est ton prénom ?',
    placeholder: 'Ton prénom...',
    field: 'first_name',
  },
  {
    id: 'language',
    type: 'choice',
    question: 'Quelle langue préfères-tu ?',
    field: 'language',
    options: [
      { value: 'fr', label: '🇫🇷 Français' },
      { value: 'en', label: '🇬🇧 English' },
    ],
  },
  {
    id: 'situation',
    type: 'choice',
    question: 'Quelle est ta situation actuelle ?',
    field: 'situation',
    options: [
      { value: 'single', label: '👤 Célibataire', desc: 'Je travaille seul sur mon bien-être' },
      { value: 'couple', label: '👫 En couple', desc: 'Je veux progresser avec ma partenaire' },
    ],
  },
  {
    id: 'duration',
    type: 'choice',
    question: 'En général, combien de temps dures-tu ?',
    subtitle: 'Sois honnête — il n\'y a aucun jugement ici.',
    field: 'duration',
    options: [
      { value: 1, label: 'Moins d\'1 minute', score: 0 },
      { value: 2, label: '1 à 3 minutes', score: 1 },
      { value: 3, label: '3 à 5 minutes', score: 2 },
      { value: 4, label: 'Plus de 5 minutes', score: 3 },
    ],
  },
  {
    id: 'anxiety',
    type: 'choice',
    question: 'L\'anxiété joue-t-elle un rôle ?',
    subtitle: 'Stress, pression de performance, pensées négatives...',
    field: 'anxiety',
    options: [
      { value: 1, label: 'Jamais', score: 3 },
      { value: 2, label: 'Parfois', score: 2 },
      { value: 3, label: 'Souvent', score: 1 },
      { value: 4, label: 'Presque toujours', score: 0 },
    ],
  },
  {
    id: 'experience',
    type: 'choice',
    question: 'As-tu déjà essayé des techniques ?',
    field: 'experience',
    options: [
      { value: 1, label: 'Jamais entendu parler', score: 0 },
      { value: 2, label: 'J\'en ai entendu parler', score: 1 },
      { value: 3, label: 'J\'ai essayé quelques fois', score: 2 },
      { value: 4, label: 'Je pratique régulièrement', score: 3 },
    ],
  },
  {
    id: 'goal',
    type: 'choice',
    question: 'Quel est ton objectif principal ?',
    field: 'goal',
    options: [
      { value: 'duration', label: '⏱ Durer plus longtemps' },
      { value: 'control', label: '🎯 Mieux contrôler mes sensations' },
      { value: 'anxiety', label: '🧘 Réduire mon anxiété' },
      { value: 'intimacy', label: '💑 Améliorer l\'intimité en couple' },
    ],
  },
]

function computeLevel(answers) {
  const score = (answers.duration?.score ?? 0) + (answers.anxiety?.score ?? 0) + (answers.experience?.score ?? 0)
  if (score <= 3) return 1
  if (score <= 6) return 2
  return 3
}

const LEVEL_INFO = {
  1: { label: 'Débutant', color: '#4A7C6F', bg: '#e8f2f0', desc: 'On part de zéro ensemble — c\'est parfait. Les fondations solides font les grands progrès.' },
  2: { label: 'En éveil', color: '#D4A855', bg: '#fdf6e3', desc: 'Tu as déjà des bases. On va les solidifier et aller plus loin.' },
  3: { label: 'En progression', color: '#7C6F4A', bg: '#f5f0e8', desc: 'Tu progresses déjà. On va affiner ta technique et consolider tes acquis.' },
}

export default function Onboarding() {
  const { user, refreshProfile } = useAuth()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [textValue, setTextValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const currentStep = STEPS[step]
  const isLast = step === STEPS.length - 1

  function handleChoice(option) {
    const newAnswers = { ...answers, [currentStep.field]: option }
    setAnswers(newAnswers)
    if (isLast) {
      setAnswers(newAnswers)
      setShowResult(true)
    } else {
      setTimeout(() => setStep(s => s + 1), 250)
    }
  }

  function handleTextNext() {
    if (!textValue.trim()) return
    setAnswers(a => ({ ...a, [currentStep.field]: textValue.trim() }))
    setTextValue('')
    setStep(s => s + 1)
  }

  async function handleFinish() {
    setLoading(true)
    const level = computeLevel(answers)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      first_name: answers.first_name,
      language: answers.language?.value ?? 'fr',
      situation: answers.situation?.value ?? 'single',
      goal: answers.goal?.value ?? 'control',
      level,
      program_week: 1,
      program_phase: 1,
      streak: 0,
      streak_last_date: null,
      xp: 0,
      onboarding_completed: true,
      created_at: new Date().toISOString(),
    })
    if (!error) await refreshProfile()
    setLoading(false)
  }

  if (showResult) {
    const level = computeLevel(answers)
    const info = LEVEL_INFO[level]
    return (
      <div style={{ minHeight: '100vh', padding: '40px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: info.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>🎯</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text)', marginBottom: 8 }}>Ton profil est prêt</div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Voici ton diagnostic, {answers.first_name}</div>
        </div>

        <div className="card" style={{ background: info.bg, border: `1.5px solid ${info.color}30`, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ background: info.color, color: '#fff', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 16 }}>{level}</div>
            <div>
              <div style={{ fontSize: 11, color: info.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Niveau diagnostiqué</div>
              <div style={{ fontSize: 20, fontFamily: 'var(--font-display)', color: 'var(--text)' }}>{info.label}</div>
            </div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6 }}>{info.desc}</p>
        </div>

        <div className="card" style={{ marginBottom: 32 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Ton programme personnalisé</div>
          {[
            { phase: 'Phase 1', title: 'Conscience corporelle', weeks: 'Semaines 1–2', active: true },
            { phase: 'Phase 2', title: 'Renforcement', weeks: 'Semaines 3–4', active: false },
            { phase: 'Phase 3', title: 'Maîtrise active', weeks: 'Semaines 5–6', active: false },
            { phase: 'Phase 4', title: 'Intégration', weeks: 'Semaines 7–8', active: false },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.active ? 'var(--primary)' : 'var(--border)', flexShrink: 0 }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: p.active ? 500 : 400, color: p.active ? 'var(--text)' : 'var(--text-muted)' }}>{p.phase} — {p.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.weeks}</div>
              </div>
              {!p.active && <i className="ti ti-lock" style={{ fontSize: 14, color: 'var(--border)' }}></i>}
              {p.active && <span className="badge badge-green">En cours</span>}
            </div>
          ))}
        </div>

        <button className="btn-primary" onClick={handleFinish} disabled={loading}>
          {loading ? <span className="spinner"></span> : 'Commencer mon programme →'}
        </button>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 24px', display: 'flex', flexDirection: 'column' }} className="fade-in">
      <div style={{ display: 'flex', gap: 4, marginBottom: 40 }}>
        {STEPS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }}></div>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 500, color: 'var(--text)', marginBottom: 8, lineHeight: 1.3 }}>{currentStep.question}</h2>
          {currentStep.subtitle && <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>{currentStep.subtitle}</p>}
        </div>

        {currentStep.type === 'text_input' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <input
              type="text"
              value={textValue}
              onChange={e => setTextValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTextNext()}
              placeholder={currentStep.placeholder}
              autoFocus
              style={{ width: '100%', padding: '16px 18px', borderRadius: 'var(--radius)', border: '1.5px solid var(--primary)', fontSize: 18, background: 'var(--bg-card)', color: 'var(--text)', outline: 'none' }}
            />
            <button className="btn-primary" onClick={handleTextNext} disabled={!textValue.trim()}>Continuer →</button>
          </div>
        )}

        {currentStep.type === 'choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {currentStep.options.map(option => (
              <button
                key={option.value}
                onClick={() => handleChoice(option)}
                style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--radius)',
                  border: `1.5px solid ${answers[currentStep.field]?.value === option.value ? 'var(--primary)' : 'var(--border)'}`,
                  background: answers[currentStep.field]?.value === option.value ? 'var(--primary-light)' : 'var(--bg-card)',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>{option.label}</div>
                {option.desc && <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{option.desc}</div>}
              </button>
            ))}
          </div>
        )}
      </div>

      {step > 0 && (
        <button onClick={() => setStep(s => s - 1)} style={{ marginTop: 24, color: 'var(--text-muted)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <i className="ti ti-arrow-left"></i> Retour
        </button>
      )}
    </div>
  )
}
