import { Award, FileText, CheckCircle2, BookOpen } from 'lucide-react'
import { panel, muted } from '@/ui/classes'

export default function SubjectStats({ paper }) {
  const isLab =
    paper.kind === 'sessional' ||
    paper.kind === 'practical' ||
    (paper.title && paper.title.toLowerCase().includes('lab'))
  const totalMarks = paper.marks ?? 100
  const examMarks = paper.examMarks ?? (isLab ? 50 : 70)
  const internalMarks = totalMarks - examMarks > 0 ? totalMarks - examMarks : 30
  const credits = paper.credits ?? (isLab ? 2 : 4)

  const stats = [
    {
      label: 'Paper Credits',
      value: `${credits} Credits`,
      detail: isLab ? 'Practical Laboratory' : 'Core Theory Paper',
      icon: Award,
    },
    {
      label: 'End-Sem Exam',
      value: `${examMarks} Marks`,
      detail: 'External University Written',
      icon: FileText,
    },
    {
      label: 'Internal Sessional',
      value: `${internalMarks} Marks`,
      detail: 'Departmental Evaluation',
      icon: CheckCircle2,
    },
    {
      label: 'Study Material',
      value: paper.noteCount > 0 ? `${paper.noteCount} Notes` : 'Outlines Ready',
      detail: paper.units.length > 0 ? `${paper.units.length} Syllabus Units` : 'Lab Guidance Ready',
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
