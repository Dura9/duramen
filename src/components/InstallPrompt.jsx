import { useState, useEffect } from 'react'

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
}
function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

export default function InstallPrompt() {
  const [show, setShow] = useState(false)
  const [deferred, setDeferred] = useState(null)
  const [iosMode, setIosMode] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    if (localStorage.getItem('duramen_install_dismissed')) return

    // Android / Chrome : on capture l'événement natif
    function onBeforeInstall(e) {
      e.preventDefault()
      setDeferred(e)
      sessionStorage.setItem('duramen_install_active', '1')
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)

    // iOS : pas d'événement natif → on affiche des instructions après 4s
    let iosTimer
    if (isIOS()) {
      iosTimer = setTimeout(() => {
        setIosMode(true)
        sessionStorage.setItem('duramen_install_active', '1')
        setShow(true)
      }, 4000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      if (iosTimer) clearTimeout(iosTimer)
    }
  }, [])

  async function handleInstall() {
    if (!deferred) return
    deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    close()
  }

  function close() {
    sessionStorage.removeItem('duramen_install_active')
    setShow(false)
  }

  function dismiss() {
    localStorage.setItem('duramen_install_dismissed', '1')
    close()
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)', maxWidth: 440,
      background: 'var(--bg-card)', border: '1.5px solid var(--border)',
      borderRadius: 20, padding: '16px 18px',
      boxShadow: 'var(--shadow-lg)', zIndex: 95,
      animation: 'slide-up 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>📲</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
            Installe Duramen
          </div>
          {iosMode ? (
            <>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12 }}>
                Appuie sur <i className="ti ti-share" style={{ verticalAlign: 'middle' }}></i> <strong>Partager</strong> en bas de Safari, puis <strong>« Sur l'écran d'accueil »</strong>.
              </div>
              <button onClick={dismiss} style={{ width: '100%', padding: '9px 0', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                J'ai compris
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 12 }}>
                Ajoute l'app à ton écran d'accueil pour un accès rapide, comme une vraie application.
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleInstall} style={{ flex: 1, padding: '9px 0', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Installer
                </button>
                <button onClick={dismiss} style={{ flex: 1, padding: '9px 0', background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, cursor: 'pointer' }}>
                  Plus tard
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
