import { usePreferences } from '../hooks/preferencesContext'
import { muted } from '@/ui/classes'
import Dropdown from '@/ui/Dropdown'
const sizes = [16, 18, 20, 22].map(size => ({ value: size, label: `${size}px` }))
const fonts = [{ value: 'sans', label: 'Sans serif' }, { value: 'serif', label: 'Serif' }]
export default function ReadingPreferences() {
  const { preferences, update } = usePreferences()
  return <div className={`flex flex-wrap items-center gap-4 text-sm ${muted}`}>
    <div className="flex items-center gap-2"><label htmlFor="reading-size">Text size</label><Dropdown id="reading-size" label="Text size" options={sizes} value={preferences.readerSize} onChange={readerSize => update({ readerSize })} /></div>
    <div className="flex items-center gap-2"><label htmlFor="reading-font">Reading font</label><Dropdown id="reading-font" label="Reading font" options={fonts} value={preferences.readerFont} onChange={readerFont => update({ readerFont })} /></div>
  </div>
}
