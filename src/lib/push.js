// Helpers de gestion des notifications push (abonnement / désabonnement)
import { supabase } from './supabase'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = window.atob(base64)
  const arr = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; ++i) arr[i] = raw.charCodeAt(i)
  return arr
}

export function pushSupported() {
  return typeof Notification !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window
}

// Renvoie true si l'utilisateur est actuellement abonné aux notifications
export async function isPushEnabled() {
  if (!pushSupported() || Notification.permission !== 'granted') return false
  try {
    const reg = await navigator.serviceWorker.getRegistration()
    if (!reg) return false
    const sub = await reg.pushManager.getSubscription()
    return !!sub
  } catch { return false }
}

// Active les notifications : permission + abonnement + sauvegarde Supabase
export async function enablePush(userId) {
  if (!pushSupported()) throw new Error('unsupported')
  const permission = await Notification.requestPermission()
  if (permission !== 'granted') throw new Error('denied')
  const reg = await navigator.serviceWorker.register('/sw.js')
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  })
  await fetch('/api/push-subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription: sub, user_id: userId }),
  })
  localStorage.removeItem('duramen_push_dismissed')
  return true
}

// Désactive les notifications : désabonnement + suppression Supabase
export async function disablePush(userId) {
  try {
    const reg = await navigator.serviceWorker.getRegistration()
    if (reg) {
      const sub = await reg.pushManager.getSubscription()
      if (sub) await sub.unsubscribe()
    }
  } catch {}
  try { await supabase.from('push_subscriptions').delete().eq('user_id', userId) } catch {}
  localStorage.setItem('duramen_push_dismissed', '1')
  return false
}
