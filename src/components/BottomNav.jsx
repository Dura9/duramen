import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const TABS = [
  { path: '/',           icon: 'ti-home',           label: 'Accueil'   },
  { path: '/exercises',  icon: 'ti-barbell',         label: 'Exercices' },
  { path: '/coach',      icon: 'ti-message-circle',  label: 'Coach'     },
  { path: '/progress',   icon: 'ti-chart-bar',       label: 'Progrès'   },
]

export default function BottomNav() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const [todayDone, setTodayDone] = useState(false)
  const [bouncing, setBouncing]   = useState(null)

  // Vérifie si la séance du jour est faite (badge sur Exercices)
  useEffect(() => {
    if (!user) return
    const today = new Date()
    const start = new Date(today); start.setHours(0, 0, 0, 0)
    supabase.from('sessions').select('id', { count: 'exact', head: true })
      .eq('user_id', user.id).gte('completed_at', start.toISOString())
      .then(({ count }) => setTodayDone((count || 0) > 0))
  }, [user, location.pathname])

  function handleClick(path) {
    setBouncing(path)
    setTimeout(() => setBouncing(null), 400)
    navigate(path)
  }

  return (
    <>
      <style>{`
        @keyframes nav-bounce {
          0%   { transform: translateY(0) scale(1); }
          35%  { transform: translateY(-5px) scale(1.15); }
          65%  { transform: translateY(1px) scale(0.95); }
          100% { transform: translateY(0) scale(1); }
        }
        .nav-bounce { animation: nav-bounce 0.38s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        padding: '6px 8px env(safe-area-inset-bottom, 8px)',
        zIndex: 50,
        gap: 4,
      }}>
        {TABS.map(tab => {
          const active  = location.pathname === tab.path
          const isBouncing = bouncing === tab.path
          const showBadge  = tab.path === '/exercises' && !todayDone && !active

          return (
            <button
              key={tab.path}
              onClick={() => handleClick(tab.path)}
              style={{
                flex: 1,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: active ? '6px 4px 5px' : '6px 4px',
                border: 'none', cursor: 'pointer',
                borderRadius: 14,
                background: active ? 'var(--primary-light)' : 'transparent',
                transition: 'background 0.2s',
                position: 'relative',
              }}
            >
              {/* Icône avec badge éventuel */}
              <div style={{ position: 'relative', display: 'inline-flex' }}
                   className={isBouncing ? 'nav-bounce' : ''}>
                <i
                  className={`ti ${tab.icon}`}
                  style={{
                    fontSize: active ? 24 : 22,
                    color: active ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'font-size 0.2s, color 0.2s',
                  }}
                />
                {showBadge && (
                  <span style={{
                    position: 'absolute', top: -2, right: -4,
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#e85c0d',
                    border: '2px solid var(--nav-bg)',
                  }} />
                )}
              </div>

              {/* Label */}
              <span style={{
                fontSize: active ? 11 : 10,
                color: active ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: active ? 700 : 400,
                transition: 'all 0.2s',
                letterSpacing: active ? '0.2px' : 0,
              }}>
                {tab.label}
              </span>

              {/* Point indicateur sous le label */}
              {active && (
                <span style={{
                  width: 4, height: 4, borderRadius: '50%',
                  background: 'var(--primary)',
                  position: 'absolute', bottom: 4,
                }}/>
              )}
            </button>
          )
        })}
      </nav>
    </>
  )
}
