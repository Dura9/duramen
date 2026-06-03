import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

// ─── SÉQUENCE DES ÉTAPES ──────────────────────────────────────────────────────
// Types : 'text_input' | 'choice' | 'multi' | 'insert' | 'result'
// Les inserts et l'écran résultat ne comptent pas comme "questions" pour la jauge
const TOTAL_QUESTIONS = 14
const TOTAL_STEPS = 17 // 14 questions + 3 inserts

// Index logiques dans la séquence complète (0-based) :
// 0  = Q1, 1 = Q2, 2 = Q3,
// 3  = INSERT1,
// 4  = Q4, 5 = Q5,
// 6  = INSERT2,
// 7  = Q6, 8 = Q7, 9 = Q8, 10 = Q9,
// 11 = INSERT3,
// 12 = Q10, 13 = Q11, 14 = Q12,
// 15 = Q13, 16 = Q14
// 17 = RÉSULTAT (hors séquence)

const SEQUENCE = [
  // ── Q1 ─────────────────────────────────────────────────────────────────────
  {
    id: 'q1', type: 'choice', qIndex: 1,
    question: 'Comment décrirais-tu ta vie sexuelle en ce moment ?',
    field: 'mood_entry',
    options: [
      { value: 'great',   label: 'Elle est épanouissante' },
      { value: 'ok',      label: 'Elle est correcte mais j\'aimerais mieux faire' },
      { value: 'improve', label: 'J\'aimerais vraiment l\'améliorer' },
      { value: 'hard',    label: 'Elle est difficile en ce moment' },
    ],
  },
  // ── Q2 ─────────────────────────────────────────────────────────────────────
  {
    id: 'q2', type: 'choice', qIndex: 2,
    question: 'Depuis quand remarques-tu que tu éjacules plus vite que tu ne le souhaites ?',
    field: 'q2',
    options: [
      { value: 'always',    label: 'Depuis mes tous premiers rapports sexuels',      score: 0, flag_primary: true },
      { value: 'months',    label: 'Depuis quelques mois',                           score: 2 },
      { value: 'years',     label: 'Depuis quelques années',                         score: 2 },
      { value: 'variable',  label: 'C\'est variable selon les moments',              score: 3 },
      { value: 'unsure',    label: 'Je ne suis pas sûr que ce soit vraiment un problème', score: 3 },
    ],
  },
  // ── Q3 ─────────────────────────────────────────────────────────────────────
  {
    id: 'q3', type: 'choice', qIndex: 3,
    question: 'À quelle fréquence cela se produit-il ?',
    field: 'q3',
    options: [
      { value: '0', label: 'Presque toujours (plus de 9 fois sur 10)',    score: 0 },
      { value: '1', label: 'La plupart du temps (plus d\'une fois sur deux)', score: 1 },
      { value: '2', label: 'Environ la moitié du temps',                  score: 2 },
      { value: '3', label: 'De temps en temps',                           score: 3 },
      { value: '4', label: 'Rarement',                                    score: 4 },
    ],
  },
  // ── INSERT 1 ───────────────────────────────────────────────────────────────
  {
    id: 'insert1', type: 'insert',
    bg: '#e8f4f0',
    icon: '💡',
    text: 'Pour information : la durée médiane mondiale lors d\'un rapport est de 5,4 minutes. 30 % des hommes éjaculent en moins de 2 minutes. Ce que tu vis est partagé par des millions d\'hommes — et ça se traite très bien.',
  },
  // ── Q4 ─────────────────────────────────────────────────────────────────────
  {
    id: 'q4', type: 'choice', qIndex: 4,
    question: 'En général, combien de temps s\'écoule entre le début de la pénétration et l\'éjaculation ?',
    field: 'q4',
    options: [
      { value: '0', label: 'Moins de 30 secondes',                           score: 0, flag_severe: true },
      { value: '1', label: 'Entre 30 secondes et 1 minute',                  score: 1, flag_moderate: true },
      { value: '2', label: 'Entre 1 et 2 minutes',                           score: 2 },
      { value: '3', label: 'Entre 2 et 5 minutes',                           score: 3 },
      { value: '4', label: 'Plus de 5 minutes (mais je veux mieux contrôler)', score: 4 },
    ],
  },
  // ── Q5 ─────────────────────────────────────────────────────────────────────
  {
    id: 'q5', type: 'choice', qIndex: 5,
    question: 'Comment évalues-tu ton niveau de contrôle sur le moment de ton éjaculation ?',
    field: 'q5',
    options: [
      { value: '0', label: 'Aucun contrôle — ça arrive avant même que je le réalise', score: 0 },
      { value: '1', label: 'Très peu de contrôle',                                     score: 1 },
      { value: '2', label: 'Un peu de contrôle, mais insuffisant',                     score: 2 },
      { value: '3', label: 'Un contrôle correct mais perfectible',                     score: 3 },
      { value: '4', label: 'Je contrôle à peu près, mais pas assez à mon goût',        score: 4 },
    ],
  },
  // ── INSERT 2 ───────────────────────────────────────────────────────────────
  {
    id: 'insert2', type: 'insert',
    bg: '#fdf6e3',
    icon: '💬',
    text: 'Tu n\'es pas seul. 78 % des hommes qui font ce diagnostic ressentent exactement la même anxiété pendant les rapports. L\'absence de contrôle n\'est pas un défaut — c\'est une compétence qui s\'apprend.',
  },
  // ── Q6 ─────────────────────────────────────────────────────────────────────
  {
    id: 'q6', type: 'choice', qIndex: 6,
    question: 'Pendant un rapport sexuel, à quel point penses-tu à la durée ?',
    field: 'q6',
    options: [
      { value: '0', label: 'Tout le temps — c\'est la seule chose à laquelle je pense', score_anxiety: 0 },
      { value: '1', label: 'Souvent — ça gâche une partie du plaisir',                  score_anxiety: 1 },
      { value: '2', label: 'Parfois — selon les moments',                               score_anxiety: 2 },
      { value: '3', label: 'Rarement',                                                  score_anxiety: 3 },
      { value: '4', label: 'Jamais ou presque',                                         score_anxiety: 4 },
    ],
  },
  // ── Q7 ─────────────────────────────────────────────────────────────────────
  {
    id: 'q7', type: 'choice', qIndex: 7,
    question: 'À quel point ce problème affecte-t-il ta confiance en toi ?',
    field: 'q7',
    options: [
      { value: '0', label: 'Enormément — c\'est très douloureux psychologiquement', score: 0 },
      { value: '1', label: 'Beaucoup — j\'y pense souvent en dehors des rapports',  score: 1 },
      { value: '2', label: 'Modérément',                                            score: 2 },
      { value: '3', label: 'Un peu',                                                score: 3 },
      { value: '4', label: 'Pas vraiment',                                          score: 4 },
    ],
  },
  // ── Q8 ─────────────────────────────────────────────────────────────────────
  {
    id: 'q8', type: 'choice', qIndex: 8,
    question: 'Est-ce que ce problème crée des tensions dans ta vie intime ou amoureuse ?',
    field: 'q8',
    options: [
      { value: '0', label: 'Oui, c\'est une source majeure de problèmes dans mon couple', score: 0 },
      { value: '1', label: 'Oui, ça crée parfois des tensions',                          score: 1 },
      { value: '2', label: 'Un peu',                                                     score: 2 },
      { value: '3', label: 'Pas vraiment',                                               score: 3 },
      { value: 'single', label: 'Je suis célibataire pour l\'instant',                  score: 2 },
    ],
  },
  // ── Q9 ─────────────────────────────────────────────────────────────────────
  {
    id: 'q9', type: 'choice', qIndex: 9,
    question: 'As-tu déjà essayé de résoudre ce problème ?',
    field: 'past_attempts',
    options: [
      { value: 'first_time',  label: 'Non, c\'est la première fois que j\'en prends conscience' },
      { value: 'research',    label: 'J\'ai cherché des informations sur internet' },
      { value: 'tried_alone', label: 'J\'ai essayé des techniques seul, sans résultat durable' },
      { value: 'medical',     label: 'J\'ai consulté un médecin' },
    ],
  },
  // ── INSERT 3 ───────────────────────────────────────────────────────────────
  {
    id: 'insert3', type: 'insert',
    bg: '#ffffff',
    icon: '🔬',
    text: 'Les 3 questions suivantes sont médicales. Elles nous permettent de t\'orienter correctement et de t\'éviter de perdre du temps si ton problème nécessite d\'abord un avis médical.',
  },
  // ── Q10 ────────────────────────────────────────────────────────────────────
  {
    id: 'q10', type: 'choice', qIndex: 10,
    question: 'As-tu des douleurs ou une gêne dans le bas-ventre, ou des brûlures urinaires ?',
    field: 'q10',
    options: [
      { value: 'often',  label: 'Oui, souvent',   flag_red: true },
      { value: 'sometimes', label: 'Oui, parfois', flag_yellow: true },
      { value: 'never',  label: 'Non jamais' },
    ],
  },
  // ── Q11 ────────────────────────────────────────────────────────────────────
  {
    id: 'q11', type: 'choice', qIndex: 11,
    question: 'As-tu parfois des difficultés à obtenir ou maintenir une érection ?',
    field: 'q11',
    options: [
      { value: 'often',     label: 'Oui, souvent — c\'est aussi un problème', flag_red: true },
      { value: 'sometimes', label: 'Oui, parfois',                            flag_yellow: true },
      { value: 'never',     label: 'Non, l\'érection n\'est pas un problème' },
    ],
  },
  // ── Q12 ────────────────────────────────────────────────────────────────────
  {
    id: 'q12', type: 'multi', qIndex: 12,
    question: 'As-tu l\'un de ces éléments ?',
    field: 'q12',
    options: [
      { value: 'thyroid',    label: 'Problèmes de thyroïde',                                   flag_yellow: true },
      { value: 'diabetes',   label: 'Diabète',                                                 flag_yellow: true },
      { value: 'medication', label: 'Je prends des antidépresseurs ou des médicaments pour la tension', flag_yellow: true },
      { value: 'none',       label: 'Aucun de ces éléments',                                  exclusive: true },
    ],
  },
  // ── Q13 ────────────────────────────────────────────────────────────────────
  {
    id: 'q13', type: 'choice', qIndex: 13,
    question: 'Si tu ne pouvais choisir qu\'une seule chose à améliorer, ce serait ?',
    field: 'goal',
    options: [
      { value: 'duration',  label: 'Durer significativement plus longtemps' },
      { value: 'control',   label: 'Mieux sentir et contrôler mes sensations' },
      { value: 'anxiety',   label: 'Arrêter d\'avoir peur pendant les rapports' },
      { value: 'intimacy',  label: 'Améliorer l\'intimité avec ma partenaire' },
    ],
  },
  // ── Q14 ────────────────────────────────────────────────────────────────────
  {
    id: 'q14', type: 'choice', qIndex: 14,
    question: 'Combien de minutes peux-tu consacrer à ton programme chaque jour ?',
    subtitle: 'La régularité est plus importante que la durée. 10 minutes par jour vaut mieux que 2 heures par semaine.',
    field: 'daily_minutes',
    options: [
      { value: 5,  label: '5 minutes' },
      { value: 10, label: '10 minutes' },
      { value: 15, label: '15 à 20 minutes' },
      { value: 20, label: 'Plus de 20 minutes' },
    ],
  },
]

