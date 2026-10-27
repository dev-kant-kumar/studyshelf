import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Code2, FileText } from 'lucide-react'
import { muted, focus } from '@/ui/classes'

const references = [
  {
    label: 'India National Classification of Occupations (PDF)',
    href: 'https://www.ncs.gov.in/Documents/National%20Classification%20of%20Occupations%20_Vol%20II-A-%202015.pdf',
  },
  {
    label: 'Computer and IT Occupation Families (BLS)',
    href: 'https://www.bls.gov/ooh/computer-and-information-technology/home.htm',
  },
  {
    label: 'India National Qualification Register (NQR)',
    href: 'https://www.nqr.gov.in/',
  },
]

export default function CareerFooter() {
  return (
    <section className="mt-12 grid grid-cols-1 gap-5 border-t border-line pt-10 dark:border-night-line sm:grid-cols-2 sm:gap-6">
      {/* Ready to Build Card */}
      <div className="flex flex-col justify-between rounded-xl border border-line bg-surface p-4.5 shadow-xs dark:border-night-line dark:bg-night-surface sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
              <Code2 size={15} aria-hidden="true" />
            </span>
            <h2 className="font-display text-lg font-bold text-ink dark:text-night-ink">
              Ready to start building?
            </h2>
          </div>
          <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
            Visit the Developer Shelf for structured roadmaps covering Frontend, Node.js, Python, and Java backend development with real student project briefs.
          </p>
        </div>
        <div className="mt-5">
          <Link
            to="/developers"
            className={`inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-on-brand shadow-xs transition-opacity hover:opacity-95 dark:bg-night-brand dark:text-night-on-brand ${focus}`}
          >
            <span>Explore Developer Shelf</span>
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Official Classification References */}
      <div className="flex flex-col justify-between rounded-xl border border-line bg-surface p-6 shadow-xs dark:border-night-line dark:bg-night-surface">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-md bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
              <FileText size={15} aria-hidden="true" />
            </span>
            <h2 className="font-display text-lg font-bold text-ink dark:text-night-ink">
              Standard Industry Frameworks
            </h2>
          </div>
          <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
            These categories are aligned with national and international occupational standards rather than commercial placement buzzwords:
          </p>
          <ul className="mt-3 space-y-2">
            {references.map(ref => (
              <li key={ref.href}>
                <a
                  href={ref.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold text-subtle transition-colors hover:text-ink dark:text-night-subtle dark:hover:text-night-ink ${focus}`}
                >
                  <ExternalLink size={12} className="text-brand dark:text-night-brand" aria-hidden="true" />
                  <span>{ref.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
