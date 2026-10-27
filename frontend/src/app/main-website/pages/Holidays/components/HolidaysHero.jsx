import { Calendar, Sun, Palmtree, Clock } from 'lucide-react'
import { eyebrow, muted } from '@/ui/classes'
import { holidaySummary } from '../holidayData'

export default function HolidaysHero() {
  return (
    <header className="border-b border-line pb-8 dark:border-night-line">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className={eyebrow}>VBU / Academic Calendar 2026</p>
          <h1
            tabIndex={-1}
            className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl dark:text-night-ink"
          >
            University holiday list
          </h1>
          <p className={`mt-2 max-w-2xl text-sm leading-relaxed sm:text-base ${muted}`}>
            Official list of approved holidays, academic vacations, and festival leaves for
            Vinoba Bhave University (VBU, Hazaribag) students and faculty for the year 2026.
          </p>
        </div>

        {/* Circular downloads commented out until official university PDF/scan is released
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          {holidaySummary.sourceNotices.map((notice, index) => (
            <a
              key={notice.href}
              href={notice.href}
              download={`vbu-holiday-2026-part${index + 1}.png`}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:hover:border-night-brand dark:hover:text-night-brand sm:flex-initial sm:py-1.5 ${focus}`}
            >
              <Download size={14} aria-hidden="true" />
              <span>Official notice Part {index + 1}</span>
            </a>
          ))}
        </div>
        */}
      </div>

      {/* Metric Cards Grid */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-line bg-surface p-3.5 shadow-xs dark:border-night-line dark:bg-night-surface sm:p-4">
          <div className="flex items-center gap-2 text-subtle dark:text-night-subtle">
            <Calendar size={16} className="text-brand dark:text-night-brand" aria-hidden="true" />
            <span className="text-xs font-medium">Total Leave Days</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-ink dark:text-night-ink sm:text-3xl">
            {holidaySummary.totalDays}
          </p>
          <p className="mt-0.5 text-[11px] text-subtle dark:text-night-subtle">
            Across 39 notified holidays
          </p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-3.5 shadow-xs dark:border-night-line dark:bg-night-surface sm:p-4">
          <div className="flex items-center gap-2 text-subtle dark:text-night-subtle">
            <Clock size={16} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            <span className="text-xs font-medium">Working Days Off</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-ink dark:text-night-ink sm:text-3xl">
            {holidaySummary.workingDaysOff}
          </p>
          <p className="mt-0.5 text-[11px] text-subtle dark:text-night-subtle">
            Excluding regular Sundays
          </p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-3.5 shadow-xs dark:border-night-line dark:bg-night-surface sm:p-4">
          <div className="flex items-center gap-2 text-subtle dark:text-night-subtle">
            <Sun size={16} className="text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <span className="text-xs font-medium">Sunday Overlaps</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-ink dark:text-night-ink sm:text-3xl">
            {holidaySummary.sundays}
          </p>
          <p className="mt-0.5 text-[11px] text-subtle dark:text-night-subtle">
            Holidays falling on Sunday
          </p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-3.5 shadow-xs dark:border-night-line dark:bg-night-surface sm:p-4">
          <div className="flex items-center gap-2 text-subtle dark:text-night-subtle">
            <Palmtree size={16} className="text-purple-600 dark:text-purple-400" aria-hidden="true" />
            <span className="text-xs font-medium">Major Vacations</span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold text-ink dark:text-night-ink sm:text-3xl">
            4
          </p>
          <p className="mt-0.5 text-[11px] text-subtle dark:text-night-subtle">
            Summer, Autumn, Winter, Dussehra
          </p>
        </div>
      </div>
    </header>
  )
}
