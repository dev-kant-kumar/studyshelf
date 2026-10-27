import { ArrowUpRight, BookOpen, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { focus, muted, panel } from '@/ui/classes'

export default function CourseLink({ course }) {
  const available = course.semesters.length > 0

  return (
    <Link
      className={`${panel} group flex flex-col justify-between p-6 transition-colors hover:border-brand dark:hover:border-night-brand motion-reduce:transition-none sm:p-8 ${focus}`}
      to={course.href}
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="flex size-12 items-center justify-center rounded-xl bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
            <GraduationCap size={24} aria-hidden="true" />
          </span>
          <ArrowUpRight
            className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand dark:text-night-subtle dark:group-hover:text-night-brand"
            size={22}
            aria-hidden="true"
          />
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand dark:text-night-brand">
            {course.id.toUpperCase()} - CBCS Curriculum
          </p>
          <h3 className="mt-1 font-display text-2xl font-medium text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand sm:text-3xl">
            {course.name}
          </h3>
          <p className={`mt-2.5 text-sm leading-relaxed ${muted}`}>{course.description}</p>
        </div>

        {available && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {course.semesters.map(semester => (
              <span
                key={semester.id}
                className="rounded-md border border-line bg-soft/60 px-2 py-0.5 text-xs font-medium text-subtle dark:border-night-line dark:bg-night-soft/50 dark:text-night-subtle"
              >
                Sem {semester.number}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={`mt-6 flex items-center justify-between border-t border-line pt-5 text-sm dark:border-night-line ${muted}`}>
        <div className="flex items-center gap-2">
          <BookOpen size={16} aria-hidden="true" />
          <span>
            {available
              ? `${course.noteCount} published notes · ${course.semesters.length} semesters`
              : 'Syllabus coming soon'}
          </span>
        </div>
        <span className="text-xs font-semibold text-brand dark:text-night-brand">
          Browse syllabus
        </span>
      </div>
    </Link>
  )
}
