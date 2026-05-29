import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const EXERCISES = [
  {
    id: 'breathing',
    phase: 1,
    icon: 'ti-wind',
    title: 'Respiration diaphragmatique',
    subtitle: 'Conscience corporelle',
    duration: '8 min',
    level: 1,
    xp: 10,
    steps: [
      { text: 'Allonge-toi sur le dos, jambes légèrement écartées, bras le long du corps.', duration: 10 },
      { text: 'Pose une main sur ton ventre, une main sur ta poitrine.', duration: 8 },
      { text: 'Inspire lentement par le nez pendant 4 secondes. Seule la main sur le ventre doit se lever.', duration: 4 },
      { text: 'Retiens ta respiration doucement pendant 2 secondes.', duration: 2 },
      { text: 'Expire lentement par la bouche pendant 6 secondes. Sens ton ventre descendre.', duration: 6 },
      { text: 'Répète ce cycle 10 fois en restant concentré sur les sensations.', duration: 120 },
    ],
    note: 'La respiration diaphragmatique active le système nerveux parasympathique, réduisant directement l\'anxiété de performance.',
  },
  {
    id: 'kegel_basic',
    phase: 1,
    icon: 'ti-activity',
    title: 'Kegel — Niveau débutant',
    subtitle: 'Renforcement du plancher pelvien',
    duration: '10 min',
    level: 1,
    xp: 10,
    steps: [
      { text: 'Trouve ton muscle PC : c\'est le muscle que tu contractes pour arrêter d\'uriner. Identifie-le sans contracter les fesses.', duration: 15 },
      { text: 'Contracte ce muscle pendant 3 secondes.', duration: 3 },
      { text: 'Relâche complètement pendant 3 secondes. Le relâchement est aussi important que la contraction.', duration: 3 },
      { text: 'Répète 10 fois. Repose 30 secondes.', duration: 90 },
      { text: 'Fais 2 séries supplémentaires avec 30 secondes de repos entre chaque.', duration: 180 },
    ],
    note: 'Un plancher pelvien fort améliore le contrôle éjaculatoire. La régularité (quotidienne) est plus importante que l\'intensité.',
  },
  {
    id: 'body_scan',
    phase: 1,
    icon: 'ti-eye',
    title: 'Scan corporel',
    subtitle: 'Pleine conscience et sensations',
    duration: '12 min',
    level: 1,
    xp: 10,
    steps: [
      { text: 'Allonge-toi confortablement. Ferme les yeux et fais quelques respirations profondes.', duration: 20 },
      { text: 'Porte ton attention sur tes pieds. Observe les sensations sans jugement.', duration: 30 },
      { text: 'Remonte progressivement : mollets, genoux, cuisses. Remarque chaque sensation.', duration: 60 },
      { text: 'Concentre-toi sur le bas du ventre et le périnée. Sens si cette zone est tendue ou détendue.', duration: 60 },
      { text: 'Continue vers le ventre, la poitrine, les épaules. Relâche les tensions que tu trouves.', duration: 60 },
      { text: 'Termine sur le visage et le sommet du crâne. Ouvre les yeux doucement.', duration: 30 },
    ],
    note: 'La conscience corporelle est la base du contrôle. Reconnaître les sensations d\'excitation avant qu\'elles deviennent incontrôlables est la clé.',
  },
  {
    id: 'stop_start',
    phase: 2,
    icon: 'ti-pause',
    title: 'Technique Stop-Start',
    subtitle: 'Contrôle de l\'excitation',
    duration: '15 min',
    level: 2,
    xp: 15,
    steps: [
      { text: 'Commence une stimulation sexuelle seul, à ton propre rythme.', duration: 10 },
      { text: 'Augmente lentement l\'intensité. Sois attentif à ton niveau d\'excitation sur une échelle de 1 à 10.', duration: 30 },
      { text: 'Quand tu atteins un niveau 7/10, STOP. Arrête toute stimulation.', duration: 5 },
      { text: 'Respire profondément. Attends que ton niveau redescende à 4/10. Prends le temps nécessaire.', duration: 30 },
      { text: 'Reprends la stimulation. Répète ce cycle stop-start 3 fois.', duration: 300 },
      { text: 'La dernière fois, laisse-toi aller si tu le souhaites. Observe la différence.', duration: 30 },
    ],
    note: 'La technique stop-start entraîne ton système nerveux à reconnaître et contrôler le point de non-retour. 4 à 8 semaines de pratique régulière montrent des résultats significatifs.',
  },
  {
    id: 'kegel_advanced',
    phase: 2,
    icon: 'ti-bolt',
    title: 'Kegel — Niveau avancé',
    subtitle: 'Contractions rapides et endurance',
    duration: '12 min',
    level: 2,
    xp: 15,
    steps: [
      { text: 'Série 1 — Contractions lentes : contracte 5 secondes, relâche 5 secondes. 10 répétitions.', duration: 100 },
      { text: 'Repos 30 secondes.', duration: 30 },
      { text: 'Série 2 — Contractions rapides : contracte et relâche rapidement. 20 répétitions.', duration: 40 },
      { text: 'Repos 30 secondes.', duration: 30 },
      { text: 'Série 3 — Contraction longue : contracte et maintiens 10 secondes. 5 répétitions.', duration: 75 },
    ],
    note: 'La variété des contractions développe à la fois la force et l\'endurance musculaire.',
  },
  {
    id: 'squeeze',
    phase: 3,
    icon: 'ti-hand-stop',
    title: 'Technique Squeeze',
    subtitle: 'Maîtrise avancée',
    duration: '15 min',
    level: 3,
    xp: 20,
    locked: true,
    steps: [],
    note: 'Débloqué en semaine 5.',
  },
]

