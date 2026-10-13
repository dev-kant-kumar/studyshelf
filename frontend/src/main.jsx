import '@fontsource/source-sans-3/latin-400.css'
import '@fontsource/source-sans-3/latin-600.css'
import '@fontsource/source-sans-3/latin-700.css'
import '@fontsource/literata/latin-500.css'
import '@fontsource/literata/latin-600.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// React owns metadata after startup; remove the build-time copies to avoid stale tags on navigation.
for (const element of document.head.querySelectorAll('[data-static-head]')) element.remove()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
