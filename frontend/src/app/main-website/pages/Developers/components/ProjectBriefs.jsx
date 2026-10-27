import { CheckCircle2, Zap } from 'lucide-react'
import { eyebrow, muted } from '@/ui/classes'

const projects = [
  {
    title: 'Campus Study Planner',
    difficulty: 'Beginner',
    difficultyColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    stack: 'HTML, CSS, JavaScript (or React) & LocalStorage',
    desc: 'Help university students manage assignments, deadlines, and study priorities.',
    mvp: [
      'Create and delete subjects and study tasks',
      'Set target completion dates and priority levels',
      'Filter tasks by pending, overdue, and completed',
      'Persist all data in browser storage across reloads',
    ],
    stretch: 'Add keyboard navigation shortcuts and an export option for weekly schedules.',
  },
  {
    title: 'Resource & Notes Repository',
    difficulty: 'Intermediate',
    difficultyColor: 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-500/20',
    stack: 'Python (Django) or Node.js (Express) & PostgreSQL',
    desc: 'Centralize academic notes, previous year question papers, and lab manuals.',
    mvp: [
      'Store resource titles, course tags, paper codes, and links',
      'Instant search and multi-tag filtering system',
      'Server-side validation for missing or invalid metadata',
      'Relational tables with foreign key constraints',
    ],
    stretch: 'Prevent duplicate link submissions and add a verified faculty badge.',
  },
  {
    title: 'Placement & Internship Tracker',
    difficulty: 'Advanced',
    difficultyColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    stack: 'Java (Spring Boot) or Python & PostgreSQL',
    desc: 'Track tech company applications, OA tests, interviews, and offer letters.',
    mvp: [
      'Pipeline stages: Applied, OA, Interview, Offer, Rejected',
      'Timeline log recording date and notes for each status change',
      'Student account authentication and ownership isolation',
      'Paginated search by role title and recruitment drive date',
    ],
    stretch: 'Implement automated status progression tests and CSV export for college TPO records.',
  },
]

export default function ProjectBriefs() {
  return (
    <section id="project-briefs" aria-labelledby="projects-heading" className="scroll-mt-20 mb-12">
      <div>
        <p className={eyebrow}>Student Project Briefs</p>
        <h2 id="projects-heading" className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl dark:text-night-ink">
          Build for campus life.
        </h2>
        <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${muted}`}>
          Pick one real student problem. Build and test the core MVP features before attempting the stretch goal.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {projects.map(project => (
          <article
            key={project.title}
            className="flex flex-col justify-between rounded-xl border border-line bg-surface p-4.5 shadow-xs dark:border-night-line dark:bg-night-surface sm:p-6"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold ${project.difficultyColor}`}>
                  {project.difficulty}
                </span>
                <span className="font-mono text-[11px] text-subtle dark:text-night-subtle">
                  Self-Paced
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="mt-3 font-display text-lg font-bold text-ink dark:text-night-ink">
                {project.title}
              </h3>
              <p className={`mt-1.5 text-xs leading-relaxed ${muted}`}>
                {project.desc}
              </p>

              {/* Stack Recommendation */}
              <div className="mt-3 rounded-md bg-soft/60 px-2.5 py-1.5 text-[11px] font-mono text-ink dark:bg-night-soft/50 dark:text-night-ink">
                <span className="font-semibold text-subtle dark:text-night-subtle">Stack: </span>
                {project.stack}
              </div>

              {/* Core MVP Checklist */}
              <div className="mt-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-ink dark:text-night-ink">
                  <CheckCircle2 size={13} className="text-brand dark:text-night-brand" aria-hidden="true" />
                  <span>Core MVP Deliverables</span>
                </p>
                <ul className="mt-2 space-y-1.5">
                  {project.mvp.map(item => (
                    <li key={item} className="flex items-start gap-2 text-xs text-subtle dark:text-night-subtle">
                      <span className="mt-1 size-1 rounded-full bg-brand shrink-0 dark:bg-night-brand" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Stretch Goal */}
            <div className="mt-5 border-t border-line/70 pt-3 dark:border-night-line/70">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-brand dark:text-night-brand">
                <Zap size={13} aria-hidden="true" />
                <span>Stretch Challenge</span>
              </p>
              <p className={`mt-1 text-xs leading-relaxed ${muted}`}>
                {project.stretch}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
