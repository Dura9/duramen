import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts'
import { getProgram } from '../data/programs'
import { useLang } from '../i18n/LanguageContext'

const BADGES = [
  { id: 'first_session', icon: '🌱', condition: (s, p) => s.length >= 1 },
  { id: 'streak_3',      icon: '🔥', condition: (s, p) => p.streak >= 3 },
  { id: 'streak_7',      icon: '⚡', condition: (s, p) => p.streak >= 7 },
  { id: 'streak_30',     icon: '💎', condition: (s, p) => p.streak >= 30 },
  { id: 'sessions_10',   icon: '💪', condition: (s, p) => s.length >= 10 },
  { id: 'sessions_20',   icon: '🏆', condition: (s, p) => s.length >= 20 },
  { id: 'kegel_5',       icon: '🎯', condition: (s, p) => s.filter(x => x.exercise_id?.includes('kegel')).length >= 5 },
  { id: 'xp_100',        icon: '⭐', condition: (s, p) => p.xp >= 100 },
]

const BADGE_TEXT = {
  fr: {
    first_session: { title: 'Premier pas', desc: 'Première séance' },
    streak_3: { title: '3 jours', desc: '3 jours consécutifs' },
    streak_7: { title: '7 jours', desc: '7 jours consécutifs' },
    streak_30: { title: '1 mois', desc: '30 jours consécutifs' },
    sessions_10: { title: 'Assidu', desc: '10 séances complétées' },
    sessions_20: { title: 'Expert', desc: '20 séances complétées' },
    kegel_5: { title: 'Kegel Master', desc: '5 séances Kegel' },
    xp_100: { title: '100 XP', desc: '100 XP accumulés' },
  },
  en: {
    first_session: { title: 'First step', desc: 'First session' },
    streak_3: { title: '3 days', desc: '3 days in a row' },
    streak_7: { title: '7 days', desc: '7 days in a row' },
    streak_30: { title: '1 month', desc: '30 days in a row' },
    sessions_10: { title: 'Dedicated', desc: '10 sessions completed' },
    sessions_20: { title: 'Expert', desc: '20 sessions completed' },
    kegel_5: { title: 'Kegel Master', desc: '5 Kegel sessions' },
    xp_100: { title: '100 XP', desc: '100 XP earned' },
  },
}

const DAYS_LABELS = {
  fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
}
const MOOD_MAP = { '😐': 1, '😊': 2, '😄': 3 }

