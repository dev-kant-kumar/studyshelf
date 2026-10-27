import { Link } from 'react-router-dom'
import { ArrowRight, Server, Globe, Database, Cpu } from 'lucide-react'
import { eyebrow, muted, focus } from '@/ui/classes'

const roadmapsList = [
  {
    slug: 'nodejs-roadmap',
    title: 'Node.js Backend Developer',
    category: 'Backend & APIs',
    icon: Server,
    color: 'emerald',
    stack: ['JavaScript', 'TypeScript', 'Node.js', 'PostgreSQL'],
    deliverable: 'Build production APIs, secure data with JWT, write database migrations, and deploy services.',
    targetProject: 'Production REST API with Auth & DB',
  },
  {
    slug: 'frontend-roadmap',
    title: 'Frontend Web Developer',
    category: 'Client-Side & UI',
    icon: Globe,
    color: 'sky',
    stack: ['HTML5', 'CSS3 / Tailwind', 'TypeScript', 'React'],
    deliverable: 'Build accessible interfaces, stateful UI components, test user flows, and deploy web applications.',
    targetProject: 'Study Planner Web App with API Sync',
  },
  {
    slug: 'python-backend-roadmap',
    title: 'Python Backend Developer',
    category: 'Data & Backend',
    icon: Database,
    color: 'amber',
    stack: ['Python', 'Django', 'PostgreSQL', 'Django REST'],
    deliverable: 'Model relational schemas, build authenticated endpoints, and manage background job queues.',
    targetProject: 'Campus Resource Library with Ownership Rules',
  },
  {
    slug: 'java-backend-roadmap',
    title: 'Java Backend Developer',
    category: 'Enterprise Backend',
    icon: Cpu,
    color: 'rose',
    stack: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Spring Security'],
    deliverable: 'Domain-driven architecture, ACID transactions, Spring Boot microservices, and observability.',
    targetProject: 'Internship Tracker API with Audit History',
  },
]

export default function RoadmapGrid() {
  return (
    <section id="roadmaps" aria-labelledby="roadmaps-heading" className="scroll-mt-20 mb-12">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className={eyebrow}>Structured Learning Paths</p>
          <h2 id="roadmaps-heading" className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl dark:text-night-ink">
            Choose what you want to build.
          </h2>
          <p className={`mt-2 max-w-2xl text-sm leading-relaxed ${muted}`}>
            Each roadmap is divided into 8 prerequisite stages with real milestone challenges, vetted documentation sources, and verification checklists.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {roadmapsList.map(roadmap => {
          const Icon = roadmap.icon
          return (
            <article
              key={roadmap.slug}
              className="flex flex-col justify-between rounded-xl border border-line bg-surface p-6 shadow-xs transition-shadow hover:shadow-md dark:border-night-line dark:bg-night-surface"
            >
              <div>
                {/* Header Category & Badge */}
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-selected px-2.5 py-1 text-xs font-semibold text-brand dark:bg-night-selected dark:text-night-brand">
                    <Icon size={14} aria-hidden="true" />
                    <span>{roadmap.category}</span>
                  </span>
                  <span className="font-mono text-xs text-subtle dark:text-night-subtle">
                    8 Stages
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-ink dark:text-night-ink">
                  {roadmap.title}
                </h3>

                {/* Deliverable description */}
                <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
                  {roadmap.deliverable}
                </p>

                {/* Stack Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {roadmap.stack.map(tech => (
                    <span
                      key={tech}
                      className="rounded-md border border-line bg-soft/60 px-2 py-0.5 font-mono text-[11px] font-medium text-subtle dark:border-night-line dark:bg-night-soft/50 dark:text-night-subtle"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Target Project Callout */}
                <div className="mt-4 rounded-lg border border-line/60 bg-soft/40 px-3 py-2 text-xs dark:border-night-line/60 dark:bg-night-soft/30">
                  <span className="font-semibold text-ink dark:text-night-ink">Capstone project: </span>
                  <span className={muted}>{roadmap.targetProject}</span>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-6 border-t border-line pt-4 dark:border-night-line">
                <Link
                  to={`/developers/${roadmap.slug}`}
                  className={`inline-flex w-full items-center justify-between rounded-lg bg-soft/80 px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-selected hover:text-brand dark:bg-night-soft dark:text-night-ink dark:hover:bg-night-selected dark:hover:text-night-brand ${focus}`}
                >
                  <span>Explore {roadmap.title}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
