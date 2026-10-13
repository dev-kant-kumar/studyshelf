import { Outlet } from 'react-router-dom'
import Header from './shared/components/Header'
import Footer from './shared/components/Footer'
import PreferencesProvider from './shared/components/PreferencesProvider'
import RouteFocus from './shared/components/RouteFocus'
import { usePreferences } from './shared/hooks/preferencesContext'
import { container } from '@/ui/classes'
function StorageNotice() {
  const { storageError } = usePreferences()
  return storageError ? <p role="status" className={`${container} my-4 rounded-lg bg-accent-soft p-4 text-sm text-accent dark:bg-night-accent-soft dark:text-night-accent`}>{storageError}</p> : null
}
export default function MainWebsiteLayout() { return <PreferencesProvider><div className="flex min-h-dvh flex-col bg-canvas font-sans text-ink antialiased selection:bg-selected selection:text-brand dark:bg-night-canvas dark:text-night-ink dark:selection:bg-night-selected dark:selection:text-night-brand print:bg-white print:text-black"><Header /><StorageNotice /><RouteFocus /><main id="main-content" className="flex-1 scroll-mt-24 focus:outline-none" tabIndex={-1}><Outlet /></main><Footer /></div></PreferencesProvider> }
