import { Link } from 'react-router-dom'
import { ArrowRight, Code } from 'lucide-react'
import { panel, focus, muted } from '@/ui/classes'

const tracks = [
  {
    title: 'Node.js Backend Roadmap',
    href: '/developers/nodejs-roadmap',
    description: 'Event loop architecture, asynchronous streams, REST APIs, database queries, and deployment.',
    tag: 'Core Track',
  },
  {
    title: 'Frontend Developer',
    href: '/developers/frontend-roadmap',
    description: 'Semantic HTML, responsive CSS, modern JavaScript, strict TypeScript, and React interfaces.',
    tag: 'Web Track',
  },
  {
    title: 'Python Backend Developer',
    href: '/developers/python-backend-roadmap',
    description: 'Python programming, relational data modeling, Django REST framework, and API contracts.',
    tag: 'Backend Track',
  },
  {
    title: 'Java Backend Developer',
    href: '/developers/java-backend-roadmap',
    description: 'Java language fundamentals, Spring Boot REST services, JPA persistence, and JUnit testing.',
    tag: 'Enterprise Track',
  },
]

export default function DeveloperShowcase() {
  return (
    <section className="py-12 sm:py-16" aria-labelledby="developer-heading">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand dark:text-night-brand">
            From Syllabus to Industry
          </p>
          <h2 id="developer-heading" className="mt-2 font-display text-2xl font-medium text-ink dark:text-night-ink sm:text-3xl">
            Developer Shelf & Career Roadmaps
          </h2>
        </div>
        <Link
          to="/developers"
          className={`inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline dark:text-night-brand ${focus}`}
        >
          <span>Explore all roadmaps</span>
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <p className={`mt-3 max-w-2xl text-base leading-relaxed ${muted}`}>
        Connect university theory with production engineering workflows. Step-by-step milestones with concrete projects and locally saved progress tracking.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tracks.map(track => (
          <Link
            key={track.href}
            to={track.href}
            className={`${panel} group flex flex-col justify-between p-5 transition-colors hover:border-brand dark:hover:border-night-brand motion-reduce:transition-none sm:p-6 ${focus}`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-soft text-brand dark:bg-night-soft dark:text-night-brand">
                  <Code size={18} aria-hidden="true" />
                </span>
                <span className="rounded bg-soft px-2 py-0.5 text-[11px] font-medium text-subtle dark:bg-night-soft dark:text-night-subtle">
                  {track.tag}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand">
                {track.title}
              </h3>
              <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
                {track.description}
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 border-t border-line pt-3 text-xs font-semibold text-brand dark:border-night-line dark:text-night-brand">
              <span>View roadmap</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>

      {/* Career Explorer Callout */}
      <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-line bg-soft/40 p-5 dark:border-night-line dark:bg-night-soft/30 sm:flex-row sm:items-center sm:p-6">
        <div>
          <h3 className="font-semibold text-ink dark:text-night-ink">
            Planning your job search after BCA or MCA?
          </h3>
          <p className={`mt-1 text-sm ${muted}`}>
            Use the Career Explorer to see which syllabus subjects and practical skills map directly to roles in software development, data systems, and cloud architecture.
          </p>
        </div>
        <Link
          to="/careers"
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-on-brand transition-colors hover:bg-brand-hover dark:bg-night-brand dark:text-night-on-brand dark:hover:bg-night-brand-hover ${focus}`}
        >
          <span>Open Career Explorer</span>
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
