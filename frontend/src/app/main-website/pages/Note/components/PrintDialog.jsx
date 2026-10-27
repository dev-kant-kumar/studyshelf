import { useEffect, useRef } from 'react'
import { FileText, BookOpen, Library, X, Printer, Loader2 } from 'lucide-react'
import { focus, iconButton } from '@/ui/classes'

export default function PrintDialog({
  open,
  onClose,
  note,
  currentUnit,
  paper,
  onPrint,
  isPreparing,
  progressText,
}) {
  const dialog = useRef(null)

  useEffect(() => {
    if (!open) return
    const el = dialog.current
    el?.showModal()
    const wasLocked = document.body.classList.contains('overflow-hidden')
    document.body.classList.add('overflow-hidden')
    return () => {
      el?.close()
      if (!wasLocked) document.body.classList.remove('overflow-hidden')
    }
  }, [open])

  if (!open) return null

  const unitNoteCount = currentUnit?.notes?.length || 1
  const paperNoteCount = paper.units.reduce((acc, u) => acc + u.notes.length, 0)

  return (
    <dialog
      ref={dialog}
      aria-label="Print or Export to PDF"
      className={`fixed inset-0 m-auto w-[min(92vw,560px)] max-w-none rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/60 dark:border-night-line dark:bg-night-surface dark:text-night-ink ${focus}`}
      onCancel={e => {
        e.preventDefault()
        if (!isPreparing) onClose()
      }}
      onClick={e => {
        if (e.target === e.currentTarget && !isPreparing) onClose()
      }}
    >
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-line pb-4 dark:border-night-line">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
                <Printer size={18} aria-hidden="true" />
              </span>
              <h2 className="font-display text-xl font-bold sm:text-2xl">
                Print or Save as PDF
              </h2>
            </div>
            <p className="mt-1 text-xs text-subtle dark:text-night-subtle sm:text-sm">
              Choose the print scope for <span className="font-semibold text-ink dark:text-night-ink">{paper.title}</span> ({paper.code}).
            </p>
          </div>
          <button
            type="button"
            className={iconButton}
            aria-label="Close print options"
            disabled={isPreparing}
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Loading Overlay */}
        {isPreparing ? (
          <div className="py-12 text-center">
            <Loader2 size={36} className="mx-auto animate-spin text-brand dark:text-night-brand" aria-hidden="true" />
            <p className="mt-4 text-base font-semibold text-ink dark:text-night-ink">
              {progressText || 'Preparing print layout...'}
            </p>
            <p className="mt-1 text-xs text-subtle dark:text-night-subtle">
              Loading note components, diagrams, and expanding all question solutions.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {/* Option 1: Current Topic */}
            <button
              type="button"
              onClick={() => onPrint('topic')}
              className={`group flex w-full items-start gap-4 rounded-xl border border-line bg-surface p-4 text-left transition-all hover:border-brand/50 hover:bg-soft/70 dark:border-night-line dark:bg-night-surface dark:hover:border-night-brand/50 dark:hover:bg-night-soft/70 ${focus}`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-soft text-subtle transition-colors group-hover:bg-selected group-hover:text-brand dark:bg-night-soft dark:text-night-subtle dark:group-hover:bg-night-selected dark:group-hover:text-night-brand">
                <FileText size={20} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand text-sm sm:text-base">
                    This Topic Only
                  </span>
                  <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] font-medium text-subtle dark:bg-night-soft dark:text-night-subtle">
                    1 topic
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-subtle dark:text-night-subtle">
                  {note.title}
                </p>
                <p className="mt-1 text-[11px] text-subtle/80 dark:text-night-subtle/80">
                  Prints the currently opened chapter with all solutions expanded.
                </p>
              </div>
            </button>

            {/* Option 2: Complete Unit */}
            {currentUnit && (
              <button
                type="button"
                onClick={() => onPrint('unit')}
                className={`group flex w-full items-start gap-4 rounded-xl border border-line bg-surface p-4 text-left transition-all hover:border-brand/50 hover:bg-soft/70 dark:border-night-line dark:bg-night-surface dark:hover:border-night-brand/50 dark:hover:bg-night-soft/70 ${focus}`}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-soft text-subtle transition-colors group-hover:bg-selected group-hover:text-brand dark:bg-night-soft dark:text-night-subtle dark:group-hover:bg-night-selected dark:group-hover:text-night-brand">
                  <BookOpen size={20} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand text-sm sm:text-base">
                      Complete Unit {currentUnit.number}
                    </span>
                    <span className="rounded-full bg-selected/80 px-2 py-0.5 text-[11px] font-semibold text-brand dark:bg-night-selected/80 dark:text-night-brand">
                      {unitNoteCount} topics
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-subtle dark:text-night-subtle">
                    {currentUnit.title}
                  </p>
                  <p className="mt-1 text-[11px] text-subtle/80 dark:text-night-subtle/80">
                    Prints every topic in Unit {currentUnit.number} sequentially with page breaks between topics.
                  </p>
                </div>
              </button>
            )}

            {/* Option 3: Full Paper Curriculum */}
            <button
              type="button"
              onClick={() => onPrint('paper')}
              className={`group flex w-full items-start gap-4 rounded-xl border border-line bg-surface p-4 text-left transition-all hover:border-brand/50 hover:bg-soft/70 dark:border-night-line dark:bg-night-surface dark:hover:border-night-brand/50 dark:hover:bg-night-soft/70 ${focus}`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-soft text-subtle transition-colors group-hover:bg-selected group-hover:text-brand dark:bg-night-soft dark:text-night-subtle dark:group-hover:bg-night-selected dark:group-hover:text-night-brand">
                <Library size={20} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand text-sm sm:text-base">
                    Full Paper ({paper.code})
                  </span>
                  <span className="rounded-full bg-soft px-2 py-0.5 text-[11px] font-medium text-subtle dark:bg-night-soft dark:text-night-subtle">
                    {paperNoteCount} topics
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs text-subtle dark:text-night-subtle">
                  All {paper.units.length} units in {paper.title}
                </p>
                <p className="mt-1 text-[11px] text-subtle/80 dark:text-night-subtle/80">
                  Full semester exam study booklet covering the complete curriculum.
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Footer info tip */}
        <div className="mt-5 border-t border-line/60 pt-3 text-[11px] text-subtle dark:border-night-line/60 dark:text-night-subtle">
          <p>
            Tip: In your browser print dialog, choose <strong className="text-ink dark:text-night-ink">Save as PDF</strong> to generate an offline study booklet. All question answers and code examples are automatically expanded.
          </p>
        </div>
      </div>
    </dialog>
  )
}
