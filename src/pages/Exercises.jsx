import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { launchConfetti } from '../hooks/useConfetti'

const EXERCISES = [
  // ── PHASE 0 — Reconditionnement ───────────────────────────────────────────
  {
    id: 'conscious_masturb', phase: 0,
    emoji: '🧠', color: '#D4A855', bg: '#fdf6e3',
    title: 'Masturbation consciente',
    subtitle: 'Reconditionnement sensoriel',
    duration: '15 min', level: 1, xp: 15,
    steps: [
      { text: 'Installe-toi dans un endroit calme, sans téléphone, sans écran.', duration: 10 },
      { text: 'Commence une stimulation lente et intentionnelle, sans chercher à éjaculer rapidement. L\'objectif est d\'explorer les sensations, pas d\'atteindre l\'orgasme.', duration: 30 },
      { text: 'Porte ton attention sur les sensations physiques précises — chaleur, pression, texture. Reste dans ton corps.', duration: 60 },
      { text: 'Si ton esprit cherche des images ou des fantasmes visuels intenses, reviens doucement à la sensation physique. C\'est normal — ne te juge pas.', duration: 30 },
      { text: 'Continue à un rythme lent pendant 10 minutes minimum. Si tu sens l\'éjaculation approcher, ralentis — mais ne t\'arrête pas complètement.', duration: 600 },
      { text: 'Termine la séance. Que tu aies éjaculé ou non, tu as accompli quelque chose d\'important : tu as commencé à reconnecter ton cerveau aux sensations réelles.', duration: 20 },
    ],
    note: 'La masturbation consciente sans pornographie est la première étape du reconditionnement neurologique. Elle réapprend au cerveau à trouver du plaisir dans une stimulation normale, sans hyperstimulation visuelle.',
  },
  {
    id: 'porn_reduction', phase: 0,
    emoji: '📉', color: '#D4A855', bg: '#fdf6e3',
    title: 'Réduction progressive',
    subtitle: 'Reconditionnement comportemental',
    duration: '5 min', level: 1, xp: 10,
    steps: [
      { text: 'Note mentalement ta consommation habituelle de pornographie par semaine. Sois honnête avec toi-même.', duration: 20 },
      { text: 'L\'objectif n\'est pas la culpabilité — c\'est la conscience. Le problème n\'est pas la pornographie en soi, c\'est le conditionnement qu\'elle a créé dans ton corps.', duration: 15 },
      { text: 'Pour cette semaine, fixe-toi un objectif de réduction de 50 %. Si tu regardes 6 fois par semaine, vise 3. Si tu regardes tous les jours, vise un jour sur deux.', duration: 20 },
      { text: 'Remplace ces moments par une séance Duramen. Pas par volonté — par substitution progressive.', duration: 15 },
      { text: 'À la fin de la semaine, fais le bilan avec Alex. Il adaptera ton programme en fonction.', duration: 10 },
    ],
    note: 'La réduction progressive est plus efficace que l\'arrêt brutal, qui crée souvent un effet rebond. L\'objectif est de ne plus dépendre de la pornographie pour l\'excitation, pas nécessairement de l\'éliminer complètement.',
  },
  {
    id: 'body_reconnect', phase: 0,
    emoji: '🫁', color: '#D4A855', bg: '#fdf6e3',
    title: 'Reconnexion corps entier',
    subtitle: 'Pleine conscience corporelle',
    duration: '12 min', level: 1, xp: 10,
    steps: [
      { text: 'Allonge-toi confortablement. Ferme les yeux. Fais 3 respirations profondes.', duration: 30 },
      { text: 'Porte ton attention sur tes mains. Sens leur température, leur poids.', duration: 20 },
      { text: 'Remonte vers les bras, les épaules, le cou. Où sens-tu de la tension ? Relâche-la sans forcer.', duration: 40 },
      { text: 'Descends vers le torse, le ventre. Observe comment ta respiration le fait bouger.', duration: 30 },
      { text: 'Porte attention au bas du ventre et au périnée. Est-ce que cette zone est tendue ou détendue ?', duration: 40 },
      { text: 'Observe : sens-tu une connexion entre cette zone et le reste de ton corps, ou semble-t-elle isolée ? Il n\'y a pas de bonne réponse.', duration: 30 },
      { text: 'Fais 5 respirations en imaginant envoyer de l\'air vers le bas du ventre à chaque inspiration.', duration: 60 },
      { text: 'Ouvre les yeux doucement. Cette reconnexion est la base de tout ce qui vient ensuite.', duration: 20 },
    ],
    note: 'Les hommes avec EP conditionnée ont souvent une dissociation entre la zone génitale et le reste du corps. Cet exercice rétablit la connexion neurologique nécessaire pour un contrôle éjaculatoire durable.',
  },
  // ── PHASE 1 ───────────────────────────────────────────────────────────────
  {
    id: 'breathing', phase: 1,
    emoji: '🌬️', color: '#4A7C6F', bg: '#e8f2f0',
    title: 'Respiration diaphragmatique',
    subtitle: 'Conscience corporelle',
    duration: '8 min', level: 1, xp: 10,
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
    id: 'kegel_basic', phase: 1,
    emoji: '💪', color: '#4A7C6F', bg: '#e8f2f0',
    title: 'Kegel — Niveau débutant',
    subtitle: 'Renforcement du plancher pelvien',
    duration: '10 min', level: 1, xp: 10,
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
    id: 'body_scan', phase: 1,
    emoji: '🧘', color: '#4A7C6F', bg: '#e8f2f0',
    title: 'Scan corporel',
    subtitle: 'Pleine conscience et sensations',
    duration: '12 min', level: 1, xp: 10,
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
    id: 'stop_start', phase: 2,
    emoji: '⏸️', color: '#D4A855', bg: '#fdf6e3',
    title: 'Technique Stop-Start',
    subtitle: 'Contrôle de l\'excitation',
    duration: '15 min', level: 2, xp: 15,
    steps: [
      { text: 'Commence une stimulation sexuelle seul, à ton propre rythme.', duration: 10 },
      { text: 'Augmente lentement l\'intensité. Sois attentif à ton niveau d\'excitation sur une échelle de 1 à 10.', duration: 30 },
      { text: 'Quand tu atteins un niveau 7/10, STOP. Arrête toute stimulation.', duration: 5 },
      { text: 'Respire profondément. Attends que ton niveau redescende à 4/10.', duration: 30 },
      { text: 'Reprends la stimulation. Répète ce cycle stop-start 3 fois.', duration: 300 },
      { text: 'La dernière fois, laisse-toi aller si tu le souhaites. Observe la différence.', duration: 30 },
    ],
    note: 'La technique stop-start entraîne ton système nerveux à reconnaître et contrôler le point de non-retour.',
  },
  {
    id: 'kegel_advanced', phase: 2,
    emoji: '⚡', color: '#D4A855', bg: '#fdf6e3',
    title: 'Kegel — Niveau avancé',
    subtitle: 'Contractions rapides et endurance',
    duration: '12 min', level: 2, xp: 15,
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
    id: 'squeeze', phase: 3,
    emoji: '🎯', color: '#7C6F4A', bg: '#f5f0e8',
    title: 'Technique Squeeze',
    subtitle: 'Maîtrise avancée',
    duration: '15 min', level: 3, xp: 20,
    locked: true, steps: [],
    note: 'Débloqué en semaine 5.',
  },
]

