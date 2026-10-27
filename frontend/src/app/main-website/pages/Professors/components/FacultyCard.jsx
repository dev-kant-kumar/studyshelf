import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Mail, Phone, Award } from 'lucide-react'
import ProfessorPhoto from '../ProfessorPhoto'
import { professorHref } from '../facultyData'
import { focus } from '@/ui/classes'

export default function FacultyCard({ person }) {
  const hasContact = person.emails?.length > 0 || person.phones?.length > 0

  return (
    <article className="h-full">
      <Link
        to={professorHref(person.id)}
        className={`group flex h-full flex-col justify-between rounded-xl border border-line bg-surface p-4 shadow-xs transition-all hover:border-brand hover:shadow-md dark:border-night-line dark:bg-night-surface dark:hover:border-night-brand sm:p-6 ${focus}`}
      >
        <div>
          {/* Top Row: Photo & Basic Details */}
          <div className="flex items-start gap-3 sm:gap-4">
            <ProfessorPhoto person={person} />
            <div className="min-w-0 flex-1">
              <span className="inline-block rounded-md bg-soft px-2 py-0.5 text-[11px] font-semibold text-subtle dark:bg-night-soft dark:text-night-subtle">
                {person.designation}
              </span>
              <h3 className="mt-1 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand sm:text-xl">
                {person.name}
              </h3>
              {person.specialization && (
                <p className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-night-brand">
                  <Award size={14} aria-hidden="true" />
                  <span>{person.specialization}</span>
                </p>
              )}
            </div>
          </div>

          {/* Qualification */}
          {person.qualification && (
            <div className="mt-4 rounded-lg border border-line/60 bg-soft/40 px-3 py-2 text-xs text-subtle dark:border-night-line/60 dark:bg-night-soft/30 dark:text-night-subtle">
              <span className="font-semibold text-ink dark:text-night-ink">Qualifications: </span>
              <span>{person.qualification}</span>
            </div>
          )}

          {/* Tags: Courses & Experience */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            {(person.courses ?? []).map(course => (
              <span
                key={course}
                className="inline-flex items-center gap-1 rounded-md bg-selected px-2 py-0.5 text-[10px] font-bold uppercase text-brand dark:bg-night-selected dark:text-night-brand"
              >
                <BookOpen size={10} aria-hidden="true" />
                <span>{course}</span>
              </span>
            ))}
            {person.reportedExperienceYears && (
              <span className="rounded-md border border-line bg-soft/60 px-2 py-0.5 text-[10px] font-medium text-subtle dark:border-night-line dark:bg-night-soft/50 dark:text-night-subtle">
                {person.reportedExperienceYears} yrs experience (as listed)
              </span>
            )}
          </div>
        </div>

        {/* Card Footer: Contact & Action */}
        <div className="mt-5 flex items-center justify-between border-t border-line/70 pt-3 text-xs font-semibold dark:border-night-line/70">
          <div className="flex items-center gap-2 text-subtle dark:text-night-subtle">
            {hasContact && (
              <span className="flex items-center gap-1 text-[11px]">
                {person.emails?.length > 0 && <Mail size={12} aria-hidden="true" />}
                {person.phones?.length > 0 && <Phone size={12} aria-hidden="true" />}
                <span>Contact listed</span>
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-brand dark:text-night-brand">
            <span>View profile</span>
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </article>
  )
}
