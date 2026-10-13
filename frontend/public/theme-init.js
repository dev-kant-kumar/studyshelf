// Set the initial theme before the application paints. No network/cookies.
try {
  const stored = JSON.parse(localStorage.getItem('studyshelf-preferences-v1'))
  const preference = ['light', 'dark', 'system'].includes(stored?.theme) ? stored.theme : 'system'
  const theme = preference === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : preference
  document.documentElement.dataset.theme = theme
  document.documentElement.classList.toggle('scheme-dark', theme === 'dark')
      document.documentElement.classList.toggle('scheme-light', theme === 'light')
} catch {
  const theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  document.documentElement.dataset.theme = theme
  document.documentElement.classList.toggle('scheme-dark', theme === 'dark')
      document.documentElement.classList.toggle('scheme-light', theme === 'light')
}
