import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { isPushEnabled, enablePush, disablePush, pushSupported } from '../lib/push'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { useLang } from '../i18n/LanguageContext'
import FeedbackCard from '../components/FeedbackCard'

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="section-label" style={{ marginBottom: 10 }}>{title}</div>
      <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

function Row({ icon, label, value, onClick, danger, last }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 16px',
        borderBottom: last ? 'none' : '1px solid var(--border)',
        background: 'transparent', cursor: onClick ? 'pointer' : 'default',
        textAlign: 'left',
      }}
    >
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: danger ? '#fde8e8' : 'var(--primary-light)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: danger ? 'var(--danger)' : 'var(--text)' }}>{label}</div>
        {value && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{value}</div>}
      </div>
      {onClick && <i className="ti ti-chevron-right" style={{ color: 'var(--text-muted)', fontSize: 16 }}></i>}
    </button>
  )
}

export default function Account() {
  const { user, profile, refreshProfile } = useAuth()
  const { dark, toggle: toggleTheme } = useTheme()
  const { lang, setLang, t } = useLang()
  const navigate = useNavigate()

  const [modal, setModal] = useState(null) // 'email' | 'password' | 'name' | null
  const [value1, setValue1] = useState('')
  const [value2, setValue2] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError]     = useState(null)
  const [notifOn, setNotifOn]   = useState(false)
  const [notifBusy, setNotifBusy] = useState(false)

  useEffect(() => { isPushEnabled().then(setNotifOn) }, [])

  async function toggleNotif() {
    if (notifBusy) return
    if (!pushSupported()) { alert(t('acc_notifUnsupported')); return }
    if (typeof Notification !== 'undefined' && Notification.permission === 'denied') { alert(t('acc_notifDenied')); return }
    setNotifBusy(true)
    try {
      if (notifOn) { await disablePush(user.id); setNotifOn(false) }
      else { await enablePush(user.id); setNotifOn(true) }
    } catch (e) {
      if (e.message === 'denied') alert(t('acc_notifDenied'))
    }
    setNotifBusy(false)
  }

  function openModal(type) {
    setModal(type)
    setValue1(''); setValue2(''); setError(null); setSuccess(null)
  }

  async function handleSave() {
    setLoading(true); setError(null); setSuccess(null)

    if (modal === 'name') {
      if (!value1.trim()) { setError(t('acc_enterFirstName')); setLoading(false); return }
      const { error } = await supabase.from('profiles').update({ first_name: value1.trim() }).eq('id', user.id)
      if (error) setError(error.message)
      else { await refreshProfile(); setSuccess(t('acc_firstNameUpdated')); setTimeout(() => setModal(null), 1200) }
    }

    if (modal === 'email') {
      if (!value1.includes('@')) { setError(t('acc_invalidEmail')); setLoading(false); return }
      const { error } = await supabase.auth.updateUser({ email: value1 })
      if (error) setError(error.message)
      else setSuccess(t('acc_emailConfirmSent'))
    }

    if (modal === 'password') {
      if (value1.length < 6) { setError(t('acc_passwordMin')); setLoading(false); return }
      if (value1 !== value2) { setError(t('acc_passwordMismatch')); setLoading(false); return }
      const { error } = await supabase.auth.updateUser({ password: value1 })
      if (error) setError(error.message)
      else { setSuccess(t('acc_passwordUpdated')); setTimeout(() => setModal(null), 1200) }
    }

    setLoading(false)
  }

  async function handleDeleteAccount() {
    if (!confirm(t('acc_deleteConfirm1'))) return
    if (!confirm(t('acc_deleteConfirm2'))) return
    await supabase.from('profiles').delete().eq('id', user.id)
    await supabase.auth.signOut()
  }

  const modalConfig = {
    name:     { title: t('acc_changeFirstName'), label: t('acc_newFirstName'),  placeholder: profile?.first_name || t('acc_yourFirstName'), type: 'text',     second: false },
    email:    { title: t('acc_changeEmail'),     label: t('acc_newEmail'),      placeholder: user?.email || '',                            type: 'email',    second: false },
    password: { title: t('acc_changePassword'),  label: t('acc_newPassword'),   placeholder: t('acc_passwordMin'),                         type: 'password', second: true  },
  }
  const cfg = modal ? modalConfig[modal] : null

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
        <div style={{ position: 'absolute', top: -30, right: -30, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
            👤
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: '#fff', fontWeight: 500 }}>{profile?.first_name || t('acc_myAccount')}</h1>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{user?.email}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>

        {/* ── PROFIL ───────────────────────────────────────────────────── */}
        <Section title={t('acc_profile')}>
          <Row icon="✏️" label={t('acc_firstName')} value={profile?.first_name} onClick={() => openModal('name')} />
          <Row icon="📧" label={t('acc_email')}      value={user?.email}         onClick={() => openModal('email')} />
          <Row icon="🔒" label={t('acc_password')}   value="••••••••"            onClick={() => openModal('password')} last />
        </Section>

        {/* ── NOTIFICATIONS ────────────────────────────────────────────── */}
        <Section title={t('acc_notifications')}>
          <button
            onClick={toggleNotif}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>🔔</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{t('acc_dailyReminder')}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {notifBusy ? '…' : notifOn ? t('acc_notifOn') : t('acc_notifTap')}
              </div>
            </div>
            <div style={{ width: 44, height: 26, borderRadius: 13, background: notifOn ? 'var(--primary)' : 'var(--border)', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 3, left: notifOn ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </div>
          </button>
        </Section>

        {/* ── PRÉFÉRENCES ──────────────────────────────────────────────── */}
        <Section title={t('acc_preferences')}>
          <button
            onClick={toggleTheme}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', background: 'transparent', cursor: 'pointer', textAlign: 'left',
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
              {dark ? '☀️' : '🌙'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{t('acc_appearance')}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{dark ? t('acc_darkOn') : t('acc_lightOn')}</div>
            </div>
            <div style={{
              width: 44, height: 26, borderRadius: 13,
              background: dark ? 'var(--primary)' : 'var(--border)',
              position: 'relative', transition: 'background 0.2s', flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', top: 3, left: dark ? 21 : 3,
                width: 20, height: 20, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </div>
          </button>

          {/* Langue */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>🌍</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>{t('acc_language')}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{lang === 'fr' ? 'Français' : 'English'}</div>
            </div>
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 20, padding: 3, flexShrink: 0 }}>
              {['fr', 'en'].map(l => (
                <button key={l} onClick={() => setLang(l)}
                  style={{
                    border: 'none', borderRadius: 16, padding: '5px 11px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    background: lang === l ? 'var(--primary)' : 'transparent',
                    color: lang === l ? '#fff' : 'var(--text-muted)', transition: 'all 0.15s',
                  }}>
                  {l === 'fr' ? '🇫🇷' : '🇬🇧'}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── FEEDBACK ─────────────────────────────────────────────────── */}
        <FeedbackCard />

        {/* ── COMPTE ───────────────────────────────────────────────────── */}
        <Section title={t('acc_account')}>
          <Row
            icon="🚪" label={t('acc_logout')}
            onClick={() => { if (confirm(t('acc_logoutConfirm'))) supabase.auth.signOut() }}
          />
          <Row icon="🗑️" label={t('acc_deleteAccount')} value={t('acc_irreversible')} onClick={handleDeleteAccount} danger last />
        </Section>

        {/* ── INFOS ────────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            Duramen v1.0 · {t('acc_footer')}<br/>
            <span onClick={() => navigate('/legal/cgu')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>{t('acc_terms')}</span>
            {' · '}
            <span onClick={() => navigate('/legal/confidentialite')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>{t('acc_privacy')}</span>
          </div>
        </div>

      </div>

      {/* ── MODAL ÉDITION ────────────────────────────────────────────── */}
      {modal && cfg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--bg)', borderRadius: '28px 28px 0 0', padding: '24px 24px 48px', width: '100%', maxWidth: 480, margin: '0 auto' }}>
            <div style={{ width: 40, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>{cfg.title}</h2>
              <button onClick={() => setModal(null)} style={{ color: 'var(--text-muted)', fontSize: 22 }}>
                <i className="ti ti-x"></i>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>{cfg.label}</label>
                <input
                  type={cfg.type} value={value1} onChange={e => setValue1(e.target.value)}
                  placeholder={cfg.placeholder} autoFocus
                  style={{ width: '100%', padding: '13px 14px', borderRadius: 12, border: '1.5px solid var(--border)', fontSize: 15, background: 'var(--bg)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              {cfg.second && (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>{t('acc_confirmPassword')}</label>
                  <input
                    type="password" value={value2} onChange={e => setValue2(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '13px 14px', borderRadius: 12, border: '1.5px solid var(--border)', fontSize: 15, background: 'var(--bg)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              )}

              {error   && <div style={{ background: '#fde8e8', color: 'var(--danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>{error}</div>}
              {success && <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>✓ {success}</div>}

              <button className="btn-primary" onClick={handleSave} disabled={loading} style={{ marginTop: 4 }}>
                {loading ? <span className="spinner"></span> : t('acc_save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
