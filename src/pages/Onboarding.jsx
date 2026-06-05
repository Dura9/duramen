import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

// ─── DONNÉES PROFIL ───────────────────────────────────────────────────────────
const PROFILE_LABELS = {
  sensory:     'Hyperexcité Sensoriel',
  cognitive:   'Anxieux de Performance',
  situational: 'EP Situationnelle',
  conditioned: 'EP Conditionnée',
  primary:     'EP Primaire',
}

const PROFILE_DURATION = {
  sensory:     '4 à 6 semaines',
  cognitive:   '4 à 6 semaines',
  situational: '4 à 6 semaines',
  conditioned: '8 à 12 semaines',
  primary:     '8 à 16 semaines',
}

const PROFILE_APPROACH = {
  sensory:     'Sensorielle & corporelle',
  cognitive:   'TCC & pleine conscience',
  situational: 'Contextuelle & relationnelle',
  conditioned: 'Reconditionnement neurologique',
  primary:     'Comportementale & médicale',
}

const PROFILE_TESTIMONIAL = {
  sensory:     { text: "J'avais l'impression que mon corps ne m'obéissait pas. En 5 semaines, j'ai appris à le reconnaître avant qu'il s'emballe.", author: 'Mehdi, 28 ans' },
  cognitive:   { text: "C'était dans ma tête, je le savais. Mais je ne savais pas comment en sortir. Alex m'a aidé à comprendre mes pensées.", author: 'Pierre, 31 ans' },
  situational: { text: "Avec ma nouvelle partenaire j'étais bloqué. Duramen m'a aidé à comprendre pourquoi et à retrouver confiance.", author: 'Karim, 26 ans' },
  conditioned: { text: "J'avais des habitudes depuis des années. Le programme de reconditionnement a tout changé en 10 semaines.", author: 'Lucas, 24 ans' },
  primary:     { text: "J'ai toujours cru que c'était génétique et que rien ne pouvait changer. J'avais tort.", author: 'Marc, 38 ans' },
}

const DESIRE_TEXT = {
  freedom:      "Tu mérites de vivre ta sexualité sans cette peur constante. C'est possible. Et ça commence maintenant.",
  relationship: "Une relation intime épanouie se construit. Duramen t'accompagne dans ce chemin.",
  control:      "Le contrôle ne se donne pas — il s'apprend. Duramen est la méthode.",
  identity:     "Cet homme existe déjà en toi. Duramen te donne les outils pour qu'il s'exprime.",
}

// ─── SÉQUENCE ─────────────────────────────────────────────────────────────────
// intro → q1 → insert1 → q2 → q3 → q4 → insert2 → q5 → q6 → result
const STEPS = [
  'intro', 'q1', 'insert1', 'q2', 'q3', 'q4', 'insert2', 'q5', 'q6', 'result'
]
const QUESTION_STEPS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']

