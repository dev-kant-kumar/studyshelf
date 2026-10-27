import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen } from 'lucide-react'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import DocumentHead from '../../shared/components/DocumentHead'
import DevelopersHero from './components/DevelopersHero'
import RoadmapGrid from './components/RoadmapGrid'
import CareerBanner from './components/CareerBanner'
import PracticalSteps from './components/PracticalSteps'
import ProjectBriefs from './components/ProjectBriefs'
import ReadinessChecklist from './components/ReadinessChecklist'
import { muted, focus } from '@/ui/classes'

export default function Developers() {
  return (
    <CatalogueLayout>
      <DocumentHead
        title="Developer Shelf - Practical Roadmaps and Student Projects"
        description="A practical starting point for BCA and MCA students moving toward software engineering: curated developer roadmaps, real campus project briefs, and a portfolio readiness checklist."
        path="/developers"
      />

      {/* Hero with Jump Pills and Dev Loop Terminal */}
      <DevelopersHero />

      {/* Quick Bridge to Career Explorer */}
      <CareerBanner />

      {/* 4 Core Developer Roadmaps */}
      <RoadmapGrid />
      <section className="my-8 rounded-xl border border-line p-6 dark:border-night-line"><h2 className="font-display text-2xl">SQL for backend engineers</h2><p className={`mt-3 ${muted}`}>Learn PostgreSQL with worked queries, actual browser results, diagrams, exercises, and labs for transactions, security, query plans, and recovery.</p><Link to="/developers/sql" className={`mt-4 inline-block text-brand underline underline-offset-4 dark:text-night-brand ${focus}`}>Open the SQL learning path</Link></section>

      {/* 4-Step Practical Methodology */}
      <PracticalSteps />

      {/* Student Project Briefs */}
      <ProjectBriefs />

      {/* Portfolio Readiness Audit Checklist */}
      <ReadinessChecklist />

      {/* Bridge back to Academic Computing Fundamentals */}
      <section className="mt-8 flex flex-col justify-between gap-4 rounded-xl border border-line bg-soft/40 p-6 sm:flex-row sm:items-center dark:border-night-line dark:bg-night-soft/30">
        <div className="flex items-start gap-3">
          <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
            <BookOpen size={16} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-ink dark:text-night-ink">
              Keep your academic fundamentals close.
            </h2>
            <p className={`mt-0.5 text-xs leading-relaxed ${muted}`}>
              Bring operating systems, database normalisation, and networking principles from your VBU syllabus into the applications you build.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/courses/mca"
            className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:hover:border-night-brand dark:hover:text-night-brand ${focus}`}
          >
            <span>MCA Subjects</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
          <Link
            to="/courses/bca"
            className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:hover:border-night-brand dark:hover:text-night-brand ${focus}`}
          >
            <span>BCA Subjects</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </CatalogueLayout>
  )
}
