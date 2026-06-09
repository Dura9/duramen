import { createContext, useContext, useState, useEffect } from 'react'
import { translations } from './translations'

const LanguageContext = createContext(null)

function detectDefault() {
  const saved = localStorage.getItem('duramen_lang')
  if (saved === 'fr' || saved === 'en') return saved
  // Détection auto selon la langue du navigateur
  const nav = (navigator.language || 'fr').toLowerCase()
  return nav.startsWith('fr') ? 'fr' : 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectDefault)

  useEffect(() => {
    localStorage.setItem('duramen_lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  function setLang(l) { setLangState(l) }
  function toggle() { setLangState(l => (l === 'fr' ? 'en' : 'fr')) }

  // Fonction de traduction : t('cle') → chaîne dans la langue active (fallback FR)
  function t(key) {
    return translations[lang]?.[key] ?? translations.fr[key] ?? key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLang = () => useContext(LanguageContext)
