import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useState } from 'react'
import { usePreferences } from '../hooks/preferencesContext'
import { iconButton, secondary } from '@/ui/classes'
export default function SaveButton({ note, label = false }) {
  const { preferences, toggleSaved } = usePreferences(), [message, setMessage] = useState('')
  const saved = preferences.saved.includes(note.slug), Icon = saved ? BookmarkCheck : Bookmark
  function toggle() { const success = toggleSaved(note.slug); setMessage(success ? saved ? 'Removed from saved notes.' : 'Saved on this device.' : 'Could not save. Allow site storage and try again.') }
  return <span className="inline-flex"><button type="button" className={label ? secondary : iconButton} aria-label={`${saved ? 'Remove saved note' : 'Save note'}: ${note.title}`} aria-pressed={saved} onClick={toggle}><Icon size={18} aria-hidden="true" />{label && (saved ? 'Saved' : 'Save note')}</button><span className="sr-only" role="status">{message}</span></span>
}
