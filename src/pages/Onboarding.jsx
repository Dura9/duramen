import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useLang } from '../i18n/LanguageContext'
import { track } from '../lib/analytics'

// ─── CONTENU DU QUESTIONNAIRE (bilingue) ──────────────────────────────────────
// Les VALEURS (value) sont identiques dans les 2 langues (elles pilotent la logique).
// Seuls les textes affichés (label, feedback, questions) changent.
const OB = {
  fr: {
    continue: 'Continuer →', back: 'Retour',
    q1_q: 'Soyons honnêtes. Ce problème, qu\'est-ce qu\'il te coûte vraiment ?',
    q1_opts: [
      { label: '😔 Ma confiance en moi — je me sens moins homme', value: 'confidence' },
      { label: '💑 Mon couple — je sens la distance s\'installer',  value: 'relationship' },
      { label: '😰 Chaque rapport devient une source de stress',    value: 'stress' },
      { label: '🔄 Tout ça à la fois — c\'est épuisant',           value: 'all' },
    ],
    q2_q: 'Quand tu es honnête avec toi-même, qu\'est-ce qui se passe vraiment ?',
    q2_opts: [
      { label: '⚡ Mon corps s\'emballe — je n\'ai pas le temps de réagir', value: 'sensory' },
      { label: '🧠 Ma tête prend le dessus — je pense trop pendant l\'acte', value: 'cognitive' },
      { label: '🎲 C\'est aléatoire — parfois ça va, parfois non',           value: 'situational' },
      { label: '📱 J\'ai toujours consommé beaucoup de pornographie',        value: 'conditioned' },
      { label: '❓ Je ne sais pas vraiment — c\'est là depuis toujours',     value: 'primary' },
    ],
    q3_q: 'Depuis combien de temps est-ce que tu vis avec ça ?',
    q3_opts: [
      { label: 'Quelques mois — ça s\'est installé récemment',     value: 'months',   feedback: 'C\'est le meilleur moment pour agir.' },
      { label: '1 à 3 ans — j\'ai appris à faire avec',            value: '1_3years', feedback: 'Chaque mois qui passe ancre davantage le schéma.' },
      { label: 'Plus de 3 ans — c\'est devenu normal pour moi',    value: '3plus',    feedback: '3 ans de trop. Le changement commence maintenant.' },
      { label: 'Depuis toujours — je n\'ai jamais connu autre chose', value: 'always', feedback: 'Ce profil répond très bien à notre approche.' },
    ],
    q4_q: 'Si ce problème disparaissait demain, qu\'est-ce qui changerait vraiment dans ta vie ?',
    q4_opts: [
      { label: 'Je me sentirais enfin libre et confiant dans l\'intimité', value: 'freedom' },
      { label: 'Ma relation de couple s\'améliorerait profondément',       value: 'relationship' },
      { label: 'Je reprendrais le contrôle de ma vie sexuelle',            value: 'control' },
      { label: 'Je redeviendrais l\'homme que je veux être',               value: 'identity' },
    ],
    q5_sub: 'La régularité bat l\'intensité. 10 minutes par jour changent tout.',
    q5_q: 'Pour retrouver ce contrôle, tu es prêt à investir combien de temps par jour ?',
    q5_opts: [
      { label: '5 minutes — l\'essentiel, intégré dans ma journée',  value: 5,  feedback: 'Parfait. On a conçu un programme pour ça.' },
      { label: '10 minutes — je suis motivé et régulier',            value: 10, feedback: 'C\'est le sweet spot. La majorité des résultats viennent de là.' },
      { label: '15 à 20 minutes — je veux des résultats rapides',    value: 15, feedback: 'Excellent. Tu vas progresser plus vite que la moyenne.' },
      { label: 'Je fais ce qu\'il faut — pas de limite',             value: 20, feedback: 'On aime cet état d\'esprit. Ton programme sera intense.' },
    ],
    q6_q: 'Une dernière chose — tu es ?',
    q6_opts: [
      { label: 'Célibataire — je travaille sur moi d\'abord',   value: 'single' },
      { label: 'En couple — je veux progresser pour nous deux', value: 'couple' },
    ],
    insert1_quote: '« Tu n\'es pas le seul. »',
    insert1_text: '78 % des hommes qui vivent ça n\'en ont jamais parlé à personne — ni à leur médecin, ni à leur partenaire.\n\nLe fait que tu sois là est déjà courageux.',
    insert2_label: 'ILS ONT FAIT LE MÊME CHEMIN',
    insert2_quote: '« En 6 semaines, j\'ai retrouvé quelque chose que j\'avais perdu depuis 4 ans. Ma confiance, et ma relation avec ma femme. »',
    insert2_author: '— Thomas, 34 ans',
    insert2_stat: 'des utilisateurs rapportent une amélioration significative dès la Phase 1',
    profileTitle: 'TON PROFIL',
    rows: { program: 'Programme', results: 'Résultats estimés', approach: 'Approche' },
    minPerDay: 'min/jour',
    urgency: 'Plus tôt tu commences, plus tôt tu redeviendras maître de ton éjaculation.\nTon programme personnalisé est prêt.',
    ctaLoggedIn: 'Commencer mon programme →',
    ctaNew: 'Créer mon compte gratuit →',
    guarantee: '✓ Gratuit pour commencer · ✓ Sans carte bancaire · ✓ Résultats en 4 semaines',
    profileLabels: {
      sensory: 'Hyperexcité Sensoriel', cognitive: 'Anxieux de Performance', situational: 'EP Situationnelle',
      conditioned: 'EP Conditionnée', primary: 'EP Primaire',
    },
    profileDuration: {
      sensory: '4 à 6 semaines', cognitive: '4 à 6 semaines', situational: '4 à 6 semaines',
      conditioned: '8 à 12 semaines', primary: '8 à 16 semaines',
    },
    profileApproach: {
      sensory: 'Sensorielle & corporelle', cognitive: 'TCC & pleine conscience', situational: 'Contextuelle & relationnelle',
      conditioned: 'Reconditionnement neurologique', primary: 'Comportementale & médicale',
    },
    profileTestimonial: {
      sensory:     { text: 'J\'avais l\'impression que mon corps ne m\'obéissait pas. En 5 semaines, j\'ai appris à le reconnaître avant qu\'il s\'emballe.', author: 'Mehdi, 28 ans' },
      cognitive:   { text: 'C\'était dans ma tête, je le savais. Mais je ne savais pas comment en sortir. Alex m\'a aidé à comprendre mes pensées.', author: 'Pierre, 31 ans' },
      situational: { text: 'Avec ma nouvelle partenaire j\'étais bloqué. Duramen m\'a aidé à comprendre pourquoi et à retrouver confiance.', author: 'Karim, 26 ans' },
      conditioned: { text: 'J\'avais des habitudes depuis des années. Le programme de reconditionnement a tout changé en 10 semaines.', author: 'Lucas, 24 ans' },
      primary:     { text: 'J\'ai toujours cru que c\'était génétique et que rien ne pouvait changer. J\'avais tort.', author: 'Marc, 38 ans' },
    },
    desireText: {
      freedom:      'Tu mérites de vivre ta sexualité sans cette peur constante. C\'est possible. Et ça commence maintenant.',
      relationship: 'Une relation intime épanouie se construit. Duramen t\'accompagne dans ce chemin.',
      control:      'Le contrôle ne se donne pas — il s\'apprend. Duramen est la méthode.',
      identity:     'Cet homme existe déjà en toi. Duramen te donne les outils pour qu\'il s\'exprime.',
    },
  },

  en: {
    continue: 'Continue →', back: 'Back',
    q1_q: 'Let\'s be honest. What is this problem really costing you?',
    q1_opts: [
      { label: '😔 My self-confidence — I feel less of a man',        value: 'confidence' },
      { label: '💑 My relationship — I can feel the distance growing', value: 'relationship' },
      { label: '😰 Every time becomes a source of stress',           value: 'stress' },
      { label: '🔄 All of it at once — it\'s exhausting',            value: 'all' },
    ],
    q2_q: 'When you\'re honest with yourself, what\'s really happening?',
    q2_opts: [
      { label: '⚡ My body races — I don\'t have time to react',       value: 'sensory' },
      { label: '🧠 My mind takes over — I overthink during sex',      value: 'cognitive' },
      { label: '🎲 It\'s random — sometimes fine, sometimes not',     value: 'situational' },
      { label: '📱 I\'ve always watched a lot of pornography',        value: 'conditioned' },
      { label: '❓ I\'m not really sure — it\'s always been there',   value: 'primary' },
    ],
    q3_q: 'How long have you been living with this?',
    q3_opts: [
      { label: 'A few months — it started recently',          value: 'months',   feedback: 'This is the best time to act.' },
      { label: '1 to 3 years — I\'ve learned to live with it', value: '1_3years', feedback: 'Every month that passes anchors the pattern deeper.' },
      { label: 'More than 3 years — it\'s become normal for me', value: '3plus',  feedback: '3 years too many. Change starts now.' },
      { label: 'Always — I\'ve never known anything else',     value: 'always',   feedback: 'This profile responds very well to our approach.' },
    ],
    q4_q: 'If this problem disappeared tomorrow, what would really change in your life?',
    q4_opts: [
      { label: 'I\'d finally feel free and confident in intimacy', value: 'freedom' },
      { label: 'My relationship would deeply improve',            value: 'relationship' },
      { label: 'I\'d take back control of my sex life',           value: 'control' },
      { label: 'I\'d become the man I want to be again',          value: 'identity' },
    ],
    q5_sub: 'Consistency beats intensity. 10 minutes a day changes everything.',
    q5_q: 'To regain that control, how much time a day are you ready to invest?',
    q5_opts: [
      { label: '5 minutes — the essentials, fit into my day',  value: 5,  feedback: 'Perfect. We designed a program for exactly that.' },
      { label: '10 minutes — I\'m motivated and consistent',   value: 10, feedback: 'That\'s the sweet spot. Most results come from there.' },
      { label: '15 to 20 minutes — I want fast results',       value: 15, feedback: 'Excellent. You\'ll progress faster than average.' },
      { label: 'Whatever it takes — no limit',                 value: 20, feedback: 'We love that mindset. Your program will be intense.' },
    ],
    q6_q: 'One last thing — are you?',
    q6_opts: [
      { label: 'Single — I\'m working on myself first',              value: 'single' },
      { label: 'In a relationship — I want to progress for us both', value: 'couple' },
    ],
    insert1_quote: '“You\'re not alone.”',
    insert1_text: '78% of men who go through this have never told anyone — not their doctor, not their partner.\n\nThe fact that you\'re here already takes courage.',
    insert2_label: 'THEY WALKED THE SAME PATH',
    insert2_quote: '“In 6 weeks, I got back something I\'d lost for 4 years. My confidence, and my relationship with my wife.”',
    insert2_author: '— Thomas, 34',
    insert2_stat: 'of users report significant improvement as early as Phase 1',
    profileTitle: 'YOUR PROFILE',
    rows: { program: 'Program', results: 'Estimated results', approach: 'Approach' },
    minPerDay: 'min/day',
    urgency: 'The sooner you start, the sooner you\'ll be in control again.\nYour personalized program is ready.',
    ctaLoggedIn: 'Start my program →',
    ctaNew: 'Create my free account →',
    guarantee: '✓ Free to start · ✓ No credit card · ✓ Results in 4 weeks',
    profileLabels: {
      sensory: 'Sensory Hyperarousal', cognitive: 'Performance Anxiety', situational: 'Situational PE',
      conditioned: 'Conditioned PE', primary: 'Primary PE',
    },
    profileDuration: {
      sensory: '4 to 6 weeks', cognitive: '4 to 6 weeks', situational: '4 to 6 weeks',
      conditioned: '8 to 12 weeks', primary: '8 to 16 weeks',
    },
    profileApproach: {
      sensory: 'Sensory & body-based', cognitive: 'CBT & mindfulness', situational: 'Contextual & relational',
      conditioned: 'Neurological reconditioning', primary: 'Behavioral & medical',
    },
    profileTestimonial: {
      sensory:     { text: 'I felt like my body wasn\'t obeying me. In 5 weeks, I learned to recognize it before it raced.', author: 'Mehdi, 28' },
      cognitive:   { text: 'It was in my head, I knew it. But I didn\'t know how to get out. Alex helped me understand my thoughts.', author: 'Pierre, 31' },
      situational: { text: 'With my new partner I was stuck. Duramen helped me understand why and rebuild my confidence.', author: 'Karim, 26' },
      conditioned: { text: 'I\'d had habits for years. The reconditioning program changed everything in 10 weeks.', author: 'Lucas, 24' },
      primary:     { text: 'I always thought it was genetic and that nothing could change. I was wrong.', author: 'Marc, 38' },
    },
    desireText: {
      freedom:      'You deserve to live your sexuality without that constant fear. It\'s possible. And it starts now.',
      relationship: 'A fulfilling intimate relationship is built. Duramen guides you on that path.',
      control:      'Control isn\'t given — it\'s learned. Duramen is the method.',
      identity:     'That man already exists within you. Duramen gives you the tools to let him out.',
    },
  },
}

