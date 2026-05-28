import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import Onboarding from './pages/Onboarding'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Exercises from './pages/Exercises'
import Coach from './pages/Coach'
import Progress from './pages/Progress'
import BottomNav from './components/BottomNav'

function AppRoutes() {
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#4A7C6F' }}>Duramen</div>
      <div className="spinner" style={{ borderTopColor: '#4A7C6F', borderColor: '#e8f2f0' }}></div>
    </div>
  )

  if (!user) return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )

  if (!profile?.onboarding_completed) return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="*" element={<Navigate to="/onboarding" replace />} />
    </Routes>
  )

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/coach" element={<Coach />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
