import { Link } from 'react-router-dom'
import { ArrowRight, Users } from 'lucide-react'
import ProfessorPhoto from '../ProfessorPhoto'
import { professorHref } from '../facultyData'
import { focus } from '@/ui/classes'

export default function StaffCard({ person }) {
  return (
    <article className="h-full">
      <Link
        to={professorHref(person.id)}
        className={`group flex h-full items-center justify-between rounded-xl border border-line bg-surface p-4 shadow-xs transition-all hover:border-brand hover:shadow-md dark:border-night-line dark:bg-night-surface dark:hover:border-night-brand sm:p-5 ${focus}`}
      >
        <div className="flex items-center gap-3.5">
          <ProfessorPhoto person={person} />
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-subtle dark:text-night-subtle">
              <Users size={12} aria-hidden="true" />
              <span>{person.designation}</span>
            </span>
            <h3 className="font-display text-base font-bold text-ink transition-colors group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand">
              {person.name}
            </h3>
            <p className="mt-0.5 text-xs text-subtle dark:text-night-subtle">
              Department of Computer Applications
            </p>
          </div>
        </div>

        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-soft text-subtle transition-colors group-hover:bg-selected group-hover:text-brand dark:bg-night-soft dark:text-night-subtle dark:group-hover:bg-night-selected dark:group-hover:text-night-brand">
          <ArrowRight size={15} aria-hidden="true" />
        </span>
      </Link>
    </article>
  )
}
