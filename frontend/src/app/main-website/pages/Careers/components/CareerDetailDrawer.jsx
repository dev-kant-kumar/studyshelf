import { Link } from 'react-router-dom'
import { ArrowRight, Code2, Layers, Briefcase, Zap, TrendingUp, BookOpen } from 'lucide-react'
import Drawer from '@/ui/Drawer'
import { muted, focus } from '@/ui/classes'

export default function CareerDetailDrawer({ selected, onClose }) {
  if (!selected) return null

  return (
    <Drawer
      open={Boolean(selected)}
      onClose={onClose}
      title={selected.name}
      widthClassName="w-full sm:w-[min(90vw,640px)]"
    >
      <div className="space-y-6">
        {/* Summary & Category */}
        <div>
          <span className="inline-flex rounded-md bg-selected px-2.5 py-0.5 text-xs font-semibold text-brand dark:bg-night-selected dark:text-night-brand">
            {selected.group}
          </span>
          <p className={`mt-3 text-sm leading-relaxed ${muted}`}>
            {selected.summary}
          </p>
        </div>

        {/* Roles to Explore */}
        <section>
          <div className="flex items-center gap-2">
            <Briefcase size={16} className="text-brand dark:text-night-brand" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-night-ink">
              Job Roles to Explore
            </h3>
          </div>
          <ul className="mt-2.5 grid gap-2 text-xs sm:grid-cols-2">
            {selected.roles.map(role => (
              <li
                key={role}
                className="flex items-center gap-2 rounded-lg border border-line bg-soft/60 px-3 py-2 font-medium text-ink dark:border-night-line dark:bg-night-soft/40 dark:text-night-ink"
              >
                <span className="size-1.5 rounded-full bg-brand shrink-0 dark:bg-night-brand" aria-hidden="true" />
                <span>{role}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Skills You Will Use */}
        <section>
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-brand dark:text-night-brand" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-night-ink">
              Core Technical Skills
            </h3>
          </div>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {selected.skills.map(skill => (
              <span
                key={skill}
                className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs font-medium text-ink dark:border-night-line dark:bg-night-surface dark:text-night-ink"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Where to Start */}
        <section className="rounded-xl border border-line bg-surface p-4 dark:border-night-line dark:bg-night-surface">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-brand dark:text-night-brand" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-night-ink">
              Where to Start
            </h3>
          </div>
          <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
            {selected.start}
          </p>
        </section>

        {/* Recommended Starter Project */}
        <section className="rounded-xl border border-brand/40 bg-selected/50 p-4 dark:border-night-brand/40 dark:bg-night-selected/40">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-brand dark:text-night-brand" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-brand dark:text-night-brand">
              Recommended Starter Project
            </h3>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-ink dark:text-night-ink">
            {selected.project}
          </p>
        </section>

        {/* Career Progression & Specialisation */}
        <section>
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-brand dark:text-night-brand" aria-hidden="true" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-night-ink">
              Career Growth & Specialisation
            </h3>
          </div>
          <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
            {selected.later}
          </p>
        </section>

        {/* Available Roadmaps on Study Shelf */}
        {selected.roadmaps && (
          <nav aria-label={`${selected.name} roadmaps`} className="border-t border-line pt-4 dark:border-night-line">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-brand dark:text-night-brand" aria-hidden="true" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-night-ink">
                Available Developer Roadmaps
              </h3>
            </div>
            <div className="mt-3 space-y-2">
              {selected.roadmaps.map(([label, href]) => (
                <Link
                  key={href}
                  to={href}
                  onClick={onClose}
                  className={`flex items-center justify-between rounded-lg border border-line bg-soft/70 px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:bg-selected hover:text-brand dark:border-night-line dark:bg-night-soft/60 dark:text-night-ink dark:hover:border-night-brand dark:hover:bg-night-selected dark:hover:text-night-brand ${focus}`}
                >
                  <span>Explore {label} Roadmap</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </Drawer>
  )
}
