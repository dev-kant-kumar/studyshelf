import { getHolidayStatus } from '../holidayData'

const categoryBadges = {
  vacation: {
    label: 'Vacation',
    className:
      'bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border-purple-500/30',
  },
  festival: {
    label: 'Festival',
    className:
      'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/30',
  },
  national: {
    label: 'National Day',
    className:
      'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-500/30',
  },
  jayanti: {
    label: 'Jayanti',
    className:
      'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/30',
  },
  regional: {
    label: 'Jharkhand Regional',
    className:
      'bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300 border-teal-500/30',
  },
  general: {
    label: 'General',
    className:
      'bg-soft text-subtle dark:bg-night-soft dark:text-night-subtle border-line',
  },
}

export default function HolidayCard({ holiday, today }) {
  const status = getHolidayStatus(holiday, today)
  const isLive = status === 'active'
  const isUpcoming = status === 'upcoming'
  const isVacation = holiday.category === 'vacation'

  const badge = categoryBadges[holiday.category] ?? categoryBadges.general

  return (
    <article
      className={`flex flex-col justify-between rounded-xl border p-4.5 shadow-xs transition-colors ${
        isLive
          ? 'border-brand bg-selected/50 ring-1 ring-brand dark:border-night-brand dark:bg-night-selected/40 dark:ring-night-brand'
          : isVacation
            ? 'border-purple-500/30 bg-purple-500/5 dark:border-purple-500/20 dark:bg-purple-500/10'
            : 'border-line bg-surface dark:border-night-line dark:bg-night-surface'
      }`}
    >
      <div>
        {/* Header Strip: Sl. No + Date + Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="rounded bg-soft px-1.5 py-0.5 font-mono text-[10px] font-bold text-subtle dark:bg-night-soft dark:text-night-subtle">
              #{holiday.slNo}
            </span>
            <span className="font-mono text-xs font-bold text-ink dark:text-night-ink">
              {holiday.date}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isLive && (
              <span className="inline-flex items-center gap-1 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-on-brand dark:bg-night-brand dark:text-night-on-brand">
                <span className="size-1.5 rounded-full bg-white animate-pulse" />
                <span>Today</span>
              </span>
            )}

            {isUpcoming && (
              <span className="rounded bg-soft px-1.5 py-0.5 text-[10px] font-medium text-subtle dark:bg-night-soft dark:text-night-subtle">
                Upcoming
              </span>
            )}

            <span
              className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold ${badge.className}`}
            >
              {badge.label}
            </span>
          </div>
        </div>

        {/* Title & Hindi Translation */}
        <h3 className="mt-2.5 font-display text-base font-bold text-ink dark:text-night-ink">
          {holiday.name}
        </h3>
        <p className="mt-1 text-xs text-subtle dark:text-night-subtle">
          {holiday.hindiName}
        </p>
      </div>

      {/* Footer Details: Day of Week + Duration */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line/70 pt-3 text-xs text-subtle dark:border-night-line/70 dark:text-night-subtle">
        <span>{holiday.dayOfWeek}</span>

        <div className="flex items-center gap-2">
          <span className="font-bold text-ink dark:text-night-ink">
            {holiday.days} {holiday.days === 1 ? 'day' : 'days'}
          </span>

          {holiday.sundays > 0 && (
            <span className="rounded bg-amber-500/10 px-1.5 py-0.2 text-[10px] font-medium text-amber-700 dark:text-amber-400">
              {holiday.sundays} {holiday.sundays === 1 ? 'Sunday' : 'Sundays'}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
