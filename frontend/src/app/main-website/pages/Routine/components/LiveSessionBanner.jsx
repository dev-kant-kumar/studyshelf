import { Link } from 'react-router-dom'
import { Clock, ArrowRight, BookOpen, Coffee, CheckCircle2 } from 'lucide-react'
import ProfessorPhoto from '../../Professors/ProfessorPhoto'
import { getProfessor, professorHref } from '../../Professors/facultyData'
import { teachers, sessionLabel, formatClassTime } from '../routineData'
import { focus } from '@/ui/classes'

export default function LiveSessionBanner({
  routine,
  clock,
  current,
  next,
}) {
  if (!clock) return null

  const isTodayClassesListed = Boolean(routine?.days[clock.day]?.length)
  const activeSession = current || next

  // Resolve paper link if activeSession corresponds to an academic paper
  let paperLink = null
  if (activeSession && routine?.papers && activeSession.kind !== 'break') {
    const paperId =
      routine.papers[activeSession.subject]?.[activeSession.kind] ??
      routine.papers[activeSession.subject]?.class
    if (paperId) {
      paperLink = `/courses/${routine.course}/semesters/sem${routine.semester}/subjects/${paperId}`
    }
  }

  const teacher = activeSession?.teacher
    ? getProfessor(teachers[activeSession.teacher]?.professorId)
    : null

  return (
    <aside
      aria-label="Live class schedule status"
      className="mb-8 overflow-hidden rounded-xl border border-brand/40 bg-selected/40 shadow-xs dark:border-night-brand/40 dark:bg-night-selected/30"
    >
      {/* Top Banner Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand/20 bg-brand/10 px-4 py-2 text-xs font-semibold dark:border-night-brand/20 dark:bg-night-brand/15">
        <div className="flex items-center gap-2">
          {current ? (
            <>
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Live Class in Progress
              </span>
            </>
          ) : next ? (
            <>
              <span className="size-2 rounded-full bg-brand dark:bg-night-brand" />
              <span className="font-bold uppercase tracking-wider text-brand dark:text-night-brand">
                Next Up Today
              </span>
            </>
          ) : isTodayClassesListed ? (
            <>
              <CheckCircle2 size={13} className="text-subtle dark:text-night-subtle" aria-hidden="true" />
              <span className="text-subtle dark:text-night-subtle">
                Today's scheduled classes have finished
              </span>
            </>
          ) : (
            <>
              <Clock size={13} className="text-subtle dark:text-night-subtle" aria-hidden="true" />
              <span className="text-subtle dark:text-night-subtle">
                No classes scheduled for {clock.day}
              </span>
            </>
          )}
        </div>

        <span className="font-mono text-[11px] text-subtle dark:text-night-subtle">
          {clock.day}, {clock.date} · IST
        </span>
      </div>

      {/* Main Body */}
      {activeSession ? (
        <div className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-subtle dark:text-night-subtle">
              <Clock size={14} className="text-brand dark:text-night-brand" aria-hidden="true" />
              <time className="font-mono">
                {formatClassTime(activeSession.start)} - {formatClassTime(activeSession.end)}
              </time>
              {current && (
                <span className="rounded bg-brand/15 px-1.5 py-0.2 text-[10px] font-bold text-brand dark:bg-night-brand/25 dark:text-night-brand">
                  Until {formatClassTime(activeSession.end)}
                </span>
              )}
            </div>

            <h3 className="mt-1.5 font-display text-lg font-bold text-ink dark:text-night-ink sm:text-xl">
              {sessionLabel(routine, activeSession)}
            </h3>

            {teacher && (
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
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

            {activeSession.kind === 'break' && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-subtle dark:text-night-subtle">
                <Coffee size={14} aria-hidden="true" />
                <span>Mid-day recess. Classes resume at {formatClassTime(activeSession.end)}.</span>
              </div>
            )}
          </div>

          {paperLink && (
            <Link
              to={paperLink}
              className={`inline-flex w-full shrink-0 items-center justify-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-xs font-semibold text-on-brand shadow-xs transition-opacity hover:opacity-95 dark:bg-night-brand dark:text-night-on-brand sm:w-auto sm:py-2 ${focus}`}
            >
              <BookOpen size={14} aria-hidden="true" />
              <span>Read Paper Notes</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          )}
        </div>
      ) : (
        <div className="p-5 text-center text-xs text-subtle dark:text-night-subtle">
          Check the daily schedule below to prepare for your upcoming lectures.
        </div>
      )}
    </aside>
  )
}
