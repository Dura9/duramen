import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { ThemeProvider } from './hooks/useTheme'
import { supabase } from './lib/supabase'
import { track } from './lib/analytics'
import Onboarding from './pages/Onboarding'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Exercises from './pages/Exercises'
import Coach from './pages/Coach'
import Progress from './pages/Progress'
import Account from './pages/Account'
import Legal from './pages/Legal'
import Admin from './pages/Admin'
import BottomNav from './components/BottomNav'
import PushPrompt from './components/PushPrompt'
import InstallPrompt from './components/InstallPrompt'

function ResetPasswordScreen() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [done, setDone] = useState(false)

  async function handleReset(e) {
    e.preventDefault()
    if (password !== confirm) return setError('Les mots de passe ne correspondent pas.')
    if (password.length < 6) return setError('Minimum 6 caractères.')
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else setDone(true)
    setLoading(false)
  }

  if (done) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 24px', background: 'var(--bg)', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--text)', marginBottom: 8 }}>Mot de passe modifié</div>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32 }}>Tu peux maintenant utiliser ton nouveau mot de passe.</p>
      <button className="btn-primary" onClick={() => window.location.href = '/'}>Aller sur l'app →</button>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 24px', background: 'var(--bg)' }}>
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--primary)', fontWeight: 400 }}>Duramen</div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>Choisir un nouveau mot de passe</div>
      </div>
      <div className="card" style={{ padding: 28 }}>
        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Nouveau mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Minimum 6 caractères"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 15, background: 'var(--bg)', color: 'var(--text)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Confirmer le mot de passe</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required minLength={6} placeholder="••••••••"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 15, background: 'var(--bg)', color: 'var(--text)', outline: 'none' }} />
          </div>
          {error && <div style={{ background: '#fde8e8', color: 'var(--danger)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <span className="spinner"></span> : 'Enregistrer le nouveau mot de passe'}
          </button>
        </form>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { user, profile, loading, refreshProfile } = useAuth()
  const [isPasswordReset, setIsPasswordReset] = useState(false)

  // Après inscription : sauvegarder les réponses du questionnaire
  useEffect(() => {
    if (!user) return
    const saved = sessionStorage.getItem('duramen_onboarding')
    if (!saved) return
    const answers = JSON.parse(saved)
    const profileType = answers.profile_type || 'cognitive'
    const isConditioned = profileType === 'conditioned'
    supabase.from('profiles').upsert({
      id: user.id,
      email: user.email,
      profile_type: profileType,
      cost: answers.cost,
      desire: answers.desire,
      duration: answers.duration,
      daily_minutes: answers.daily_minutes || 10,
      situation: answers.situation || 'single',
      level: 1,
      program_week: 1,
      program_phase: 1,
      flag_conditioned_high: isConditioned,
      flag_conditioned_moderate: false,
      streak: 0, streak_last_date: null, xp: 0,
      onboarding_completed: true,
      created_at: new Date().toISOString(),
    }).then(() => {
      track('signup', { profile_type: profileType })
      sessionStorage.removeItem('duramen_onboarding')
      refreshProfile()
    })
  }, [user])

  useEffect(() => {
    // Détecter si l'URL contient un token de reset Supabase
    const hash = window.location.hash
    if (hash.includes('type=recovery')) {
      setIsPasswordReset(true)
    }
    // Écouter l'événement Supabase PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setIsPasswordReset(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (isPasswordReset) return <ResetPasswordScreen />

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', flexDirection: 'column', gap: 24, background: 'linear-gradient(160deg, #4A7C6F 0%, #3a6359 100%)' }}>
      <div style={{ textAlign: 'center', animation: 'fadeIn 0.6s ease' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 40, color: '#fff', fontWeight: 400, letterSpacing: '-0.5px', marginBottom: 8 }}>Duramen</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.5px' }}>Ton coach personnel</div>
      </div>
      <div className="spinner" style={{ borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.25)' }}></div>
    </div>
  )

  if (!user) {
    // Visiteur déjà venu sur cet appareil → connexion directe. Nouveau → questionnaire.
    const returning = localStorage.getItem('duramen_returning') === '1'
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/legal/:doc" element={<Legal />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to={returning ? '/auth' : '/onboarding'} replace />} />
      </Routes>
    )
  }

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
        <Route path="/account" element={<Account />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/legal/:doc" element={<Legal />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
      <InstallPrompt />
      <PushPrompt />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  )
}
