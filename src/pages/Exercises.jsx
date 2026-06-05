import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { launchConfetti } from '../hooks/useConfetti'
import { getProgram, getPhaseExercises } from '../data/programs'

// ── MODAL EXERCICE ────────────────────────────────────────────────────────────
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
        if (t <= 1) { clearInterval(timerRef.current); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [running, stepIndex])

  useEffect(() => {
    if (running && timer === 0 && stepIndex >= 0) setTimeout(() => nextStep(), 800)
  }, [timer])

  function startExercise() {
    setStepIndex(0)
    setTimer(exercise.steps[0].duration)
    setRunning(true)
  }

  function nextStep() {
    clearInterval(timerRef.current)
    const next = stepIndex + 1
    if (next >= exercise.steps.length) { setRunning(false); setDone(true) }
    else { setStepIndex(next); setTimer(exercise.steps[next].duration) }
  }

  function handleMood(m) {
    setMood(m)
    setTimeout(() => onComplete(m), 500)
  }

  // Lance les confettis quand l'exercice est terminé
  useEffect(() => {
    if (done) launchConfetti(70)
  }, [done])

  const progress = stepIndex >= 0 ? (stepIndex + 1) / exercise.steps.length : 0

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--bg)', borderRadius: '28px 28px 0 0', padding: '24px 24px 48px', width: '100%', maxWidth: 480, margin: '0 auto', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Handle */}
        <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 20px' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 26 }}>{exercise.emoji}</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text)' }}>{exercise.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{exercise.duration} · +{exercise.xp} XP</div>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', fontSize: 22, padding: 4 }}>
            <i className="ti ti-x"></i>
          </button>
        </div>

        {/* Barre de progression étapes */}
        {stepIndex >= 0 && !done && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
              {exercise.steps.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= stepIndex ? exercise.color : 'var(--border)', transition: 'background 0.3s' }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>
              Étape {stepIndex + 1} / {exercise.steps.length}
            </div>
          </div>
        )}

        {/* Écran de départ */}
        {stepIndex === -1 && !done && (
          <div className="fade-in">
            <div style={{ background: exercise.bg, border: `1px solid ${exercise.color}30`, borderRadius: 16, padding: '14px 16px', marginBottom: 24, display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>💡</span>
              <p style={{ fontSize: 13, color: exercise.color, lineHeight: 1.6 }}>{exercise.note}</p>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
              {exercise.steps.length} étapes · Installe-toi dans un endroit calme avant de commencer.
            </p>
            <button className="btn-primary btn-ripple" onClick={startExercise} style={{ background: exercise.color }}>
              Commencer l'exercice →
            </button>
          </div>
        )}

        {/* Exercice en cours */}
        {stepIndex >= 0 && !done && (
          <div className="fade-in">
            {/* Timer circulaire */}
            <div style={{ textAlign: 'center', margin: '24px 0 28px' }}>
              <div style={{
                width: 110, height: 110, borderRadius: '50%',
                background: timer === 0 ? '#27AE60' : exercise.bg,
                border: `4px solid ${timer === 0 ? '#27AE60' : exercise.color}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', transition: 'all 0.3s',
              }}>
                {timer === 0
                  ? <span style={{ fontSize: 36 }}>✓</span>
                  : <>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: exercise.color, lineHeight: 1 }}>
                      {timer > 99 ? `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` : timer}
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>sec</span>
                  </>
                }
              </div>
              <p style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.7, fontWeight: 500 }}>
                {exercise.steps[stepIndex].text}
              </p>
            </div>
            <button className="btn-primary btn-ripple" onClick={nextStep} style={{ background: exercise.color }}>
              {stepIndex === exercise.steps.length - 1 ? 'Terminer l\'exercice ✓' : 'Étape suivante →'}
            </button>
          </div>
        )}

        {/* Écran de fin */}
        {done && (
          <div className="fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
            <div className="bounce-in" style={{ fontSize: 64, marginBottom: 12 }}>🎉</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text)', marginBottom: 6 }}>Excellent travail !</div>
            <div className="bounce-in" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 20, padding: '6px 16px', fontSize: 14, fontWeight: 600, marginBottom: 28, animationDelay: '0.15s' }}>
              ⭐ +{exercise.xp} XP gagnés
            </div>
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 16 }}>Comment tu te sens après cet exercice ?</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
                {[
                  { emoji: '😐', label: 'Neutre' },
                  { emoji: '😊', label: 'Bien' },
                  { emoji: '😄', label: 'Super' },
                ].map(m => (
                  <button key={m.emoji} onClick={() => handleMood(m.emoji)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      background: mood === m.emoji ? 'var(--primary-light)' : 'var(--bg-card)',
                      borderRadius: 16, padding: '12px 16px',
                      border: `2px solid ${mood === m.emoji ? 'var(--primary)' : 'var(--border)'}`,
                      transition: 'all 0.15s', cursor: 'pointer',
                    }}>
                    <span style={{ fontSize: 32 }}>{m.emoji}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.label}</span>
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

// ── PAGE EXERCICES ────────────────────────────────────────────────────────────
export default function Exercises() {
  const { user, profile, refreshProfile } = useAuth()
  const [activeExercise, setActiveExercise] = useState(null)
  const [phaseUnlocked, setPhaseUnlocked] = useState(null)

  const program = getProgram(profile?.profile_type)
  const maxPhase = program.phases.length
  const SESSIONS_PER_PHASE = 4 // séances pour débloquer la phase suivante
  // program_phase peut valoir 0 (anciens profils conditionnés) → on ramène à 1
  const currentPhase = Math.min(Math.max(profile?.program_phase || 1, 1), maxPhase)

  async function handleComplete(mood) {
    if (!user || !activeExercise) return
    const ex = activeExercise

    await supabase.from('sessions').insert({
      user_id: user.id, exercise_id: ex.id, mood, xp_earned: ex.xp,
      completed_at: new Date().toISOString(),
    })

    const today = new Date().toDateString()
    const lastDate = profile.streak_last_date ? new Date(profile.streak_last_date).toDateString() : null
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1)
    const newStreak = lastDate === today ? profile.streak : lastDate === yesterday.toDateString() ? profile.streak + 1 : 1

    // Exercices de la phase courante
    const phaseExerciseIds = getPhaseExercises(program, currentPhase).map(e => e.id)
    const { count } = await supabase.from('sessions').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id).in('exercise_id', phaseExerciseIds)

    const totalPhaseSessions = (count || 0) + 1
    const shouldAdvancePhase = totalPhaseSessions >= SESSIONS_PER_PHASE && currentPhase < maxPhase

    await supabase.from('profiles').update({
      xp: (profile.xp || 0) + ex.xp,
      streak: newStreak,
      streak_last_date: new Date().toISOString(),
      ...(shouldAdvancePhase && { program_phase: currentPhase + 1, program_week: Math.min(8, currentPhase * 2 + 1) }),
    }).eq('id', user.id)

    await refreshProfile()
    setActiveExercise(null)
    if (shouldAdvancePhase) setPhaseUnlocked(currentPhase + 1)
  }

  if (!profile) return null

  return (
    <div className="page fade-in" style={{ paddingTop: 0 }}>

      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, var(--primary) 0%, #3a6359 100%)',
        borderRadius: '0 0 32px 32px',
        padding: '56px 24px 28px',
        marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>Profil : {program.label}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#fff', fontWeight: 500, marginBottom: 4 }}>Mon programme</h1>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>{program.approach} · {program.duration}</div>

        {/* Phases indicator */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {program.phases.map(ph => (
            <div key={ph.n} style={{
              flex: 1, minWidth: 60, padding: '8px 6px', borderRadius: 12,
              background: ph.n === currentPhase ? 'rgba(255,255,255,0.2)' : ph.n < currentPhase ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${ph.n === currentPhase ? 'rgba(255,255,255,0.4)' : 'transparent'}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 14 }}>{ph.n < currentPhase ? '✓' : ph.emoji}</div>
              <div style={{ fontSize: 10, color: ph.n <= currentPhase ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)', fontWeight: ph.n === currentPhase ? 700 : 400, marginTop: 2 }}>
                Phase {ph.n}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {program.phases.map(ph => {
          const phaseExercises = getPhaseExercises(program, ph.n)
          const isLocked   = ph.n > currentPhase
          const isDone     = ph.n < currentPhase
          const isCurrent  = ph.n === currentPhase

          return (
            <div key={ph.n} style={{ marginBottom: 28 }}>
              {/* En-tête de phase */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{ph.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isLocked ? 'var(--text-muted)' : 'var(--text)' }}>Phase {ph.n} — {ph.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{ph.focus}</div>
                  </div>
                </div>
                {isLocked  && <span style={{ fontSize: 11, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '3px 10px', borderRadius: 20, flexShrink: 0 }}>🔒</span>}
                {isDone    && <span style={{ fontSize: 11, background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 10px', borderRadius: 20, fontWeight: 600, flexShrink: 0 }}>✓ Terminé</span>}
                {isCurrent && <span style={{ fontSize: 11, background: '#fdf6e3', color: '#7a5c00', border: '1px solid #e8c97a', padding: '3px 10px', borderRadius: 20, fontWeight: 600, flexShrink: 0 }}>En cours</span>}
              </div>

              {/* Cartes exercices */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                {phaseExercises.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => !isLocked && setActiveExercise(ex)}
                    disabled={isLocked}
                    style={{
                      display: 'flex', gap: 14, alignItems: 'center',
                      background: 'var(--bg-card)', borderRadius: 16,
                      border: '1.5px solid var(--border)',
                      padding: '14px 16px',
                      opacity: isLocked ? 0.45 : 1,
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      textAlign: 'left', width: '100%',
                      transition: 'all 0.15s',
                      boxShadow: isCurrent ? 'var(--shadow)' : 'none',
                    }}
                  >
                    <div style={{
                      width: 50, height: 50, borderRadius: 14, flexShrink: 0,
                      background: ex.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24,
                    }}>
                      {ex.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{ex.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ex.duration} · {ex.subtitle}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: ex.color + '22', color: ex.color }}>
                        Phase {ex.phase}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+{ex.xp} XP</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── TOAST PHASE DÉBLOQUÉE ─────────────────────────────────────── */}
      {phaseUnlocked && (
        <div style={{
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
          zIndex: 200, background: 'var(--primary)', color: '#fff',
          borderRadius: 20, padding: '20px 28px',
          boxShadow: '0 8px 32px rgba(74,124,111,0.4)',
          textAlign: 'center', maxWidth: 300, width: '90%',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 4 }}>Phase {phaseUnlocked} débloquée !</div>
          <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 16 }}>De nouveaux exercices sont disponibles.</div>
          <button onClick={() => setPhaseUnlocked(null)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: 10, padding: '8px 20px', fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>
            Super ! 🙌
          </button>
        </div>
      )}

      {/* ── MODAL ────────────────────────────────────────────────────── */}
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
