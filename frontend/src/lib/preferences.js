import { defaultSqlDialect, sanitiseSqlDialect } from './sqlDialects.js'

export const STORAGE_KEY = 'studyshelf-preferences-v1'
export const defaults = { theme: 'system', saved: [], recent: [], readerSize: 18, readerFont: 'sans', sqlDialect: defaultSqlDialect }
export function sanitisePreferences(value) {
  const strings = items => Array.isArray(items) ? [...new Set(items.filter(item => typeof item === 'string' && item.length < 250))].slice(0, 500) : []
  return {
    theme: ['light', 'dark', 'system'].includes(value?.theme) ? value.theme : defaults.theme,
    saved: strings(value?.saved), recent: strings(value?.recent).slice(0, 8),
    readerSize: [16, 18, 20, 22].includes(value?.readerSize) ? value.readerSize : defaults.readerSize,
    readerFont: ['sans', 'serif'].includes(value?.readerFont) ? value.readerFont : defaults.readerFont,
    sqlDialect: sanitiseSqlDialect(value?.sqlDialect),
  }
}
export function readPreferences() {
  try { return sanitisePreferences(JSON.parse(localStorage.getItem(STORAGE_KEY))) }
  catch { return { ...defaults, saved: [], recent: [] } }
}
