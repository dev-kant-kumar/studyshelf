import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SaveButton from './SaveButton'
import { formatDate } from '@/lib/format'
import { focus, muted } from '@/ui/classes'
export default function NoteLinks({ notes, sidebar = false }) {
  const { pathname } = useLocation()
  if (!notes.length) return <p className={`py-3 text-sm ${muted}`}>Notes will be added here.</p>
  return <ul className={sidebar ? 'space-y-1' : 'divide-y divide-line dark:divide-night-line'}>{notes.map(note => <li className={sidebar ? '' : 'flex items-start justify-between gap-4 py-6'} key={note.slug}><div className="min-w-0"><Link className={`${focus} ${sidebar ? 'block rounded-lg px-3 py-2.5 text-sm hover:bg-soft dark:hover:bg-night-soft' : 'inline-flex items-center gap-2 text-lg font-semibold hover:text-brand dark:hover:text-night-brand'} ${pathname === note.href ? 'bg-selected text-brand dark:bg-night-selected dark:text-night-brand' : ''}`} aria-current={pathname === note.href ? 'page' : undefined} to={note.href}>{note.title}{!sidebar && <ArrowUpRight size={17} className="shrink-0" aria-hidden="true" />}</Link>{!sidebar && <><p className={`mt-2 max-w-2xl ${muted}`}>{note.summary}</p><div className={`mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm ${muted}`}><span>{note.courseName} · {note.paperTitle}</span>{note.updatedAt && <span>{formatDate(note.updatedAt)}</span>}</div></>}</div>{!sidebar && <SaveButton note={note} />}</li>)}</ul>
}
