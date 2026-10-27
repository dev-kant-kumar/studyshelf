import { Link } from 'react-router-dom'
import { ArrowRight, Code } from 'lucide-react'
import { panel, focus, muted } from '@/ui/classes'

export default function CourseCareerPaths({ course }) {
  const isMca = course.id === 'mca'

  const tracks = isMca
    ? [
        {
          title: 'Node.js Backend Developer',
          href: '/developers/nodejs-roadmap',
          description:
            'Extends Operating Systems, Concurrency, and REST API concepts into production server architectures.',
        },
        {
          title: 'Java Backend Developer',
          href: '/developers/java-backend-roadmap',
          description:
            'Spring Boot enterprise architectures, relational persistence with JPA, and distributed services.',
        },
      ]
    : [
        {
          title: 'Frontend Developer',
          href: '/developers/frontend-roadmap',
          description:
            'Web fundamentals, HTML5, CSS layout systems, modern JavaScript, and React interface engineering.',
        },
        {
          title: 'Python Backend Developer',
          href: '/developers/python-backend-roadmap',
          description:
            'Programming paradigms, data modeling with relational databases, and Django REST services.',
        },
      ]

  return (
    <section className="mt-12" aria-labelledby="career-paths-heading">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand dark:text-night-brand">
            Career Preparedness
          </p>
          <h2 id="career-paths-heading" className="mt-2 font-display text-2xl font-medium text-ink dark:text-night-ink sm:text-3xl">
            Recommended Developer Roadmaps for {isMca ? 'MCA' : 'BCA'} Students
          </h2>
        </div>
        <Link
          to="/careers"
          className={`inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline dark:text-night-brand ${focus}`}
        >
          <span>Open Career Explorer</span>
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${muted}`}>
        Align your semester study with industry engineering standards. Step-by-step milestones with reproducible project builds.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {tracks.map(track => (
          <Link
            key={track.href}
            to={track.href}
            className={`${panel} group flex flex-col justify-between p-5 transition-colors hover:border-brand dark:hover:border-night-brand motion-reduce:transition-none sm:p-6 ${focus}`}
          >
            <div>
              <div className="flex items-center gap-2 text-brand dark:text-night-brand">
                <Code size={18} aria-hidden="true" />
                <h3 className="font-display text-lg font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand">
                  {track.title}
                </h3>
              </div>
              <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
                {track.description}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 border-t border-line pt-3 text-xs font-semibold text-brand dark:border-night-line dark:text-night-brand">
              <span>View roadmap</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
