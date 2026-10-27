import { Link } from 'react-router-dom'
import { Compass, ArrowRight } from 'lucide-react'
import { focus } from '@/ui/classes'

export default function CareerBanner() {
  return (
    <aside className="mb-12 flex flex-col justify-between gap-4 rounded-xl border border-brand/30 bg-selected/40 p-5 sm:flex-row sm:items-center dark:border-night-brand/30 dark:bg-night-selected/30">
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand text-on-brand dark:bg-night-brand dark:text-night-on-brand">
          <Compass size={18} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-bold text-ink dark:text-night-ink">
            Still deciding which career direction to pursue?
          </h2>
          <p className="mt-0.5 text-xs leading-relaxed text-subtle dark:text-night-subtle">
            Compare 12+ software engineering, data science, cybersecurity, and cloud careers with salary insights and syllabus cross-references.
          </p>
        </div>
      </div>

      <Link
        to="/careers"
        className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-on-brand shadow-xs transition-opacity hover:opacity-95 dark:bg-night-brand dark:text-night-on-brand ${focus}`}
      >
        <span>Open Career Explorer</span>
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </aside>
  )
}
