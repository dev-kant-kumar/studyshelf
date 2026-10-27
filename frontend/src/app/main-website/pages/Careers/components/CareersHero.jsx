import { Compass, ArrowDown, Layers, Terminal } from 'lucide-react'
import { eyebrow, muted, focus } from '@/ui/classes'

const quickLinks = [
  { label: '16 Career Fields', href: '#fields' },
  { label: '3-Step Approach', href: '#strategy' },
  { label: 'Search Roles & Skills', href: '#filter-bar' },
]

export default function CareersHero() {
  return (
    <header className="grid items-center gap-8 border-b border-line pb-10 dark:border-night-line lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className={eyebrow}>Career Explorer / BCA & MCA</p>
        <h1
          tabIndex={-1}
          className="mt-3 font-display text-4xl leading-tight font-bold tracking-tight text-ink sm:text-5xl dark:text-night-ink"
        >
          Find the tech career <br className="hidden sm:block" />
          that fits you.
        </h1>
        <p className={`mt-4 max-w-xl text-base leading-relaxed sm:text-lg ${muted}`}>
          Explore software, data, security, cloud, and digital design. Compare real-world job roles, required technical skills, and beginner projects before choosing your roadmap.
        </p>

        {/* Quick Jump Action Pills */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {quickLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-soft/70 px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:bg-selected hover:text-brand dark:border-night-line dark:bg-night-soft/60 dark:text-night-ink dark:hover:border-night-brand dark:hover:bg-night-selected dark:hover:text-night-brand ${focus}`}
            >
              <span>{link.label}</span>
              <ArrowDown size={13} className="text-subtle dark:text-night-subtle" aria-hidden="true" />
            </a>
          ))}
        </div>

        <p className={`mt-4 text-xs font-medium text-subtle dark:text-night-subtle`}>
          Curated for computer applications students navigating campus placements and career choices.
        </p>
      </div>

      {/* Visual Role vs Stack Strategy Card */}
      <aside
        aria-label="Career strategy tip"
        className="rounded-xl border border-line bg-surface p-5 shadow-xs sm:p-6 dark:border-night-line dark:bg-night-surface"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
            <Compass size={18} aria-hidden="true" />
          </span>
          <h2 className="font-display text-base font-bold text-ink dark:text-night-ink">
            A field first. A stack second.
          </h2>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-line/60 bg-soft/40 p-3 text-xs dark:border-night-line/60 dark:bg-night-soft/30">
            <Layers size={16} className="mt-0.5 shrink-0 text-brand dark:text-night-brand" aria-hidden="true" />
            <div>
              <span className="font-bold text-ink dark:text-night-ink">The Role: </span>
              <span className={muted}>
                The problem you enjoy solving (e.g. backend data APIs, responsive UI, cloud reliability).
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-line/60 bg-soft/40 p-3 text-xs dark:border-night-line/60 dark:bg-night-soft/30">
            <Terminal size={16} className="mt-0.5 shrink-0 text-brand dark:text-night-brand" aria-hidden="true" />
            <div>
              <span className="font-bold text-ink dark:text-night-ink">The Stack: </span>
              <span className={muted}>
                Tools that support that work (Java, Python, Node.js, Go). Stacks are interchangeable across teams.
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 border-t border-line/70 pt-3 text-xs leading-relaxed text-subtle dark:border-night-line/70 dark:text-night-subtle">
          Start with the kind of engineering problems you enjoy solving. Specific languages can be picked up as required.
        </p>
      </aside>
    </header>
  )
}
