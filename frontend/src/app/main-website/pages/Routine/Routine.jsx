import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarDays, Calendar, LayoutGrid } from 'lucide-react'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import DocumentHead from '../../shared/components/DocumentHead'
import {
  routineCourses,
  days,
  getRoutine,
  getIndiaClock,
  sessionStatus,
} from './routineData'
import RoutineHeader from './components/RoutineHeader'
import LiveSessionBanner from './components/LiveSessionBanner'
import DayScheduleView from './components/DayScheduleView'
import WeekTableView from './components/WeekTableView'
import { muted, focus } from '@/ui/classes'

export default function Routine() {
  const [params, setParams] = useSearchParams()
  const [clock, setClock] = useState(null)

  useEffect(() => {
    const update = () => setClock(getIndiaClock())
    update()
    const timer = setInterval(update, 30000)
    window.addEventListener('focus', update)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', update)
    }
  }, [])

  const course =
    routineCourses.find(item => item.id === params.get('course')) ?? routineCourses[0]
  const semester = course.semesters.includes(Number(params.get('semester')))
    ? Number(params.get('semester'))
    : 1
  const routine = getRoutine(course.id, semester)
  const isWeekly = params.get('view') === 'week'

  // Default day to India Standard Time today if valid weekday, else Monday
  const day = days.includes(params.get('day')) ? params.get('day') : clock?.day ?? 'Monday'

  const current =
    clock &&
    routine?.days[clock.day]?.find(session => sessionStatus(session, clock.minutes) === 'now')
  const next =
    clock &&
    routine?.days[clock.day]?.find(
      session => sessionStatus(session, clock.minutes) === 'upcoming' && session.kind !== 'break'
    )

  function change(values) {
    const nextParams = new URLSearchParams(params)
    for (const [key, value] of Object.entries(values)) {
      if (value == null) nextParams.delete(key)
      else nextParams.set(key, String(value))
    }
    setParams(nextParams, { preventScrollReset: true })
  }

  return (
    <CatalogueLayout>
      <DocumentHead
        title="VBU MCA & BCA Class Routine - Live Timetable"
        description="Check your daily lecture routine, classroom periods, live class tracker, and weekly timetable for VBU Department of Computer Applications."
        path="/routine"
      />

      <Breadcrumbs items={[{ label: 'Class routine' }]} />

      {/* Header with Title & Compact Selector */}
      <RoutineHeader
        routineCourses={routineCourses}
        course={course}
        semester={semester}
        routine={routine}
        onChange={change}
      />

      {/* Routine Content */}
      <div className="mt-8">
        {!routine ? (
          <section className="rounded-xl border border-line bg-surface p-8 text-center shadow-xs dark:border-night-line dark:bg-night-surface">
            <CalendarDays
              size={36}
              className="mx-auto text-brand dark:text-night-brand"
              aria-hidden="true"
            />
            <h2 className="mt-3 font-display text-2xl font-bold text-ink dark:text-night-ink">
              {course.label} Semester {semester} routine not published yet
            </h2>
            <p className={`mx-auto mt-2 max-w-md text-xs leading-relaxed ${muted}`}>
              The university department has only published the active schedule for MCA Semester 1. Timetables for other semesters will appear here as soon as notified.
            </p>
            <button
              type="button"
              onClick={() => change({ course: 'mca', semester: 1 })}
              className={`mt-5 inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-on-brand transition-opacity hover:opacity-95 dark:bg-night-brand dark:text-night-on-brand ${focus}`}
            >
              <span>View MCA Semester 1 Timetable</span>
            </button>
          </section>
        ) : (
          <>
            {/* View Switcher: Day View vs Full Week */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold text-ink dark:text-night-ink sm:text-xl">
                  {course.label} Semester {semester}
                </span>
                <span className="rounded-md bg-selected px-2 py-0.5 text-xs font-bold text-brand dark:bg-night-selected dark:text-night-brand">
                  Live Timetable
                </span>
              </div>

              {/* View Toggle Buttons */}
              <div
                className="grid grid-cols-2 rounded-lg border border-line bg-soft/50 p-1 dark:border-night-line dark:bg-night-soft/40 sm:inline-flex sm:w-auto"
                role="group"
                aria-label="Timetable view mode"
              >
                <button
                  type="button"
                  aria-pressed={!isWeekly}
                  onClick={() => change({ view: null })}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${focus} ${
                    !isWeekly
                      ? 'bg-surface text-ink shadow-xs dark:bg-night-surface dark:text-night-ink'
                      : 'text-subtle hover:text-ink dark:text-night-subtle dark:hover:text-night-ink'
                  }`}
                >
                  <Calendar size={13} aria-hidden="true" />
                  <span>Day view</span>
                </button>

                <button
                  type="button"
                  aria-pressed={isWeekly}
                  onClick={() => change({ view: 'week' })}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${focus} ${
                    isWeekly
                      ? 'bg-surface text-ink shadow-xs dark:bg-night-surface dark:text-night-ink'
                      : 'text-subtle hover:text-ink dark:text-night-subtle dark:hover:text-night-ink'
                  }`}
                >
                  <LayoutGrid size={13} aria-hidden="true" />
                  <span>Full week</span>
                </button>
              </div>
            </div>

            {/* Live Session Tracker Widget */}
            <LiveSessionBanner
              routine={routine}
              clock={clock}
              current={current}
              next={next}
            />

            {/* View Mode: Day View or Weekly Master Table */}
            {isWeekly ? (
              <WeekTableView routine={routine} clock={clock} />
            ) : (
              <DayScheduleView
                routine={routine}
                day={day}
                clock={clock}
                onChange={change}
              />
            )}

            {/* Footer Disclaimer & Official Notice Info */}
            <div className="mt-8 rounded-xl border border-line bg-soft/40 p-4 text-xs leading-relaxed text-subtle dark:border-night-line dark:bg-night-soft/30 dark:text-night-subtle">
              <span className="font-semibold text-ink dark:text-night-ink">Official source: </span>
              Transcribed from the Department of Computer Applications MCA-I official notification. Routine timing follows India Standard Time (IST). Academic holiday notices and ad-hoc university cancellations are not reflected automatically.
            </div>
          </>
        )}
      </div>
    </CatalogueLayout>
  )
}
