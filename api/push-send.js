// Envoie les notifications push quotidiennes
// Appelé automatiquement chaque jour par Vercel Cron
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

webpush.setVapidDetails(
  'mailto:duramenplus@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

const MESSAGES = [
  { title: '🌬️ Duramen', body: 'Ta séance du jour t\'attend. 10 minutes pour progresser.' },
  { title: '🔥 Duramen', body: 'Garde ton streak ! La régularité fait la différence.' },
  { title: '💪 Duramen', body: 'Chaque séance te rapproche de ton objectif. C\'est le moment !' },
  { title: '🧘 Duramen', body: 'Alex est là pour t\'accompagner. Tu reviens ?' },
  { title: '⭐ Duramen', body: 'N\'oublie pas ta séance d\'aujourd\'hui — tu le mérites.' },
  { title: '🎯 Duramen', body: 'Un petit effort aujourd\'hui, un grand progrès demain.' },
  { title: '🌱 Duramen', body: 'Ta progression continue. Fais ta séance du jour !' },
]

export default async function handler(req, res) {
  // Sécurité : vérifier le header Vercel Cron
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Non autorisé' })
  }

  const { data: subs } = await supabase.from('push_subscriptions').select('*')
  if (!subs || subs.length === 0) return res.status(200).json({ sent: 0 })

  const msg = MESSAGES[new Date().getDay() % MESSAGES.length]
  const payload = JSON.stringify({ title: msg.title, body: msg.body, icon: '/icon.svg', badge: '/icon.svg' })

  let sent = 0, failed = 0
  for (const sub of subs) {
    try {
      await webpush.sendNotification(JSON.parse(sub.subscription), payload)
      sent++
    } catch (err) {
      failed++
      // Subscription expirée — on la supprime
      if (err.statusCode === 410) {
        await supabase.from('push_subscriptions').delete().eq('user_id', sub.user_id)
      }
    }
  }

  return res.status(200).json({ sent, failed })
}
