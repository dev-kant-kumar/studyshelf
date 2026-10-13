import { BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { panel, muted, secondary } from '@/ui/classes'
export default function EmptyState({ title = 'The shelf is getting ready.', description, href, action, icon: Icon = BookOpen, compact = false }) {
  return <div className={`${panel} ${compact ? 'p-6' : 'px-6 py-12 sm:p-12'} flex flex-col items-center text-center`}><span className="mb-5 flex size-14 items-center justify-center rounded-xl bg-selected text-brand dark:bg-night-selected dark:text-night-brand"><Icon size={24} aria-hidden="true" /></span><h2 className="font-display text-xl font-medium sm:text-2xl">{title}</h2><p className={`mt-3 max-w-lg leading-relaxed ${muted}`}>{description}</p>{href && <Link className={`${secondary} mt-6`} to={href}>{action}</Link>}</div>
}
