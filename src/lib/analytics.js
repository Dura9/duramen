// ════════════════════════════════════════════════════════════════════════════
// ANALYTICS INTERNE DURAMEN
// Tracking événementiel maison (stocké dans Supabase), sans outil tiers.
// Objectif : mesurer le funnel (activation, rétention, conversion) pour piloter.
// RGPD-friendly : pas de cookie publicitaire, pas de partage tiers.
// ════════════════════════════════════════════════════════════════════════════
import { supabase } from './supabase'

// Identifiant anonyme stable par appareil (pour suivre le funnel AVANT inscription)
function getAnonId() {
  let id = localStorage.getItem('duramen_anon')
  if (!id) {
    id = 'anon_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
    localStorage.setItem('duramen_anon', id)
  }
  return id
}

// Envoie un événement. Ne bloque jamais l'UI, n'émet aucune erreur visible.
export async function track(event, props = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    await supabase.from('events').insert({
      user_id: session?.user?.id ?? null,
      anon_id: getAnonId(),
      event,
      props,
      path: typeof window !== 'undefined' ? window.location.pathname : null,
      created_at: new Date().toISOString(),
    })
  } catch (_) {
    // silencieux : l'analytics ne doit jamais casser l'expérience
  }
}
