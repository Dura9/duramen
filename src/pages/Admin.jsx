import { useState, useEffect } from 'react'

function Stat({ label, value, sub, color = 'var(--primary)' }) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '16px 10px' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color, fontWeight: 600, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--text)', marginTop: 6, fontWeight: 500 }}>{label}</div>
      {sub != null && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

function Bar({ label, value, max, color = 'var(--primary)' }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text)', marginBottom: 4 }}>
        <span>{label}</span><span style={{ fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4 }} />
      </div>
    </div>
  )
}

export default function Admin() {
  const [key, setKey] = useState(localStorage.getItem('duramen_admin_key') || '')
  const [input, setInput] = useState('')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function load(k) {
    setLoading(true); setError(null)
    try {
      const res = await fetch(`/api/stats?key=${encodeURIComponent(k)}`)
      if (res.status === 401) { setError('Mot de passe incorrect.'); localStorage.removeItem('duramen_admin_key'); setKey(''); setLoading(false); return }
      const json = await res.json()
      setData(json)
      localStorage.setItem('duramen_admin_key', k)
      setKey(k)
    } catch (e) { setError('Erreur de chargement.') }
    setLoading(false)
  }

  useEffect(() => { if (key) load(key) }, [])

  // Écran mot de passe
  if (!key || (!data && !loading)) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 24px', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--primary)' }}>Duramen · Admin</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Tableau de bord privé</div>
        </div>
        <input
          type="password" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && load(input)}
          placeholder="Mot de passe admin"
          style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1.5px solid var(--border)', fontSize: 15, background: 'var(--bg-card)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
        />
        {error && <div style={{ background: '#fde8e8', color: 'var(--danger)', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 12 }}>{error}</div>}
        <button className="btn-primary" onClick={() => load(input)} disabled={loading || !input}>
          {loading ? <span className="spinner"></span> : 'Accéder'}
        </button>
      </div>
    )
  }

  if (loading || !data) {
    return <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}><span className="spinner" style={{ borderTopColor: 'var(--primary)' }}></span></div>
  }

  const { funnel, rates, dropoff, profiles, exoByType, totals, feedback } = data
  const maxDrop = Math.max(...Object.values(dropoff), 1)
  const maxExo = Math.max(...Object.values(exoByType || {}), 1)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', paddingBottom: 40 }}>
      <div style={{ background: 'linear-gradient(160deg, var(--primary) 0%, #3a6359 100%)', padding: '52px 20px 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#fff', fontWeight: 500 }}>Tableau de bord</h1>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>30 derniers jours · {totals.events} événements</div>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Taux clés */}
        <div className="section-label">Taux clés</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 24 }}>
          <Stat label="Complétion onboarding" value={`${rates.onboardingCompletion}%`} sub={`${funnel.complete}/${funnel.start}`} />
          <Stat label="Conversion inscription" value={`${rates.signupConversion}%`} sub={`${funnel.signup} comptes`} color="#D4A855" />
          <Stat label="Activation (1er exo)" value={`${rates.activation}%`} sub={`${funnel.exoUsers} actifs`} color="#5A9E8F" />
          <Stat label="Rétention (≥2 jours)" value={`${rates.retentionRate}%`} sub={`${totals.returning} reviennent`} color="#e85c0d" />
        </div>

        {/* Funnel */}
        <div className="section-label">Funnel de conversion</div>
        <div className="card" style={{ marginBottom: 24 }}>
          <Bar label="① Onboarding démarré" value={funnel.start} max={funnel.start} />
          <Bar label="② Onboarding terminé" value={funnel.complete} max={funnel.start} />
          <Bar label="③ Compte créé" value={funnel.signup} max={funnel.start} color="#D4A855" />
          <Bar label="④ 1er exercice fait" value={funnel.exoUsers} max={funnel.start} color="#5A9E8F" />
          <Bar label="⑤ A parlé à Alex" value={funnel.coachUsers} max={funnel.start} color="#7C6F4A" />
        </div>

        {/* Abandon par question */}
        <div className="section-label">Progression du questionnaire (abandon)</div>
        <div className="card" style={{ marginBottom: 24 }}>
          {Object.entries(dropoff).map(([q, v]) => (
            <Bar key={q} label={`Question ${q.replace('q', '')}`} value={v} max={maxDrop} />
          ))}
        </div>

        {/* Profils */}
        <div className="section-label">Profils diagnostiqués</div>
        <div className="card" style={{ marginBottom: 24 }}>
          {Object.keys(profiles).length === 0 ? <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Aucune donnée</div> :
            Object.entries(profiles).map(([p, v]) => (
              <Bar key={p} label={p} value={v} max={Math.max(...Object.values(profiles), 1)} color="#D4A855" />
            ))}
        </div>

        {/* Exercices populaires */}
        <div className="section-label">Exercices complétés</div>
        <div className="card" style={{ marginBottom: 24 }}>
          {Object.keys(exoByType || {}).length === 0 ? <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Aucune donnée</div> :
            Object.entries(exoByType).sort((a, b) => b[1] - a[1]).map(([id, v]) => (
              <Bar key={id} label={id} value={v} max={maxExo} color="#5A9E8F" />
            ))}
        </div>

        {/* Feedback */}
        <div className="section-label">Retours utilisateurs {feedback.avgRating && `· ${feedback.avgRating}/5 ⭐`}</div>
        <div className="card">
          {feedback.recent.length === 0 ? <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Aucun retour pour l'instant</div> :
            feedback.recent.map((f, i) => (
              <div key={i} style={{ paddingBottom: 10, marginBottom: 10, borderBottom: i < feedback.recent.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontSize: 13, color: 'var(--text)' }}>{f.rating ? '⭐'.repeat(f.rating) : ''} {f.message || <em style={{ color: 'var(--text-muted)' }}>(note seule)</em>}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{f.date}</div>
              </div>
            ))}
        </div>

        <button onClick={() => load(key)} style={{ marginTop: 20, width: '100%', padding: '12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text-muted)', fontSize: 14, cursor: 'pointer' }}>
          ↻ Rafraîchir
        </button>
      </div>
    </div>
  )
}
