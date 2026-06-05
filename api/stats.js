// Tableau de bord admin — calcule les métriques du funnel à partir des events.
// Protégé par mot de passe (CRON_SECRET). Lit via la clé service (données privées).
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

function uniq(arr) { return [...new Set(arr.filter(Boolean))] }

export default async function handler(req, res) {
  const key = req.query.key || req.headers['x-admin-key']
  if (key !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  try {
    // Récupère les événements des 30 derniers jours (max 10000)
    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
    const { data: events } = await supabase
      .from('events').select('*').gte('created_at', since).limit(10000)

    const { data: feedback } = await supabase
      .from('feedback').select('*').order('created_at', { ascending: false }).limit(50)

    const ev = events || []
    const by = name => ev.filter(e => e.event === name)
    const idsOf = name => uniq(by(name).map(e => e.user_id || e.anon_id))

    // Funnel principal (par personne unique)
    const start    = idsOf('onboarding_start').length
    const complete = idsOf('onboarding_complete').length
    const signup   = uniq(by('signup').map(e => e.user_id)).length
    const exoUsers = uniq(by('exercise_complete').map(e => e.user_id || e.anon_id)).length
    const coachUsers = idsOf('coach_open').length

    // Abandon par question d'onboarding
    const dropoff = {}
    for (let q = 1; q <= 6; q++) {
      dropoff['q' + q] = uniq(by('onboarding_step').filter(e => e.props?.q === q).map(e => e.anon_id || e.user_id)).length
    }

    // Exercices complétés (total + par exercice)
    const exoComplete = by('exercise_complete')
    const exoByType = {}
    exoComplete.forEach(e => { const id = e.props?.id || '?'; exoByType[id] = (exoByType[id] || 0) + 1 })

    // Rétention simple : utilisateurs actifs sur N jours distincts
    const daysByUser = {}
    ev.filter(e => e.user_id).forEach(e => {
      const d = e.created_at.slice(0, 10)
      daysByUser[e.user_id] = daysByUser[e.user_id] || new Set()
      daysByUser[e.user_id].add(d)
    })
    const usersActiveDays = Object.values(daysByUser).map(s => s.size)
    const returning = usersActiveDays.filter(n => n >= 2).length

    // Profils choisis
    const profiles = {}
    by('onboarding_complete').forEach(e => { const p = e.props?.profile_type || '?'; profiles[p] = (profiles[p] || 0) + 1 })

    // Feedback
    const fb = feedback || []
    const ratings = fb.map(f => f.rating).filter(Boolean)
    const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null

    const pct = (a, b) => b > 0 ? Math.round((a / b) * 100) : 0

    return res.status(200).json({
      funnel: { start, complete, signup, exoUsers, coachUsers },
      rates: {
        onboardingCompletion: pct(complete, start),
        signupConversion: pct(signup, complete),
        activation: pct(exoUsers, signup),
        retentionRate: pct(returning, signup),
      },
      dropoff,
      profiles,
      exoByType,
      totals: { events: ev.length, returning, signup },
      feedback: { avgRating, count: fb.length, recent: fb.slice(0, 20).map(f => ({ rating: f.rating, message: f.message, date: f.created_at?.slice(0, 10) })) },
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
