import { Search, Code2, Milestone } from 'lucide-react'
import { muted } from '@/ui/classes'

const steps = [
  {
    num: '01',
    icon: Search,
    title: 'Survey the Roles',
    desc: 'Review day-to-day responsibilities, titles, and starting skills across software, data, security, and cloud.',
  },
  {
    num: '02',
    icon: Code2,
    title: 'Try a Starter Project',
    desc: 'Build a focused, mini capstone project to test your genuine interest before committing to a multi-month roadmap.',
  },
  {
    num: '03',
    icon: Milestone,
    title: 'Choose One Focus',
    desc: 'Select a primary learning path, build practical milestones, and reinforce concepts with your university coursework.',
  },
]

export default function CareerStrategy() {
  return (
    <section
      id="strategy"
      aria-label="How to choose a career path"
      className="scroll-mt-20 py-8"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map(step => {
          const Icon = step.icon
          return (
            <div
              key={step.num}
              className="rounded-xl border border-line bg-surface p-5 shadow-xs dark:border-night-line dark:bg-night-surface"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-7 items-center justify-center rounded-md bg-selected font-mono text-xs font-bold text-brand dark:bg-night-selected dark:text-night-brand">
                  {step.num}
                </span>
                <Icon size={16} className="text-subtle dark:text-night-subtle" aria-hidden="true" />
              </div>
              <h2 className="mt-3 font-display text-base font-bold text-ink dark:text-night-ink">
                {step.title}
              </h2>
              <p className={`mt-1.5 text-xs leading-relaxed ${muted}`}>
                {step.desc}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
