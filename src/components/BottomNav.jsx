import { useLocation, useNavigate } from 'react-router-dom'

const TABS = [
  { path: '/', icon: 'ti-home', label: 'Accueil' },
  { path: '/exercises', icon: 'ti-barbell', label: 'Exercices' },
  { path: '/coach', icon: 'ti-message-circle', label: 'Coach' },
  { path: '/progress', icon: 'ti-chart-bar', label: 'Progrès' },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480,
      background: 'rgba(250,247,242,0.95)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      padding: '8px 0 env(safe-area-inset-bottom, 8px)',
      zIndex: 50,
    }}>
      {TABS.map(tab => {
        const active = location.pathname === tab.path
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '6px 4px', border: 'none', background: 'transparent', cursor: 'pointer',
              borderRadius: 10, transition: 'background 0.15s',
            }}
          >
            <i className={`ti ${tab.icon}`} style={{ fontSize: 22, color: active ? 'var(--primary)' : 'var(--text-muted)', transition: 'color 0.15s' }}></i>
            <span style={{ fontSize: 10, color: active ? 'var(--primary)' : 'var(--text-muted)', fontWeight: active ? 600 : 400, transition: 'color 0.15s' }}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
