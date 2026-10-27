import { useState } from 'react'
import { useLocation, useParams, Link } from 'react-router-dom'
import { Plus, Minus, List, BookOpen, Layers } from 'lucide-react'
import Illustration from '../../shared/components/Illustration'
import { getPaperIllustration } from '@/config/paperIllustrations'
import { getCourse, getSemester, getPaper } from '../../notesData'
import ErrorPage from '../../ErrorPage'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import PageIntro from '../../shared/components/PageIntro'
import SyllabusLabel from '../../shared/components/SyllabusLabel'
import SyllabusNotice from '../../shared/components/SyllabusNotice'
import NoteLinks from '../../shared/components/NoteLinks'
import EmptyState from '../../shared/components/EmptyState'
import DocumentHead from '../../shared/components/DocumentHead'
import KindBadge from '../../shared/components/KindBadge'
import SubjectStats from './components/SubjectStats'
import SubjectFaculty from './components/SubjectFaculty'
import { panel, muted, focus, eyebrow } from '@/ui/classes'

export default function Subject() {
  const { course: courseId, semester: semesterId, subject: paperId } = useParams()
  const { hash } = useLocation()

  const course = getCourse(courseId)
  const semester = getSemester(courseId, semesterId)
  const paper = getPaper(courseId, semesterId, paperId)

  if (!paper || !course || !semester) return <ErrorPage />

  return (
    <SubjectContent
      key={`${paper.href}${hash}`}
      course={course}
      semester={semester}
      paper={paper}
      hash={hash}
    />
  )
}