function ExerciseModal({ exercise, onClose, onComplete }) {
  const [stepIndex, setStepIndex] = useState(-1)
  const [timer, setTimer] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [mood, setMood] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!running || timer <= 0) return
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [running, stepIndex])

  useEffect(() => {
    if (running && timer === 0 && stepIndex >= 0) {
      setTimeout(() => nextStep(), 800)
    }
  }, [timer])

  function startExercise() {
    setStepIndex(0)
    setTimer(exercise.steps[0].duration)
    setRunning(true)
  }

  function nextStep() {
    clearInterval(timerRef.current)
    const next = stepIndex + 1
    if (next >= exercise.steps.length) {
      setRunning(false)
      setDone(true)
    } else {
      setStepIndex(next)
      setTimer(exercise.steps[next].duration)
    }
  }

  function handleMood(m) {
    setMood(m)
    setTimeout(() => onComplete(m), 600)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
      <div style={{ background: 'var(--bg)', borderRadius: '24px 24px 0 0', padding: '28px 24px 40px', width: '100%', maxWidth: 480, margin: '0 auto', maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text)' }}>{exercise.title}</div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: 20 }}><i className="ti ti-x"></i></button>
        </div>

        {stepIndex === -1 && !done && (
          <div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
              Durée estimée : {exercise.duration} · {exercise.steps.length} étapes<br />
              Installe-toi confortablement dans un endroit calme avant de commencer.
            </p>
            <div style={{ background: 'var(--primary-light)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10 }}>
              <i className="ti ti-info-circle" style={{ color: 'var(--primary)', fontSize: 16, marginTop: 2, flexShrink: 0 }}></i>
              <p style={{ fontSize: 13, color: 'var(--primary)', lineHeight: 1.5 }}>{exercise.note}</p>
            </div>
            <button className="btn-primary" onClick={startExercise}>Commencer l'exercice</button>
          </div>
        )}

        {stepIndex >= 0 && !done && (
          <div className="fade-in">
            <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
              {exercise.steps.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= stepIndex ? 'var(--primary)' : 'var(--border)' }}></div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: timer === 0 ? 'var(--accent)' : 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: timer > 99 ? 20 : 28, color: '#fff', fontFamily: 'var(--font-display)', transition: 'background 0.3s' }}>
                {timer === 0 ? '✓' : timer}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Étape {stepIndex + 1}/{exercise.steps.length}</div>
              <p style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.6 }}>{exercise.steps[stepIndex].text}</p>
            </div>
            <button className="btn-primary" onClick={nextStep}>
              {stepIndex === exercise.steps.length - 1 ? 'Terminer ✓' : 'Étape suivante →'}
            </button>
          </div>
        )}

        {done && (
          <div className="fade-in" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Exercice terminé !</div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>+{exercise.xp} XP gagnés</p>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Comment tu te sens ?</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                {['😐', '😊', '😄'].map(m => (
                  <button key={m} onClick={() => handleMood(m)} style={{ fontSize: 36, background: mood === m ? 'var(--primary-light)' : 'transparent', borderRadius: 12, padding: 12, border: mood === m ? '2px solid var(--primary)' : '2px solid transparent', transition: 'all 0.15s' }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Exercises() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [activeExercise, setActiveExercise] = useState(null)
  const [phaseUnlocked, setPhaseUnlocked] = useState(null)

  const PHASE_UNLOCK_THRESHOLD = { 1: 5, 2: 5 }

  async function handleComplete(mood) {
    if (!user || !activeExercise) return
    const ex = activeExercise

    await supabase.from('sessions').insert({
      user_id: user.id,
      exercise_id: ex.id,
      mood,
      xp_earned: ex.xp,
      completed_at: new Date().toISOString(),
    })

    const today = new Date().toDateString()
    const lastDate = profile.streak_last_date ? new Date(profile.streak_last_date).toDateString() : null
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = lastDate === yesterday.toDateString()
    const isToday = lastDate === today

    const newStreak = isToday ? profile.streak : isYesterday ? (profile.streak + 1) : 1

    const currentPhase = profile.program_phase || 1
    const phaseExerciseIds = EXERCISES.filter(e => e.phase === currentPhase).map(e => e.id)
    const { count } = await supabase
      .from('sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .in('exercise_id', phaseExerciseIds)

    const totalPhaseSessions = (count || 0) + 1
    const threshold = PHASE_UNLOCK_THRESHOLD[currentPhase]
    const shouldAdvancePhase = threshold && totalPhaseSessions >= threshold && currentPhase < 3

    const newWeek = Math.min(8, Math.floor(totalPhaseSessions / 2) + (currentPhase - 1) * 2 + 1)

    await supabase.from('profiles').update({
      xp: (profile.xp || 0) + ex.xp,
      streak: newStreak,
      streak_last_date: new Date().toISOString(),
      ...(shouldAdvancePhase && { program_phase: currentPhase + 1, program_week: (currentPhase) * 2 + 1 }),
    }).eq('id', user.id)

    await refreshProfile()
    setActiveExercise(null)
    if (shouldAdvancePhase) {
      setPhaseUnlocked(currentPhase + 1)
    }
  }

  const currentPhase = profile?.program_phase || 1

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-title">Exercices</div>
        <div className="page-subtitle">Programme progressif — Phase {currentPhase}</div>
      </div>

      {[1, 2, 3].map(phase => {
        const phaseExercises = EXERCISES.filter(e => e.phase === phase)
        const isLocked = phase > currentPhase
        return (
          <div key={phase} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div className="section-label" style={{ margin: 0 }}>Phase {phase}</div>
              {isLocked && <span className="badge badge-gray"><i className="ti ti-lock" style={{ fontSize: 10 }}></i> Verrouillé</span>}
              {!isLocked && phase < currentPhase && <span className="badge badge-green"><i className="ti ti-check" style={{ fontSize: 10 }}></i> Terminé</span>}
              {phase === currentPhase && <span className="badge badge-gold">En cours</span>}
            </div>

            {phaseExercises.map(ex => (
              <div
                key={ex.id}
                className="card"
                style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 10, opacity: isLocked ? 0.5 : 1, cursor: isLocked ? 'not-allowed' : 'pointer' }}
                onClick={() => !isLocked && setActiveExercise(ex)}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`ti ${ex.icon}`} style={{ fontSize: 22, color: 'var(--primary)' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{ex.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{ex.duration} · {ex.subtitle}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, background: ex.level === 1 ? 'var(--primary-light)' : ex.level === 2 ? 'var(--accent-light)' : '#fde8e8', color: ex.level === 1 ? 'var(--primary)' : ex.level === 2 ? '#7a5c00' : '#c0392b', padding: '3px 8px', borderRadius: 20, fontWeight: 500, marginBottom: 4 }}>Niv. {ex.level}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>+{ex.xp} XP</div>
                </div>
              </div>
            ))}
          </div>
        )
      })}

      {phaseUnlocked && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: 'var(--primary)', color: '#fff', borderRadius: 16, padding: '16px 24px', boxShadow: '0 8px 24px rgba(74,124,111,0.4)', textAlign: 'center', maxWidth: 320, animation: 'fadeIn 0.3s ease' }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>🎉</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 4 }}>Phase {phaseUnlocked} débloquée !</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 12 }}>De nouveaux exercices sont disponibles.</div>
          <button onClick={() => setPhaseUnlocked(null)} style={{ background: 'rgba(255,255,255,0.25)', border: 'none', color: '#fff', borderRadius: 8, padding: '6px 16px', fontSize: 13, cursor: 'pointer' }}>Super !</button>
        </div>
      )}

      {activeExercise && (
        <ExerciseModal
          exercise={activeExercise}
          onClose={() => setActiveExercise(null)}
          onComplete={handleComplete}
        />
      )}
    </div>
  )
}
