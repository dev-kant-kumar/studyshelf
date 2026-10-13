import Dropdown from '@/ui/Dropdown'
import { useSearchParams } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import { courses, searchNotes } from '../../notesData'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import PageIntro from '../../shared/components/PageIntro'
import SearchField from '../../shared/components/SearchField'
import NoteLinks from '../../shared/components/NoteLinks'
import EmptyState from '../../shared/components/EmptyState'
import DocumentHead from '../../shared/components/DocumentHead'
import { panel, muted, secondary } from '@/ui/classes'
export default function Search() {
  const [params, setParams] = useSearchParams(), query = params.get('q') ?? '', courseId = params.get('course') ?? ''
  const validCourse = courses.some(course => course.id === courseId) ? courseId : ''
  const results = searchNotes(query).filter(note => !validCourse || note.courseId === validCourse)
  function search(value) { const next = {}; if (value) next.q = value; if (validCourse) next.course = validCourse; setParams(next) }
  return <CatalogueLayout><DocumentHead title="Search notes" path="/search" noindex /><PageIntro eyebrow="Find a topic" title="What are you looking for?" description="Search published notes by topic, subject, or course." /><div className={`${panel} mb-8 p-5 sm:p-6`}><SearchField id="search-page-input" defaultValue={query} onSearch={search} /><div className="mt-5 flex flex-wrap items-center gap-3"><label className="text-sm font-semibold" htmlFor="course-filter">Course</label><Dropdown id="course-filter" label="Course" options={[{value:'',label:'All courses'},...courses.map(course=>({value:course.id,label:course.name}))]} value={validCourse} onChange={value => { const next = {}; if(query)next.q=query; if(value)next.course=value; setParams(next) }} />{(query || validCourse) && <button type="button" className={`${secondary} ml-auto`} onClick={() => setParams({})}>Clear filters</button>}</div></div>{query.trim() ? <><p className={`mb-4 text-sm ${muted}`} role="status">{results.length} {results.length===1?'result':'results'} for “{query}”</p>{results.length ? <NoteLinks notes={results} /> : <EmptyState title="No notes found yet." description="The library has no matching published notes. Try a different topic or browse the MCA syllabus while the collection grows." href="/courses/mca" action="Browse MCA syllabus" icon={SearchIcon} />}</> : <EmptyState title="Start with a topic." description="Enter a topic above to search the notes library. You can also explore the course syllabus to see how subjects are organised." href="/courses/mca" action="Explore MCA" icon={SearchIcon} />}</CatalogueLayout>
}
