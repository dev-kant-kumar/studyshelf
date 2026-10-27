import { Link } from 'react-router-dom'
import { Download, FlaskConical, Coffee } from 'lucide-react'
import ProfessorPhoto from '../../Professors/ProfessorPhoto'
import { getProfessor, professorHref } from '../../Professors/facultyData'
import {
  days,
  sessionLabel,
  sessionStatus,
  formatClassTime,
  formatDuration,
  minutesOf,
  dayDuration,
  teachers,
} from '../routineData'
import { focus } from '@/ui/classes'

const slots = [
  ['10:30', '11:30'],
  ['11:30', '12:30'],
  ['12:30', '13:30'],
  ['13:30', '14:00'],
  ['14:00', '15:00'],
  ['15:00', '16:00'],
]

export default function WeekTableView({ routine, clock }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3 dark:border-night-line">
        <h2 className="font-display text-xl font-bold text-ink dark:text-night-ink">
          Weekly Master Timetable
        </h2>
        <span className="font-mono text-xs text-subtle dark:text-night-subtle">
          MCA Semester 1 · Regular Schedule
        </span>
      </div>

      <p className="text-[11px] text-subtle sm:hidden dark:text-night-subtle">
        Scroll horizontally to view all periods and faculty details.
      </p>

      <div
        className="overflow-x-auto rounded-xl border border-line bg-surface shadow-xs dark:border-night-line dark:bg-night-surface"
        tabIndex={0}
        role="region"
        aria-label="Weekly timetable, scroll horizontally for all periods"
      >
        <table className="w-full min-w-[1050px] border-collapse text-left text-xs">
          <caption className="sr-only">
            MCA Semester 1 weekly timetable with classroom slots and lab hours
          </caption>

          <thead className="border-b border-line bg-soft/70 dark:border-night-line dark:bg-night-soft/60">
            <tr>
              <th scope="col" className="p-3.5 font-bold text-ink dark:text-night-ink">
                Day
              </th>
              {slots.map(([start, end]) => (
                <th
                  key={start}
                  scope="col"
                  className="p-3.5 font-mono font-semibold text-subtle dark:text-night-subtle"
                >
                  {formatClassTime(start)} - {formatClassTime(end)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {days.slice(0, 6).map(weekday => {
              const isToday = weekday === clock?.day
              const daySessions = routine?.days[weekday] ?? []

              return (
                <tr
                  key={weekday}
                  className={`border-t border-line transition-colors dark:border-night-line ${
                    isToday
                      ? 'bg-selected/30 dark:bg-night-selected/20'
                      : 'hover:bg-soft/30 dark:hover:bg-night-soft/20'
                  }`}
                >
                  {/* Day Column */}
                  <th scope="row" className="p-3.5 align-top font-bold text-ink dark:text-night-ink">
                    <div className="flex items-center gap-1.5">
                      <span>{weekday}</span>
                      {isToday && (
                        <span className="rounded bg-brand px-1 py-0.2 text-[9px] font-bold text-on-brand dark:bg-night-brand dark:text-night-on-brand">
                          Today
                        </span>
                      )}
                    </div>
                    <span className="mt-1 block font-mono text-[10px] font-normal text-subtle dark:text-night-subtle">
                      {formatDuration(dayDuration(daySessions))}
                    </span>
                  </th>

                  {/* Sessions in day */}
                  {daySessions.map(session => {
                    const colSpan = slots.filter(
                      ([start]) =>
                        minutesOf(start) >= minutesOf(session.start) &&
                        minutesOf(start) < minutesOf(session.end)
                    ).length

                    const isLive = isToday && clock && sessionStatus(session, clock.minutes) === 'now'
                    const isBreak = session.kind === 'break'
                    const teacher = session.teacher
                      ? getProfessor(teachers[session.teacher]?.professorId)
                      : null

                    return (
                      <td
                        key={session.start}
                        colSpan={colSpan}
                        className={`border-l border-line p-3 align-top transition-colors dark:border-night-line ${
                          isLive
                            ? 'relative bg-selected/80 ring-2 ring-inset ring-brand dark:bg-night-selected/60 dark:ring-night-brand'
                            : isBreak
                              ? 'bg-soft/50 dark:bg-night-soft/40'
                              : session.kind === 'lab'
                                ? 'bg-purple-500/5 dark:bg-purple-500/10'
                                : ''
                        }`}
                      >
                        {/* Live Now Indicator */}
                        {isLive && (
                          <div className="mb-2">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-brand shadow-xs dark:bg-night-brand dark:text-night-on-brand">
                              <span className="relative flex size-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                                <span className="relative inline-flex size-2 rounded-full bg-white" />
                              </span>
                              <span>Live Now</span>
                            </span>
                          </div>
                        )}

                        <p
                          className={`font-semibold ${
                            isLive
                              ? 'font-bold text-brand dark:text-night-brand'
                              : 'text-ink dark:text-night-ink'
                          }`}
                        >
                          {sessionLabel(routine, session)}
                        </p>

                        {/* Kind Badges */}
                        {session.kind === 'lab' && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded bg-purple-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-purple-700 dark:text-purple-400">
                            <FlaskConical size={10} aria-hidden="true" />
                            <span>Lab · 2 periods</span>
                          </span>
                        )}

                        {isBreak && (
                          <span className="mt-1 inline-flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                            <Coffee size={10} aria-hidden="true" />
                            <span>Recess</span>
                          </span>
                        )}

                        {/* Teacher Link */}
                        {teacher && (
                          <div className="mt-2 flex items-center gap-1.5">
                            <ProfessorPhoto person={teacher} small decorative />
                            <Link
                              to={professorHref(teacher.id)}
                              className={`text-[11px] font-medium text-ink hover:text-brand hover:underline dark:text-night-ink dark:hover:text-night-brand ${focus}`}
                            >
                              {teacher.name}
                            </Link>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-soft/40 p-3.5 text-xs text-subtle dark:border-night-line dark:bg-night-soft/30 dark:text-night-subtle">
          <span>Sunday: No classes listed (Weekly holiday).</span>
          {routine?.source?.href && (
            <a
              href={routine.source.href}
              download="mca-sem1-routine.png"
              className={`inline-flex items-center gap-1 font-semibold text-brand hover:underline dark:text-night-brand ${focus}`}
            >
              <Download size={13} aria-hidden="true" />
              <span>Download original notice scan</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
