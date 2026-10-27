import { Terminal, Code2, Hammer, GitBranch, ArrowDown } from 'lucide-react'
import { eyebrow, muted, focus } from '@/ui/classes'

const quickLinks = [
  { label: '4 Roadmaps', href: '#roadmaps' },
  { label: '4-Step Path', href: '#learning-path' },
  { label: '3 Project Briefs', href: '#project-briefs' },
  { label: 'Readiness Audit', href: '#readiness-audit' },
]

const loopSteps = [
  {
    icon: Code2,
    num: '01',
    title: 'Understand',
    desc: 'Clarify the problem, define data inputs, and outline edge cases before writing code.',
  },
  {
    icon: Hammer,
    num: '02',
    title: 'Build (MVP)',
    desc: 'Implement the smallest working slice with tests and strict input validation.',
  },
  {
    icon: GitBranch,
    num: '03',
    title: 'Review & Ship',
    desc: 'Inspect git diff, write reproducible README setup steps, and document trade-offs.',
  },
]

export default function DevelopersHero() {
  return (
    <section className="grid items-center gap-8 pb-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className={eyebrow}>Developer Shelf</p>
        <h1
          tabIndex={-1}
          className="mt-3 font-display text-4xl leading-tight font-bold tracking-tight text-ink sm:text-5xl dark:text-night-ink"
        >
          Build real software <br className="hidden sm:block" />
          beyond coursework.
        </h1>
        <p className={`mt-4 max-w-xl text-base leading-relaxed sm:text-lg ${muted}`}>
          Your university degree builds foundational theory. Turn that foundation into practical skills with focused developer roadmaps, student project briefs, and portfolio milestones.
        </p>

        {/* Quick Jump Action Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {quickLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-soft/70 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:bg-selected hover:text-brand dark:border-night-line dark:bg-night-soft/60 dark:text-night-ink dark:hover:border-night-brand dark:hover:bg-night-selected dark:hover:text-night-brand ${focus}`}
            >
              <span>{link.label}</span>
              <ArrowDown size={13} className="text-subtle dark:text-night-subtle" aria-hidden="true" />
            </a>
          ))}
        </div>

        <p className={`mt-4 text-xs font-medium text-subtle dark:text-night-subtle`}>
          Designed specifically for VBU BCA and MCA students taking their first steps into software engineering.
        </p>
      </div>

      {/* Visual Developer Working Loop Widget */}
      <aside
        aria-label="The developer engineering loop"
        className="overflow-hidden rounded-xl border border-line bg-surface shadow-xs dark:border-night-line dark:bg-night-surface"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-line bg-soft/80 px-4 py-2.5 text-xs font-semibold dark:border-night-line dark:bg-night-soft/60">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-red-400/80" />
              <span className="size-2.5 rounded-full bg-amber-400/80" />
              <span className="size-2.5 rounded-full bg-emerald-400/80" />
            </span>
            <span className="font-mono text-subtle dark:text-night-subtle">
              studyshelf dev --loop
            </span>
          </div>
          <span className="flex items-center gap-1 font-mono text-[11px] text-brand dark:text-night-brand">
            <Terminal size={13} aria-hidden="true" />
            3-Step Cycle
          </span>
        </div>

        {/* Loop Steps */}
        <div className="space-y-4 p-5 sm:p-6">
          {loopSteps.map(({ icon: Icon, num, title, desc }) => (
            <div key={title} className="flex items-start gap-3.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-selected text-xs font-bold text-brand dark:bg-night-selected dark:text-night-brand">
                <Icon size={16} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold text-subtle dark:text-night-subtle">
                    {num}
                  </span>
                  <p className="text-sm font-semibold text-ink dark:text-night-ink">{title}</p>
                </div>
                <p className={`mt-0.5 text-xs leading-relaxed ${muted}`}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Terminal Footer */}
        <div className="border-t border-line bg-soft/30 px-5 py-2.5 font-mono text-[11px] text-brand dark:border-night-line dark:bg-night-soft/20 dark:text-night-brand">
          small commits - working software - steady progress
        </div>
      </aside>
    </section>
  )
}
