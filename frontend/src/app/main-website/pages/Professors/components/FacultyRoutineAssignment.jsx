import { Link } from 'react-router-dom'
import { Clock, ArrowRight, BookOpen, FlaskConical } from 'lucide-react'
import { teachers, mcaSemesterOne, subjects } from '../../Routine/routineData'
import mcaSyllabus from '../../../notesData/MCA/syllabus.js'
import { focus, muted } from '@/ui/classes'

const romanMap = {
  paper1: 'Paper I',
  paper2: 'Paper II',
  paper3: 'Paper III',
  paper4: 'Paper IV',
  paper5: 'Paper V',
  paper6: 'Paper VI',
  paper7: 'Paper VII',
  paper8: 'Paper VIII',
  paper9: 'Paper IX',
}

const sem1Papers = mcaSyllabus.semesters[0].papers
const paperMap = Object.fromEntries(sem1Papers.map(p => [p.id, p]))

export default function FacultyRoutineAssignment({ professorId }) {
  // Resolve assigned sessions from MCA Semester 1 timetable
  const assignments = []
  const seen = new Set()

  for (const [, sessions] of Object.entries(mcaSemesterOne.days)) {
    for (const session of sessions) {
      if (session.teacher && teachers[session.teacher]?.professorId === professorId) {
        const key = `${session.subject}-${session.kind || 'class'}`
        if (!seen.has(key)) {
          seen.add(key)
          const paperSlug =
            session.kind === 'lab'
              ? mcaSemesterOne.papers[session.subject]?.lab
              : mcaSemesterOne.papers[session.subject]?.class

          const paper = paperMap[paperSlug]
          const paperCode = paper?.code ?? session.subject
          const paperRoman = romanMap[paperSlug] ?? ''
          const fullTitle = paper
            ? paper.title.replace(/\s+/g, ' ').trim()
            : subjects[session.subject] || session.subject

          assignments.push({
            subjectCode: session.subject,
            paperCode,
            paperRoman,
            fullTitle,
            kind: session.kind || 'class',
            paperSlug,
            href: paperSlug ? `/courses/mca/semesters/sem1/subjects/${paperSlug}` : null,
          })
        }
      }
    }
  }

  if (!assignments.length) return null

  return (
    <section className="rounded-xl border border-line bg-surface p-6 shadow-xs dark:border-night-line dark:bg-night-surface">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
            <Clock size={16} aria-hidden="true" />
          </span>
          <h2 className="font-display text-lg font-bold text-ink dark:text-night-ink">
            Current Semester Teaching Schedule
          </h2>
        </div>
        <span className="rounded-md bg-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-subtle dark:bg-night-soft dark:text-night-subtle">
          MCA Sem 1
        </span>
      </div>

      <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
        Listed as instructor for the following paper(s) in the active departmental class routine:
      </p>

      <div className="mt-4 space-y-3">
        {assignments.map(item => (
          <div
            key={item.subjectCode + item.kind}
            className="flex flex-col justify-between gap-3 rounded-lg border border-line/70 bg-soft/40 p-3.5 sm:flex-row sm:items-center dark:border-night-line/70 dark:bg-night-soft/30"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-brand dark:text-night-brand">
                  {item.paperRoman ? `${item.paperRoman} (${item.paperCode})` : item.paperCode}
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-subtle dark:bg-night-surface dark:text-night-subtle">
                  {item.kind === 'lab' ? (
                    <>
                      <FlaskConical size={10} aria-hidden="true" />
                      <span>Practical Lab</span>
                    </>
                  ) : item.kind === 'tutorial' ? (
                    <>
                      <BookOpen size={10} aria-hidden="true" />
                      <span>Tutorial Session</span>
                    </>
                  ) : (
                    <>
                      <BookOpen size={10} aria-hidden="true" />
                      <span>Theory Lecture</span>
                    </>
                  )}
                </span>
              </div>
              <h3 className="mt-1 font-display text-base font-bold text-ink dark:text-night-ink">
                {item.fullTitle}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {item.href && (
                <Link
                  to={item.href}
                  className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:hover:border-night-brand dark:hover:text-night-brand ${focus}`}
                >
                  <span>Read Paper Notes</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-line/70 pt-3 dark:border-night-line/70">
        <Link
          to="/routine"
          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-night-brand ${focus}`}
        >
          <span>View weekly lecture routine & periods</span>
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
