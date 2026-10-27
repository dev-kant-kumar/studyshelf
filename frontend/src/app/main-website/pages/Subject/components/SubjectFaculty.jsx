import { Link } from 'react-router-dom'
import { Users, ArrowRight } from 'lucide-react'
import { mcaSemesterOne, teachers } from '../../Routine/routineData'
import { getProfessor, professorHref } from '../../Professors/facultyData'
import ProfessorPhoto from '../../Professors/ProfessorPhoto'
import { panel, focus, muted } from '@/ui/classes'

export default function SubjectFaculty({ course, semester, paper }) {
  const isMcaSem1 = course.id === 'mca' && semester.id === 'sem1'

  let assignedProfessors = []
  if (isMcaSem1) {
    const paperKey = Object.entries(mcaSemesterOne.papers).find(
      ([, mapping]) => mapping.class === paper.id || mapping.lab === paper.id
    )?.[0]

    if (paperKey) {
      const teacherCodes = new Set()
      Object.values(mcaSemesterOne.days).forEach(daySessions => {
        daySessions.forEach(session => {
          if (session.subject === paperKey && session.teacher) {
            teacherCodes.add(session.teacher)
          }
        })
      })

      assignedProfessors = Array.from(teacherCodes)
        .map(code => teachers[code]?.professorId)
        .filter(Boolean)
        .map(getProfessor)
        .filter(Boolean)
    }
  }

  if (assignedProfessors.length > 0) {
    return (
      <div className={`${panel} mb-8 p-5 sm:p-6`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-brand dark:text-night-brand">
            <Users size={18} aria-hidden="true" />
            <h3 className="font-semibold text-ink dark:text-night-ink">
              Department Faculty for this Course
            </h3>
          </div>
          <Link
            to="/professors"
            className={`text-xs font-semibold text-brand hover:underline dark:text-night-brand ${focus}`}
          >
            All faculty & staff
          </Link>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {assignedProfessors.map(prof => (
            <Link
              key={prof.id}
              to={professorHref(prof.id)}
              className="group flex items-center gap-3.5 rounded-lg border border-line bg-soft/30 p-3 transition-colors hover:border-brand/60 hover:bg-surface dark:border-night-line dark:bg-night-soft/20 dark:hover:border-night-brand/60 dark:hover:bg-night-surface"
            >
              <div className="shrink-0">
                <ProfessorPhoto person={prof} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="truncate text-sm font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand">
                  {prof.name}
                </h4>
                <p className={`truncate text-xs ${muted}`}>
                  {prof.designation} · {prof.specialization || 'Computer Applications'}
                </p>
              </div>
              <ArrowRight
                size={15}
                className="shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand dark:text-night-subtle dark:group-hover:text-night-brand"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`${panel} mb-8 flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center sm:p-5`}>
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
          <Users size={17} aria-hidden="true" />
        </span>
        <div>
          <span className="block text-sm font-semibold text-ink dark:text-night-ink">
            Faculty Consultation & Mentorship
          </span>
          <span className={`block text-xs ${muted}`}>
            Connect with department professors for coursework guidance and project approvals.
          </span>
        </div>
      </div>
      <Link
        to="/professors"
        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline dark:text-night-brand ${focus}`}
      >
        <span>View faculty directory</span>
        <ArrowRight size={13} aria-hidden="true" />
      </Link>
    </div>
  )
}
