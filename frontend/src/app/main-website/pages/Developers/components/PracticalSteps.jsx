import { Code2, FolderGit2, Layers, MessageSquareCode } from 'lucide-react'
import { eyebrow, muted } from '@/ui/classes'

const steps = [
  {
    num: '01',
    icon: Code2,
    title: 'Language Fundamentals',
    focus: 'Variables, loops, control flow, functions, and reading runtime stack traces.',
    task: 'Build a CLI marks calculator that gracefully handles non-numeric and out-of-range input.',
  },
  {
    num: '02',
    icon: FolderGit2,
    title: 'Developer Tooling',
    focus: 'Terminal navigation, Git commits, branching, diff reviews, and reproducible READMEs.',
    task: 'Publish your calculator to a Git repository with verified setup instructions and test runs.',
  },
  {
    num: '03',
    icon: Layers,
    title: 'Full-Stack Connection',
    focus: 'Connecting user interface, backend application logic, and persistent relational data.',
    task: 'Turn a campus problem into a working application with database storage and error states.',
  },
  {
    num: '04',
    icon: MessageSquareCode,
    title: 'Engineering Walkthrough',
    focus: 'Explaining design choices, debugging sessions, algorithmic complexity, and trade-offs.',
    task: 'Give a 5-minute technical walkthrough: the user problem, your architecture, and next steps.',
  },
]

export default function PracticalSteps() {
  return (
    <section id="learning-path" aria-labelledby="path-heading" className="scroll-mt-20 mb-12 border-t border-line pt-10 dark:border-night-line">
      <div>
        <p className={eyebrow}>Learning Methodology</p>
        <h2 id="path-heading" className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl dark:text-night-ink">
          Learn a little. Build with it. Repeat.
        </h2>
        <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${muted}`}>
          Start at the first step you cannot complete comfortably. Advance only when you have built its milestone and can explain its technical design.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {steps.map(step => {
          const Icon = step.icon
          return (
            <article
              key={step.num}
              className="flex flex-col justify-between rounded-xl border border-line bg-surface p-4 shadow-xs dark:border-night-line dark:bg-night-surface sm:p-5"
            >
              <div>
                {/* Step badge & icon */}
                <div className="flex items-center justify-between">
                  <span className="flex size-7 items-center justify-center rounded-md bg-selected font-mono text-xs font-bold text-brand dark:bg-night-selected dark:text-night-brand">
                    {step.num}
                  </span>
                  <Icon size={16} className="text-subtle dark:text-night-subtle" aria-hidden="true" />
                </div>

                <h3 className="mt-3 font-display text-base font-bold text-ink dark:text-night-ink">
                  {step.title}
                </h3>

                <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
                  {step.focus}
                </p>
              </div>

              {/* Milestone task */}
              <div className="mt-4 border-t border-line/70 pt-3 dark:border-night-line/70">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-brand dark:text-night-brand">
                  Milestone Task
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink dark:text-night-ink">
                  {step.task}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
