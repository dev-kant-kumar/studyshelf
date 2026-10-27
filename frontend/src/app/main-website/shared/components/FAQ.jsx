import { useId, useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { focus, muted } from '@/ui/classes'

const levels = {
  easy: 'bg-selected text-brand dark:bg-night-selected dark:text-night-brand',
  medium: 'bg-accent-soft text-accent dark:bg-night-accent-soft dark:text-night-accent',
  hard: 'bg-soft text-ink dark:bg-night-soft dark:text-night-ink',
}

export default function FAQ({ items, title = 'Questions and answers', description, showGuide = true }) {
  const prefix = useId()
  const [expanded, setExpanded] = useState(() => new Set())
  function toggle(id) {
    setExpanded(current => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section className="my-10 print:my-4" aria-labelledby={`${prefix}-title`}>
      <h2 id={`${prefix}-title`} className="print:text-lg print:font-bold print:text-black">
        {title}
      </h2>
      {description && <p className={`${muted} print:text-gray-700 print:text-xs`}>{description}</p>}
      {showGuide && (
        <p className={`font-sans text-sm ${muted} print:hidden`}>
          Easy: explain the idea. Medium: apply or compare it. Hard: analyse assumptions and trade-offs. Tags describe the question's purpose; interview questions are original practice, not claims about a specific employer.
        </p>
      )}
      <div className="my-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface dark:divide-night-line dark:border-night-line dark:bg-night-surface print:my-2.5 print:divide-y print:divide-gray-300 print:overflow-visible print:rounded-none print:border print:border-gray-300 print:bg-white print:text-black">
        {items.map(item => {
          const open = expanded.has(item.id)
          const questionId = `${prefix}-${item.id}-question`
          const answerId = `${prefix}-${item.id}-answer`
          return (
            <div key={item.id} className="print:break-inside-avoid">
              <button
                id={questionId}
                type="button"
                aria-expanded={open}
                aria-controls={answerId}
                onClick={() => toggle(item.id)}
                className={`flex min-h-16 w-full items-start justify-between gap-4 px-5 py-5 text-left font-sans transition-colors hover:bg-soft dark:hover:bg-night-soft motion-reduce:transition-none print:min-h-0 print:py-2 print:px-3 print:hover:bg-transparent ${focus.replace(
                  'outline-offset-4',
                  '-outline-offset-4'
                )}`}
              >
                <span className="min-w-0">
                  <span className="block text-base font-semibold leading-relaxed sm:text-lg print:text-xs print:font-bold print:leading-snug print:text-black">
                    {item.question}
                  </span>
                  <span className="mt-3 flex flex-wrap gap-2 print:mt-1 print:gap-1">
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold capitalize print:border print:border-gray-300 print:bg-gray-100 print:px-1.5 print:py-0.5 print:text-[10px] print:text-black ${
                        levels[item.level] || levels.medium
                      }`}
                    >
                      {item.level}
                    </span>
                    {item.tags.map(tag => (
                      <span
                        key={tag}
                        className="rounded-md border border-line px-2 py-1 text-xs text-subtle dark:border-night-line dark:text-night-subtle print:border-gray-300 print:bg-white print:px-1.5 print:py-0.5 print:text-[10px] print:text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-selected text-brand dark:bg-night-selected dark:text-night-brand print:hidden">
                  {open ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
                </span>
              </button>

              {/* In print, answer is always fully expanded and visible */}
              <div
                id={answerId}
                aria-labelledby={questionId}
                className={`border-t border-line px-5 pt-3 pb-5 text-base leading-relaxed dark:border-night-line print:!block print:!border-t print:!border-gray-300 print:!bg-gray-50/50 print:!px-3 print:!py-2 print:!text-xs print:!leading-normal print:!text-black ${
                  open ? 'block' : 'hidden print:!block'
                }`}
              >
                <div className="hidden print:block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">
                  Answer:
                </div>
                {item.answer}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