export default function Progress() {
  const { profile } = useAuth()
  const { lang, t } = useLang()
  const [sessions, setSessions] = useState([])
  const [weekData, setWeekData] = useState([])

  useEffect(() => { if (profile) fetchSessions() }, [profile])

  async function fetchSessions() {
    const { data } = await supabase
      .from('sessions').select('*')
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
          ? daySessions.reduce((sum, s) => sum + (MOOD_MAP[s.mood] || 2), 0) / daySessions.length : 0
        last7.push({ day: (DAYS_LABELS[lang] || DAYS_LABELS.fr)[d.getDay()], séances: daySessions.length, humeur: Math.round(avgMood * 10) / 10, isToday: i === 0 })
      }
      setWeekData(last7)
    }
  }

  if (!profile) return null

  const programProgress = Math.round(((profile.program_week - 1) / 8) * 100)
  const earnedBadges = BADGES.filter(b => b.condition(sessions, profile))
  const xpPerLevel = 200
  const xpLevel = Math.floor((profile.xp || 0) / xpPerLevel) + 1
  const xpPct = ((profile.xp || 0) % xpPerLevel) / xpPerLevel * 100

  const stats = [
    { icon: '🔥', val: profile.streak || 0,  lbl: t('pr_statStreak'),   color: '#e85c0d' },
    { icon: '💪', val: sessions.length,       lbl: t('pr_statSessions'), color: 'var(--primary)' },
    { icon: '⭐', val: profile.xp || 0,       lbl: t('pr_statXp'),       color: '#d4a855' },
    { icon: '🏅', val: `${earnedBadges.length}/${BADGES.length}`, lbl: t('pr_statBadges'), color: '#7c6f4a' },
  ]

  const program = getProgram(profile.profile_type, lang)
  const phaseCount = program.phases.length
  const currentPhase = Math.min(Math.max(profile.program_phase || 1, 1), phaseCount)

  return (
    <div className="page fade-in" style={{ paddingTop: 0 }}>

      {/* ── HEADER ───────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, var(--primary) 0%, #3a6359 100%)',
        borderRadius: '0 0 32px 32px',
        padding: '56px 24px 28px',
        marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>{t('pr_program')} · {t('pr_week')} {profile.program_week} {t('pr_of')} 8</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#fff', fontWeight: 500, marginBottom: 20 }}>{t('pr_title')}</h1>

        {/* Barre programme */}
        <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>
            <span>{t('pr_programProgress')}</span>
            <span style={{ fontWeight: 700 }}>{programProgress}%</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#fff', borderRadius: 4, width: `${programProgress}%`, transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>
            <span>{t('pr_begin')}</span><span>{t('pr_end')}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>

        {/* ── STATS ────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 20 }}>
          {stats.map((s, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '18px 10px' }}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 500, color: 'var(--text)', lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

        {/* ── NIVEAU XP ────────────────────────────────────────────────── */}
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{t('pr_level')} {xpLevel}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{profile.xp || 0} {t('pr_xpAccumulated')}</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⭐</div>
          </div>
          <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), #5cb8a0)', borderRadius: 4, width: `${xpPct}%`, transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
            <span>{t('pr_level')} {xpLevel}</span>
            <span>{(profile.xp || 0) % xpPerLevel}/{xpPerLevel} XP → {t('pr_nextLevel')} {xpLevel + 1}</span>
          </div>
        </div>

        {/* ── GRAPHIQUE ────────────────────────────────────────────────── */}
        {weekData.some(d => d.séances > 0) ? (
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span className="section-label" style={{ margin: 0 }}>{t('pr_activity7')}</span>
              <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500 }}>
                {weekData.reduce((a, d) => a + d.séances, 0)} {t('pr_sessions')}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={110}>
              <BarChart data={weekData} barSize={28} barCategoryGap="30%">
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Bar dataKey="séances" radius={[6, 6, 0, 0]}>
                  {weekData.map((entry, i) => (
                    <Cell key={i} fill={entry.isToday ? 'var(--primary)' : entry.séances > 0 ? '#5cb8a0' : 'var(--border)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="card" style={{ marginBottom: 20, textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📊</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>{t('pr_noActivity')}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t('pr_noActivitySub')}</div>
          </div>
        )}

        {/* ── PHASES ───────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span className="section-label" style={{ margin: 0 }}>{t('pr_myProgram')} · {program.label}</span>
          <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500 }}>{t('pr_phase')} {currentPhase}/{phaseCount}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5 }}>{program.intro}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {program.phases.map(p => {
            const isDone    = currentPhase > p.n
            const isCurrent = currentPhase === p.n
            const isLocked  = currentPhase < p.n
            return (
              <div key={p.n} style={{
                background: isCurrent ? 'var(--primary-light)' : 'var(--bg-card)',
                border: `1.5px solid ${isCurrent ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 16, padding: '14px 16px',
                display: 'flex', gap: 14, alignItems: 'center',
                opacity: isLocked ? 0.5 : 1,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: isDone ? 'var(--primary)' : isCurrent ? 'var(--primary)' : 'var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: isDone ? 18 : 22,
                  color: isDone || isCurrent ? '#fff' : 'var(--text-muted)',
                }}>
                  {isDone ? '✓' : isLocked ? '🔒' : p.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{t('pr_phase')} {p.n} — {p.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{p.focus}</div>
                </div>
                {isCurrent && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--primary)', background: 'var(--primary-light)', border: '1px solid var(--primary)', borderRadius: 20, padding: '3px 8px', flexShrink: 0 }}>{t('pr_inProgress')}</span>}
                {isDone && <span style={{ fontSize: 14, color: 'var(--primary)', flexShrink: 0 }}>✓</span>}
              </div>
            )
          })}
        </div>

        {/* ── BADGES ───────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span className="section-label" style={{ margin: 0 }}>{t('pr_badges')}</span>
          <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500 }}>{earnedBadges.length}/{BADGES.length} {t('pr_obtained')}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 32 }}>
          {BADGES.map(b => {
            const earned = earnedBadges.find(e => e.id === b.id)
            return (
              <div key={b.id} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 16, margin: '0 auto 6px',
                  background: earned ? 'var(--accent-light)' : 'var(--bg-card)',
                  border: `2px solid ${earned ? 'var(--accent)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, opacity: earned ? 1 : 0.3,
                  transition: 'all 0.2s',
                }}>
                  {b.icon}
                </div>
                <div style={{ fontSize: 10, fontWeight: earned ? 600 : 400, color: earned ? 'var(--text)' : 'var(--text-muted)', lineHeight: 1.3 }}>
                  {(BADGE_TEXT[lang] || BADGE_TEXT.fr)[b.id].title}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── RESET ────────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', paddingBottom: 16 }}>
          <button
            onClick={async () => {
              if (!confirm(t('pr_resetConfirm'))) return
              await supabase.from('profiles').update({ onboarding_completed: false }).eq('id', profile.id)
              window.location.reload()
            }}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
          >
            {t('pr_resetDiagnostic')}
          </button>
        </div>

      </div>
    </div>
  )
}
