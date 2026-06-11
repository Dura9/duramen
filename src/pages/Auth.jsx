import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useLang } from '../i18n/LanguageContext'

export default function Auth() {
  const navigate = useNavigate()
  const { t } = useLang()
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'forgot'
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
      else setMessage(t('auth_regCheckEmail'))
    } else if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://duramen.app',
      })
      if (error) setError(error.message)
      else setMessage(t('auth_resetSent'))
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(t('auth_invalidCreds'))
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 24px', background: 'var(--bg)' }}>

      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, color: 'var(--primary)', fontWeight: 400, letterSpacing: '-0.5px' }}>Duramen</div>
        <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>
          {mode === 'login' ? t('auth_taglineLogin') : t('auth_taglineRegister')}
        </div>
      </div>

      <div className="card fade-in" style={{ padding: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: 'var(--text)' }}>
          {mode === 'login' ? t('auth_login') : mode === 'register' ? t('auth_register') : t('auth_forgot')}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>{t('auth_email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 15, background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>{t('auth_password')}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder={mode === 'register' ? t('auth_passwordMin') : '••••••••'}
                minLength={6}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 15, background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
              />
            </div>
          )}

          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginTop: -8 }}>
              <button type="button" onClick={() => { setMode('forgot'); setError(null); setMessage(null) }}
                style={{ fontSize: 13, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {t('auth_forgotQ')}
              </button>
            </div>
          )}

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
            {loading ? <span className="spinner"></span> : mode === 'login' ? t('auth_signin') : mode === 'register' ? t('auth_createAccount') : t('auth_sendReset')}
          </button>
        </form>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          {mode === 'forgot' ? (
            <button onClick={() => { setMode('login'); setError(null); setMessage(null) }}
              style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
              {t('auth_backToLogin')}
            </button>
          ) : (
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); setMessage(null) }}
              style={{ fontSize: 14, color: 'var(--primary)', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>
              {mode === 'login' ? t('auth_noAccount') : t('auth_haveAccount')}
            </button>
          )}
        </div>
      </div>

      <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 24, lineHeight: 1.6 }}>
        {t('auth_legalPre')}{' '}
        <span onClick={() => navigate('/legal/cgu')} style={{ color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer' }}>{t('auth_terms')}</span>{' '}
        {t('auth_and')}{' '}
        <span onClick={() => navigate('/legal/confidentialite')} style={{ color: 'var(--primary)', textDecoration: 'underline', cursor: 'pointer' }}>{t('auth_privacy')}</span>.<br/>
        {t('auth_adults')}
      </p>
    </div>
  )
}
