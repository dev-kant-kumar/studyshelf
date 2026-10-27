import { usePreferences } from '../hooks/preferencesContext'
import { muted } from '@/ui/classes'
import Dropdown from '@/ui/Dropdown'
import { ALargeSmall, Type } from 'lucide-react'

const sizes = [16, 18, 20, 22].map(size => ({ value: size, label: `${size}px` }))
const fonts = [
  { value: 'sans', label: 'Sans' },
  { value: 'serif', label: 'Serif' },
]

export default function ReadingPreferences() {
  const { preferences, update } = usePreferences()
  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 text-xs ${muted}`}>
      <div className="flex items-center gap-1.5">
        <label htmlFor="reading-size" className="inline-flex items-center gap-1 font-medium text-subtle dark:text-night-subtle cursor-pointer">
          <ALargeSmall size={14} className="shrink-0" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Size</span>
        </label>
        <Dropdown
          id="reading-size"
          label="Text size"
          options={sizes}
          value={preferences.readerSize}
          onChange={readerSize => update({ readerSize })}
          compact
        />
      </div>
      <div className="flex items-center gap-1.5">
        <label htmlFor="reading-font" className="inline-flex items-center gap-1 font-medium text-subtle dark:text-night-subtle cursor-pointer">
          <Type size={14} className="shrink-0" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Font</span>
        </label>
        <Dropdown
          id="reading-font"
          label="Reading font"
          options={fonts}
          value={preferences.readerFont}
          onChange={readerFont => update({ readerFont })}
          compact
        />
      </div>
    </div>
  )
}
