import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowRight, Clock, Users, Compass, ArrowUpRight } from 'lucide-react'
import Illustration from '../../shared/components/Illustration'
import { getPaperIllustration } from '@/config/paperIllustrations'
import { getCourse, getSemester } from '../../notesData'
import ErrorPage from '../../ErrorPage'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import PageIntro from '../../shared/components/PageIntro'
import SyllabusLabel from '../../shared/components/SyllabusLabel'
import SyllabusNotice from '../../shared/components/SyllabusNotice'
import KindBadge from '../../shared/components/KindBadge'
import DocumentHead from '../../shared/components/DocumentHead'
import SemesterStats from './components/SemesterStats'
import { muted, panel, focus } from '@/ui/classes'
import { noteCountLabel } from '@/lib/format'

export default function Semester() {
  const { course: courseId, semester: semesterId } = useParams()
  const [params, setParams] = useSearchParams()

  const course = getCourse(courseId)
  const semester = getSemester(courseId, semesterId)

  const kinds = useMemo(() => (semester ? [...new Set(semester.papers.map(paper => paper.kind))] : []), [semester])
  const type = params.get('type') ?? 'all'
  const filter = kinds.includes(type) ? type : 'all'

  const papers = useMemo(
    () => (semester ? semester.papers.filter(paper => filter === 'all' || paper.kind === filter) : []),
    [semester, filter]
  )

  if (!semester || !course) return <ErrorPage />

  const kindLabels = {
    all: 'All papers',
    foundation: 'Foundation',
    core: 'Core theory',
    sessional: 'Practical labs',
    practical: 'Practical labs',
    elective: 'Electives',
  }

  return (
    <CatalogueLayout>
      <DocumentHead
        title={`VBU ${course.name} ${semester.title} Syllabus & Notes`}
        description={`Explore the VBU ${course.name} ${semester.title} syllabus, subject units, and available study notes. Find core papers, sessionals, and elective options.`}
        path={semester.href}
      />

      <Breadcrumbs
        items={[
          { label: course.name, href: course.href },
          { label: semester.title },
        ]}
      />

      <div className="mb-8 flex items-center justify-between gap-6 [&>div]:mb-0">
        <PageIntro
          eyebrow={`${course.name} / ${semester.title}`}
          title={`VBU ${course.name} ${semester.title} syllabus and notes`}
          description="Browse semester coursework, unit outlines, and published study guides mapped to the official curriculum."
        >
          <SyllabusLabel course={course} />
        </PageIntro>
      </div>

      {/* Semester Metrics */}
      <div className="mb-8">
        <SemesterStats semester={semester} />
      </div>

      {/* Quick Action Hub */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to={`/routine?course=${course.id}&semester=${semester.number}`}
          className={`${panel} group flex items-center justify-between gap-4 p-4 transition-colors hover:border-brand dark:hover:border-night-brand motion-reduce:transition-none ${focus}`}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
              <Clock size={17} aria-hidden="true" />
            </span>
            <div>
              <span className="block text-sm font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand">
                Semester {semester.number} Routine
              </span>
              <span className={`block text-xs ${muted}`}>
                Timetable and class periods
              </span>
            </div>
          </div>
          <ArrowRight size={15} className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand dark:text-night-subtle dark:group-hover:text-night-brand" aria-hidden="true" />
        </Link>

        <Link
          to="/professors"
          className={`${panel} group flex items-center justify-between gap-4 p-4 transition-colors hover:border-brand dark:hover:border-night-brand motion-reduce:transition-none ${focus}`}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
              <Users size={17} aria-hidden="true" />
            </span>
            <div>
              <span className="block text-sm font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand">
                Faculty Directory
              </span>
              <span className={`block text-xs ${muted}`}>
                Department professors and advisors
              </span>
            </div>
          </div>
          <ArrowRight size={15} className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand dark:text-night-subtle dark:group-hover:text-night-brand" aria-hidden="true" />
        </Link>

        <Link
          to="/vbu"
          className={`${panel} group flex items-center justify-between gap-4 p-4 transition-colors hover:border-brand dark:hover:border-night-brand motion-reduce:transition-none sm:col-span-2 lg:col-span-1 ${focus}`}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
              <Compass size={17} aria-hidden="true" />
            </span>
            <div>
              <span className="block text-sm font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand">
                VBU Academic Guide
              </span>
              <span className={`block text-xs ${muted}`}>
                70/30 marks & passing rules
              </span>
            </div>
          </div>
          <ArrowRight size={15} className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand dark:text-night-subtle dark:group-hover:text-night-brand" aria-hidden="true" />
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Paper category filter">
          {['all', ...kinds].map(kind => {
            const count = kind === 'all'
              ? semester.papers.length
              : semester.papers.filter(p => p.kind === kind).length

            return (
              <button
                key={kind}
                type="button"
                className={`min-h-10 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-colors ${focus} ${
                  filter === kind
                    ? 'border-brand bg-selected text-brand dark:border-night-brand dark:bg-night-selected dark:text-night-brand'
                    : 'border-line bg-surface hover:bg-soft text-subtle hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:bg-night-soft dark:hover:text-night-ink'
                }`}
                aria-pressed={filter === kind}
                onClick={() => setParams(kind === 'all' ? {} : { type: kind })}
              >
                {kindLabels[kind] ?? kind} ({count})
              </button>
            )
          })}
        </div>

        <p className={`text-xs font-medium ${muted}`} role="status">
          Showing {papers.length} of {semester.papers.length} papers
        </p>
      </div>

      {/* Papers List */}
      <div className={`${panel} divide-y divide-line overflow-hidden dark:divide-night-line`}>
        {papers.map(paper => {
          const illustration = getPaperIllustration(course.id, semester.id, paper.id)

          return (
            <Link
              key={paper.id}
              className={`group flex items-center gap-4 p-5 transition-colors hover:bg-soft dark:hover:bg-night-soft sm:gap-6 sm:p-6 ${focus}`}
              to={paper.href}
            >
              {illustration ? (
                <Illustration
                  name={illustration}
                  sizes="(min-width: 640px) 96px, 64px"
                  className="w-16 shrink-0 sm:w-20"
                />
              ) : (
                <span className="hidden w-24 shrink-0 border-l-2 border-brand pl-3 font-mono text-xs font-semibold text-brand dark:border-night-brand dark:text-night-brand sm:block">
                  {paper.code ?? paper.id.toUpperCase()}
                </span>
              )}

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <KindBadge kind={paper.kind} group={paper.electiveGroup} />
                  <span className={`text-xs font-medium ${illustration ? '' : 'sm:hidden'} ${muted}`}>
                    {paper.code}
                  </span>
                </div>

                <h2 className="text-base font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand sm:text-lg">
                  {paper.title}
                </h2>

                <div className={`mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs ${muted}`}>
                  {paper.credits != null && <span>{paper.credits} credits</span>}
                  {paper.marks != null && <span>· {paper.marks} marks</span>}
                  {paper.units.length > 0 && <span>· {paper.units.length} units</span>}
                  <span>· {noteCountLabel(paper.noteCount)}</span>
                </div>
              </div>

              <ArrowUpRight
                size={20}
                className="shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand dark:text-night-subtle dark:group-hover:text-night-brand"
                aria-hidden="true"
              />
            </Link>
          )
        })}
      </div>

      {semester.papers.some(paper => paper.kind === 'elective') && (
        <div className="mt-6 rounded-lg border border-line bg-soft/40 p-4 text-xs leading-relaxed text-subtle dark:border-night-line dark:bg-night-soft/30 dark:text-night-subtle">
          <p>
            <strong className="font-semibold text-ink dark:text-night-ink">Elective Selection Note:</strong> Choose one paper from each designated elective group. Listed elective papers are alternatives to fulfill your credit requirements, not extra compulsory courses.
          </p>
        </div>
      )}

      <SyllabusNotice course={course} />
    </CatalogueLayout>
  )
}
