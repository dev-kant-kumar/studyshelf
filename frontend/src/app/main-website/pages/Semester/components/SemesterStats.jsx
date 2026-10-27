import { Layers, Award, BookOpen, Clock } from 'lucide-react'
import { panel, muted } from '@/ui/classes'

export default function SemesterStats({ semester }) {
  const totalPapers = semester.papers.length
  const totalCredits = semester.credits || 0
  const coreCount = semester.papers.filter(p => p.kind === 'core' || p.kind === 'foundation').length
  const labCount = semester.papers.filter(p => p.kind === 'sessional' || p.kind === 'practical' || (p.title && p.title.toLowerCase().includes('lab'))).length
  const publishedNotes = semester.noteCount || 0

  const stats = [
    {
      label: 'Semester Papers',
      value: `${totalPapers} Papers`,
      detail: `${coreCount} Theory · ${labCount} Labs`,
      icon: Layers,
    },
    {
      label: 'Semester Credits',
      value: totalCredits ? `${totalCredits} Credits` : 'CBCS Aligned',
      detail: 'Grading Point Weightage',
      icon: Award,
    },
    {
      label: 'Exam Scheme',
      value: '70 / 30 Scheme',
      detail: '70 External · 30 Sessional',
      icon: Clock,
    },
    {
      label: 'Study Material',
      value: publishedNotes > 0 ? `${publishedNotes} Notes` : 'Outlines Ready',
      detail: publishedNotes > 0 ? 'Worked code & topics' : 'Syllabus unit topics',
      icon: BookOpen,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div key={idx} className={`${panel} flex flex-col justify-between p-3.5 sm:p-5`}>
            <div className="flex items-center justify-between gap-1.5">
              <span className={`text-[11px] font-semibold uppercase tracking-wider ${muted} sm:text-xs`}>
                {stat.label}
              </span>
              <Icon size={16} className="shrink-0 text-brand dark:text-night-brand sm:size-[17px]" aria-hidden="true" />
            </div>
            <div className="mt-2.5 sm:mt-3">
              <p className="font-display text-xl font-semibold text-ink dark:text-night-ink sm:text-2xl">
                {stat.value}
              </p>
              <p className={`mt-0.5 text-xs leading-snug ${muted}`}>{stat.detail}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
