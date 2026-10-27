import { Link } from 'react-router-dom'
import { ArrowUpRight, Download, Users, BookOpen, Calendar } from 'lucide-react'
import { eyebrow, muted, focus } from '@/ui/classes'

export default function RoutineHeader({
  routineCourses,
  course,
  semester,
  routine,
  onChange,
}) {
  return (
    <header className="border-b border-line pb-6 dark:border-night-line">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className={eyebrow}>VBU / Your College Day</p>
          <h1
            tabIndex={-1}
            className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl dark:text-night-ink"
          >
            Class routine
          </h1>
          <p className={`mt-2 text-sm leading-relaxed sm:text-base ${muted}`}>
            Your daily lecture timetable, subjects, classroom hours, and assigned faculty.
          </p>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <Link
            to="/holidays"
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:hover:border-night-brand dark:hover:text-night-brand sm:flex-initial sm:py-1.5 ${focus}`}
          >
            <Calendar size={14} aria-hidden="true" />
            <span>Holiday calendar</span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>

          <Link
            to="/professors"
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:hover:border-night-brand dark:hover:text-night-brand sm:flex-initial sm:py-1.5 ${focus}`}
          >
            <Users size={14} aria-hidden="true" />
            <span>Faculty directory</span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </Link>

          {routine?.source?.href && (
            <a
              href={routine.source.href}
              download="mca-sem1-routine.png"
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:hover:border-night-brand dark:hover:text-night-brand sm:flex-initial sm:py-1.5 ${focus}`}
            >
              <Download size={14} aria-hidden="true" />
              <span>Official scan</span>
            </a>
          )}
        </div>
      </div>

      {/* Compact Course & Semester Selector */}
      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-line bg-surface p-3 shadow-xs dark:border-night-line dark:bg-night-surface sm:flex-row sm:items-center sm:justify-between sm:p-4">
        {/* Course Selection */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Select course">
          <span className="text-xs font-bold uppercase tracking-wider text-subtle dark:text-night-subtle">
            Course:
          </span>
          {routineCourses.map(item => {
            const isSelected = course.id === item.id
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onChange({ course: item.id, semester: 1 })}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${focus} ${
                  isSelected
                    ? 'border-brand bg-brand text-on-brand shadow-xs dark:border-night-brand dark:bg-night-brand dark:text-night-on-brand'
                    : 'border-line bg-soft/60 text-ink hover:border-brand/40 hover:bg-surface dark:border-night-line dark:bg-night-soft/40 dark:text-night-ink dark:hover:border-night-brand/40 dark:hover:bg-night-surface'
                }`}
              >
                <BookOpen size={12} aria-hidden="true" />
                <span>{item.label}</span>
                {item.id === 'mca' && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                      isSelected
                        ? 'bg-on-brand/20 text-on-brand dark:bg-night-on-brand/20 dark:text-night-on-brand'
                        : 'bg-selected text-brand dark:bg-night-selected dark:text-night-brand'
                    }`}
                  >
                    Active
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Semester Selection */}
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Select semester">
          <span className="text-xs font-bold uppercase tracking-wider text-subtle dark:text-night-subtle">
            Semester:
          </span>
          {course.semesters.map(num => {
            const isSelected = semester === num
            return (
              <button
                key={num}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onChange({ semester: num })}
                className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${focus} ${
                  isSelected
                    ? 'border-brand bg-selected text-brand font-bold dark:border-night-brand dark:bg-night-selected dark:text-night-brand'
                    : 'border-line/70 bg-surface text-subtle hover:border-brand/40 hover:text-ink dark:border-night-line/70 dark:bg-night-surface dark:text-night-subtle dark:hover:border-night-brand/40 dark:hover:text-night-ink'
                }`}
              >
                Sem {num}
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
