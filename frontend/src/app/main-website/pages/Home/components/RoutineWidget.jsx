import { Link } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'
import {
  mcaSemesterOne,
  getIndiaClock,
  sessionStatus,
  sessionLabel,
  formatClassTime,
} from '../../Routine/routineData'
import { panel, focus, muted } from '@/ui/classes'

export default function RoutineWidget() {
  const clock = getIndiaClock()
  const todaySessions = mcaSemesterOne.days[clock.day] || []
  const current = todaySessions.find(s => sessionStatus(s, clock.minutes) === 'now')
  const next = todaySessions.find(s => sessionStatus(s, clock.minutes) === 'upcoming')

  return (
    <div className={`${panel} flex flex-col justify-between p-4 sm:p-7`}>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
              <Clock size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-ink dark:text-night-ink">MCA Semester 1 Routine</h3>
              <p className={`truncate text-xs ${muted}`}>{clock.day}, {clock.date} - IST</p>
            </div>
          </div>
          {current ? (
            <span className="inline-flex shrink-0 items-center rounded-full bg-selected px-2.5 py-0.5 text-xs font-semibold text-brand dark:bg-night-selected dark:text-night-brand">
              In Session Now
            </span>
          ) : (
            <span className="inline-flex shrink-0 items-center rounded-full border border-line bg-soft/50 px-2.5 py-0.5 text-xs font-medium text-subtle dark:border-night-line dark:bg-night-soft/50 dark:text-night-subtle">
              {todaySessions.length > 0 ? 'Today Scheduled' : 'No Classes Today'}
            </span>
          )}
        </div>

        <div className="mt-5 rounded-lg border border-line bg-soft/40 p-4 dark:border-night-line dark:bg-night-soft/30">
          {current ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-brand dark:text-night-brand">Current class</p>
              <p className="mt-1 text-base font-semibold text-ink dark:text-night-ink">
                {sessionLabel(mcaSemesterOne, current)}
              </p>
              <p className={`mt-0.5 text-xs ${muted}`}>
                Scheduled until {formatClassTime(current.end)}
              </p>
            </div>
          ) : next ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-subtle dark:text-night-subtle">Next scheduled class</p>
              <p className="mt-1 text-base font-semibold text-ink dark:text-night-ink">
                {sessionLabel(mcaSemesterOne, next)}
              </p>
              <p className={`mt-0.5 text-xs ${muted}`}>
                Starts at {formatClassTime(next.start)}
              </p>
            </div>
          ) : todaySessions.length > 0 ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-subtle dark:text-night-subtle">Classes finished</p>
              <p className="mt-1 text-sm font-semibold text-ink dark:text-night-ink">
                All scheduled classes for today have ended.
              </p>
              <p className={`mt-0.5 text-xs ${muted}`}>
                Check the weekly schedule for tomorrow's timetable.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-subtle dark:text-night-subtle">Weekend recess</p>
              <p className="mt-1 text-sm font-semibold text-ink dark:text-night-ink">
                No classes scheduled for {clock.day}.
              </p>
              <p className={`mt-0.5 text-xs ${muted}`}>
                Use non-class days to revise notes and worked coding examples.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 border-t border-line pt-4 dark:border-night-line">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/routine?course=mca&semester=1"
            className={`inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline dark:text-night-brand ${focus}`}
          >
            <span>Open Interactive Routine</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
          <Link
            to="/holidays"
            className={`text-xs text-subtle hover:text-ink hover:underline dark:text-night-subtle dark:hover:text-night-ink ${focus}`}
          >
            University holiday calendar
          </Link>
        </div>
      </div>
    </div>
  )
}
