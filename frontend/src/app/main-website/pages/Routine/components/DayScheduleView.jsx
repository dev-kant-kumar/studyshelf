import { Link } from 'react-router-dom'
import {
  Clock,
  ArrowRight,
  BookOpen,
  FlaskConical,
  Coffee,
  RotateCcw,
} from 'lucide-react'
import ProfessorPhoto from '../../Professors/ProfessorPhoto'
import { getProfessor, professorHref } from '../../Professors/facultyData'
import {
  days,
  sessionLabel,
  sessionStatus,
  formatClassTime,
  formatDuration,
  minutesOf,
  teachers,
  dayDuration,
} from '../routineData'
import { focus, muted } from '@/ui/classes'

export default function DayScheduleView({
  routine,
  day,
  clock,
  onChange,
}) {
  const isToday = day === clock?.day
  const sessions = routine?.days[day] ?? []

  return (
    <div className="space-y-6">
      {/* Day Selector Pill Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:pb-0"
          role="group"
          aria-label="Day of week"
        >
          {days.map(weekday => {
            const isSelected = day === weekday
            const isTodayDay = weekday === clock?.day

            return (
              <button
                key={weekday}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onChange({ day: isTodayDay ? null : weekday })}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${focus} ${
                  isSelected
                    ? 'border-brand bg-brand text-on-brand shadow-xs dark:border-night-brand dark:bg-night-brand dark:text-night-on-brand'
                    : 'border-line bg-surface text-ink hover:border-brand/40 hover:bg-soft dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:hover:border-night-brand/40 dark:hover:bg-night-soft'
                }`}
              >
                <span>{weekday.slice(0, 3)}</span>
                {isTodayDay && (
                  <span
                    className={`rounded px-1 py-0.2 text-[9px] font-bold ${
                      isSelected
                        ? 'bg-on-brand/20 text-on-brand dark:bg-night-on-brand/20 dark:text-night-on-brand'
                        : 'bg-selected text-brand dark:bg-night-selected dark:text-night-brand'
                    }`}
                  >
                    Today
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {!isToday && clock?.day && (
          <button
            type="button"
            onClick={() => onChange({ day: null })}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors hover:underline dark:text-night-brand ${focus}`}
          >
            <RotateCcw size={12} aria-hidden="true" />
            <span>Jump to today ({clock.day.slice(0, 3)})</span>
          </button>
        )}
      </div>

      {/* Day Heading & Instructional Time Summary */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3 dark:border-night-line">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl font-bold text-ink dark:text-night-ink">
            {day} Schedule
          </h2>
          {isToday && (
            <span className="rounded-md bg-selected px-2 py-0.5 text-xs font-bold text-brand dark:bg-night-selected dark:text-night-brand">
              Today
            </span>
          )}
        </div>

        {sessions.length > 0 && (
          <p className="font-mono text-xs text-subtle dark:text-night-subtle">
            Total class duration: {formatDuration(dayDuration(sessions))} (excluding recess)
          </p>
        )}
      </div>

      {/* Period Cards List */}
      {sessions.length > 0 ? (
        <ol className="space-y-3.5" aria-label={`${day} class periods`}>
          {sessions.map((session, index) => {
            const isLive = isToday && clock && sessionStatus(session, clock.minutes) === 'now'
            const isUpcoming = isToday && clock && sessionStatus(session, clock.minutes) === 'upcoming'
            const isFinished = isToday && clock && sessionStatus(session, clock.minutes) === 'finished'
            const isBreak = session.kind === 'break'

            const teacher = session.teacher
              ? getProfessor(teachers[session.teacher]?.professorId)
              : null

            let paperLink = null
            if (routine?.papers && !isBreak) {
              const paperId =
                routine.papers[session.subject]?.[session.kind] ??
                routine.papers[session.subject]?.class
              if (paperId) {
                paperLink = `/courses/${routine.course}/semesters/sem${routine.semester}/subjects/${paperId}`
              }
            }

            return (
              <li
                key={session.start + index}
                className={`flex flex-col justify-between gap-4 rounded-xl border p-4.5 shadow-xs transition-colors sm:flex-row sm:items-center ${
                  isLive
                    ? 'border-brand bg-selected/50 ring-1 ring-brand dark:border-night-brand dark:bg-night-selected/40 dark:ring-night-brand'
                    : isBreak
                      ? 'border-line/70 bg-soft/40 dark:border-night-line/70 dark:bg-night-soft/30'
                      : isFinished
                        ? 'border-line/60 bg-surface/70 opacity-80 dark:border-night-line/60 dark:bg-night-surface/70'
                        : 'border-line bg-surface dark:border-night-line dark:bg-night-surface'
                }`}
              >
                {/* Left: Timing & Period Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1.5 font-mono text-xs font-bold text-ink dark:text-night-ink">
                      <Clock size={13} className="text-subtle dark:text-night-subtle" aria-hidden="true" />
                      <time>{formatClassTime(session.start)}</time>
                      <span>-</span>
                      <time>{formatClassTime(session.end)}</time>
                    </span>

                    <span className="text-[11px] text-subtle dark:text-night-subtle">
                      ({formatDuration(minutesOf(session.end) - minutesOf(session.start))})
                    </span>

                    {/* Status Badge */}
                    {isLive && (
                      <span className="inline-flex items-center gap-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-on-brand dark:bg-night-brand dark:text-night-on-brand">
                        <span className="size-1.5 rounded-full bg-white animate-pulse" />
                        <span>Now</span>
                      </span>
                    )}

                    {isUpcoming && (
                      <span className="rounded bg-soft px-1.5 py-0.5 text-[10px] font-medium text-subtle dark:bg-night-soft dark:text-night-subtle">
                        Upcoming
                      </span>
                    )}

                    {isBreak && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                        <Coffee size={10} aria-hidden="true" />
                        <span>Recess</span>
                      </span>
                    )}

                    {session.kind === 'lab' && (
                      <span className="inline-flex items-center gap-1 rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-400">
                        <FlaskConical size={10} aria-hidden="true" />
                        <span>Lab Session (2 periods)</span>
                      </span>
                    )}
                  </div>

                  {/* Main Title */}
                  <h3 className="mt-2 font-display text-base font-bold text-ink dark:text-night-ink sm:text-lg">
                    {sessionLabel(routine, session)}
                  </h3>

                  {/* Teacher Preview */}
                  {teacher && (
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <ProfessorPhoto person={teacher} small decorative />
                      <Link
                        to={professorHref(teacher.id)}
                        className={`text-xs font-semibold text-ink hover:text-brand hover:underline dark:text-night-ink dark:hover:text-night-brand ${focus}`}
                      >
                        {teacher.name}
                      </Link>
                      <span className="text-[11px] text-subtle dark:text-night-subtle">
                        ({teacher.designation})
                      </span>
                    </div>
                  )}

                  {isBreak && (
                    <p className={`mt-1 text-xs ${muted}`}>
                      Mid-day break for lunch and department library access.
                    </p>
                  )}
                </div>

                {/* Right: Notes Action */}
                {paperLink && (
                  <div className="w-full shrink-0 sm:w-auto">
                    <Link
                      to={paperLink}
                      className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:hover:border-night-brand dark:hover:text-night-brand sm:w-auto sm:py-1.5 ${focus}`}
                    >
                      <BookOpen size={13} aria-hidden="true" />
                      <span>Read Notes</span>
                      <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      ) : (
        <div className="rounded-xl border border-line bg-surface p-8 text-center dark:border-night-line dark:bg-night-surface">
          <h3 className="font-display text-lg font-bold text-ink dark:text-night-ink">
            No classes scheduled for {day}
          </h3>
          <p className={`mt-2 text-xs ${muted}`}>
            Sunday is a university holiday. Select any weekday above to view its timetable.
          </p>
        </div>
      )}
    </div>
  )
}
