import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/global.css'

// Mode "sans traçage" pour les appareils de l'admin :
// visiter /?notrack=1 → ton activité n'est plus comptée dans les stats. /?notrack=0 pour réactiver.
const _params = new URLSearchParams(window.location.search)
if (_params.get('notrack') === '1') localStorage.setItem('duramen_notrack', '1')
if (_params.get('notrack') === '0') localStorage.removeItem('duramen_notrack')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

// Enregistrement du service worker (PWA + notifications)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
