import { Link } from 'react-router-dom'
import { ArrowRight, Database, BookOpen, Users, Compass } from 'lucide-react'
import { panel, focus, muted } from '@/ui/classes'

const features = [
  {
    icon: Database,
    title: 'Multi-DBMS SQL Switcher',
    description:
      'Compare queries side by side in Oracle, MySQL, SQL Server, PostgreSQL, and SQLite directly inside the study notes.',
  },
  {
    icon: BookOpen,
    title: 'Verified Unit Outlines',
    description:
      'Structured semester-wise topics following Vinoba Bhave University CBCS curriculum regulations for semester examination prep.',
  },
  {
    icon: Users,
    title: 'Faculty & Department Mentors',
    description:
      'Explore professor profiles, qualifications, subject specializations, and departmental staff directories.',
    href: '/professors',
    linkLabel: 'View faculty directory',
  },
  {
    icon: Compass,
    title: 'VBU Student Academic Guide',
    description:
      'Understand internal sessional marks, external university exam weightage, passing rules, and practical lab formats.',
    href: '/vbu',
    linkLabel: 'Read university guide',
  },
]

export default function LearningFeatures() {
  return (
    <section className="border-t border-line bg-surface py-12 dark:border-night-line dark:bg-night-surface sm:py-16" aria-labelledby="features-heading">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand dark:text-night-brand">
            Built For Technical Learning
          </p>
          <h2 id="features-heading" className="mt-2 font-display text-2xl font-medium text-ink dark:text-night-ink sm:text-3xl">
            Designed for University Notes & Engineering Practice
          </h2>
          <p className={`mt-3 text-base leading-relaxed ${muted}`}>
            StudyShelf combines rigorous academic curriculum mapping with real developer tooling to help computer applications students build lasting mastery.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className={`${panel} flex flex-col justify-between p-6 transition-colors hover:border-brand/60 dark:hover:border-night-brand/60`}
              >
                <div>
                  <span className="flex size-10 items-center justify-center rounded-lg bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink dark:text-night-ink">
                    {item.title}
                  </h3>
                  <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
                    {item.description}
                  </p>
                </div>

                {item.href && (
                  <div className="mt-6 border-t border-line pt-3 dark:border-night-line">
                    <Link
                      to={item.href}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline dark:text-night-brand ${focus}`}
                    >
                      <span>{item.linkLabel}</span>
                      <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
