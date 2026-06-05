import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { track } from '../lib/analytics'

export default function FeedbackCard() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(null)
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!rating && !text.trim()) return
    setLoading(true)
    try {
      await supabase.from('feedback').insert({
        user_id: user?.id ?? null,
        rating,
        message: text.trim() || null,
        created_at: new Date().toISOString(),
      })
      track('feedback_submit', { rating })
      setSent(true)
      setTimeout(() => { setOpen(false); setSent(false); setRating(null); setText('') }, 1800)
    } catch (_) {}
    setLoading(false)
  }

  return (
    <>
      {/* Row dans la page Compte */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>Ton avis compte</div>
        <button
          onClick={() => setOpen(true)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
            background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)',
            cursor: 'pointer', textAlign: 'left',
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>💬</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>Donner mon avis</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Aide-nous à améliorer Duramen</div>
          </div>
          <i className="ti ti-chevron-right" style={{ color: 'var(--text-muted)', fontSize: 16 }}></i>
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--bg)', borderRadius: '28px 28px 0 0', padding: '24px 24px 48px', width: '100%', maxWidth: 480, margin: '0 auto' }}>
            <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 20px' }} />

            {sent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 10 }}>🙏</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text)', marginBottom: 6 }}>Merci !</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Ton retour nous aide vraiment à progresser.</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>Ton avis sur Duramen</h2>
                  <button onClick={() => setOpen(false)} style={{ color: 'var(--text-muted)', fontSize: 22 }}><i className="ti ti-x"></i></button>
                </div>

                <div style={{ fontSize: 14, color: 'var(--text)', marginBottom: 12 }}>Comment trouves-tu l'application ?</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 20 }}>
                  {[
                    { v: 1, e: '😞' }, { v: 2, e: '😕' }, { v: 3, e: '😐' }, { v: 4, e: '😊' }, { v: 5, e: '😍' },
                  ].map(r => (
                    <button key={r.v} onClick={() => setRating(r.v)}
                      style={{
                        flex: 1, padding: '12px 0', fontSize: 28, borderRadius: 14, cursor: 'pointer',
                        background: rating === r.v ? 'var(--primary-light)' : 'var(--bg-card)',
                        border: `2px solid ${rating === r.v ? 'var(--primary)' : 'var(--border)'}`,
                        transition: 'all 0.15s',
                      }}>
                      {r.e}
                    </button>
                  ))}
                </div>

                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Qu'est-ce qui te plaît ? Qu'est-ce qui te manque ou te bloque ? (facultatif)"
                  rows={4}
                  style={{ width: '100%', padding: '14px', borderRadius: 14, border: '1.5px solid var(--border)', fontSize: 14, background: 'var(--bg-card)', color: 'var(--text)', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: 16, fontFamily: 'var(--font-body)' }}
                />

                <button className="btn-primary" onClick={submit} disabled={loading || (!rating && !text.trim())}>
                  {loading ? <span className="spinner"></span> : 'Envoyer mon avis'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
