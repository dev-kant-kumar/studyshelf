import { useEffect, useMemo, useState } from 'react'
import { CalendarX2 } from 'lucide-react'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import DocumentHead from '../../shared/components/DocumentHead'
import { holidays2026, getIndiaToday } from './holidayData'
import HolidaysHero from './components/HolidaysHero'
import UpcomingHolidayBanner from './components/UpcomingHolidayBanner'
import HolidayFilters from './components/HolidayFilters'
import HolidayCard from './components/HolidayCard'
import HolidaysTable from './components/HolidaysTable'
import { muted, focus } from '@/ui/classes'

export default function Holidays() {
  const [today, setToday] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('cards') // 'cards' | 'table'

  useEffect(() => {
    const update = () => setToday(getIndiaToday())
    update()
    window.addEventListener('focus', update)
    return () => window.removeEventListener('focus', update)
  }, [])

  const filteredHolidays = useMemo(() => {
    const q = query.trim().toLowerCase()

    return holidays2026.filter(holiday => {
      // Search matching (English name, Hindi name, month, date)
      if (q) {
        const matchesName = holiday.name.toLowerCase().includes(q)
        const matchesHindi = holiday.hindiName.toLowerCase().includes(q)
        const matchesMonth = holiday.month.toLowerCase().includes(q)
        const matchesDate = holiday.date.toLowerCase().includes(q)
        if (!matchesName && !matchesHindi && !matchesMonth && !matchesDate) {
          return false
        }
      }

      // Month filter
      if (selectedMonth && holiday.month !== selectedMonth) {
        return false
      }

      // Category filter
      if (selectedCategory !== 'all' && holiday.category !== selectedCategory) {
        return false
      }

      return true
    })
  }, [query, selectedMonth, selectedCategory])

  return (
    <CatalogueLayout>
      <DocumentHead
        title="VBU Holiday List 2026 - Official University Calendar"
        description="Official list of approved holidays, academic vacations, and festival leaves for Vinoba Bhave University (VBU, Hazaribag) students and faculty for 2026."
        path="/holidays"
      />

      <Breadcrumbs items={[{ label: 'Holiday list' }]} />

      {/* Hero Header with Metrics */}
      <HolidaysHero />

      <div className="mt-8">
        {/* Next Upcoming Holiday Highlight */}
        <UpcomingHolidayBanner today={today} />

        {/* Filters & Search */}
        <HolidayFilters
          query={query}
          onQueryChange={setQuery}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalMatching={filteredHolidays.length}
        />

        {/* Content Display: Cards vs Table */}
        <div className="mt-6">
          {filteredHolidays.length > 0 ? (
            viewMode === 'table' ? (
              <HolidaysTable holidays={filteredHolidays} today={today} />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredHolidays.map(holiday => (
                  <HolidayCard key={holiday.id} holiday={holiday} today={today} />
                ))}
              </div>
            )
          ) : (
            <div className="rounded-xl border border-line bg-surface p-8 text-center dark:border-night-line dark:bg-night-surface">
              <CalendarX2
                size={36}
                className="mx-auto text-subtle dark:text-night-subtle"
                aria-hidden="true"
              />
              <h3 className="mt-3 font-display text-lg font-bold text-ink dark:text-night-ink">
                No holidays matching your filters
              </h3>
              <p className={`mx-auto mt-1 max-w-sm text-xs ${muted}`}>
                Try adjusting your search keyword, category, or month selector to find scheduled university leaves.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setSelectedMonth('')
                  setSelectedCategory('all')
                }}
                className={`mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-1.5 text-xs font-semibold text-on-brand transition-opacity hover:opacity-95 dark:bg-night-brand dark:text-night-on-brand ${focus}`}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Official University Circular Note */}
        <div className="mt-8 rounded-xl border border-line bg-soft/40 p-4 text-xs leading-relaxed text-subtle dark:border-night-line dark:bg-night-soft/30 dark:text-night-subtle">
          <p>
            <span className="font-semibold text-ink dark:text-night-ink">Official university notice: </span>
            A total of 5 restricted holidays (प्रतिबंधित अवकाश) are additionally available as per Jharkhand State Government regulations. University leaves and examination schedules may be amended subject to official notifications by the Vinoba Bhave University administration and state government directives.
          </p>
        </div>
      </div>
    </CatalogueLayout>
  )
}
