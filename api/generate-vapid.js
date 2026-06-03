// Endpoint ONE-SHOT pour générer les clés VAPID
// À appeler UNE SEULE FOIS depuis le navigateur, puis supprimer ou sécuriser
import webpush from 'web-push'

export default function handler(req, res) {
  // Sécurité basique : n'afficher que si les clés ne sont pas encore définies
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    return res.status(200).json({
      message: 'Clés déjà configurées. Supprime cet endpoint.',
      public: process.env.VAPID_PUBLIC_KEY,
    })
  }

  const keys = webpush.generateVAPIDKeys()
  return res.status(200).json({
    message: 'Copie ces deux valeurs dans les variables Vercel !',
    VAPID_PUBLIC_KEY: keys.publicKey,
    VAPID_PRIVATE_KEY: keys.privateKey,
  })
}
