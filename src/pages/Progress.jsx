import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const BADGES = [
  { id: 'first_session', icon: '🌱', title: 'Premier pas', desc: 'Première séance complétée', condition: (s, p) => s.length >= 1 },
  { id: 'streak_3', icon: '🔥', title: '3 jours', desc: '3 jours consécutifs', condition: (s, p) => p.streak >= 3 },
  { id: 'streak_7', icon: '⚡', title: '7 jours', desc: '7 jours consécutifs', condition: (s, p) => p.streak >= 7 },
  { id: 'streak_30', icon: '💎', title: '1 mois', desc: '30 jours consécutifs', condition: (s, p) => p.streak >= 30 },
  { id: 'sessions_10', icon: '💪', title: 'Assidu', desc: '10 séances complétées', condition: (s, p) => s.length >= 10 },
  { id: 'sessions_20', icon: '🏆', title: 'Expert', desc: '20 séances complétées', condition: (s, p) => s.length >= 20 },
  { id: 'kegel_5', icon: '🎯', title: 'Kegel Master', desc: '5 séances Kegel', condition: (s, p) => s.filter(x => x.exercise_id?.includes('kegel')).length >= 5 },
  { id: 'xp_100', icon: '⭐', title: '100 XP', desc: '100 XP accumulés', condition: (s, p) => p.xp >= 100 },
]

const LEVEL_INFO = {
  1: { label: 'Débutant', next: 'En éveil', progress: 25 },
  2: { label: 'En éveil', next: 'En progression', progress: 50 },
  3: { label: 'En progression', next: 'En contrôle', progress: 75 },
  4: { label: 'En contrôle', next: 'Maître de soi', progress: 90 },
  5: { label: 'Maître de soi', next: null, progress: 100 },
}

const MOOD_MAP = { '😐': 1, '😊': 2, '😄': 3 }
const DAYS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

export default function Progress() {
  const { profile } = useAuth()
  const [sessions, setSessions] = useState([])
  const [weekData, setWeekData] = useState([])

  useEffect(() => {
    if (profile) fetchSessions()
  }, [profile])

  async function fetchSessions() {
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', profile.id)
      .order('completed_at', { ascending: false })

    if (data) {
      setSessions(data)

      const last7 = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dayStr = d.toDateString()
        const daySessions = data.filter(s => new Date(s.completed_at).toDateString() === dayStr)
        const avgMood = daySessions.length > 0
          ? daySessions.reduce((sum, s) => sum + (MOOD_MAP[s.mood] || 2), 0) / daySessions.length
          : 0
        last7.push({
          day: DAYS_FR[d.getDay()],
          séances: daySessions.length,
          humeur: Math.round(avgMood * 10) / 10,
        })
      }
      setWeekData(last7)
    }
  }

  if (!profile) return null

  const levelInfo = LEVEL_INFO[profile.level] || LEVEL_INFO[1]
  const programProgress = Math.round(((profile.program_week - 1) / 8) * 100)
  const earnedBadges = BADGES.filter(b => b.condition(sessions, profile))

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div className="page-title">Mes progrès</div>
        <div className="page-subtitle">Semaine {profile.program_week} sur 8</div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Programme global</div>
          <div style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 500 }}>{programProgress}%</div>
        </div>
        <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ height: '100%', background: 'var(--primary)', borderRadius: 4, width: `${programProgress}%`, transition: 'width 0.6s ease' }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
          <span>Semaine 1</span><span>Semaine 8</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { icon: 'ti-flame', val: profile.streak || 0, lbl: 'Jours consécutifs', color: '#e85c0d' },
          { icon: 'ti-activity', val: sessions.length, lbl: 'Séances totales', color: 'var(--primary)' },
          { icon: 'ti-star', val: profile.xp || 0, lbl: 'XP total', color: '#d4a855' },
          { icon: 'ti-trophy', val: earnedBadges.length, lbl: 'Badges obtenus', color: '#7c6f4a' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '14px 10px' }}>
            <i className={`ti ${s.icon}`} style={{ fontSize: 22, color: s.color, display: 'block', marginBottom: 6 }}></i>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, color: 'var(--text)' }}>{s.val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {weekData.some(d => d.séances > 0) && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Activité des 7 derniers jours</div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weekData} barSize={24}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                formatter={(val, name) => [val, name === 'séances' ? 'Séances' : 'Humeur']}
              />
              <Bar dataKey="séances" fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="section-label">Les 4 phases du programme</div>
      {[
        { n: 1, title: 'Conscience corporelle', weeks: 'Semaines 1–2', desc: 'Respiration, scan corporel, conscience du périnée' },
        { n: 2, title: 'Renforcement', weeks: 'Semaines 3–4', desc: 'Kegel, contrôle musculaire, stop-start' },
        { n: 3, title: 'Maîtrise active', weeks: 'Semaines 5–6', desc: 'Squeeze, gestion de l\'excitation' },
        { n: 4, title: 'Intégration', weeks: 'Semaines 7–8', desc: 'Consolidation, confiance, intimité' },
      ].map(p => {
        const isDone = profile.program_phase > p.n
        const isCurrent = profile.program_phase === p.n
        const isLocked = profile.program_phase < p.n
        return (
          <div key={p.n} className="card" style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10, opacity: isLocked ? 0.6 : 1 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, marginTop: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, background: isDone ? 'var(--primary-light)' : isCurrent ? 'var(--primary)' : 'var(--border)', color: isDone ? 'var(--primary)' : isCurrent ? '#fff' : 'var(--text-muted)' }}>
              {isDone ? <i className="ti ti-check"></i> : isLocked ? <i className="ti ti-lock" style={{ fontSize: 13 }}></i> : p.n}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>Phase {p.n} — {p.title}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.5 }}>{p.desc}</div>
              <div style={{ fontSize: 11, color: isCurrent ? 'var(--primary)' : 'var(--text-muted)', marginTop: 4, fontWeight: isCurrent ? 500 : 400 }}>
                {p.weeks}{isCurrent ? ' · En cours' : isDone ? ' · Terminé' : ''}
              </div>
            </div>
          </div>
        )
      })}

      <div className="section-label" style={{ marginTop: 24 }}>Badges ({earnedBadges.length}/{BADGES.length})</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 32 }}>
        {BADGES.map(b => {
          const earned = earnedBadges.find(e => e.id === b.id)
          return (
            <div key={b.id} style={{ textAlign: 'center', opacity: earned ? 1 : 0.35 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: earned ? 'var(--accent-light)' : 'var(--border)', border: earned ? '2px solid var(--accent)' : '2px solid transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 6px' }}>{b.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 500, color: earned ? 'var(--text)' : 'var(--text-muted)', lineHeight: 1.3 }}>{b.title}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
