import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, Search, X } from 'lucide-react'
import NoteLinks from '../../../shared/components/NoteLinks'
import { link, eyebrow, muted, focus } from '@/ui/classes'

export default function NoteSidebar({ paper, currentNoteId: _currentNoteId, currentUnitId }) {
  const [topicFilter, setTopicFilter] = useState('')
  const [openUnits, setOpenUnits] = useState(() => (currentUnitId ? [currentUnitId] : []))
  const [prevUnitId, setPrevUnitId] = useState(currentUnitId)

  // Adjust state during render when currentUnitId changes
  if (prevUnitId !== currentUnitId) {
    setPrevUnitId(currentUnitId)
    if (currentUnitId && !openUnits.includes(currentUnitId)) {
      setOpenUnits(prev => [...prev, currentUnitId])
    }
  }

  const toggleUnit = unitId => {
    setOpenUnits(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    )
  }

  const expandAll = () => setOpenUnits(paper.units.map(u => u.id))
  const collapseAll = () => setOpenUnits([])

  const query = topicFilter.trim().toLocaleLowerCase()

  const allMatchingNotesCount = paper.units.reduce((acc, unit) => {
    const matches = unit.notes.filter(
      item => !query || `${item.title} ${item.summary}`.toLocaleLowerCase().includes(query)
    )
    return acc + matches.length
  }, 0)

  return (
    <nav aria-label="Subject notes" className="space-y-4">
      {/* Return to Paper Overview Link */}
      <Link
        className={`${link} inline-flex items-center gap-1.5 text-xs font-semibold sm:text-sm`}
        to={paper.href}
      >
        <ArrowLeft size={14} aria-hidden="true" />
        <span className="line-clamp-1">{paper.title}</span>
      </Link>

      {/* Topic Filter Input */}
      <div className="relative">
        <label htmlFor="topic-search-input" className="sr-only">
          Filter subject topics
        </label>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-subtle dark:text-night-subtle">
          <Search size={14} aria-hidden="true" />
        </div>
        <input
          id="topic-search-input"
          type="search"
          value={topicFilter}
          onChange={e => setTopicFilter(e.target.value)}
          placeholder="Filter topics..."
          className={`min-h-10 w-full rounded-lg border border-line bg-canvas py-2 pr-8 pl-8.5 text-xs text-ink placeholder:text-subtle/70 outline-none transition-colors dark:border-night-line dark:bg-night-canvas dark:text-night-ink dark:placeholder:text-night-subtle/70 ${focus}`}
        />
        {topicFilter && (
          <button
            type="button"
            onClick={() => setTopicFilter('')}
            aria-label="Clear topic search"
            className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-subtle hover:text-ink dark:text-night-subtle dark:hover:text-night-ink"
          >
            <X size={13} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Expand all / Collapse all toolbar */}
      <div className="flex items-center justify-between border-b border-line pb-2.5 text-xs dark:border-night-line">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            className={`text-brand hover:underline dark:text-night-brand ${focus}`}
          >
            Expand all
          </button>
          <span className={muted}>·</span>
          <button
            type="button"
            onClick={collapseAll}
            className={`text-subtle hover:text-ink dark:text-night-subtle dark:hover:text-night-ink ${focus}`}
          >
            Collapse all
          </button>
        </div>
        <span className="font-mono text-[11px] text-subtle dark:text-night-subtle">
          {paper.units.length} {paper.units.length === 1 ? 'unit' : 'units'}
        </span>
      </div>

      {/* Units List */}
      <div className="space-y-3 pt-1">
        {paper.units.map(unit => {
          const matches = unit.notes.filter(
            item => !query || `${item.title} ${item.summary}`.toLocaleLowerCase().includes(query)
          )

          // If searching, hide units that have no matches
          if (query && !matches.length) return null

          // When searching, auto-expand matching units so results are visible
          const isExpanded = query ? true : openUnits.includes(unit.id)
          const isCurrentUnit = unit.id === currentUnitId

          return (
            <section
              key={unit.id}
              className={`rounded-lg border transition-colors ${
                isCurrentUnit
                  ? 'border-brand/40 bg-selected/10 dark:border-night-brand/40 dark:bg-night-selected/10'
                  : 'border-line/70 bg-transparent dark:border-night-line/70'
              }`}
            >
              {/* Collapsible Accordion Header */}
              <button
                type="button"
                onClick={() => toggleUnit(unit.id)}
                aria-expanded={isExpanded}
                className={`group flex w-full items-center justify-between rounded-lg p-2.5 text-left transition-colors hover:bg-soft/70 dark:hover:bg-night-soft/70 ${focus}`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className={`${eyebrow} !mb-0 font-bold text-ink dark:text-night-ink`}>
                      Unit {unit.number}
                    </span>
                    <span className="rounded-full bg-soft px-1.5 py-0.2 text-[10px] font-semibold text-subtle dark:bg-night-soft dark:text-night-subtle">
                      {matches.length}
                    </span>
                  </div>
                  {unit.title && (
                    <p className="mt-0.5 truncate text-xs text-subtle group-hover:text-ink dark:text-night-subtle dark:group-hover:text-night-ink">
                      {unit.title}
                    </p>
                  )}
                </div>

                <span className="flex size-6 shrink-0 items-center justify-center rounded text-subtle transition-colors group-hover:bg-selected group-hover:text-brand dark:text-night-subtle dark:group-hover:bg-night-selected dark:group-hover:text-night-brand">
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-brand dark:text-night-brand' : ''
                    }`}
                    aria-hidden="true"
                  />
                </span>
              </button>

              {/* Collapsible Content */}
              {isExpanded && (
                <div className="border-t border-line/60 p-1.5 dark:border-night-line/60">
                  <NoteLinks sidebar notes={matches} />
                </div>
              )}
            </section>
          )
        })}

        {/* Empty filter state */}
        {query && allMatchingNotesCount === 0 && (
          <p role="status" className={`py-4 text-center text-xs ${muted}`}>
            No topics match "{topicFilter}". Try another keyword.
          </p>
        )}
      </div>
    </nav>
  )
}