const PHASE_INFO = {
  0: { label: 'Reconditionnement',      color: '#D4A855', emoji: '🔄' },
  1: { label: 'Conscience corporelle',  color: '#4A7C6F', emoji: '🧘' },
  2: { label: 'Renforcement',           color: '#D4A855', emoji: '💪' },
  3: { label: 'Maîtrise active',        color: '#7C6F4A', emoji: '🎯' },
}

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

  const PHASE_UNLOCK_THRESHOLD = { 1: 5, 2: 5 }

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

    const currentPhase = profile.program_phase || 1
    const phaseExerciseIds = EXERCISES.filter(e => e.phase === currentPhase).map(e => e.id)
    const { count } = await supabase.from('sessions').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id).in('exercise_id', phaseExerciseIds)

    const totalPhaseSessions = (count || 0) + 1
    const threshold = PHASE_UNLOCK_THRESHOLD[currentPhase]
    const shouldAdvancePhase = threshold && totalPhaseSessions >= threshold && currentPhase < 3

    await supabase.from('profiles').update({
      xp: (profile.xp || 0) + ex.xp,
      streak: newStreak,
      streak_last_date: new Date().toISOString(),
      ...(shouldAdvancePhase && { program_phase: currentPhase + 1, program_week: currentPhase * 2 + 1 }),
    }).eq('id', user.id)

    await refreshProfile()
    setActiveExercise(null)
    if (shouldAdvancePhase) setPhaseUnlocked(currentPhase + 1)
  }

  const currentPhase = profile?.program_phase ?? 1
  const showPhase0 = profile?.flag_conditioned_high || profile?.flag_conditioned_moderate
  const phases = showPhase0 ? [0, 1, 2, 3] : [1, 2, 3]

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
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>Programme progressif</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#fff', fontWeight: 500, marginBottom: 16 }}>Exercices</h1>

        {/* Phases indicator */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {phases.map(p => (
            <div key={p} style={{
              flex: 1, padding: '8px 10px', borderRadius: 12,
              background: p === currentPhase ? 'rgba(255,255,255,0.2)' : p < currentPhase ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${p === currentPhase ? 'rgba(255,255,255,0.4)' : 'transparent'}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 14 }}>{PHASE_INFO[p].emoji}</div>
              <div style={{ fontSize: 10, color: p <= currentPhase ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)', fontWeight: p === currentPhase ? 700 : 400, marginTop: 2 }}>
                Phase {p}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {phases.map(phase => {
          const phaseExercises = EXERCISES.filter(e => e.phase === phase)
          const isPhase0   = phase === 0
          const isLocked   = !isPhase0 && phase > currentPhase
          const isDone     = !isPhase0 && phase < currentPhase
          const isCurrent  = phase === currentPhase
          const info       = PHASE_INFO[phase]

          return (
            <div key={phase} style={{ marginBottom: 28 }}>
              {/* En-tête de phase */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{info.emoji}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isLocked ? 'var(--text-muted)' : 'var(--text)' }}>Phase {phase}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{info.label}</div>
                  </div>
                </div>
                {isPhase0  && <span style={{ fontSize: 11, background: '#fdf6e3', color: '#7a5c00', border: '1px solid #e8c97a', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>Prioritaire</span>}
                {isLocked  && <span style={{ fontSize: 11, background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-muted)', padding: '3px 10px', borderRadius: 20 }}>🔒 Verrouillé</span>}
                {isDone    && <span style={{ fontSize: 11, background: 'var(--primary-light)', color: 'var(--primary)', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>✓ Terminé</span>}
                {isCurrent && !isPhase0 && <span style={{ fontSize: 11, background: '#fdf6e3', color: '#7a5c00', border: '1px solid #e8c97a', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>En cours</span>}
              </div>

              {/* Cartes exercices */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {phaseExercises.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => !(isLocked && !isPhase0) && !ex.locked && setActiveExercise(ex)}
                    disabled={(isLocked && !isPhase0) || ex.locked}
                    style={{
                      display: 'flex', gap: 14, alignItems: 'center',
                      background: 'var(--bg-card)', borderRadius: 16,
                      border: `1.5px solid ${isCurrent && !ex.locked ? 'var(--border)' : 'var(--border)'}`,
                      padding: '14px 16px',
                      opacity: isLocked || ex.locked ? 0.45 : 1,
                      cursor: (isLocked && !isPhase0) || ex.locked ? 'not-allowed' : 'pointer',
                      textAlign: 'left', width: '100%',
                      transition: 'all 0.15s',
                      boxShadow: isCurrent && !ex.locked ? 'var(--shadow)' : 'none',
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
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20,
                        background: ex.level === 1 ? '#e8f2f0' : ex.level === 2 ? '#fdf6e3' : '#f5f0e8',
                        color: ex.level === 1 ? '#4A7C6F' : ex.level === 2 ? '#7a5c00' : '#7C6F4A',
                      }}>
                        Niv. {ex.level}
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