// ─── CALCUL DU RÉSULTAT ───────────────────────────────────────────────────────
function computeResult(answers) {
  const score = (v, field) => answers[field]?.score ?? 0
  const scoreAnxiety = (v, field) => answers[field]?.score_anxiety ?? 0

  const pedt_score =
    (answers.q3?.score ?? 0) +
    (answers.q4?.score ?? 0) +
    (answers.q5?.score ?? 0) +
    (answers.q7?.score ?? 0) +
    (answers.q8?.score ?? 0)

  const anxiety_score = answers.q6?.score_anxiety ?? 0

  const flag_primary =
    answers.q2?.flag_primary === true &&
    (answers.q4?.value === '0' || answers.q4?.value === '1')

  const flag_red =
    answers.q10?.flag_red === true ||
    answers.q11?.flag_red === true ||
    (flag_primary && pedt_score <= 4)

  const q12_yellow = Array.isArray(answers.q12)
    ? answers.q12.some(o => o.flag_yellow)
    : false

  const flag_yellow =
    answers.q10?.flag_yellow === true ||
    answers.q11?.flag_yellow === true ||
    q12_yellow ||
    anxiety_score <= 1 ||
    (flag_primary && !flag_red)

  let result_type = 'green'
  if (flag_red) result_type = 'red'
  else if (flag_yellow) result_type = 'yellow'

  const level = pedt_score <= 7 ? 1 : pedt_score <= 14 ? 2 : 3

  return { pedt_score, anxiety_score, flag_primary, flag_red, flag_yellow, result_type, level }
}

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
export default function Onboarding() {
  const { user, refreshProfile } = useAuth()
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [textValue, setTextValue] = useState('')
  const [multiSelected, setMultiSelected] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fadeKey, setFadeKey] = useState(0)

  const step = SEQUENCE[stepIndex]

  // Nombre de questions répondues pour la jauge (inserts ne comptent pas)
  const questionsAnswered = SEQUENCE.slice(0, stepIndex).filter(s => s.type !== 'insert').length
  const progress = showResult ? 1 : questionsAnswered / TOTAL_QUESTIONS

  function goNext() {
    if (stepIndex < SEQUENCE.length - 1) {
      setFadeKey(k => k + 1)
      setStepIndex(i => i + 1)
    } else {
      setShowResult(true)
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      setFadeKey(k => k + 1)
      setStepIndex(i => i - 1)
    }
  }

  function handleChoice(option) {
    setAnswers(a => ({ ...a, [step.field]: option }))
    setTimeout(goNext, 220)
  }

  function handleMultiToggle(option) {
    if (option.exclusive) {
      setMultiSelected([option])
      return
    }
    setMultiSelected(prev => {
      const withoutExclusive = prev.filter(o => !o.exclusive)
      const already = withoutExclusive.find(o => o.value === option.value)
      return already
        ? withoutExclusive.filter(o => o.value !== option.value)
        : [...withoutExclusive, option]
    })
  }

  function handleMultiNext() {
    const selected = multiSelected.length > 0 ? multiSelected : []
    setAnswers(a => ({ ...a, [step.field]: selected }))
    goNext()
  }

  function handleTextNext() {
    if (!textValue.trim()) return
    setAnswers(a => ({ ...a, [step.field]: textValue.trim() }))
    setTextValue('')
    goNext()
  }

  async function handleFinish() {
    setLoading(true)
    const { pedt_score, anxiety_score, result_type, level } = computeResult(answers)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      first_name: answers.first_name,
      language: answers.language?.value ?? 'fr',
      situation: answers.situation?.value ?? 'single',
      goal: answers.goal?.value ?? answers.goal ?? 'control',
      level,
      pedt_score,
      anxiety_score,
      past_attempts: answers.past_attempts?.value ?? answers.past_attempts ?? null,
      daily_minutes: answers.daily_minutes?.value ?? answers.daily_minutes ?? 10,
      result_type,
      mood_entry: answers.mood_entry?.value ?? answers.mood_entry ?? null,
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

  // ── ÉCRAN RÉSULTAT ────────────────────────────────────────────────────────
  if (showResult) {
    const { pedt_score, anxiety_score, result_type, level } = computeResult(answers)
    const firstName = answers.first_name ?? ''
    const past = answers.past_attempts?.value ?? answers.past_attempts ?? 'first_time'
    const goalValue = answers.goal?.value ?? answers.goal ?? 'control'

    const goalLabel = {
      duration: 'Maîtrise & durée',
      control: 'Contrôle des sensations',
      anxiety: 'Confiance & sérénité',
      intimacy: 'Intimité de couple',
    }[goalValue] ?? 'Programme personnalisé'

    const pastMsg = {
      first_time:  'Tu as fait le premier pas, souvent le plus difficile.',
      research:    'L\'information seule ne suffit pas. Il faut une méthode structurée et progressive.',
      tried_alone: 'Sans progression guidée, les techniques isolées ne fonctionnent pas. Duramen change ça.',
      medical:     'Duramen complète parfaitement un suivi médical sur la partie comportementale.',
    }[past] ?? ''

    if (result_type === 'green') {
      return (
        <ResultScreen title="Bonne nouvelle — ton profil est traitable" color="#4A7C6F" progress={1}>
          <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.7, marginBottom: 24 }}>
            On comprend. Ce n'est pas juste une question de durée. C'est la confiance en toi, le regard de ta partenaire, ce moment juste avant où tu te demandes si ça va aller cette fois. Duramen est conçu pour tout ça.
          </p>

          <div style={{ background: '#e8f4f0', border: '1.5px solid #4A7C6F40', borderRadius: 16, padding: '20px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#4A7C6F', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>Ton diagnostic</div>
            <Row label="Ton profil" value="EP acquise / variable" />
            <Row label="Niveau de sévérité" value={`${pedt_score}/20`} />
            <Row label="Programme recommandé" value={goalLabel} />
            <Row label="Résultats visibles estimés" value="4 à 6 semaines" last />
            <ScoreBar score={pedt_score} max={20} color="#4A7C6F" />
          </div>

          {pastMsg && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', marginBottom: 24, fontSize: 14, color: 'var(--text)', lineHeight: 1.6, fontStyle: 'italic' }}>
              "{pastMsg}"
            </div>
          )}

          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 }}>
            Plus tôt tu commences, plus tôt tu redeviendras maître de ton éjaculation.
          </p>

          <button className="btn-primary" onClick={handleFinish} disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Créer mon compte et commencer →'}
          </button>
        </ResultScreen>
      )
    }

    if (result_type === 'yellow') {
      return (
        <ResultScreen title="Tu peux progresser avec Duramen — avec un accompagnement complémentaire" color="#D4A855" progress={1}>
          <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.7, marginBottom: 24 }}>
            Ton profil montre des éléments qui méritent une attention particulière. Duramen peut t'aider sur la partie comportementale et psychologique — mais pour maximiser tes résultats, un suivi médical complémentaire serait utile. Ce n'est pas un obstacle — c'est simplement pour aller plus loin.
          </p>

          <div style={{ background: '#fdf6e3', border: '1.5px solid #D4A85540', borderRadius: 16, padding: '20px', marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#D4A855', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 14 }}>Ton diagnostic</div>
            <Row label="Ton profil" value={answers.q2?.flag_primary ? 'EP primaire' : 'EP avec facteurs complémentaires'} />
            <Row label="Recommandation" value="Duramen + consultation urologue ou sexologue" last />
          </div>

          <button className="btn-primary" onClick={handleFinish} disabled={loading} style={{ marginBottom: 12 }}>
            {loading ? <span className="spinner"></span> : 'Commencer Duramen maintenant →'}
          </button>
          <a href="https://www.doctolib.fr/sexologue" target="_blank" rel="noopener noreferrer"
            style={{ display: 'block', textAlign: 'center', padding: '14px', borderRadius: 12, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
            Trouver un sexologue
          </a>
        </ResultScreen>
      )
    }

    // RED
    return (
      <ResultScreen title="Ton profil nécessite d'abord un avis médical" color="#c0392b" progress={1}>
        <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.7, marginBottom: 24 }}>
          Ton honnêteté te rend service. Certaines de tes réponses indiquent qu'un professionnel de santé devrait être consulté avant de commencer des exercices comportementaux. Ce n'est pas une mauvaise nouvelle — ces situations se traitent très bien médicalement. Une fois suivi, Duramen sera là pour t'accompagner.
        </p>

        <a href="https://www.doctolib.fr/urologue" target="_blank" rel="noopener noreferrer"
          style={{ display: 'block', textAlign: 'center', padding: '16px', borderRadius: 12, background: 'var(--primary)', color: '#fff', fontSize: 15, fontWeight: 600, textDecoration: 'none', marginBottom: 16 }}>
          Trouver un urologue / sexologue
        </a>

        <button onClick={handleFinish} disabled={loading}
          style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 14, padding: '8px', cursor: 'pointer' }}>
          {loading ? <span className="spinner"></span> : 'Je comprends, je veux quand même explorer Duramen'}
        </button>
      </ResultScreen>
    )
  }

  // ── QUESTIONS & INSERTS ───────────────────────────────────────────────────
  const isInsert = step.type === 'insert'
  const canGoBack = stepIndex > 0 && !isInsert

  return (
    <div key={fadeKey} style={{ minHeight: '100dvh', padding: '0 0 32px', display: 'flex', flexDirection: 'column', background: isInsert ? step.bg : 'var(--bg)' }} className="fade-in">

      {/* ── Barre de progression ── */}
      <div style={{ padding: '52px 24px 0' }}>
        <div style={{ height: 4, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 4, background: 'var(--primary)', width: `${progress * 100}%`, transition: 'width 0.4s ease' }} />
        </div>
        {!isInsert && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, textAlign: 'right' }}>
            {step.qIndex} / {TOTAL_QUESTIONS}
          </div>
        )}
      </div>

      {/* ── INSERT interstitiel ── */}
      {isInsert && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 28px', textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 24 }}>{step.icon}</div>
          <p style={{ fontSize: 16, color: 'var(--text)', lineHeight: 1.75, maxWidth: 400 }}>{step.text}</p>
          <button className="btn-primary" onClick={goNext} style={{ marginTop: 40, width: '100%', maxWidth: 320 }}>
            Continuer
          </button>
        </div>
      )}

      {/* ── Questions ── */}
      {!isInsert && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 24px 0' }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, color: 'var(--text)', lineHeight: 1.35, marginBottom: 8 }}>
              {step.question}
            </h2>
            {step.subtitle && (
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>{step.subtitle}</p>
            )}
          </div>

          {/* ── Saisie texte ── */}
          {step.type === 'text_input' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input
                type="text"
                value={textValue}
                onChange={e => setTextValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleTextNext()}
                placeholder={step.placeholder}
                autoFocus
                style={{ width: '100%', padding: '16px 18px', borderRadius: 'var(--radius)', border: '1.5px solid var(--primary)', fontSize: 18, background: 'var(--bg-card)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }}
              />
              <button className="btn-primary" onClick={handleTextNext} disabled={!textValue.trim()}>Continuer →</button>
            </div>
          )}

          {/* ── Choix unique ── */}
          {step.type === 'choice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {step.options.map(option => {
                const selected = answers[step.field]?.value === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => handleChoice(option)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: 14,
                      border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                      background: selected ? 'var(--primary-light)' : 'var(--bg-card)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 }}>{option.label}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* ── Multi-sélection (Q12) ── */}
          {step.type === 'multi' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {step.options.map(option => {
                const selected = multiSelected.find(o => o.value === option.value)
                return (
                  <button
                    key={option.value}
                    onClick={() => handleMultiToggle(option)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: 14,
                      border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                      background: selected ? 'var(--primary-light)' : 'var(--bg-card)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 6, border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                      background: selected ? 'var(--primary)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {selected && <span style={{ color: '#fff', fontSize: 12, lineHeight: 1 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4 }}>{option.label}</span>
                  </button>
                )
              })}
              <button className="btn-primary" onClick={handleMultiNext} style={{ marginTop: 8 }}>
                Continuer →
              </button>
            </div>
          )}

          {/* ── Bouton retour ── */}
          {canGoBack && (
            <button onClick={goBack} style={{ marginTop: 24, color: 'var(--text-muted)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <i className="ti ti-arrow-left"></i> Retour
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── COMPOSANTS UTILITAIRES ───────────────────────────────────────────────────
function ResultScreen({ title, color, progress, children }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }} className="fade-in">
      <div style={{ padding: '52px 24px 0' }}>
        <div style={{ height: 4, borderRadius: 4, background: 'var(--border)', overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 4, background: color, width: '100%' }} />
        </div>
      </div>
      <div style={{ flex: 1, padding: '32px 24px 40px', display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, marginBottom: 24 }}>
          {title}
        </h1>
        {children}
      </div>
    </div>
  )
}

function Row({ label, value, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, paddingBottom: last ? 0 : 10, marginBottom: last ? 0 : 10, borderBottom: last ? 'none' : '1px solid var(--border)' }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function ScoreBar({ score, max, color }) {
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
        <span>Score PEDT</span>
        <span style={{ fontWeight: 700, color }}>{score}/{max}</span>
      </div>
      <div style={{ height: 8, borderRadius: 8, background: 'var(--border)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 8, background: color, width: `${(score / max) * 100}%`, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}
