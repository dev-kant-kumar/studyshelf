import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, X, RotateCcw, Clock, ArrowRight } from 'lucide-react'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import DocumentHead from '../../shared/components/DocumentHead'
import { departmentPeople, filterProfessors } from './facultyData'
import FacultyHero from './components/FacultyHero'
import FacultyCard from './components/FacultyCard'
import StaffCard from './components/StaffCard'
import FacultySource from './FacultySource'
import { muted, focus } from '@/ui/classes'

export default function Professors() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all') // 'all', 'faculty', 'staff'

  const allFiltered = filterProfessors(query)
  const results = allFiltered.filter(person => {
    if (category === 'faculty') return (person.category ?? 'faculty') === 'faculty'
    if (category === 'staff') return person.category === 'staff'
    return true
  })

  const reset = () => {
    setQuery('')
    setCategory('all')
  }

  const facultyCount = departmentPeople.filter(p => (p.category ?? 'faculty') === 'faculty').length
  const staffCount = departmentPeople.filter(p => p.category === 'staff').length
  const isFiltered = query.trim() !== '' || category !== 'all'

  return (
    <CatalogueLayout>
      <DocumentHead
        title="VBU BCA & MCA Faculty and Staff Directory"
        description="Find BCA and MCA professors at Vinoba Bhave University, their academic specializations, qualifications, experience, and published contact details."
        path="/professors"
      />

      <Breadcrumbs items={[{ label: 'Professors' }]} />

      {/* Hero with Metric Strip */}
      <FacultyHero />

      {/* Search and Category Filter Toolbar */}
      <section className="mt-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search
              size={16}
              className="absolute top-3 left-3.5 text-subtle dark:text-night-subtle"
              aria-hidden="true"
            />
            <input
              type="text"
              role="searchbox"
              id="faculty-search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, specialization, or qualification..."
              aria-label="Search faculty and staff"
              autoComplete="off"
              className={`min-h-11 w-full rounded-xl border border-line bg-surface py-2 pr-10 pl-10 text-sm text-ink outline-none transition-colors placeholder:text-subtle focus:border-brand focus:ring-1 focus:ring-brand dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:placeholder:text-night-subtle dark:focus:border-night-brand dark:focus:ring-night-brand`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute top-3 right-3 text-subtle hover:text-ink dark:text-night-subtle dark:hover:text-night-ink"
                aria-label="Clear search query"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Results count & Reset */}
          <div className="flex items-center gap-3">
            <p role="status" className="font-mono text-xs font-semibold text-subtle dark:text-night-subtle">
              Showing {results.length} of {departmentPeople.length} people
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

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${focus} ${
              category === 'all'
                ? 'border-brand bg-brand text-on-brand dark:border-night-brand dark:bg-night-brand dark:text-night-on-brand'
                : 'border-line bg-surface text-subtle hover:border-brand/50 hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:border-night-brand/50 dark:hover:text-night-ink'
            }`}
          >
            <span>All Directory</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                category === 'all'
                  ? 'bg-on-brand/20 text-on-brand dark:bg-night-on-brand/20 dark:text-night-on-brand'
                  : 'bg-soft text-subtle dark:bg-night-soft dark:text-night-subtle'
              }`}
            >
              {departmentPeople.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCategory('faculty')}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${focus} ${
              category === 'faculty'
                ? 'border-brand bg-brand text-on-brand dark:border-night-brand dark:bg-night-brand dark:text-night-on-brand'
                : 'border-line bg-surface text-subtle hover:border-brand/50 hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:border-night-brand/50 dark:hover:text-night-ink'
            }`}
          >
            <span>Faculty Members</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                category === 'faculty'
                  ? 'bg-on-brand/20 text-on-brand dark:bg-night-on-brand/20 dark:text-night-on-brand'
                  : 'bg-soft text-subtle dark:bg-night-soft dark:text-night-subtle'
              }`}
            >
              {facultyCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setCategory('staff')}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${focus} ${
              category === 'staff'
                ? 'border-brand bg-brand text-on-brand dark:border-night-brand dark:bg-night-brand dark:text-night-on-brand'
                : 'border-line bg-surface text-subtle hover:border-brand/50 hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:border-night-brand/50 dark:hover:text-night-ink'
            }`}
          >
            <span>Departmental Staff</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                category === 'staff'
                  ? 'bg-on-brand/20 text-on-brand dark:bg-night-on-brand/20 dark:text-night-on-brand'
                  : 'bg-soft text-subtle dark:bg-night-soft dark:text-night-subtle'
              }`}
            >
              {staffCount}
            </span>
          </button>
        </div>
      </section>

      {/* Faculty Section */}
      {(category === 'all' || category === 'faculty') && (
        <section className="mt-10" aria-label="Faculty members">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-bold text-ink dark:text-night-ink">
              Faculty members
            </h2>
            <span className="font-mono text-xs text-subtle dark:text-night-subtle">
              {results.filter(p => (p.category ?? 'faculty') === 'faculty').length} professors
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            {results
              .filter(person => (person.category ?? 'faculty') === 'faculty')
              .map(person => (
                <FacultyCard key={person.id} person={person} />
              ))}
          </div>
        </section>
      )}

      {/* Staff Section */}
      {(category === 'all' || category === 'staff') && (
        <section className="mt-10 sm:mt-12" aria-label="Departmental staff">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-xl font-bold text-ink dark:text-night-ink sm:text-2xl">
              Departmental staff
            </h2>
            <span className="font-mono text-xs text-subtle dark:text-night-subtle">
              {results.filter(p => p.category === 'staff').length} staff
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {results
              .filter(person => person.category === 'staff')
              .map(person => (
                <StaffCard key={person.id} person={person} />
              ))}
          </div>
        </section>
      )}

      {/* Empty Search State */}
      {!results.length && (
        <div className="mt-8 rounded-xl border border-line bg-surface p-8 text-center dark:border-night-line dark:bg-night-surface">
          <h2 className="font-display text-xl font-bold text-ink dark:text-night-ink">
            No faculty or staff match your search
          </h2>
          <p className={`mt-2 text-xs ${muted}`}>
            No profile matches "{query}". Try searching by name, or an academic area such as "Software Engineering" or "Data Mining".
          </p>
          <button
            type="button"
            onClick={reset}
            className={`mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-on-brand transition-opacity hover:opacity-95 dark:bg-night-brand dark:text-night-on-brand ${focus}`}
          >
            Show all faculty and staff
          </button>
        </div>
      )}

      {/* Routine Timetable Bridge */}
      <section className="mt-12 flex flex-col justify-between gap-4 rounded-xl border border-brand/30 bg-selected/40 p-5 sm:flex-row sm:items-center dark:border-night-brand/30 dark:bg-night-selected/30">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand text-on-brand dark:bg-night-brand dark:text-night-on-brand">
            <Clock size={16} aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-ink dark:text-night-ink">
              Looking for class schedules and lecture hours?
            </h3>
            <p className={`mt-0.5 text-xs text-subtle dark:text-night-subtle`}>
              Check the live India Standard Time timetable for MCA Semester 1 lectures, lab sessions, and recess timings.
            </p>
          </div>
        </div>

        <Link
          to="/routine"
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-on-brand shadow-xs transition-opacity hover:opacity-95 dark:bg-night-brand dark:text-night-on-brand ${focus}`}
        >
          <span>View Class Routine</span>
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </section>

      {/* Official Record Disclaimer */}
      <FacultySource />
    </CatalogueLayout>
  )
}
