import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
  return outputArray
}

export default function PushPrompt() {
  const { user } = useAuth()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!user) return
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (Notification.permission !== 'default') return
    const dismissed = localStorage.getItem('duramen_push_dismissed')
    if (dismissed) return
    // Afficher après 3 secondes
    const t = setTimeout(() => setShow(true), 3000)
    return () => clearTimeout(t)
  }, [user])

  async function handleAccept() {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.register('/sw.js')
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') { setShow(false); return }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub, user_id: user.id }),
      })

      setDone(true)
      setTimeout(() => setShow(false), 2000)
    } catch (err) {
      console.error('Push error:', err)
      setShow(false)
    }
    setLoading(false)
  }

  function handleDismiss() {
    localStorage.setItem('duramen_push_dismissed', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)', maxWidth: 440,
      background: 'var(--bg-card)', border: '1.5px solid var(--border)',
      borderRadius: 20, padding: '16px 18px',
      boxShadow: 'var(--shadow-lg)', zIndex: 90,
      animation: 'slide-up 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
    }}>
      {done ? (
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>🔔</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Notifications activées !</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Tu recevras un rappel quotidien à 8h.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>🔔</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
              Rappel quotidien
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12 }}>
              Reçois une notification chaque matin pour ne jamais manquer ta séance.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleAccept}
                disabled={loading}
                style={{ flex: 1, padding: '9px 0', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                {loading ? '...' : 'Activer'}
              </button>
              <button
                onClick={handleDismiss}
                style={{ flex: 1, padding: '9px 0', background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}
              >
                Plus tard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
