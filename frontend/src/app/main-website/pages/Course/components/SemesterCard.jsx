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
      className={`${panel} group flex flex-col justify-between p-6 transition-colors hover:border-brand dark:hover:border-night-brand motion-reduce:transition-none sm:p-7 ${focus}`}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-selected font-mono text-base font-semibold text-brand dark:bg-night-selected dark:text-night-brand">
              {String(semester.number).padStart(2, '0')}
            </span>
            <div>
              <h2 className="font-display text-xl font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand sm:text-2xl">
                {semester.title}
              </h2>
              <p className={`text-xs ${muted}`}>
                {semester.credits ? `${semester.credits} Credits · ` : ''}
                {semester.papers.length} Total Papers
              </p>
            </div>
          </div>

          {semester.noteCount > 0 ? (
            <span className="rounded-full bg-selected px-2.5 py-0.5 text-xs font-semibold text-brand dark:bg-night-selected dark:text-night-brand">
              {semester.noteCount} Notes
            </span>
          ) : (
            <span className="rounded-full border border-line bg-soft/40 px-2 py-0.5 text-[11px] font-medium text-subtle dark:border-night-line dark:bg-night-soft/40 dark:text-night-subtle">
              Outlines
            </span>
          )}
        </div>

        {/* Paper breakdown breakdown pills */}
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
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

        {/* Sample Subjects in this Semester */}
        <div className="mt-4 space-y-1">
          <p className={`text-[11px] font-semibold uppercase tracking-wider ${muted}`}>
            Subjects include:
          </p>
          <ul className="space-y-1 text-xs">
            {previewPapers.map(paper => (
              <li key={paper.id} className="truncate text-subtle dark:text-night-subtle">
                <span className="font-medium text-ink dark:text-night-ink">{paper.code || paper.id.toUpperCase()}:</span>{' '}
                {paper.title}
              </li>
            ))}
            {semester.papers.length > previewPapers.length && (
              <li className={`text-[11px] italic ${muted}`}>
                + {semester.papers.length - previewPapers.length} more papers
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className={`mt-6 flex items-center justify-between border-t border-line pt-4 text-xs dark:border-night-line ${muted}`}>
        <div className="flex items-center gap-1.5">
          <BookOpen size={14} aria-hidden="true" />
          <span>
            {semester.noteCount > 0
              ? `${semester.noteCount} published study chapters`
              : 'Syllabus outlines & unit topics ready'}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 font-semibold text-brand dark:text-night-brand">
          <span>Browse subjects</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
