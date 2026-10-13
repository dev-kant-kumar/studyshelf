import { createContext, useContext } from 'react'
export const PreferencesContext = createContext(null)
export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) throw new Error('Reading preferences require PreferencesProvider.')
  return context
}
