import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Plus, Minus, List, BookOpen } from 'lucide-react'
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
import { panel, muted, focus, eyebrow } from '@/ui/classes'
export default function Subject() {
  const { course: courseId, semester: semesterId, subject: paperId } = useParams()
  const { hash } = useLocation()
  const course = getCourse(courseId), semester = getSemester(courseId, semesterId), paper = getPaper(courseId, semesterId, paperId)
  if (!paper) return <ErrorPage />
  return <SubjectContent key={`${paper.href}${hash}`} course={course} semester={semester} paper={paper} hash={hash} />
}
function SubjectContent({ course, semester, paper, hash }) {
  const selected = paper.units.find(unit => `#${unit.id}` === hash)?.id ?? paper.units[0]?.id
  const [expanded, setExpanded] = useState(selected)
  return <CatalogueLayout>
    <DocumentHead title={`${paper.title} - ${course.name} ${semester.title}`} description={`Explore ${paper.title} syllabus units and available study notes for ${course.name} ${semester.title}.`} path={paper.href} noindex={!paper.units.length && !paper.noteCount} />
    <Breadcrumbs items={[{label:course.name,href:course.href},{label:semester.title,href:semester.href},{label:paper.title}]} />
    <PageIntro eyebrow={paper.code} title={paper.title}>
      <div className={`mt-4 flex flex-wrap items-center gap-3 text-sm ${muted}`}><KindBadge kind={paper.kind} group={paper.electiveGroup} />{paper.credits != null && <span>{paper.credits} credits</span>}{paper.marks != null && <span>{paper.marks} marks</span>}<span>{paper.noteCount} published notes</span></div>
      <SyllabusLabel course={course} />
    </PageIntro>
    <div className="grid items-start gap-8 lg:grid-cols-[224px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24"><nav aria-label="Subject units" className={`${panel} p-5`}>
        <p className={`${eyebrow} mb-4 flex items-center gap-2`}><List size={16} aria-hidden="true" />In this subject</p>
        {paper.units.length ? <ul className="space-y-1">{paper.units.map(unit => <li key={unit.id}><a aria-current={expanded === unit.id ? 'location' : undefined} onClick={() => setExpanded(unit.id)} className={`flex min-h-11 items-start gap-3 rounded-lg px-2 py-2.5 text-sm hover:bg-soft dark:hover:bg-night-soft ${expanded === unit.id ? 'bg-selected text-brand dark:bg-night-selected dark:text-night-brand' : ''} ${focus}`} href={`#${unit.id}`}><span className="mt-0.5 font-mono text-xs text-brand dark:text-night-brand">{String(unit.number).padStart(2,'0')}</span><span>{unit.title}</span></a></li>)}</ul> : <p className={`text-sm ${muted}`}>A detailed unit outline is not supplied for this paper.</p>}
      </nav></aside>
      <div className="min-w-0">
        {paper.noteCount === 0 && <div className={`${panel} mb-6 flex items-start gap-3 p-5`}><BookOpen size={21} className="mt-0.5 shrink-0 text-brand dark:text-night-brand" aria-hidden="true" /><div><h2 className="font-semibold">Notes are on their way.</h2><p className={`mt-1 text-sm ${muted}`}>For now, use the syllabus outline to see what this subject covers.</p></div></div>}
        {paper.units.length ? <div className="space-y-5">{paper.units.map(unit => {
          const open = expanded === unit.id
          const topics = unit.topicCoverage ?? []
          const covered = topics.filter(topic => topic.notes.length).length
          const upcoming = topics.filter(topic => !topic.notes.length)
          return <section className={`${panel} scroll-mt-24 overflow-hidden`} id={unit.id} key={unit.id}>
            <h2><button type="button" id={`${unit.id}-heading`} aria-expanded={open} aria-controls={`${unit.id}-content`} onClick={() => setExpanded(open ? null : unit.id)} className={`flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6 ${focus}`}>
              <span className="min-w-0"><span className={`block ${eyebrow}`}>Unit {String(unit.number).padStart(2,'0')}</span><span className="mt-3 block text-xl font-semibold leading-snug">{unit.title}</span><span className={`mt-3 block text-sm font-normal ${muted}`}>{topics.length ? `${covered} of ${topics.length} syllabus topics covered` : `${unit.notes.length} published notes`}</span></span>
              <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded bg-selected text-brand dark:bg-night-selected dark:text-night-brand">{open ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}</span>
            </button></h2>
            <div role="region" aria-labelledby={`${unit.id}-heading`} id={`${unit.id}-content`} hidden={!open} className="border-t border-line px-5 pb-5 dark:border-night-line sm:px-6 sm:pb-6 print:block">
              {!topics.length && unit.syllabusText && <><h3 className="mt-5 text-sm font-semibold">Syllabus topics</h3><p className={`mt-3 text-base leading-7 ${muted}`}>{unit.syllabusText}</p></>}
              {unit.notes.length > 0 ? <NoteLinks notes={unit.notes} /> : <p className={`mt-5 text-sm ${muted}`}>Notes will be added here.</p>}
              {upcoming.length > 0 && <><h3 className="mt-5 text-sm font-semibold">Topics awaiting notes</h3><ul className={`mt-3 space-y-2 text-sm ${muted}`}>{upcoming.map(topic => <li key={topic.id}>{topic.title}</li>)}</ul></>}
              {unit.sourcePage && <p className={`mt-4 text-xs ${muted}`}>Syllabus: supplied PDF, page {unit.sourcePage}.</p>}
            </div>
          </section>
        })}</div> : <EmptyState compact title="No detailed outline supplied." description="This paper appears in the course structure, but the supplied document does not list units for it. Study material will be added when available." />}
      </div>
    </div>
    <SyllabusNotice course={course} />
  </CatalogueLayout>
}
