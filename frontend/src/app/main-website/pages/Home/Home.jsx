import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Illustration from '../../shared/components/Illustration'
import { courses, notes, getNote } from '../../notesData'
import CourseLink from './components/CourseLink'
import RoutineWidget from './components/RoutineWidget'
import DeveloperShowcase from './components/DeveloperShowcase'
import LearningFeatures from './components/LearningFeatures'
import SearchField from '../../shared/components/SearchField'
import NoteLinks from '../../shared/components/NoteLinks'
import DocumentHead from '../../shared/components/DocumentHead'
import { usePreferences } from '../../shared/hooks/preferencesContext'
import { container, eyebrow, muted, link, focus } from '@/ui/classes'

export default function Home() {
  const { preferences } = usePreferences()
  const recent = preferences.recent.map(getNote).filter(Boolean)
  const latest = [...notes]
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
    .slice(0, 4)

  return (
    <>
      <DocumentHead
        title="BCA, MCA & Developer Learning Resources"
        description="Explore VBU BCA and MCA syllabus outlines, published MCA notes, worked examples and revision, plus developer roadmaps and projects."
      />

      {/* Hero Section */}
      <section className={`${container} grid items-center gap-8 pt-10 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10`}>
        <div className="max-w-3xl">
          <p className={eyebrow}>For VBU computer applications students in Jharkhand</p>
          <h1
            tabIndex={-1}
            className="mt-4 font-display text-[2.125rem] leading-[1.15] font-medium tracking-tight sm:text-5xl"
          >
            VBU BCA and MCA.
            <br />
            <span className="text-brand dark:text-night-brand">Syllabus, notes and revision.</span>
          </h1>
          <p className={`mt-5 max-w-xl text-lg leading-relaxed ${muted}`}>
            Study material organised around the Vinoba Bhave University CBCS curriculum. Browse the BCA and MCA syllabus by semester, subject and unit, and read published MCA chapters with worked code examples.
          </p>

          <div className="mt-8 max-w-2xl">
            <SearchField prominent />
          </div>

          {/* Quick Curriculum Jump Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className={`font-semibold uppercase tracking-wider ${muted}`}>Jump to:</span>
            <Link
              to="/courses/mca"
              className={`rounded-md border border-line bg-surface px-2.5 py-1 font-medium transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-surface dark:hover:border-night-brand dark:hover:text-night-brand ${focus}`}
            >
              MCA Syllabus
            </Link>
            <Link
              to="/courses/bca"
              className={`rounded-md border border-line bg-surface px-2.5 py-1 font-medium transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-surface dark:hover:border-night-brand dark:hover:text-night-brand ${focus}`}
            >
              BCA Syllabus
            </Link>
            <Link
              to="/routine"
              className={`rounded-md border border-line bg-surface px-2.5 py-1 font-medium transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-surface dark:hover:border-night-brand dark:hover:text-night-brand ${focus}`}
            >
              Class Routine
            </Link>
            <Link
              to="/developers"
              className={`rounded-md border border-line bg-surface px-2.5 py-1 font-medium transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-surface dark:hover:border-night-brand dark:hover:text-night-brand ${focus}`}
            >
              Developer Roadmaps
            </Link>
          </div>

          <div className="mt-5">
            <Link className={`${link} inline-flex items-center gap-2 text-sm font-medium`} to="/vbu">
              <span>Studying under VBU or an affiliated college? Read the student guide</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <Illustration
          name="study-desk"
          priority
          sizes="(min-width: 1200px) 490px, (min-width: 1024px) 42vw, (min-width: 640px) 380px, 300px"
          className="mx-auto w-full max-w-[300px] sm:max-w-[380px] lg:max-w-none"
        />
      </section>

      {/* Academic Hub: Courses & Live Class Schedule */}
      <section className={`${container} py-12 sm:py-16`} aria-labelledby="academic-hub-heading">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className={eyebrow}>Academic Library & Timetable</p>
            <h2 id="academic-hub-heading" className="mt-2 font-display text-2xl font-medium sm:text-3xl text-ink dark:text-night-ink">
              Your Course Syllabuses & Class Routine
            </h2>
          </div>
          <span className={`text-sm ${muted}`}>Vinoba Bhave University CBCS Structure</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {courses.map(course => (
            <CourseLink key={course.id} course={course} />
          ))}
          <RoutineWidget />
        </div>
      </section>

      {/* Developer Shelf Section */}
      <div className={container}>
        <DeveloperShowcase />
      </div>

      {/* Recent Reading History (if present) */}
      {recent.length > 0 && (
        <section className={`${container} pb-14`} aria-labelledby="recent-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="recent-heading" className="font-display text-2xl font-medium text-ink dark:text-night-ink">
              Pick up where you left off
            </h2>
            <Link to="/saved" className={`text-xs font-semibold text-brand hover:underline dark:text-night-brand ${focus}`}>
              View all saved notes
            </Link>
          </div>
          <NoteLinks notes={recent} />
        </section>
      )}

      {/* Recently Published Notes */}
      {latest.length > 0 && (
        <section className={`${container} pb-14`} aria-labelledby="latest-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="latest-heading" className="font-display text-2xl font-medium text-ink dark:text-night-ink">
              Recently published notes
            </h2>
            <Link to="/updates" className={`text-xs font-semibold text-brand hover:underline dark:text-night-brand ${focus}`}>
              View all syllabus updates
            </Link>
          </div>
          <NoteLinks notes={latest} />
        </section>
      )}

      {/* Technical Learning Features */}
      <LearningFeatures />
    </>
  )
}