// intro → q1 → insert1 → q2 → q3 → q4 → insert2 → q5 → q6 → result
const STEPS = ['intro', 'q1', 'insert1', 'q2', 'q3', 'q4', 'insert2', 'q5', 'q6', 'result']
const QUESTION_STEPS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']

export default function Onboarding() {
  const { user, refreshProfile } = useAuth()
  const { t, lang, setLang } = useLang()
  const c = OB[lang] || OB.fr
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

  useEffect(() => { track('onboarding_start') }, [])
  useEffect(() => { if (isQuestion) track('onboarding_step', { q: qNumber }) }, [step])

  function goNext() { setFadeKey(k => k + 1); setStepIndex(i => i + 1) }
  function goBack() { if (stepIndex > 1) { setFadeKey(k => k + 1); setStepIndex(i => i - 1) } }

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
    if (user) {
      setLoading(true)
      const profileType = answers.profile_type || 'cognitive'
      const isConditioned = profileType === 'conditioned'
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        language: lang,
        profile_type: profileType,
        cost: answers.cost,
        desire: answers.desire,
        duration: answers.duration,
        daily_minutes: answers.daily_minutes || 10,
        situation: answers.situation || 'single',
        level: 1,
        program_week: 1,
        program_phase: 1,
        flag_conditioned_high: isConditioned,
        flag_conditioned_moderate: false,
        streak: 0, streak_last_date: null, xp: 0,
        onboarding_completed: true,
        created_at: new Date().toISOString(),
      })
      if (error) { alert('Erreur : ' + error.message); setLoading(false); return }
      track('onboarding_complete', { profile_type: profileType, returning: true })
      await refreshProfile()
      setLoading(false)
    } else {
      track('onboarding_complete', { profile_type: answers.profile_type || 'cognitive', returning: false })
      sessionStorage.setItem('duramen_onboarding', JSON.stringify({ ...answers, language: lang }))
      navigate('/auth')
    }
  }

  // ── INTRO ───────────────────────────────────────────────────────────────────
  if (step === 'intro') return (
    <div key={fadeKey} className="fade-in" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 28px', background: 'var(--bg)', position: 'relative' }}>

      <div style={{ position: 'absolute', top: 'calc(20px + env(safe-area-inset-top, 0px))', right: 20, display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: 3 }}>
        {['fr', 'en'].map(l => (
          <button key={l} onClick={() => setLang(l)}
            style={{
              border: 'none', borderRadius: 16, padding: '5px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: lang === l ? 'var(--primary)' : 'transparent',
              color: lang === l ? '#fff' : 'var(--text-muted)', transition: 'all 0.15s',
            }}>
            {l === 'fr' ? '🇫🇷 FR' : '🇬🇧 EN'}
          </button>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--primary)', fontWeight: 400, marginBottom: 32 }}>Duramen</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 500, color: 'var(--text)', lineHeight: 1.35, marginBottom: 16, whiteSpace: 'pre-line' }}>
          {t('intro_title')}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 12 }}>{t('intro_subtitle')}</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' }}>{t('intro_stat')}</p>
      </div>
      <button className="btn-primary" onClick={goNext} style={{ fontSize: 16, padding: '16px' }}>{t('intro_cta')}</button>
      {!user && (
        <button onClick={() => navigate('/auth')}
          style={{ marginTop: 20, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 14, cursor: 'pointer', textAlign: 'center' }}>
          {t('intro_have_account')} · <span style={{ color: 'var(--primary)', fontWeight: 500 }}>{t('intro_login')}</span>
        </button>
      )}
    </div>
  )

  // ── INSERT 1 ────────────────────────────────────────────────────────────────
  if (step === 'insert1') return (
    <div key={fadeKey} className="fade-in" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 28px', background: 'var(--primary-light)' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--primary)', marginBottom: 20, lineHeight: 1.4 }}>{c.insert1_quote}</p>
        <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>{c.insert1_text}</p>
      </div>
      <button className="btn-primary" onClick={goNext}>{c.continue}</button>
    </div>
  )

  // ── INSERT 2 ────────────────────────────────────────────────────────────────
  if (step === 'insert2') return (
    <div key={fadeKey} className="fade-in" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 28px', background: 'var(--bg)' }}>
      <div className="card" style={{ marginBottom: 32, padding: '24px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 14 }}>{c.insert2_label}</div>
        <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 8 }}>{c.insert2_quote}</p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.insert2_author}</p>
        <div style={{ height: 1, background: 'var(--border)', margin: '16px 0' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--primary)', lineHeight: 1 }}>89%</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{c.insert2_stat}</div>
        </div>
      </div>
      <button className="btn-primary" onClick={goNext}>{c.continue}</button>
    </div>
  )

  // ── RÉSULTAT ────────────────────────────────────────────────────────────────
  if (step === 'result') {
    const pt = answers.profile_type || 'cognitive'
    const desire = answers.desire || 'control'
    const dm = answers.daily_minutes || 10
    const testimonial = c.profileTestimonial[pt]
    return (
      <div key={fadeKey} className="fade-in" style={{ minHeight: '100dvh', padding: '52px 24px 40px', background: 'var(--bg)', overflowY: 'auto' }}>

        <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--text)', textAlign: 'center', lineHeight: 1.6, marginBottom: 28 }}>
          {c.desireText[desire]}
        </p>

        <div style={{ background: 'var(--primary-light)', border: '1.5px solid var(--primary)', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>{c.profileTitle}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text)', marginBottom: 14 }}>{c.profileLabels[pt]}</div>
          {[
            { label: c.rows.program, value: `${dm} ${c.minPerDay}` },
            { label: c.rows.results, value: c.profileDuration[pt] },
            { label: c.rows.approach, value: c.profileApproach[pt] },
          ].map((row, i, arr) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < arr.length - 1 ? 10 : 0, marginBottom: i < arr.length - 1 ? 10 : 0, borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', marginBottom: 16 }}>
          <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 6 }}>"{testimonial.text}"</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>— {testimonial.author}</p>
        </div>

        <p style={{ fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center', lineHeight: 1.7, marginBottom: 24, whiteSpace: 'pre-line' }}>
          {c.urgency}
        </p>

        <button className="btn-primary" onClick={handleFinish} disabled={loading} style={{ padding: '16px', fontSize: 15, marginBottom: 12 }}>
          {loading ? <span className="spinner"></span> : user ? c.ctaLoggedIn : c.ctaNew}
        </button>
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>{c.guarantee}</div>
      </div>
    )
  }

  // ── QUESTIONS ───────────────────────────────────────────────────────────────
  const canGoBack = stepIndex > 1 && isQuestion && step !== 'q1'

  return (
    <div key={fadeKey} className="fade-in" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', padding: '0 0 32px' }}>

      <div style={{ padding: '52px 24px 0' }}>
        <div style={{ height: 4, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 4, background: 'var(--primary)', width: `${progress}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 0' }}>

        {step === 'q1' && <>
          <h2 style={qStyle}>{c.q1_q}</h2>
          <Options options={c.q1_opts} selected={answers.cost} onSelect={v => choose('cost', v)} />
        </>}

        {step === 'q2' && <>
          <h2 style={qStyle}>{c.q2_q}</h2>
          <Options options={c.q2_opts} selected={answers.profile_type} onSelect={v => choose('profile_type', v)} />
        </>}

        {step === 'q3' && <>
          <h2 style={qStyle}>{c.q3_q}</h2>
          <OptionsWithFeedback options={c.q3_opts} selected={answers.duration} microFeedback={microFeedback} onSelect={(v, fb) => choose('duration', v, fb)} />
        </>}

        {step === 'q4' && <>
          <h2 style={qStyle}>{c.q4_q}</h2>
          <Options options={c.q4_opts} selected={answers.desire} onSelect={v => choose('desire', v)} />
        </>}

        {step === 'q5' && <>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 12, lineHeight: 1.5 }}>{c.q5_sub}</p>
          <h2 style={qStyle}>{c.q5_q}</h2>
          <OptionsWithFeedback options={c.q5_opts} selected={answers.daily_minutes} microFeedback={microFeedback} onSelect={(v, fb) => choose('daily_minutes', v, fb)} />
        </>}

        {step === 'q6' && <>
          <h2 style={qStyle}>{c.q6_q}</h2>
          <Options options={c.q6_opts} selected={answers.situation} onSelect={v => choose('situation', v)} />
        </>}

        {canGoBack && (
          <button onClick={goBack} style={{ marginTop: 24, color: 'var(--text-muted)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <i className="ti ti-arrow-left"></i> {c.back}
          </button>
        )}
      </div>
    </div>
  )
}

const qStyle = {
  fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500,
  color: 'var(--text)', lineHeight: 1.35, marginBottom: 24,
}

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
