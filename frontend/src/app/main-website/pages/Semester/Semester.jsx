import Illustration from '../../shared/components/Illustration'
import { getPaperIllustration } from '@/config/paperIllustrations'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { getCourse, getSemester } from '../../notesData'
import ErrorPage from '../../ErrorPage'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import PageIntro from '../../shared/components/PageIntro'
import SyllabusLabel from '../../shared/components/SyllabusLabel'
import SyllabusNotice from '../../shared/components/SyllabusNotice'
import KindBadge from '../../shared/components/KindBadge'
import DocumentHead from '../../shared/components/DocumentHead'
import { muted, panel, focus } from '@/ui/classes'
import { noteCountLabel } from '@/lib/format'
export default function Semester() {
  const { course: courseId, semester: semesterId } = useParams(), [params, setParams] = useSearchParams()
  const course = getCourse(courseId), semester = getSemester(courseId, semesterId)
  if (!semester) return <ErrorPage />
  const type = params.get('type') ?? 'all', kinds = [...new Set(semester.papers.map(paper => paper.kind))]
  const filter = kinds.includes(type) ? type : 'all', papers = semester.papers.filter(paper => filter === 'all' || paper.kind === filter)
  return <CatalogueLayout><DocumentHead title={`VBU ${course.name} ${semester.title} Syllabus & Notes`} description={`Explore the VBU ${course.name} ${semester.title} syllabus, subject units, and available study notes. Find core papers, sessionals, and elective options.`} path={semester.href} /><Breadcrumbs items={[{label:course.name,href:course.href},{label:semester.title}]} /><PageIntro eyebrow={`${course.name} / ${semester.title}`} title={`VBU ${course.name} ${semester.title} syllabus and notes`} description="Find the paper you’re studying, then explore its units."><SyllabusLabel course={course} /></PageIntro><div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div className="flex flex-wrap gap-2" role="group" aria-label="Paper type">{['all',...kinds].map(kind => <button key={kind} type="button" className={`min-h-11 rounded-lg border px-4 py-2 text-sm font-semibold ${focus} ${filter === kind ? 'border-brand bg-selected text-brand dark:border-night-brand dark:bg-night-selected dark:text-night-brand' : 'border-line bg-surface dark:border-night-line dark:bg-night-surface'}`} aria-pressed={filter === kind} onClick={() => setParams(kind === 'all' ? {} : {type:kind})}>{({all:'All papers',foundation:'Foundation',core:'Core',sessional:'Sessionals',elective:'Electives'})[kind] ?? kind}</button>)}</div><p className={`text-sm ${muted}`} role="status">{papers.length} {papers.length === 1 ? 'entry' : 'entries'}</p></div><div className={`${panel} divide-y divide-line overflow-hidden dark:divide-night-line`}>{papers.map(paper => <Link key={paper.id} className={`group flex items-center gap-4 p-5 hover:bg-soft dark:hover:bg-night-soft sm:gap-6 sm:p-6 ${focus}`} to={paper.href}>{getPaperIllustration(course.id,semester.id,paper.id) ? <Illustration name={getPaperIllustration(course.id,semester.id,paper.id)} sizes="(min-width: 640px) 96px, 64px" className="w-16 shrink-0 sm:w-24" /> : <span className="hidden w-24 shrink-0 border-l-2 border-brand pl-4 font-mono text-xs text-subtle dark:border-night-brand dark:text-night-subtle sm:block">{paper.code ?? paper.id}</span>}<div className="min-w-0 flex-1"><div className="mb-2 flex flex-wrap items-center gap-2"><KindBadge kind={paper.kind} group={paper.electiveGroup} /><span className={`text-xs ${getPaperIllustration(course.id,semester.id,paper.id) ? '' : 'sm:hidden'} ${muted}`}>{paper.code}</span></div><h2 className="text-base font-semibold sm:text-lg group-hover:text-brand dark:group-hover:text-night-brand">{paper.title}</h2><p className={`mt-2 text-sm ${muted}`}>{paper.credits != null && `${paper.credits} credits · `}{paper.units.length > 0 ? `${paper.units.length} units · ` : ''}{noteCountLabel(paper.noteCount)}</p></div><ArrowUpRight size={20} className="shrink-0 text-subtle dark:text-night-subtle" aria-hidden="true" /></Link>)}</div>{semester.papers.some(paper=>paper.kind==='elective') && <p className={`mt-5 text-sm ${muted}`}>Choose one paper from each elective group. Listed options are alternatives, not extra compulsory papers.</p>}<SyllabusNotice course={course} /></CatalogueLayout>
}
