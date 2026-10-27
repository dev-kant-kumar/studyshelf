import { Search, X, RotateCcw } from 'lucide-react'
import { eyebrow, focus } from '@/ui/classes'

export default function CareerFilters({
  query,
  setQuery,
  group,
  setGroup,
  careerGroups,
  careerFields,
  visibleCount,
  reset,
}) {
  const isFiltered = query.trim() !== '' || group !== 'all'

  // Count fields per group
  const groupCounts = careerGroups.reduce((acc, cat) => {
    acc[cat] = careerFields.filter(f => f.group === cat).length
    return acc
  }, {})

  return (
    <div id="filter-bar" className="scroll-mt-20 border-t border-line pt-8 dark:border-night-line">
      {/* Title & Stats */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className={eyebrow}>Explore Your Options</p>
          <h2 id="fields-heading" className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl dark:text-night-ink">
            16 Paths to work in technology.
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <p role="status" className="font-mono text-xs font-semibold text-subtle dark:text-night-subtle">
            Showing {visibleCount} of {careerFields.length} fields
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={reset}
              className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-soft px-2.5 py-1 text-xs font-semibold text-subtle transition-colors hover:text-ink dark:border-night-line dark:bg-night-soft dark:text-night-subtle dark:hover:text-night-ink ${focus}`}
            >
              <RotateCcw size={12} aria-hidden="true" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="mt-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search size={16} className="absolute top-3 left-3.5 text-subtle dark:text-night-subtle" aria-hidden="true" />
          <input
            type="text"
            role="searchbox"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search roles or skills (e.g., Python, SQL, Cloud, SOC Analyst, UX)..."
            aria-label="Search career roles or skills"
            autoComplete="off"
            className={`min-h-11 w-full rounded-xl border border-line bg-surface py-2 pr-10 pl-10 text-sm text-ink outline-none transition-colors placeholder:text-subtle focus:border-brand focus:ring-1 focus:ring-brand dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:placeholder:text-night-subtle dark:focus:border-night-brand dark:focus:ring-night-brand`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute top-3 right-3 text-subtle hover:text-ink dark:text-night-subtle dark:hover:text-night-ink"
              aria-label="Clear search text"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Filter Pills with Counts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setGroup('all')}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${focus} ${
              group === 'all'
                ? 'border-brand bg-brand text-on-brand dark:border-night-brand dark:bg-night-brand dark:text-night-on-brand'
                : 'border-line bg-surface text-subtle hover:border-brand/50 hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:border-night-brand/50 dark:hover:text-night-ink'
            }`}
          >
            <span>All Fields</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                group === 'all'
                  ? 'bg-on-brand/20 text-on-brand dark:bg-night-on-brand/20 dark:text-night-on-brand'
                  : 'bg-soft text-subtle dark:bg-night-soft dark:text-night-subtle'
              }`}
            >
              {careerFields.length}
            </span>
          </button>

          {careerGroups.map(category => {
            const count = groupCounts[category] ?? 0
            const isSelected = group === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => setGroup(category)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${focus} ${
                  isSelected
                    ? 'border-brand bg-brand text-on-brand dark:border-night-brand dark:bg-night-brand dark:text-night-on-brand'
                    : 'border-line bg-surface text-subtle hover:border-brand/50 hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:border-night-brand/50 dark:hover:text-night-ink'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isSelected
                      ? 'bg-on-brand/20 text-on-brand dark:bg-night-on-brand/20 dark:text-night-on-brand'
                      : 'bg-soft text-subtle dark:bg-night-soft dark:text-night-subtle'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
