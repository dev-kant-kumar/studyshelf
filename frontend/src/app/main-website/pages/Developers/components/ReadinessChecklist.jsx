import { useState } from 'react'
import { CheckCircle2, RotateCcw, Award } from 'lucide-react'
import { eyebrow, muted, focus } from '@/ui/classes'

const checklistItems = [
  {
    id: 'feature',
    title: 'Independent implementation',
    desc: 'I built the core logic myself without copy-pasting an entire boilerplate tutorial.',
  },
  {
    id: 'git',
    title: 'Clean version history',
    desc: 'I used meaningful Git commits and can explain each code change using diffs.',
  },
  {
    id: 'readme',
    title: 'Reproducible documentation',
    desc: 'Someone else can clone the repo and run the project following the README steps.',
  },
  {
    id: 'errors',
    title: 'Defensive validation',
    desc: 'I explicitly tested invalid inputs, empty states, network timeouts, and errors.',
  },
  {
    id: 'explaining',
    title: 'Technical articulation',
    desc: 'I can explain one architecture decision, one trade-off made, and one bug I resolved.',
  },
  {
    id: 'roadmap',
    title: 'Future roadmap',
    desc: 'I have a clear list of what I would refactor, optimize, or build next.',
  },
]

export default function ReadinessChecklist() {
  const [checkedIds, setCheckedIds] = useState(new Set())

  const toggle = id => {
    setCheckedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const reset = () => setCheckedIds(new Set())

  const total = checklistItems.length
  const completed = checkedIds.size
  const percentage = Math.round((completed / total) * 100)
  const isAllComplete = completed === total

  return (
    <section
      id="readiness-audit"
      aria-labelledby="check-heading"
      className="scroll-mt-20 mb-12 rounded-xl border border-line bg-surface p-6 shadow-xs sm:p-8 dark:border-night-line dark:bg-night-surface"
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className={eyebrow}>Portfolio Audit</p>
          <h2
            id="check-heading"
            className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl dark:text-night-ink"
          >
            Is your project ready to showcase?
          </h2>
          <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
            Use this 6-point checklist to audit your code before adding it to your resume or presenting it in a technical interview.
          </p>

          {/* Progress Card */}
          <div className="mt-6 rounded-lg border border-line bg-soft/60 p-4 dark:border-night-line dark:bg-night-soft/40">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-ink dark:text-night-ink">
                Audit Progress: {completed} of {total} checked
              </span>
              <span className="font-mono text-brand dark:text-night-brand">{percentage}%</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-line dark:bg-night-line">
              <div
                className="h-full rounded-full bg-brand transition-all duration-300 dark:bg-night-brand"
                style={{ width: `${percentage}%` }}
              />
            </div>

            {isAllComplete ? (
              <div className="mt-4 flex items-center gap-2 rounded-md bg-emerald-500/10 p-2.5 text-xs font-semibold text-emerald-800 dark:text-emerald-400">
                <Award size={16} className="shrink-0" aria-hidden="true" />
                <span>All checks passed! Your project is interview-ready.</span>
              </div>
            ) : (
              <p className={`mt-3 text-xs ${muted}`}>
                Check each item as you review your code and repository.
              </p>
            )}

            {completed > 0 && (
              <button
                type="button"
                onClick={reset}
                className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-subtle transition-colors hover:text-ink dark:text-night-subtle dark:hover:text-night-ink ${focus}`}
              >
                <RotateCcw size={12} aria-hidden="true" />
                <span>Reset checklist</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Checkbox Items */}
        <fieldset>
          <legend className="sr-only">Project readiness checklist</legend>
          <div className="space-y-2.5">
            {checklistItems.map(item => {
              const isChecked = checkedIds.has(item.id)
              return (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors ${
                    isChecked
                      ? 'border-brand/50 bg-selected/50 dark:border-night-brand/50 dark:bg-night-selected/40'
                      : 'border-line/70 bg-surface hover:bg-soft/70 dark:border-night-line/70 dark:bg-night-surface dark:hover:bg-night-soft/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(item.id)}
                    className={`mt-0.5 size-4 shrink-0 rounded accent-brand ${focus}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-bold ${
                        isChecked
                          ? 'text-brand line-through dark:text-night-brand'
                          : 'text-ink dark:text-night-ink'
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className={`mt-0.5 text-xs leading-relaxed ${muted}`}>{item.desc}</p>
                  </div>
                  {isChecked && (
                    <CheckCircle2
                      size={15}
                      className="shrink-0 text-brand dark:text-night-brand"
                      aria-hidden="true"
                    />
                  )}
                </label>
              )
            })}
          </div>
        </fieldset>
      </div>
    </section>
  )
}
