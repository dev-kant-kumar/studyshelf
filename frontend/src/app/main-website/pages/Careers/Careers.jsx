import { useState } from 'react'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import DocumentHead from '../../shared/components/DocumentHead'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import { careerFields, careerGroups, filterCareerFields } from './careerFields'
import CareersHero from './components/CareersHero'
import CareerStrategy from './components/CareerStrategy'
import CareerFilters from './components/CareerFilters'
import CareerCard from './components/CareerCard'
import CareerDetailDrawer from './components/CareerDetailDrawer'
import CareerFooter from './components/CareerFooter'
import { muted, focus } from '@/ui/classes'

export default function Careers() {
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('all')
  const [selected, setSelected] = useState(null)

  const visible = filterCareerFields(query, group)

  const reset = () => {
    setQuery('')
    setGroup('all')
  }

  const categoryId = value => `category-${value.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <>
      <CatalogueLayout>
        <DocumentHead
          title="Career Explorer for BCA & MCA Students - 16 Tech Paths"
          description="Explore 16 technology career fields for BCA and MCA students. Compare job roles, core technical skills, starter capstone projects, and direct developer roadmaps."
          path="/careers"
        />

        <Breadcrumbs items={[{ label: 'Career Explorer' }]} />

        {/* Hero with Jump Actions & Strategy Card */}
        <CareersHero />

        {/* 3-Step Practical Methodology */}
        <CareerStrategy />

        {/* Search, Group Filter Pills & Live Count */}
        <div id="fields" className="scroll-mt-20">
          <CareerFilters
            query={query}
            setQuery={setQuery}
            group={group}
            setGroup={setGroup}
            careerGroups={careerGroups}
            careerFields={careerFields}
            visibleCount={visible.length}
            reset={reset}
          />

          {/* Grouped Career Fields Grid */}
          <div className="mt-8 space-y-10">
            {careerGroups.map(category => {
              const fields = visible.filter(field => field.group === category)
              if (!fields.length) return null

              return (
                <section
                  key={category}
                  id={categoryId(category)}
                  aria-labelledby={`${categoryId(category)}-heading`}
                  className="scroll-mt-24"
                >
                  <div className="mb-4 flex items-baseline gap-2.5">
                    <h3
                      id={`${categoryId(category)}-heading`}
                      className="font-display text-xl font-bold text-ink dark:text-night-ink"
                    >
                      {category}
                    </h3>
                    <span className="font-mono text-xs text-subtle dark:text-night-subtle">
                      ({fields.length} {fields.length === 1 ? 'field' : 'fields'})
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {fields.map(field => (
                      <CareerCard
                        key={field.id}
                        field={field}
                        onSelect={setSelected}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>

          {/* Empty Search Results */}
          {!visible.length && (
            <div className="rounded-xl border border-line bg-surface p-8 text-center dark:border-night-line dark:bg-night-surface">
              <h3 className="font-display text-xl font-bold text-ink dark:text-night-ink">
                No matching career fields found
              </h3>
              <p className={`mt-2 text-xs ${muted}`}>
                No fields matched "{query}". Try searching for broader terms like "SQL", "Security", or "Python".
              </p>
              <button
                type="button"
                onClick={reset}
                className={`mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-on-brand transition-opacity hover:opacity-95 dark:bg-night-brand dark:text-night-on-brand ${focus}`}
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Ready to build & Official Framework References */}
        <CareerFooter />
      </CatalogueLayout>

      {/* Slide-Over Career Detail Drawer */}
      <CareerDetailDrawer
        selected={selected}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
