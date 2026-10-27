import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import { panel, focus, muted } from '@/ui/classes'

export default function SemesterCard({ semester }) {
  const coreCount = semester.papers.filter(p => p.kind === 'core' || p.kind === 'foundation').length
  const electiveCount = semester.papers.filter(p => p.kind === 'elective').length
  const labCount = semester.papers.filter(p => p.kind === 'sessional' || p.kind === 'practical' || (p.title && p.title.toLowerCase().includes('lab'))).length
  const previewPapers = semester.papers.slice(0, 4)

  return (
    <Link
      to={semester.href}
      className={`${panel} group flex flex-col justify-between p-4.5 transition-colors hover:border-brand dark:hover:border-night-brand motion-reduce:transition-none sm:p-7 ${focus}`}
    >
      <div>
        <div className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-selected font-mono text-sm font-semibold text-brand dark:bg-night-selected dark:text-night-brand sm:size-11 sm:text-base">
              {String(semester.number).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-display text-lg font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand sm:text-2xl">
                {semester.title}
              </h2>
              <p className={`text-xs ${muted}`}>
                {semester.credits ? `${semester.credits} Credits · ` : ''}
                {semester.papers.length} Total Papers
              </p>
            </div>
          </div>

          {semester.noteCount > 0 ? (
            <span className="shrink-0 rounded-full bg-selected px-2.5 py-0.5 text-xs font-semibold text-brand dark:bg-night-selected dark:text-night-brand">
              {semester.noteCount} Notes
            </span>
          ) : (
            <span className="shrink-0 rounded-full border border-line bg-soft/40 px-2 py-0.5 text-[11px] font-medium text-subtle dark:border-night-line dark:bg-night-soft/40 dark:text-night-subtle">
              Outlines
            </span>
          )}
        </div>

        {/* Paper breakdown pills */}
        <div className="mt-4 flex flex-wrap gap-1.5 text-xs sm:gap-2">
          {coreCount > 0 && (
            <span className="rounded bg-soft px-2 py-0.5 text-subtle dark:bg-night-soft dark:text-night-subtle">
              {coreCount} Theory
            </span>
          )}
          {labCount > 0 && (
            <span className="rounded bg-soft px-2 py-0.5 text-subtle dark:bg-night-soft dark:text-night-subtle">
              {labCount} Labs
            </span>
          )}
          {electiveCount > 0 && (
            <span className="rounded bg-soft px-2 py-0.5 text-subtle dark:bg-night-soft dark:text-night-subtle">
              {electiveCount} Electives
            </span>
          )}
        </div>

        {/* Paper title preview list */}
        <div className="mt-4 border-t border-line/60 pt-3 dark:border-night-line/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-subtle dark:text-night-subtle">
            Coursework papers
          </p>
          <ul className="mt-2 space-y-1.5 text-xs text-subtle dark:text-night-subtle">
            {previewPapers.map(paper => (
              <li key={paper.id} className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-brand/40 dark:bg-night-brand/40" />
                <span className="line-clamp-1">{paper.title}</span>
              </li>
            ))}
            {semester.papers.length > previewPapers.length && (
              <li className="text-[11px] italic text-subtle/80 dark:text-night-subtle/80">
                + {semester.papers.length - previewPapers.length} additional syllabus papers
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4 text-xs font-semibold text-brand dark:border-night-line/60 dark:text-night-brand">
        <span className="flex items-center gap-1.5">
          <BookOpen size={14} aria-hidden="true" />
          <span>Explore Semester {semester.number}</span>
        </span>
        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
          aria-hidden="true"
        />
      </div>
    </Link>
  )
}
