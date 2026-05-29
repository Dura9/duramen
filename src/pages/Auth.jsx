import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    if (mode === 'register') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Vérifiez votre email pour confirmer votre compte.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError('Email ou mot de passe incorrect.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 24px', background: 'var(--bg)' }}>

      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--primary)', fontWeight: 400, letterSpacing: '-0.5px' }}>Duramen</div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>
          {mode === 'login' ? 'Reprends le contrôle, en confiance.' : 'Créez votre espace personnel'}
        </div>
      </div>

      <div className="card fade-in" style={{ padding: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: 'var(--text)' }}>
          {mode === 'login' ? 'Connexion' : 'Créer un compte'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 15, background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder={mode === 'register' ? 'Minimum 6 caractères' : '••••••••'}
              minLength={6}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 15, background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          {error && (
            <div style={{ background: '#fde8e8', color: 'var(--danger)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
              <i className="ti ti-alert-circle" style={{ marginRight: 6 }}></i>{error}
            </div>
          )}

          {message && (
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 8, padding: '10px 14px', fontSize: 13 }}>
              <i className="ti ti-check" style={{ marginRight: 6 }}></i>{message}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <span className="spinner"></span> : (mode === 'login' ? 'Se connecter' : 'Créer mon compte')}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); setMessage(null) }}
            style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 500 }}
          >
            {mode === 'login' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </div>

      <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 24, lineHeight: 1.6 }}>
        En vous inscrivant, vous acceptez nos conditions d'utilisation.<br/>
        Cette application est réservée aux adultes (+18 ans).
      </p>
    </div>
  )
}
