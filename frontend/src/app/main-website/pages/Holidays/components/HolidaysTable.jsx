import { getHolidayStatus } from '../holidayData'

export default function HolidaysTable({ holidays, today }) {

  return (
    <div
      className="overflow-x-auto rounded-xl border border-line bg-surface shadow-xs dark:border-night-line dark:bg-night-surface"
      tabIndex={0}
      role="region"
      aria-label="University holiday official list table"
    >
      <table className="w-full min-w-[760px] border-collapse text-left text-xs">
        <caption className="sr-only">
          Vinoba Bhave University official holiday calendar for 2026
        </caption>

        <thead className="border-b border-line bg-soft/70 dark:border-night-line dark:bg-night-soft/60">
          <tr>
            <th scope="col" className="w-12 p-3 text-center font-bold text-ink dark:text-night-ink">
              Sl. No.
            </th>
            <th scope="col" className="p-3 font-bold text-ink dark:text-night-ink">
              Name of Leave
            </th>
            <th scope="col" className="p-3 font-mono font-semibold text-ink dark:text-night-ink">
              Date
            </th>
            <th scope="col" className="w-20 p-3 text-center font-bold text-ink dark:text-night-ink">
              No. of Days
            </th>
            <th scope="col" className="w-24 p-3 text-center font-semibold text-subtle dark:text-night-subtle">
              Sunday
            </th>
            <th scope="col" className="p-3 font-semibold text-subtle dark:text-night-subtle">
              Days of Week
            </th>
          </tr>
        </thead>

        <tbody>
          {holidays.map(holiday => {
            const status = getHolidayStatus(holiday, today)
            const isLive = status === 'active'
            const isVacation = holiday.category === 'vacation'

            return (
              <tr
                key={holiday.id}
                className={`border-t border-line transition-colors dark:border-night-line ${
                  isLive
                    ? 'bg-selected/50 font-medium dark:bg-night-selected/30'
                    : isVacation
                      ? 'bg-purple-500/5 dark:bg-purple-500/10'
                      : 'hover:bg-soft/40 dark:hover:bg-night-soft/30'
                }`}
              >
                <td className="p-3 text-center font-mono font-bold text-subtle dark:text-night-subtle">
                  {holiday.slNo}
                </td>

                <td className="p-3 align-top">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-ink dark:text-night-ink">
                      {holiday.name}
                    </span>
                    {isLive && (
                      <span className="rounded bg-brand px-1.5 py-0.2 text-[9px] font-bold text-on-brand dark:bg-night-brand dark:text-night-on-brand">
                        Today
                      </span>
                    )}
                  </div>
                  <span className="mt-0.5 block text-[11px] text-subtle dark:text-night-subtle">
                    {holiday.hindiName}
                  </span>
                </td>

                <td className="p-3 align-top font-mono font-semibold text-ink dark:text-night-ink">
                  {holiday.date}
                </td>

                <td className="p-3 text-center align-top font-mono font-bold text-ink dark:text-night-ink">
                  {holiday.days.toString().padStart(2, '0')}
                </td>

                <td className="p-3 text-center align-top font-mono text-subtle dark:text-night-subtle">
                  {holiday.sundays > 0 ? (
                    <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                      {holiday.sundays.toString().padStart(2, '0')} Sunday{holiday.sundays > 1 ? 's' : ''}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>

                <td className="p-3 align-top text-subtle dark:text-night-subtle">
                  {holiday.dayOfWeek}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
