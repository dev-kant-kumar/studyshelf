import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Layers } from 'lucide-react'
import { getCourse } from '../../notesData'
import ErrorPage from '../../ErrorPage'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import PageIntro from '../../shared/components/PageIntro'
import SyllabusLabel from '../../shared/components/SyllabusLabel'
import SyllabusNotice from '../../shared/components/SyllabusNotice'
import EmptyState from '../../shared/components/EmptyState'
import DocumentHead from '../../shared/components/DocumentHead'
import { panel, muted, focus, eyebrow } from '@/ui/classes'
export default function Course() {
  const { course: id } = useParams(), course = getCourse(id)
  if (!course) return <ErrorPage />
  return <CatalogueLayout><DocumentHead title={`${course.name} syllabus & notes`} description={`Browse ${course.description} semesters, subjects and available notes.`} path={course.href} noindex={!course.semesters.length} /><Breadcrumbs items={[{ label: course.name }]} /><PageIntro eyebrow="Course library" title={`${course.name}, one semester at a time.`} description={course.description}><SyllabusLabel course={course} /></PageIntro>{course.semesters.length ? <div className="grid gap-4 sm:grid-cols-2">{course.semesters.map(semester => <Link key={semester.id} className={`${panel} group flex gap-5 p-6 hover:border-brand dark:hover:border-night-brand ${focus}`} to={semester.href}><span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-selected font-mono text-lg text-brand dark:bg-night-selected dark:text-night-brand">{String(semester.number).padStart(2,'0')}</span><div className="flex-1"><h2 className="font-display text-xl font-medium">{semester.title}</h2><p className={`mt-2 text-sm ${muted}`}>{semester.papers.filter(paper => paper.kind !== 'elective').length} core & sessional entries{semester.papers.some(paper => paper.kind === 'elective') ? ' + elective options' : ''}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand dark:text-night-brand">Browse subjects <ArrowRight size={16} aria-hidden="true" /></span></div></Link>)}</div> : <EmptyState title="This shelf is next." description={`The ${course.name} syllabus and study material have not been added yet. You can explore the MCA syllabus in the meantime.`} href="/courses/mca" action="Browse MCA" icon={Layers} />}<div className={`${panel} mt-8 flex items-start gap-4 p-5`}><Layers size={20} className="mt-0.5 shrink-0 text-brand dark:text-night-brand" aria-hidden="true" /><div><p className={eyebrow}>Published study notes</p><p className={`mt-2 text-sm ${muted}`}>{course.noteCount ? `${course.noteCount} notes available across this course.` : course.semesters.length ? 'No notes published yet. The syllabus outlines are available for planning your study.' : 'Study notes will appear here when they are published.'}</p></div></div><SyllabusNotice course={course} /></CatalogueLayout>
}
