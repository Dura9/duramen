import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { getProgram, getPhaseExercises } from '../data/programs'
import { useLang } from '../i18n/LanguageContext'

const LEVEL_LABELS = {
  fr: { 1: 'Débutant', 2: 'En éveil', 3: 'En progression', 4: 'En contrôle', 5: 'Maître de soi' },
  en: { 1: 'Beginner', 2: 'Awakening', 3: 'Progressing', 4: 'In control', 5: 'Self-master' },
}
const DAYS = { fr: ['L', 'M', 'M', 'J', 'V', 'S', 'D'], en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'] }

const QUOTES = {
  fr: [
    "La régularité bat la perfection. Chaque séance compte.",
    "Le contrôle se construit jour après jour, pas en une nuit.",
    "Ce que tu fais aujourd'hui définit qui tu seras demain.",
    "La discipline est la forme la plus haute de l'amour propre.",
    "Un petit progrès chaque jour mène à de grands résultats.",
    "La maîtrise de soi commence par un choix quotidien.",
    "Tu es plus fort que tu ne le crois.",
  ],
  en: [
    "Consistency beats perfection. Every session counts.",
    "Control is built day by day, not overnight.",
    "What you do today defines who you'll be tomorrow.",
    "Discipline is the highest form of self-respect.",
    "A little progress each day leads to big results.",
    "Self-mastery starts with a daily choice.",
    "You're stronger than you think.",
  ],
}

function getGreeting(firstName, lang) {
  const h = new Date().getHours()
  if (lang === 'en') {
    if (h < 12) return `Good morning, ${firstName} ☀️`
    if (h < 18) return `Good afternoon, ${firstName} 👋`
    return `Good evening, ${firstName} 🌙`
  }
  if (h < 12) return `Bonjour, ${firstName} ☀️`
  if (h < 18) return `Bon après-midi, ${firstName} 👋`
  return `Bonsoir, ${firstName} 🌙`
}

function getTodayQuote(lang) {
  const list = QUOTES[lang] || QUOTES.fr
  return list[new Date().getDay() % list.length]
}

function getStreakMessage(streak, lang) {
  const d = lang === 'en' ? 'days' : 'jours'
  if (lang === 'en') {
    if (streak === 0) return { msg: 'Start your first session', sub: 'The first step is the most important' }
    if (streak < 3) return { msg: 'Good start!', sub: 'Keep the momentum going' }
    if (streak < 7) return { msg: 'Nice consistency!', sub: `${streak} days without missing` }
    if (streak < 14) return { msg: 'You\'re on fire 🔥', sub: `${streak} days in a row` }
    if (streak < 30) return { msg: 'Impressive!', sub: `${streak} days — you're in the top 10%` }
    return { msg: 'Legendary 🏆', sub: `${streak} days — you're an inspiration` }
  }
  if (streak === 0) return { msg: 'Lance ta première séance', sub: 'Le premier pas est le plus important' }
  if (streak < 3) return { msg: 'Bon départ !', sub: 'Continue sur ta lancée' }
  if (streak < 7) return { msg: 'Belle régularité !', sub: `${streak} jours sans faillir` }
  if (streak < 14) return { msg: 'Tu es en feu 🔥', sub: `${streak} jours consécutifs` }
  if (streak < 30) return { msg: 'Impressionnant !', sub: `${streak} jours — tu es dans le top 10%` }
  return { msg: 'Légendaire 🏆', sub: `${streak} jours — tu es une inspiration` }
}

export default function Home() {
  const { user, profile, refreshProfile } = useAuth()
  const { dark, toggle: toggleTheme } = useTheme()
  const { lang, t } = useLang()
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
      .from('sessions').select('completed_at')
      .eq('user_id', user.id)
      .gte('completed_at', monday.toISOString())
    if (data) {
      const days = data.map(s => new Date(s.completed_at).getDay())
      setWeekSessions(days)
      setTodayDone(days.includes(new Date().getDay()))
    }
  }

  async function checkStreak() {
    if (!profile) return
    const today = new Date().toDateString()
    const lastDate = profile.streak_last_date ? new Date(profile.streak_last_date).toDateString() : null
    if (lastDate === today) return
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (!profile.streak_last_date || (lastDate !== yesterday.toDateString() && lastDate !== today)) {
      if (profile.streak > 0) {
        await supabase.from('profiles').update({ streak: 0 }).eq('id', user.id)
        await refreshProfile()
      }
    }
  }

  const weekDays = (() => {
    const today = new Date()
    const dayOfWeek = (today.getDay() + 6) % 7
    return (DAYS[lang] || DAYS.fr).map((d, i) => ({
      label: d,
      done: weekSessions.includes((i + 1) % 7),
      isToday: i === dayOfWeek,
    }))
  })()

  if (!profile) return null

  const streak = profile.streak || 0

  // Exercice du jour : 1er exercice de la phase courante du programme du profil
  const program = getProgram(profile.profile_type, lang)
  const phaseCount = program.phases.length
  const curPhase = Math.min(Math.max(profile.program_phase || 1, 1), phaseCount)
  const phaseExos = getPhaseExercises(program, curPhase, lang)
  const todayExo = phaseExos[(streak) % phaseExos.length] || phaseExos[0]
  const { msg: streakMsg, sub: streakSub } = getStreakMessage(streak, lang)
  const xpPerLevel = 200
  const xpCurrent = (profile.xp || 0) % xpPerLevel
  const xpLevel = Math.floor((profile.xp || 0) / xpPerLevel) + 1
  const xpPct = (xpCurrent / xpPerLevel) * 100

  return (
    <div className="page fade-in" style={{ paddingTop: 0 }}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(160deg, var(--primary) 0%, #3a6359 100%)',
        borderRadius: '0 0 32px 32px',
        padding: '56px 24px 28px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Cercle décoratif */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 20, right: 20,
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>
              {t('home_week')} {profile.program_week} · {t('home_phase')} {profile.program_phase}
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: '#fff', fontWeight: 500, lineHeight: 1.2 }}>
              {getGreeting(profile.first_name, lang)}
            </h1>
            <span style={{ display: 'inline-block', marginTop: 8, fontSize: 12, background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', padding: '3px 10px', borderRadius: 20, fontWeight: 500 }}>
              {(LEVEL_LABELS[lang] || LEVEL_LABELS.fr)[profile.level] || (LEVEL_LABELS[lang] || LEVEL_LABELS.fr)[1]}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, padding: '7px 10px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, background: 'transparent', flexShrink: 0 }}
            title={dark ? 'Mode clair' : 'Mode sombre'}
          >
            <i className={`ti ${dark ? 'ti-sun' : 'ti-moon'}`}></i>
          </button>
        </div>

        {/* Barre XP */}
        <div style={{ marginTop: 20, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
            <span>{t('home_level')} {xpLevel}</span>
            <span>{xpCurrent} / {xpPerLevel} XP</span>
          </div>
          <div style={{ height: 5, background: 'rgba(255,255,255,0.2)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: '#fff', borderRadius: 4, width: `${xpPct}%`, transition: 'width 0.6s ease' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>

        {/* ── STREAK ───────────────────────────────────────────────────── */}
        <div style={{
          background: streak >= 7
            ? 'linear-gradient(135deg, #e85c0d22, #ffd70022)'
            : 'var(--bg-card)',
          border: `1.5px solid ${streak >= 7 ? '#e85c0d40' : 'var(--border)'}`,
          borderRadius: 20,
          padding: '18px 20px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: streak > 0 ? '#e85c0d15' : 'var(--primary-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, flexShrink: 0, transition: 'transform 0.3s',
          }}>
            {streak === 0 ? '🌱' : streak < 7 ? '🔥' : streak < 14 ? '⚡' : '🏆'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 2 }}>{t('home_streakLabel')}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text)', fontWeight: 500 }}>
              {streak} {streak > 1 ? t('home_days') : t('home_day')}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{streakMsg} — {streakSub}</div>
          </div>
        </div>

        {/* ── SEMAINE ──────────────────────────────────────────────────── */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span className="section-label" style={{ margin: 0 }}>{t('home_thisWeek')}</span>
            <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500 }}>
              {weekSessions.length} {weekSessions.length > 1 ? t('home_sessions') : t('home_session')}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {weekDays.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                <div style={{
                  width: '100%', aspectRatio: '1', maxWidth: 40,
                  borderRadius: 10,
                  background: d.done ? 'var(--primary)' : d.isToday ? 'var(--primary-light)' : 'var(--bg)',
                  border: `1.5px solid ${d.done ? 'var(--primary)' : d.isToday ? 'var(--primary)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13,
                  color: d.done ? '#fff' : d.isToday ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: d.isToday ? 700 : 400,
                }}>
                  {d.done ? '✓' : d.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── EXERCICE DU JOUR ─────────────────────────────────────────── */}
        <div className="section-label">{t('home_todayExercise')}</div>
        <div
          onClick={() => !todayDone && navigate('/exercises')}
          style={{
            background: todayDone
              ? 'var(--bg-card)'
              : 'linear-gradient(135deg, var(--primary) 0%, #3a6359 100%)',
            borderRadius: 20,
            padding: '20px 22px',
            marginBottom: 16,
            cursor: todayDone ? 'default' : 'pointer',
            border: todayDone ? '1.5px solid var(--border)' : 'none',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.15s',
          }}
          onTouchStart={e => { if (!todayDone) e.currentTarget.style.transform = 'scale(0.98)' }}
          onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          {!todayDone && (
            <div style={{
              position: 'absolute', bottom: -20, right: -20,
              width: 100, height: 100, borderRadius: '50%',
              background: 'rgba(255,255,255,0.07)',
              pointerEvents: 'none',
            }} />
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: todayDone ? 'var(--primary-light)' : 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24,
            }}>
              {todayDone ? '✅' : (todayExo?.emoji || '🌬️')}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: todayDone ? 'var(--text)' : '#fff', marginBottom: 4 }}>
                {todayExo?.title || t('home_yourSession')}
              </div>
              <div style={{ fontSize: 13, color: todayDone ? 'var(--text-muted)' : 'rgba(255,255,255,0.7)' }}>
                {todayExo ? `${todayExo.duration} · ${todayExo.subtitle}` : t('home_personalizedProgram')}
              </div>
            </div>
            {todayDone ? (
              <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, flexShrink: 0 }}>{t('home_done')}</span>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.2)', borderRadius: 10,
                width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <i className="ti ti-arrow-right" style={{ color: '#fff', fontSize: 16 }}></i>
              </div>
            )}
          </div>
        </div>

        {/* ── REPRISE EN DOUCEUR (streak cassé) ────────────────────────── */}
        {streak === 0 && (profile.xp || 0) > 0 && !todayDone && (
          <div style={{
            background: 'var(--primary-light)',
            border: '1.5px solid var(--primary)',
            borderRadius: 16,
            padding: '14px 18px',
            marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ fontSize: 24 }}>🤗</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>{t('home_reengageTitle')}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>{t('home_reengageSub')}</div>
            </div>
            <button
              onClick={() => navigate('/coach', { state: { reengage: true } })}
              className="btn-ripple"
              style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
            >
              {t('home_talk')}
            </button>
          </div>
        )}

        {/* ── CHECK-IN HEBDO ───────────────────────────────────────────── */}
        <div style={{
          background: 'var(--accent-light)',
          border: '1.5px solid #e8c97a',
          borderRadius: 16,
          padding: '14px 18px',
          marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{ fontSize: 22 }}>📅</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#7a5c00' }}>{t('home_checkinTitle')}</div>
            <div style={{ fontSize: 12, color: '#9a7a20', marginTop: 1 }}>{t('home_checkinSub')}</div>
          </div>
          <button
            onClick={() => navigate('/coach', { state: { checkin: true } })}
            className="btn-ripple"
          style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}
          >
            {t('home_start')}
          </button>
        </div>

        {/* ── CITATION DU JOUR ─────────────────────────────────────────── */}
        <div style={{
          textAlign: 'center',
          padding: '16px 20px 8px',
          marginBottom: 8,
        }}>
          <div style={{ fontSize: 18, color: 'var(--border)', marginBottom: 8, lineHeight: 1 }}>"</div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
            {getTodayQuote(lang)}
          </p>
        </div>

      </div>
    </div>
  )
}
