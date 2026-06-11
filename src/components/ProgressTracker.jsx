import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useLang } from '../i18n/LanguageContext'
import { track } from '../lib/analytics'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const DURATIONS = [
  { v: 1, label: '< 30 sec' },
  { v: 2, label: '30 sec – 1 min' },
  { v: 3, label: '1 – 2 min' },
  { v: 4, label: '2 – 5 min' },
  { v: 5, label: '5 min +' },
]

export default function ProgressTracker() {
  const { user } = useAuth()
  const { t, lang } = useLang()
  const [checkins, setCheckins] = useState([])
  const [open, setOpen] = useState(false)
  const [duration, setDuration] = useState(null)
  const [control, setControl] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { if (user) load() }, [user])

  async function load() {
    const { data } = await supabase
      .from('progress_checkins').select('*')
      .eq('user_id', user.id).order('created_at', { ascending: true })
    if (data) setCheckins(data)
  }

  // Dû si jamais fait, ou dernier point > 7 jours
  const last = checkins[checkins.length - 1]
  const due = !last || (Date.now() - new Date(last.created_at).getTime()) > 7 * 24 * 3600 * 1000

  async function save() {
    if (!duration || !control) return
    setSaving(true)
    await supabase.from('progress_checkins').insert({
      user_id: user.id, duration_score: duration, control_score: control,
      created_at: new Date().toISOString(),
    })
    track('progress_checkin', { duration_score: duration, control_score: control })
    await load()
    setSaving(false); setSaved(true)
    setTimeout(() => { setOpen(false); setSaved(false); setDuration(null); setControl(null) }, 1800)
  }

  // Données du graphique (contrôle dans le temps)
  const chartData = checkins.map(c => ({
    date: new Date(c.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR', { day: '2-digit', month: '2-digit' }),
    controle: c.control_score,
  }))

  const improved = checkins.length >= 2 && checkins[checkins.length - 1].control_score > checkins[0].control_score

  return (
    <div style={{ marginBottom: 24 }}>
      <div className="section-label" style={{ marginBottom: 12 }}>{t('pt2_title')}</div>

      {/* Carte check-in (si dû) */}
      {due && (
        <div style={{ background: 'var(--primary-light)', border: '1.5px solid var(--primary)', borderRadius: 16, padding: '16px 18px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 26 }}>📈</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>{t('pt2_checkinCard')}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{t('pt2_checkinSub')}</div>
          </div>
          <button onClick={() => setOpen(true)} className="btn-ripple"
            style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
            {t('pt2_checkinBtn')}
          </button>
        </div>
      )}

      {/* Courbe de progression */}
      {checkins.length >= 2 ? (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{t('pt2_chartTitle')}</span>
            {improved && <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>{t('pt2_improved')}</span>}
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={chartData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="controle" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--primary)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : checkins.length === 1 && !due ? (
        <div className="card" style={{ textAlign: 'center', padding: '20px 16px' }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🌱</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{t('pt2_needMore')}</div>
        </div>
      ) : null}

      {/* Modal check-in */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--bg)', borderRadius: '28px 28px 0 0', padding: '24px 24px 48px', width: '100%', maxWidth: 480, margin: '0 auto', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 20px' }} />

            {saved ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div className="bounce-in" style={{ fontSize: 48, marginBottom: 10 }}>🎯</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text)', marginBottom: 6 }}>{t('pt2_savedTitle')}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>{checkins.length <= 1 ? t('pt2_firstTime') : t('pt2_savedSub')}</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>{t('pt2_checkinCard')}</h2>
                  <button onClick={() => setOpen(false)} style={{ color: 'var(--text-muted)', fontSize: 22 }}><i className="ti ti-x"></i></button>
                </div>

                {/* Q1 durée */}
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 10 }}>{t('pt2_q1')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {DURATIONS.map(d => (
                    <button key={d.v} onClick={() => setDuration(d.v)}
                      style={{ padding: '12px 16px', borderRadius: 12, textAlign: 'left', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: 'var(--text)',
                        border: `1.5px solid ${duration === d.v ? 'var(--primary)' : 'var(--border)'}`,
                        background: duration === d.v ? 'var(--primary-light)' : 'var(--bg-card)', transition: 'all 0.15s' }}>
                      {d.label}
                    </button>
                  ))}
                </div>

                {/* Q2 contrôle */}
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{t('pt2_q2')}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>{t('pt2_q2sub')}</div>
                <div style={{ display: 'flex', gap: 5, marginBottom: 28 }}>
                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                    <button key={n} onClick={() => setControl(n)}
                      style={{ flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        border: `1.5px solid ${control === n ? 'var(--primary)' : 'var(--border)'}`,
                        background: control === n ? 'var(--primary)' : 'var(--bg-card)',
                        color: control === n ? '#fff' : 'var(--text-muted)', transition: 'all 0.1s' }}>
                      {n}
                    </button>
                  ))}
                </div>

                <button className="btn-primary" onClick={save} disabled={saving || !duration || !control}>
                  {saving ? <span className="spinner"></span> : t('acc_save')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
