import { BookOpen, GraduationCap, Layers, Award } from 'lucide-react'
import { panel, muted } from '@/ui/classes'

export default function CourseStats({ course }) {
  const totalSemesters = course.semesters.length
  const totalPapers = course.semesters.reduce((acc, sem) => acc + sem.papers.length, 0)
  const totalCredits = course.semesters.reduce((acc, sem) => acc + (sem.credits || 0), 0)
  const publishedNotes = course.noteCount || 0

  const stats = [
    {
      label: 'Curriculum Scope',
      value: `${totalSemesters} Semesters`,
      detail: course.id === 'mca' ? '2-Year PG Degree' : '3-Year UG Degree',
      icon: GraduationCap,
    },
    {
      label: 'Syllabus Papers',
      value: `${totalPapers} Papers`,
      detail: 'Theory & Practical Labs',
      icon: Layers,
    },
    {
      label: 'Academic Credits',
      value: totalCredits ? `${totalCredits} Credits` : 'CBCS Aligned',
      detail: 'Grading Point System',
      icon: Award,
    },
    {
      label: 'Study Material',
      value: publishedNotes > 0 ? `${publishedNotes} Notes` : 'Outlines Ready',
      detail: publishedNotes > 0 ? 'Worked code & topics' : 'Syllabus unit topics',
      icon: BookOpen,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div key={idx} className={`${panel} flex flex-col justify-between p-4 sm:p-5`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold uppercase tracking-wider ${muted}`}>
                {stat.label}
              </span>
              <Icon size={17} className="text-brand dark:text-night-brand" aria-hidden="true" />
            </div>
            <div className="mt-3">
              <p className="font-display text-2xl font-semibold text-ink dark:text-night-ink">
                {stat.value}
              </p>
              <p className={`mt-0.5 text-xs ${muted}`}>{stat.detail}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
