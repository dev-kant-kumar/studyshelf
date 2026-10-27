import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Clock, Users, Compass, FileText, Layers } from 'lucide-react'
import Illustration from '../../shared/components/Illustration'
import { getCourse } from '../../notesData'
import ErrorPage from '../../ErrorPage'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import PageIntro from '../../shared/components/PageIntro'
import SyllabusLabel from '../../shared/components/SyllabusLabel'
import SyllabusNotice from '../../shared/components/SyllabusNotice'
import EmptyState from '../../shared/components/EmptyState'
import DocumentHead from '../../shared/components/DocumentHead'
import CourseStats from './components/CourseStats'
import SemesterCard from './components/SemesterCard'
import ExaminationPattern from './components/ExaminationPattern'
import CourseCareerPaths from './components/CourseCareerPaths'
import { panel, focus, muted } from '@/ui/classes'

export default function Course() {
  const { course: id } = useParams()
  const course = getCourse(id)

  if (!course) return <ErrorPage />

  const isMca = course.id === 'mca'

  return (
    <CatalogueLayout>
      <DocumentHead
        title={`VBU ${course.name} Syllabus & Study Notes`}
        description={`Browse VBU ${course.name} syllabus units and available study notes for Vinoba Bhave University students in Jharkhand.`}
        path={course.href}
        noindex={!course.semesters.length}
      />

      <Breadcrumbs items={[{ label: course.name }]} />

      {/* Course Hero & Level Info */}
      <div className="mb-8 flex items-center justify-between gap-6 [&>div]:mb-0">
        <PageIntro
          eyebrow={isMca ? 'Post Graduate Degree · 2 Years' : 'Under Graduate Degree · 3 Years'}
          title={`VBU ${course.name} syllabus and study notes`}
          description={course.description}
        >
          <SyllabusLabel course={course} />
        </PageIntro>

        <Illustration
          name="learning-shelf"
          minWidth={640}
          priority
          sizes="(min-width: 768px) 250px, 140px"
          className="hidden w-36 shrink-0 sm:block md:w-[250px]"
        />
      </div>

      {/* Course Summary Metrics */}
      {course.semesters.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <CourseStats course={course} />
        </div>
      )}

      {/* Student Action & Companion Hub */}
      <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <Link
          to={`/routine?course=${course.id}&semester=1`}
          className={`${panel} group flex items-center justify-between gap-3 p-4 transition-colors hover:border-brand dark:hover:border-night-brand motion-reduce:transition-none sm:gap-4 sm:p-5 ${focus}`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
              <Clock size={19} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <span className="block truncate font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand">
                Class Timetable
              </span>
              <span className={`mt-0.5 block truncate text-xs ${muted}`}>
                {isMca ? 'Live IST class routine for Semester 1' : 'Timetable & period tracker'}
              </span>
            </div>
          </div>
          <ArrowRight size={17} className="shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand dark:text-night-subtle dark:group-hover:text-night-brand" aria-hidden="true" />
        </Link>

        <Link
          to="/professors"
          className={`${panel} group flex items-center justify-between gap-3 p-4 transition-colors hover:border-brand dark:hover:border-night-brand motion-reduce:transition-none sm:gap-4 sm:p-5 ${focus}`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
              <Users size={19} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <span className="block truncate font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand">
                Faculty Directory
              </span>
              <span className={`mt-0.5 block truncate text-xs ${muted}`}>
                Department professors and advisors
              </span>
            </div>
          </div>
          <ArrowRight size={17} className="shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand dark:text-night-subtle dark:group-hover:text-night-brand" aria-hidden="true" />
        </Link>

        <Link
          to="/vbu"
          className={`${panel} group flex items-center justify-between gap-3 p-4 transition-colors hover:border-brand dark:hover:border-night-brand motion-reduce:transition-none sm:col-span-2 sm:gap-4 sm:p-5 lg:col-span-1 ${focus}`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
              <Compass size={19} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <span className="block truncate font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand">
                VBU Academic Guide
              </span>
              <span className={`mt-0.5 block truncate text-xs ${muted}`}>
                CBCS passing rules and practical guidelines
              </span>
            </div>
          </div>
          <ArrowRight size={17} className="shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand dark:text-night-subtle dark:group-hover:text-night-brand" aria-hidden="true" />
        </Link>
      </div>

      {/* Semesters Grid */}
      <section aria-labelledby="semesters-heading">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand dark:text-night-brand">
              Semester Syllabuses
            </p>
            <h2 id="semesters-heading" className="mt-1 font-display text-2xl font-medium text-ink dark:text-night-ink sm:text-3xl">
              Curriculum by Semester
            </h2>
          </div>
          <span className={`text-sm ${muted}`}>
            Select a semester to view its papers and unit topics
          </span>
        </div>

        {course.semesters.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {course.semesters.map(semester => (
              <SemesterCard key={semester.id} semester={semester} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="This shelf is next."
            description={`The ${course.name} syllabus and study material have not been added yet. You can explore the MCA syllabus in the meantime.`}
            href="/courses/mca"
            action="Browse MCA"
            icon={Layers}
          />
        )}
      </section>

      {/* Examination Scheme */}
      {course.semesters.length > 0 && <ExaminationPattern course={course} />}

      {/* Recommended Career & Industry Paths */}
      {course.semesters.length > 0 && <CourseCareerPaths course={course} />}

      {/* Official Syllabus Document Download / Link */}
      {course.source?.url && (
        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-xl border border-line bg-soft/40 p-5 dark:border-night-line dark:bg-night-soft/30 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface text-brand dark:bg-night-surface dark:text-night-brand">
              <FileText size={18} aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-semibold text-ink dark:text-night-ink">
                Official Vinoba Bhave University Syllabus Document
              </h3>
              <p className={`mt-0.5 text-xs ${muted}`}>
                {course.source.pages ? `${course.source.pages} pages PDF` : 'University Curriculum Document'} · {course.version}
              </p>
            </div>
          </div>
          <a
            href={course.source.url}
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:hover:border-night-brand dark:hover:text-night-brand ${focus}`}
          >
            <span>{course.source.label ?? 'Download official syllabus (PDF)'}</span>
            <ArrowRight size={13} aria-hidden="true" />
          </a>
        </div>
      )}

      {/* Syllabus Notice */}
      <SyllabusNotice course={course} />
    </CatalogueLayout>
  )
}