function SubjectContent({ course, semester, paper, hash }) {
  const illustration = getPaperIllustration(course.id, semester.id, paper.id)
  const defaultSelected = paper.units.find(unit => `#${unit.id}` === hash)?.id ?? paper.units[0]?.id

  const [openUnits, setOpenUnits] = useState(defaultSelected ? [defaultSelected] : [])

  const toggleUnit = unitId => {
    setOpenUnits(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    )
  }

  const expandAll = () => setOpenUnits(paper.units.map(u => u.id))
  const collapseAll = () => setOpenUnits([])

  return (
    <CatalogueLayout>
      <DocumentHead
        title={`${paper.title} - VBU ${course.name} ${semester.title}`}
        description={`Explore VBU ${paper.title} syllabus units and available study notes for ${course.name} ${semester.title}.`}
        path={paper.href}
        noindex={!paper.units.length && !paper.noteCount && !paper.practicalText}
      />

      <Breadcrumbs
        items={[
          { label: course.name, href: course.href },
          { label: semester.title, href: semester.href },
          { label: paper.title },
        ]}
      />

      {/* Subject Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-6 sm:mb-8 sm:flex-row sm:items-center [&>div]:mb-0">
        <PageIntro eyebrow={paper.code ?? paper.id.toUpperCase()} title={paper.title}>
          <div className={`mt-3 flex flex-wrap items-center gap-2 text-xs sm:gap-3 sm:text-sm ${muted}`}>
            <KindBadge kind={paper.kind} group={paper.electiveGroup} />
            {paper.credits != null && <span>{paper.credits} credits</span>}
            {paper.marks != null && <span>· {paper.marks} total marks</span>}
            <span>· {paper.noteCount} published notes</span>
          </div>

          <SyllabusLabel course={course} />

          {paper.examMarks != null && paper.examMarks !== paper.marks && (
            <p className={`mt-2 text-xs ${muted}`}>
              End-semester external examination: {paper.examMarks} marks. Total marks above follow official CBCS course structure.
            </p>
          )}
        </PageIntro>

        {illustration && (
          <Illustration
            name={illustration}
            minWidth={640}
            priority
            sizes="(min-width: 768px) 192px, 128px"
            className="hidden w-32 shrink-0 sm:block md:w-44"
          />
        )}
      </div>

      {/* Paper Metric Badges */}
      <div className="mb-6 sm:mb-8">
        <SubjectStats paper={paper} />
      </div>

      {/* Assigned Department Faculty */}
      <SubjectFaculty course={course} semester={semester} paper={paper} />

      {paper.sourceNote && (
        <aside aria-label="Source clarification" className={`${panel} mb-6 p-4 sm:p-5`}>
          <h2 className="font-semibold text-ink dark:text-night-ink">
            A note about the supplied syllabus
          </h2>
          <p className={`mt-2 text-sm leading-relaxed ${muted}`}>{paper.sourceNote}</p>
        </aside>
      )}

      {/* Units & Syllabus Navigation */}
      <div className="grid items-start gap-6 lg:gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Sticky Sidebar Navigation */}
        <aside className="lg:sticky lg:top-24">
          <nav aria-label="Subject units navigation" className={`${panel} p-4 sm:p-5`}>
            <p className={`${eyebrow} mb-3 flex items-center gap-2`}>
              <List size={15} aria-hidden="true" />
              <span>Syllabus Units</span>
            </p>

            {paper.units.length > 0 ? (
              <>
                <ul className="space-y-1">
                  {paper.units.map(unit => {
                    const isOpen = openUnits.includes(unit.id)
                    return (
                      <li key={unit.id}>
                        <a
                          aria-current={isOpen ? 'location' : undefined}
                          onClick={e => {
                            e.preventDefault()
                            if (!openUnits.includes(unit.id)) {
                              setOpenUnits(prev => [...prev, unit.id])
                            }
                            const el = document.getElementById(unit.id)
                            el?.scrollIntoView({ behavior: 'smooth' })
                          }}
                          className={`flex min-h-10 items-start gap-2.5 rounded-lg px-2.5 py-2 text-xs transition-colors hover:bg-soft dark:hover:bg-night-soft ${
                            isOpen
                              ? 'bg-selected font-medium text-brand dark:bg-night-selected dark:text-night-brand'
                              : 'text-subtle dark:text-night-subtle'
                          } ${focus}`}
                          href={`#${unit.id}`}
                        >
                          <span className="mt-0.5 font-mono text-[11px] font-semibold text-brand dark:text-night-brand">
                            {String(unit.number).padStart(2, '0')}
                          </span>
                          <span className="line-clamp-2">{unit.title}</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>

                <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs dark:border-night-line">
                  <button
                    type="button"
                    onClick={expandAll}
                    className={`text-brand hover:underline dark:text-night-brand ${focus}`}
                  >
                    Expand all
                  </button>
                  <span className={muted}>·</span>
                  <button
                    type="button"
                    onClick={collapseAll}
                    className={`text-subtle hover:text-ink dark:text-night-subtle dark:hover:text-night-ink ${focus}`}
                  >
                    Collapse all
                  </button>
                </div>
              </>
            ) : (
              <p className={`text-xs ${muted}`}>
                A detailed unit outline is not supplied for this paper.
              </p>
            )}
          </nav>

          {/* Quick Timetable Link */}
          <div className="mt-4">
            <Link
              to={`/routine?course=${course.id}&semester=${semester.number}`}
              className={`${panel} block p-3.5 text-xs font-semibold text-subtle transition-colors hover:border-brand hover:text-brand dark:text-night-subtle dark:hover:border-night-brand dark:hover:text-night-brand sm:p-4 ${focus}`}
            >
              <span>View Semester {semester.number} Routine</span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="min-w-0">
          {paper.noteCount === 0 && (
            <div className={`${panel} mb-6 flex items-start gap-3.5 p-4 sm:p-5`}>
              <BookOpen size={20} className="mt-0.5 shrink-0 text-brand dark:text-night-brand" aria-hidden="true" />
              <div>
                <h2 className="font-semibold text-ink dark:text-night-ink">
                  Syllabus Outlines Ready
                </h2>
                <p className={`mt-1 text-sm ${muted}`}>
                  Use the unit outlines and topic checklists below to guide your exam preparation while detailed notes are developed.
                </p>
              </div>
            </div>
          )}

          {paper.units.length > 0 ? (
            <div className="space-y-4 sm:space-y-5">
              {paper.units.map(unit => {
                const open = openUnits.includes(unit.id)
                const topics = unit.topicCoverage ?? []
                const covered = topics.filter(topic => topic.notes.length).length
                const upcoming = topics.filter(topic => !topic.notes.length)

                return (
                  <section className={`${panel} scroll-mt-24 overflow-hidden`} id={unit.id} key={unit.id}>
                    <h2>
                      <button
                        type="button"
                        id={`${unit.id}-heading`}
                        aria-expanded={open}
                        aria-controls={`${unit.id}-content`}
                        onClick={() => toggleUnit(unit.id)}
                        className={`flex w-full items-start justify-between gap-3 p-4 text-left transition-colors sm:gap-4 sm:p-6 ${focus}`}
                      >
                        <span className="min-w-0">
                          <span className={`block ${eyebrow}`}>
                            Unit {String(unit.number).padStart(2, '0')}
                          </span>
                          <span className="mt-2 block font-display text-lg font-semibold leading-snug text-ink dark:text-night-ink sm:text-xl">
                            {unit.title}
                          </span>
                          <span className={`mt-2 block text-xs font-normal ${muted}`}>
                            {topics.length
                              ? `${covered} of ${topics.length} syllabus topics covered`
                              : `${unit.notes.length} published study notes`}
                          </span>
                        </span>

                        <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
                          {open ? <Minus size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                        </span>
                      </button>
                    </h2>

                    <div
                      role="region"
                      aria-labelledby={`${unit.id}-heading`}
                      id={`${unit.id}-content`}
                      hidden={!open}
                      className="border-t border-line px-4 pb-4 dark:border-night-line sm:px-6 sm:pb-6 print:block"
                    >
                      {!topics.length && unit.syllabusText && (
                        <>
                          <h3 className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand dark:text-night-brand sm:mt-5">
                            Official Syllabus Topics
                          </h3>
                          <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
                            {unit.syllabusText}
                          </p>
                        </>
                      )}

                      {unit.notes.length > 0 ? (
                        <div className="mt-4 sm:mt-5">
                          <NoteLinks notes={unit.notes} />
                        </div>
                      ) : (
                        <p className={`mt-4 text-xs italic ${muted}`}>
                          Detailed chapter notes for this unit will appear here once authored.
                        </p>
                      )}

                      {upcoming.length > 0 && (
                        <>
                          <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-subtle dark:text-night-subtle sm:mt-6">
                            Topics in this Unit Checklist
                          </h3>
                          <ul className={`mt-2 space-y-1.5 text-xs ${muted}`}>
                            {upcoming.map(topic => (
                              <li key={topic.id} className="flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-brand/50 dark:bg-night-brand/50" />
                                <span>{topic.title}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                      {unit.sourcePage && (
                        <p className={`mt-4 text-[11px] ${muted}`}>
                          Curriculum reference: official VBU syllabus PDF, page {unit.sourcePage}.
                        </p>
                      )}
                    </div>
                  </section>
                )
              })}
            </div>
          ) : paper.practicalText ? (
            <section className={`${panel} p-5 sm:p-7`}>
              <div className="flex items-center gap-2 text-brand dark:text-night-brand">
                <Layers size={20} aria-hidden="true" />
                <h2 className="font-display text-lg font-semibold text-ink dark:text-night-ink sm:text-xl">
                  Practical Laboratory Curriculum
                </h2>
              </div>
              <p className={`mt-4 text-sm leading-relaxed ${muted}`}>{paper.practicalText}</p>
              {paper.detailPage && (
                <p className={`mt-4 text-xs ${muted}`}>
                  Syllabus reference: official VBU PDF, page {paper.detailPage}.
                </p>
              )}
            </section>
          ) : (
            <EmptyState
              compact
              title="No detailed outline supplied."
              description="This paper appears in the official course structure, but the supplied document does not list separate unit descriptions. Study guidance will be added when available."
            />
          )}
        </div>
      </div>

      <SyllabusNotice course={course} />
    </CatalogueLayout>
  )
}
