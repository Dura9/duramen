import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

const LEVEL_LABELS = { 1: 'Débutant', 2: 'En éveil', 3: 'En progression', 4: 'En contrôle', 5: 'Maître de soi' }

function getStreakMessage(streak) {
  if (streak === 0) return 'Commence aujourd\'hui !'
  if (streak < 3) return 'Bon départ !'
  if (streak < 7) return 'Continue comme ça !'
  if (streak < 14) return 'Belle régularité !'
  if (streak < 30) return 'Impressionnant !'
  return 'Tu es une inspiration !'
}

function XPBar({ xp }) {
  const xpPerLevel = 200
  const current = xp % xpPerLevel
  const lvl = Math.floor(xp / xpPerLevel) + 1
  return (
    <div style={{ background: 'var(--primary-light)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--primary)', minWidth: 32 }}>Niv. {lvl}</span>
      <div style={{ flex: 1, height: 6, background: 'rgba(74,124,111,0.2)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'var(--primary)', borderRadius: 3, width: `${(current / xpPerLevel) * 100}%`, transition: 'width 0.5s ease' }}></div>
      </div>
      <span style={{ fontSize: 11, color: 'var(--primary)', minWidth: 50, textAlign: 'right' }}>{current}/{xpPerLevel} XP</span>
    </div>
  )
}

export default function Home() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [weekSessions, setWeekSessions] = useState([])
  const [todayDone, setTodayDone] = useState(false)

  useEffect(() => {
    if (user) {
      fetchWeekSessions()
      checkStreak()
    }
  }, [user])

  async function fetchWeekSessions() {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
    monday.setHours(0, 0, 0, 0)

    const { data } = await supabase
      .from('sessions')
      .select('completed_at')
      .eq('user_id', user.id)
      .gte('completed_at', monday.toISOString())

    if (data) {
      const daysWithSession = data.map(s => new Date(s.completed_at).getDay())
      setWeekSessions(daysWithSession)
      const todayDay = new Date().getDay()
      setTodayDone(daysWithSession.includes(todayDay))
    }
  }

  async function checkStreak() {
    if (!profile) return
    const today = new Date().toDateString()
    const lastDate = profile.streak_last_date ? new Date(profile.streak_last_date).toDateString() : null
    if (lastDate === today) return

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const isYesterday = lastDate === yesterday.toDateString()

    if (!isYesterday && lastDate !== today && profile.streak > 0) {
      await supabase.from('profiles').update({ streak: 0 }).eq('id', user.id)
      await refreshProfile()
    }
  }

  const weekDays = (() => {
    const today = new Date()
    const dayOfWeek = (today.getDay() + 6) % 7
    return DAYS.map((d, i) => ({
      label: d,
      done: weekSessions.includes((i + 1) % 7),
      isToday: i === dayOfWeek,
    }))
  })()

  if (!profile) return null

  return (
    <div className="page fade-in">
      <div className="page-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>Bonjour,</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--text)', fontWeight: 500 }}>{profile.first_name} 👋</div>
          </div>
          <button onClick={() => supabase.auth.signOut()} style={{ color: 'var(--text-muted)', fontSize: 12, padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 8 }}>
            <i className="ti ti-logout"></i>
          </button>
        </div>
        <div style={{ marginTop: 4 }}>
          <span className="badge badge-green">{LEVEL_LABELS[profile.level] || 'Débutant'}</span>
          <span style={{ margin: '0 8px', color: 'var(--border)' }}>·</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Semaine {profile.program_week} · Phase {profile.program_phase}</span>
        </div>
      </div>

      <div style={{ paddingTop: 20 }}>
        <XPBar xp={profile.xp || 0} />

        <div style={{ background: 'var(--primary)', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'center', minWidth: 64 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 56, color: '#fff', lineHeight: 1 }}>{profile.streak || 0}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>jours</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Série en cours</div>
            <div style={{ fontSize: 17, color: '#fff', fontWeight: 500 }}>{getStreakMessage(profile.streak || 0)}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              {profile.streak > 0 ? `🔥 ${profile.streak} jours consécutifs` : 'Chaque jour compte'}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { val: `+${Math.min((profile.program_week - 1) * 12, 80)}%`, lbl: 'Progression' },
            { val: profile.program_week || 1, lbl: 'Semaine' },
            { val: profile.xp || 0, lbl: 'XP total' },
          ].map((s, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '14px 8px' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--primary)', fontWeight: 500 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        <div className="section-label">Cette semaine</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: d.done ? 'var(--primary)' : d.isToday ? 'var(--primary-light)' : 'var(--bg-card)',
                border: d.isToday ? '2px solid var(--primary)' : '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: d.done ? 14 : 12,
                color: d.done ? '#fff' : d.isToday ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: d.isToday ? 600 : 400,
              }}>
                {d.done ? <i className="ti ti-check"></i> : d.label}
              </div>
              <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{d.label}</span>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--accent-light)', border: '1px solid #e8c97a', borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 24 }}>📅</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: '#7a5c00' }}>Check-in hebdomadaire</div>
            <div style={{ fontSize: 12, color: '#9a7a20', marginTop: 2 }}>Alex vous attend pour votre bilan</div>
          </div>
          <button onClick={() => navigate('/coach', { state: { checkin: true } })} style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', flexShrink: 0 }}>
            Démarrer
          </button>
        </div>

        <div className="section-label">Exercice du jour</div>
        <div
          className="card"
          style={{ display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', opacity: todayDone ? 0.7 : 1 }}
          onClick={() => navigate('/exercises')}
        >
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <i className="ti ti-wind" style={{ fontSize: 22, color: 'var(--primary)' }}></i>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Respiration diaphragmatique</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>8 min · Conscience corporelle</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-green" style={{ display: 'block', marginBottom: 6 }}>Niv. 1</span>
            {todayDone
              ? <span style={{ fontSize: 12, color: 'var(--primary)' }}>✓ Fait</span>
              : <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>Démarrer</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
