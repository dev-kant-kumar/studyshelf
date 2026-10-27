import { ArrowRight, BookOpen } from 'lucide-react'
import Illustration from '../../../shared/components/Illustration'
import { careerIllustrations } from '../careerIllustrations'
import { focus } from '@/ui/classes'

export default function CareerCard({ field, onSelect }) {
  const hasRoadmaps = Boolean(field.roadmaps?.length)

  return (
    <article id={field.id} className="scroll-mt-24 h-full">
      <button
        type="button"
        onClick={() => onSelect(field)}
        aria-haspopup="dialog"
        aria-label={`Explore career details for ${field.name}`}
        className={`group flex h-full w-full flex-col justify-between rounded-xl border border-line bg-surface p-5 text-left shadow-xs transition-all hover:border-brand hover:shadow-md dark:border-night-line dark:bg-night-surface dark:hover:border-night-brand motion-reduce:transition-none ${focus}`}
      >
        <div>
          {/* Group & Roadmap Badge */}
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-md bg-soft px-2 py-0.5 text-[11px] font-semibold text-subtle dark:bg-night-soft dark:text-night-subtle">
              {field.group}
            </span>
            {hasRoadmaps && (
              <span className="inline-flex items-center gap-1 rounded-md bg-selected px-2 py-0.5 text-[10px] font-bold text-brand dark:bg-night-selected dark:text-night-brand">
                <BookOpen size={11} aria-hidden="true" />
                <span>Roadmap</span>
              </span>
            )}
          </div>

          {/* Illustration Container */}
          <div className="mt-4 flex h-36 w-full items-center justify-center rounded-lg bg-soft/40 p-2 dark:bg-night-soft/40">
            <Illustration
              name={careerIllustrations[field.id]}
              sizes="(min-width: 1024px) 200px, (min-width: 640px) 240px, 200px"
              className="w-full max-w-[200px] [&_img]:max-h-32"
            />
          </div>

          {/* Name & Summary */}
          <h4 className="mt-4 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand">
            {field.name}
          </h4>
          <p className="mt-1.5 text-xs leading-relaxed text-subtle line-clamp-2 dark:text-night-subtle">
            {field.summary}
          </p>

          {/* Roles Preview Pills */}
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {field.roles.slice(0, 3).map(role => (
              <span
                key={role}
                className="rounded-md border border-line/70 bg-soft/50 px-2 py-0.5 text-[11px] font-medium text-ink dark:border-night-line/70 dark:bg-night-soft/40 dark:text-night-ink"
              >
                {role}
              </span>
            ))}
            {field.roles.length > 3 && (
              <span className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-subtle dark:text-night-subtle">
                +{field.roles.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Card Footer Action */}
        <div className="mt-5 flex items-center justify-between border-t border-line/70 pt-3 text-xs font-semibold text-brand dark:border-night-line/70 dark:text-night-brand">
          <span>View details & starter project</span>
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
            aria-hidden="true"
          />
        </div>
      </button>
    </article>
  )
}
