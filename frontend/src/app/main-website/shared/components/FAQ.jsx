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
  function toggle(id) { setExpanded(current => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next }) }
  return <section className="my-10" aria-labelledby={`${prefix}-title`}>
    <h2 id={`${prefix}-title`}>{title}</h2>
    {description && <p className={muted}>{description}</p>}
    {showGuide && <p className={`font-sans text-sm ${muted}`}>Easy: explain the idea. Medium: apply or compare it. Hard: analyse assumptions and trade-offs. Tags describe the question’s purpose; interview questions are original practice, not claims about a specific employer.</p>}
    <div className="my-6 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface dark:divide-night-line dark:border-night-line dark:bg-night-surface">
      {items.map(item => {
        const open = expanded.has(item.id), questionId = `${prefix}-${item.id}-question`, answerId = `${prefix}-${item.id}-answer`
        return <div key={item.id}>
          <button id={questionId} type="button" aria-expanded={open} aria-controls={answerId} onClick={() => toggle(item.id)} className={`flex min-h-16 w-full items-start justify-between gap-4 px-5 py-5 text-left font-sans transition-colors hover:bg-soft dark:hover:bg-night-soft motion-reduce:transition-none ${focus.replace('outline-offset-4', '-outline-offset-4')}`}>
            <span className="min-w-0"><span className="block text-base font-semibold leading-relaxed sm:text-lg">{item.question}</span><span className="mt-3 flex flex-wrap gap-2"><span className={`rounded-md px-2 py-1 text-xs font-semibold capitalize ${levels[item.level] || levels.medium}`}>{item.level}</span>{item.tags.map(tag => <span key={tag} className="rounded-md border border-line px-2 py-1 text-xs text-subtle dark:border-night-line dark:text-night-subtle">{tag}</span>)}</span></span>
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-selected text-brand dark:bg-night-selected dark:text-night-brand print:hidden">{open ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}</span>
          </button>
          <div id={answerId} aria-labelledby={questionId} hidden={!open} className="border-t border-line px-5 pb-5 text-base leading-relaxed dark:border-night-line print:block">{item.answer}</div>
        </div>
      })}
    </div>
  </section>
}
