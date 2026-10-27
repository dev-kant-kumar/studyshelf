import { CalendarDays } from 'lucide-react'
import { getNextUpcomingHoliday, holidayCategories } from '../holidayData'

export default function UpcomingHolidayBanner({ today }) {
  const result = getNextUpcomingHoliday(today)

  if (!result) return null

  const { holiday, status } = result
  const isActive = status === 'active'

  const categoryLabel =
    holidayCategories.find(c => c.id === holiday.category)?.label ?? holiday.category

  return (
    <aside
      aria-label="Next upcoming university holiday"
      className="mb-8 overflow-hidden rounded-xl border border-brand/40 bg-selected/40 shadow-xs dark:border-night-brand/40 dark:bg-night-selected/30"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand/20 bg-brand/10 px-4 py-2 text-xs font-semibold dark:border-night-brand/20 dark:bg-night-brand/15">
        <div className="flex items-center gap-2">
          {isActive ? (
            <>
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Holiday in Progress Today
              </span>
            </>
          ) : (
            <>
              <span className="size-2 rounded-full bg-brand dark:bg-night-brand" />
              <span className="font-bold uppercase tracking-wider text-brand dark:text-night-brand">
                Next Upcoming Holiday
              </span>
            </>
          )}
        </div>

        <span className="rounded bg-brand/10 px-2 py-0.5 text-[10px] font-bold text-brand dark:bg-night-brand/20 dark:text-night-brand">
          {categoryLabel}
        </span>
      </div>

      <div className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-subtle dark:text-night-subtle">
            <CalendarDays size={14} className="text-brand dark:text-night-brand" aria-hidden="true" />
            <span>{holiday.date}</span>
            <span>·</span>
            <span>{holiday.dayOfWeek}</span>
            <span className="rounded bg-brand/15 px-1.5 py-0.2 text-[10px] font-bold text-brand dark:bg-night-brand/25 dark:text-night-brand">
              {holiday.days} {holiday.days === 1 ? 'Day' : 'Days'}
            </span>
            {holiday.sundays > 0 && (
              <span className="text-[11px] text-amber-700 dark:text-amber-400">
                (Includes {holiday.sundays} {holiday.sundays === 1 ? 'Sunday' : 'Sundays'})
              </span>
            )}
          </div>

          <h3 className="mt-1.5 font-display text-lg font-bold text-ink dark:text-night-ink sm:text-xl">
            {holiday.name}
          </h3>

          <p className="mt-0.5 text-xs text-subtle dark:text-night-subtle">
            {holiday.hindiName}
          </p>
        </div>

        <div className="shrink-0 text-left sm:text-right">
          <span className="inline-block rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-xs font-semibold text-ink dark:border-night-line dark:bg-night-surface dark:text-night-ink">
            {isActive ? 'Classes Resume After Leave' : `Starts ${holiday.date}`}
          </span>
        </div>
      </div>
    </aside>
  )
}
