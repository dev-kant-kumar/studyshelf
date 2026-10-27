import { Users, GraduationCap, Clock, Award } from 'lucide-react'
import { eyebrow, muted } from '@/ui/classes'

const stats = [
  { label: 'Faculty Members', value: '7', icon: GraduationCap },
  { label: 'Department Staff', value: '4', icon: Users },
  { label: 'Academic Programs', value: 'BCA & MCA', icon: Award },
  { label: 'Live Timetable', value: 'Semester 1', icon: Clock },
]

export default function FacultyHero() {
  return (
    <header className="border-b border-line pb-8 dark:border-night-line">
      <div className="max-w-2xl">
        <p className={eyebrow}>VBU / Department of Computer Applications</p>
        <h1
          tabIndex={-1}
          className="mt-3 font-display text-4xl leading-tight font-bold tracking-tight text-ink sm:text-5xl dark:text-night-ink"
        >
          Faculty and academic staff.
        </h1>
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${muted}`}>
          Meet the professors, course instructors, and support staff guiding BCA and MCA students at Vinoba Bhave University, Hazaribag.
        </p>
      </div>

      {/* 4-Card Metric Strip */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 shadow-xs dark:border-night-line dark:bg-night-surface"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
              <Icon size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg font-bold text-ink dark:text-night-ink">
                {value}
              </p>
              <p className="truncate text-xs font-medium text-subtle dark:text-night-subtle">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </header>
  )
}
