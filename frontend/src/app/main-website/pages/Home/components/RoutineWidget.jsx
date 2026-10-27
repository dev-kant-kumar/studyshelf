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
    <div className={`${panel} flex flex-col justify-between p-6 sm:p-7`}>
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
              <Clock size={18} aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold text-ink dark:text-night-ink">MCA Semester 1 Routine</h3>
              <p className={`text-xs ${muted}`}>{clock.day}, {clock.date} - IST</p>
            </div>
          </div>
          {current ? (
            <span className="inline-flex items-center rounded-full bg-selected px-2.5 py-0.5 text-xs font-semibold text-brand dark:bg-night-selected dark:text-night-brand">
              In Session Now
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-line bg-soft/50 px-2.5 py-0.5 text-xs font-medium text-subtle dark:border-night-line dark:bg-night-soft/50 dark:text-night-subtle">
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
              <p className="text-xs font-medium uppercase tracking-wider text-subtle dark:text-night-subtle">Next upcoming class</p>
              <p className="mt-1 text-base font-semibold text-ink dark:text-night-ink">
                {sessionLabel(mcaSemesterOne, next)}
              </p>
              <p className={`mt-0.5 text-xs ${muted}`}>
                Starts at {formatClassTime(next.start)}
              </p>
            </div>
          ) : todaySessions.length > 0 ? (
            <div>
              <p className="text-sm font-medium text-ink dark:text-night-ink">Today's scheduled classes have finished.</p>
              <p className={`mt-0.5 text-xs ${muted}`}>All periods for {clock.day} are completed.</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-ink dark:text-night-ink">No lectures scheduled for {clock.day}.</p>
              <p className={`mt-0.5 text-xs ${muted}`}>Designated for self-study and lab assignments.</p>
            </div>
          )}
        </div>

        {todaySessions.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle dark:text-night-subtle">
              Today's Periods ({todaySessions.length})
            </p>
            <ul className="mt-2.5 space-y-1.5 text-xs">
              {todaySessions.map((session, idx) => {
                const isLive = sessionStatus(session, clock.minutes) === 'now'
                return (
                  <li
                    key={idx}
                    className={`flex items-center justify-between rounded px-2.5 py-1.5 ${
                      isLive
                        ? 'bg-selected font-medium text-brand dark:bg-night-selected dark:text-night-brand'
                        : session.kind === 'break'
                        ? 'text-subtle/70 bg-soft/30 dark:bg-night-soft/20'
                        : 'text-subtle hover:bg-soft/50 dark:text-night-subtle dark:hover:bg-night-soft/30'
                    }`}
                  >
                    <span className="truncate pr-2">{sessionLabel(mcaSemesterOne, session)}</span>
                    <span className="shrink-0 font-mono text-[11px]">
                      {formatClassTime(session.start)} - {formatClassTime(session.end)}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-line pt-4 dark:border-night-line">
        <Link
          to="/routine"
          className={`inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline dark:text-night-brand ${focus}`}
        >
          <span>Open full weekly timetable</span>
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
