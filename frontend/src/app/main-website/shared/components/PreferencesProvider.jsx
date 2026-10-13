import { useEffect, useRef, useState } from 'react'
import { STORAGE_KEY, readPreferences, sanitisePreferences } from '@/lib/preferences'
import { PreferencesContext } from '../hooks/preferencesContext'
export default function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(readPreferences)
  const current = useRef(preferences)
  const [storageError, setStorageError] = useState('')
  function update(patch, requirePersistence = false) {
    const next = { ...current.current, ...patch }
    let persisted = true
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageError('') }
    catch { persisted = false; setStorageError('This browser cannot save your preferences. Allow site storage to keep them after leaving.') }
    if (persisted || !requirePersistence) { current.current = next; setPreferences(next) }
    return persisted
  }
  function toggleSaved(slug) {
    const saved = current.current.saved.includes(slug) ? current.current.saved.filter(id => id !== slug) : [...current.current.saved, slug]
    return update({ saved }, true)
  }
  function remember(slug) {
    if (current.current.recent[0] === slug) return
    update({ recent: [slug, ...current.current.recent.filter(id => id !== slug)].slice(0, 8) })
  }
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const theme = preferences.theme === 'system' ? (media.matches ? 'dark' : 'light') : preferences.theme
      document.documentElement.dataset.theme = theme
      document.documentElement.classList.toggle('scheme-dark', theme === 'dark')
      document.documentElement.classList.toggle('scheme-light', theme === 'light')
    }
    apply(); media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [preferences.theme])
  useEffect(() => {
    function sync(event) {
      if (event.key !== STORAGE_KEY && event.key !== null) return
      try { const next = sanitisePreferences(JSON.parse(event.newValue)); current.current = next; setPreferences(next) }
      catch { /* Ignore malformed external storage updates. */ }
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  return <PreferencesContext.Provider value={{ preferences, update, toggleSaved, remember, storageError }}>{children}</PreferencesContext.Provider>
}