export default function Onboarding() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [microFeedback, setMicroFeedback] = useState(null)
  const [fadeKey, setFadeKey] = useState(0)
  const [loading, setLoading] = useState(false)

  const step = STEPS[stepIndex]
  const isQuestion = QUESTION_STEPS.includes(step)
  const qNumber = QUESTION_STEPS.indexOf(step) + 1
  const progress = isQuestion ? (qNumber / 6) * 100 : null

  function goNext() {
    setFadeKey(k => k + 1)
    setStepIndex(i => i + 1)
  }

  function goBack() {
    if (stepIndex > 1) { setFadeKey(k => k + 1); setStepIndex(i => i - 1) }
  }

  function choose(field, value, feedback) {
    setAnswers(a => ({ ...a, [field]: value }))
    if (feedback) {
      setMicroFeedback(feedback)
      setTimeout(() => { setMicroFeedback(null); goNext() }, 1200)
    } else {
      setTimeout(goNext, 220)
    }
  }

  async function handleFinish() {
    // Si déjà connecté (reset diagnostic) → sauvegarder directement
    if (user) {
      setLoading(true)
      const profileType = answers.profile_type || 'cognitive'
      const isConditioned = profileType === 'conditioned'
      await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        profile_type: profileType,
        cost: answers.cost,
        desire: answers.desire,
        duration: answers.duration,
        daily_minutes: answers.daily_minutes || 10,
        situation: answers.situation || 'single',
        level: 1,
        program_week: 1,
        program_phase: isConditioned ? 0 : 1,
        flag_conditioned_high: isConditioned,
        flag_conditioned_moderate: false,
        streak: 0, streak_last_date: null, xp: 0,
        onboarding_completed: true,
        created_at: new Date().toISOString(),
      })
      await refreshProfile()
      setLoading(false)
    } else {
      // Pas encore connecté → sauvegarder en session et aller vers Auth
      sessionStorage.setItem('duramen_onboarding', JSON.stringify(answers))
      navigate('/auth')
    }
  }

  // ── INTRO ───────────────────────────────────────────────────────────────────
  if (step === 'intro') return (
    <div key={fadeKey} className="fade-in" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 28px', background: 'var(--bg)' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--primary)', fontWeight: 400, marginBottom: 32 }}>Duramen</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500, color: 'var(--text)', lineHeight: 1.35, marginBottom: 16 }}>
          Ce que tu vis a un nom.<br/>Et une solution.
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>
          2 minutes pour comprendre ton profil et découvrir ce qui va vraiment changer les choses pour toi.
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>
          1 homme sur 3 vit la même chose. Presque aucun n'en parle.
        </p>
      </div>
      <button className="btn-primary" onClick={goNext} style={{ fontSize: 16, padding: '16px' }}>
        Découvrir mon profil →
      </button>
    </div>
  )

  // ── INSERT 1 ────────────────────────────────────────────────────────────────
  if (step === 'insert1') return (
    <div key={fadeKey} className="fade-in" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 28px', background: 'var(--primary-light)' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--primary)', marginBottom: 20, lineHeight: 1.4 }}>
          "Tu n'es pas le seul."
        </p>
        <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7 }}>
          78% des hommes qui vivent ça n'en ont jamais parlé à personne — ni à leur médecin, ni à leur partenaire.<br/><br/>
          Le fait que tu sois là est déjà courageux.
        </p>
      </div>
      <button className="btn-primary" onClick={goNext}>Continuer →</button>
    </div>
  )

  // ── INSERT 2 ────────────────────────────────────────────────────────────────
  if (step === 'insert2') return (
    <div key={fadeKey} className="fade-in" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 28px', background: 'var(--bg)' }}>
      <div className="card" style={{ marginBottom: 32, padding: '24px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>ILS ONT FAIT LE MÊME CHEMIN</div>
        <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 8 }}>
          "En 6 semaines, j'ai retrouvé quelque chose que j'avais perdu depuis 4 ans. Ma confiance, et ma relation avec ma femme."
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>— Thomas, 34 ans</p>
        <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--primary)', lineHeight: 1 }}>89%</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>des utilisateurs rapportent une amélioration significative dès la Phase 1</div>
        </div>
      </div>
      <button className="btn-primary" onClick={goNext}>Continuer →</button>
    </div>
  )

  // ── RÉSULTAT ────────────────────────────────────────────────────────────────
  if (step === 'result') {
    const pt = answers.profile_type || 'cognitive'
    const desire = answers.desire || 'control'
    const dm = answers.daily_minutes || 10
    const testimonial = PROFILE_TESTIMONIAL[pt]
    return (
      <div key={fadeKey} className="fade-in" style={{ minHeight: '100dvh', padding: '52px 24px 40px', background: 'var(--bg)', overflowY: 'auto' }}>

        {/* BLOC 1 — phrase émotionnelle */}
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text)', textAlign: 'center', lineHeight: 1.6, marginBottom: 28 }}>
          {DESIRE_TEXT[desire]}
        </p>

        {/* BLOC 2 — diagnostic */}
        <div style={{ background: 'var(--primary-light)', border: '1.5px solid var(--primary)', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>TON PROFIL</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text)', marginBottom: 14 }}>{PROFILE_LABELS[pt]}</div>
          {[
            { label: 'Programme', value: `${dm} min/jour` },
            { label: 'Résultats estimés', value: PROFILE_DURATION[pt] },
            { label: 'Approche', value: PROFILE_APPROACH[pt] },
          ].map((row, i, arr) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < arr.length - 1 ? 10 : 0, marginBottom: i < arr.length - 1 ? 10 : 0, borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* BLOC 3 — témoignage */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 6 }}>"{testimonial.text}"</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>— {testimonial.author}</p>
        </div>

        {/* BLOC 4 — urgence douce */}
        <p style={{ fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.7, marginBottom: 24 }}>
          Plus tôt tu commences, plus tôt tu redeviendras maître de ton éjaculation.<br/>
          Ton programme personnalisé est prêt.
        </p>

        {/* BLOC 5 — CTA */}
        <button className="btn-primary" onClick={handleFinish} disabled={loading} style={{ padding: '16px', fontSize: 15, marginBottom: 12 }}>
          {loading ? <span className="spinner"></span> : user ? 'Commencer mon programme →' : 'Créer mon compte gratuit →'}
        </button>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
          ✓ Gratuit pour commencer · ✓ Sans carte bancaire · ✓ Résultats en 4 semaines
        </div>
      </div>
    )
  }


  // ── QUESTIONS ───────────────────────────────────────────────────────────────
  const canGoBack = stepIndex > 1 && isQuestion && step !== 'q1'

  return (
    <div key={fadeKey} className="fade-in" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', padding: '0 0 32px' }}>

      {/* Barre de progression */}
      <div style={{ padding: '52px 24px 0' }}>
        <div style={{ height: 4, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 4, background: 'var(--primary)', width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 0' }}>

        {/* ── Q1 ── */}
        {step === 'q1' && <>
          <h2 style={qStyle}>Soyons honnêtes. Ce problème, qu'est-ce qu'il te coûte vraiment ?</h2>
          <Options options={[
            { label: '😔 Ma confiance en moi — je me sens moins homme', value: 'confidence' },
            { label: '💑 Mon couple — je sens la distance s\'installer',  value: 'relationship' },
            { label: '😰 Chaque rapport devient une source de stress',    value: 'stress' },
            { label: '🔄 Tout ça à la fois — c\'est épuisant',           value: 'all' },
          ]} selected={answers.cost} onSelect={v => choose('cost', v)} />
        </>}

        {/* ── Q2 ── */}
        {step === 'q2' && <>
          <h2 style={qStyle}>Quand tu es honnête avec toi-même, qu'est-ce qui se passe vraiment ?</h2>
          <Options options={[
            { label: '⚡ Mon corps s\'emballe — je n\'ai pas le temps de réagir', value: 'sensory' },
            { label: '🧠 Ma tête prend le dessus — je pense trop pendant l\'acte', value: 'cognitive' },
            { label: '🎲 C\'est aléatoire — parfois ça va, parfois non',           value: 'situational' },
            { label: '📱 J\'ai toujours consommé beaucoup de pornographie',        value: 'conditioned' },
            { label: '❓ Je ne sais pas vraiment — c\'est là depuis toujours',     value: 'primary' },
          ]} selected={answers.profile_type} onSelect={v => choose('profile_type', v)} />
        </>}

        {/* ── Q3 ── */}
        {step === 'q3' && <>
          <h2 style={qStyle}>Depuis combien de temps est-ce que tu vis avec ça ?</h2>
          <OptionsWithFeedback
            options={[
              { label: 'Quelques mois — ça s\'est installé récemment',     value: 'months',    feedback: 'C\'est le meilleur moment pour agir.' },
              { label: '1 à 3 ans — j\'ai appris à faire avec',            value: '1_3years',  feedback: 'Chaque mois qui passe ancre davantage le schéma.' },
              { label: 'Plus de 3 ans — c\'est devenu normal pour moi',    value: '3plus',     feedback: '3 ans de trop. Le changement commence maintenant.' },
              { label: 'Depuis toujours — je n\'ai jamais connu autre chose', value: 'always', feedback: 'Ce profil répond très bien à notre approche.' },
            ]}
            selected={answers.duration}
            microFeedback={microFeedback}
            onSelect={(v, fb) => choose('duration', v, fb)}
          />
        </>}

        {/* ── Q4 ── */}
        {step === 'q4' && <>
          <h2 style={qStyle}>Si ce problème disparaissait demain, qu'est-ce qui changerait vraiment dans ta vie ?</h2>
          <Options options={[
            { label: 'Je me sentirais enfin libre et confiant dans l\'intimité', value: 'freedom' },
            { label: 'Ma relation de couple s\'améliorerait profondément',       value: 'relationship' },
            { label: 'Je reprendrais le contrôle de ma vie sexuelle',            value: 'control' },
            { label: 'Je redeviendrais l\'homme que je veux être',               value: 'identity' },
          ]} selected={answers.desire} onSelect={v => choose('desire', v)} />
        </>}

        {/* ── Q5 ── */}
        {step === 'q5' && <>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 12, lineHeight: 1.5 }}>
            La régularité bat l'intensité. 10 minutes par jour changent tout.
          </p>
          <h2 style={qStyle}>Pour retrouver ce contrôle, tu es prêt à investir combien de temps par jour ?</h2>
          <OptionsWithFeedback
            options={[
              { label: '5 minutes — l\'essentiel, intégré dans ma journée',  value: 5,  feedback: 'Parfait. On a conçu un programme pour ça.' },
              { label: '10 minutes — je suis motivé et régulier',            value: 10, feedback: 'C\'est le sweet spot. La majorité des résultats viennent de là.' },
              { label: '15 à 20 minutes — je veux des résultats rapides',    value: 15, feedback: 'Excellent. Tu vas progresser plus vite que la moyenne.' },
              { label: 'Je fais ce qu\'il faut — pas de limite',             value: 20, feedback: 'On aime cet état d\'esprit. Ton programme sera intense.' },
            ]}
            selected={answers.daily_minutes}
            microFeedback={microFeedback}
            onSelect={(v, fb) => choose('daily_minutes', v, fb)}
          />
        </>}

        {/* ── Q6 ── */}
        {step === 'q6' && <>
          <h2 style={qStyle}>Une dernière chose — tu es ?</h2>
          <Options options={[
            { label: 'Célibataire — je travaille sur moi d\'abord',      value: 'single' },
            { label: 'En couple — je veux progresser pour nous deux',    value: 'couple' },
          ]} selected={answers.situation} onSelect={v => choose('situation', v)} />
        </>}

        {/* Bouton retour */}
        {canGoBack && (
          <button onClick={goBack} style={{ marginTop: 24, color: 'var(--text-muted)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <i className="ti ti-arrow-left"></i> Retour
          </button>
        )}
      </div>
    </div>
  )
}

// ─── STYLE QUESTION ───────────────────────────────────────────────────────────
const qStyle = {
  fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500,
  color: 'var(--text)', lineHeight: 1.35, marginBottom: 24,
}

// ─── COMPOSANT OPTIONS ────────────────────────────────────────────────────────
function Options({ options, selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map(opt => (
        <button key={opt.value} onClick={() => onSelect(opt.value)} style={{
          padding: '14px 18px', borderRadius: 14, textAlign: 'left', cursor: 'pointer',
          border: `1.5px solid ${selected === opt.value ? 'var(--primary)' : 'var(--border)'}`,
          background: selected === opt.value ? 'var(--primary-light)' : 'var(--bg-card)',
          transition: 'all 0.15s',
        }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 }}>{opt.label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── COMPOSANT OPTIONS AVEC MICRO-FEEDBACK ────────────────────────────────────
function OptionsWithFeedback({ options, selected, microFeedback, onSelect }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map(opt => (
        <div key={opt.value}>
          <button onClick={() => onSelect(opt.value, opt.feedback)} style={{
            width: '100%', padding: '14px 18px', borderRadius: 14, textAlign: 'left', cursor: 'pointer',
            border: `1.5px solid ${selected === opt.value ? 'var(--primary)' : 'var(--border)'}`,
            background: selected === opt.value ? 'var(--primary-light)' : 'var(--bg-card)',
            transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 }}>{opt.label}</span>
          </button>
          {selected === opt.value && microFeedback && (
            <p style={{ fontSize: 12, color: 'var(--primary)', fontStyle: 'italic', marginTop: 6, marginLeft: 4, animation: 'fadeIn 0.2s ease' }}>
              ✓ {microFeedback}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
