import { Sun, Moon, Monitor } from 'lucide-react'
import { usePreferences } from '../hooks/preferencesContext'
import Dropdown from '@/ui/Dropdown'
const options = [{ value: 'system', label: 'System' }, { value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]
export default function ThemeControl({ id = 'theme' }) {
  const { preferences, update } = usePreferences()
  const Icon = preferences.theme === 'light' ? Sun : preferences.theme === 'dark' ? Moon : Monitor
  return <Dropdown id={id} label="Colour theme" icon={Icon} options={options} value={preferences.theme} onChange={theme => update({ theme })} />
}
