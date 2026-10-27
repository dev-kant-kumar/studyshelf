import { Search, X, LayoutGrid, Table } from 'lucide-react'
import Dropdown from '@/ui/Dropdown'
import { focus } from '@/ui/classes'
import { holidayMonths, holidayCategories } from '../holidayData'

const monthOptions = [
  { value: '', label: 'All 12 Months' },
  ...holidayMonths.map(month => ({ value: month, label: month })),
]

export default function HolidayFilters({
  query,
  onQueryChange,
  selectedMonth,
  onMonthChange,
  selectedCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  totalMatching,
}) {
  const hasFilters = Boolean(query || selectedMonth || selectedCategory !== 'all')

  function clearAll() {
    onQueryChange('')
    onMonthChange('')
    onCategoryChange('all')
  }

  return (
    <div className="space-y-4">
      {/* Top Search & View Switcher Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <label htmlFor="holiday-search" className="sr-only">
            Search holiday by name, Hindi, or month
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-subtle dark:text-night-subtle">
            <Search size={15} aria-hidden="true" />
          </div>

          <input
            id="holiday-search"
            type="text"
            role="searchbox"
            autoComplete="off"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder="Search holiday, festival, or vacation (e.g. Chhath, Holi, Summer)..."
            className={`w-full rounded-xl border border-line bg-surface py-2.5 pr-9 pl-9.5 text-xs text-ink placeholder:text-subtle/70 dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:placeholder:text-night-subtle/70 ${focus}`}
          />

          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Clear search input"
              className={`absolute inset-y-0 right-0 flex items-center pr-3 text-subtle hover:text-ink dark:text-night-subtle dark:hover:text-night-ink ${focus}`}
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* View Switcher: Cards vs Table */}
        <div
          className="grid grid-cols-2 rounded-lg border border-line bg-soft/50 p-1 dark:border-night-line dark:bg-night-soft/40 sm:inline-flex sm:w-auto"
          role="group"
          aria-label="Holiday view mode"
        >
          <button
            type="button"
            aria-pressed={viewMode === 'cards'}
            onClick={() => onViewModeChange('cards')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${focus} ${
              viewMode === 'cards'
                ? 'bg-surface text-ink shadow-xs dark:bg-night-surface dark:text-night-ink'
                : 'text-subtle hover:text-ink dark:text-night-subtle dark:hover:text-night-ink'
            }`}
          >
            <LayoutGrid size={13} aria-hidden="true" />
            <span>Cards</span>
          </button>

          <button
            type="button"
            aria-pressed={viewMode === 'table'}
            onClick={() => onViewModeChange('table')}
            className={`inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${focus} ${
              viewMode === 'table'
                ? 'bg-surface text-ink shadow-xs dark:bg-night-surface dark:text-night-ink'
                : 'text-subtle hover:text-ink dark:text-night-subtle dark:hover:text-night-ink'
            }`}
          >
            <Table size={13} aria-hidden="true" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Category Pills + Month Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Category Pills */}
        <div
          className="flex max-w-full items-center gap-1.5 overflow-x-auto pb-1 sm:flex-wrap sm:pb-0"
          role="group"
          aria-label="Holiday category"
        >
          {holidayCategories.map(cat => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onCategoryChange(cat.id)}
                className={`inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors ${focus} ${
                  isSelected
                    ? 'border-brand bg-brand text-on-brand shadow-xs dark:border-night-brand dark:bg-night-brand dark:text-night-on-brand'
                    : 'border-line bg-surface text-ink hover:border-brand/40 hover:bg-soft dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:hover:border-night-brand/40 dark:hover:bg-night-soft'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {/* Month Selector & Clear */}
        <div className="flex flex-wrap items-center gap-2">
          <Dropdown
            id="holiday-month-filter"
            compact
            label="Filter by month"
            options={monthOptions}
            value={selectedMonth}
            onChange={onMonthChange}
            className="text-xs"
          />

          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className={`text-xs font-semibold text-brand transition-colors hover:underline dark:text-night-brand ${focus}`}
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Result Status Strip */}
      <div className="flex items-center justify-between text-xs text-subtle dark:text-night-subtle">
        <span>
          Showing {totalMatching} {totalMatching === 1 ? 'holiday' : 'holidays'}
        </span>
        {selectedMonth && <span>Month: {selectedMonth}</span>}
      </div>
    </div>
  )
}
