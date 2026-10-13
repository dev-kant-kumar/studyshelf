import { Link } from 'react-router-dom'
import { notes, courses } from '../../notesData'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import PageIntro from '../../shared/components/PageIntro'
import DocumentHead from '../../shared/components/DocumentHead'
import NoteLinks from '../../shared/components/NoteLinks'
import EmptyState from '../../shared/components/EmptyState'
import { panel, muted, link } from '@/ui/classes'
export default function Updates(){const latest=[...notes].sort((a,b)=>(b.updatedAt??'').localeCompare(a.updatedAt??'')||(a.order??0)-(b.order??0));return <CatalogueLayout><DocumentHead title="Latest notes" description="See the latest published and updated Study Shelf chapters and which courses have available notes." path="/updates"/><PageIntro eyebrow="Latest notes" title="What is on the shelf now." description="Published chapters, ordered by their recorded update date. More subjects and units will be added as they are ready."/><div className="mb-8 grid gap-4 sm:grid-cols-2">{courses.map(course=><section key={course.id} className={`${panel} p-6`}><h2 className="text-xl font-semibold">{course.name}</h2><p className={`mt-2 ${muted}`}>{course.noteCount} published chapters</p><Link className={`${link} mt-4 inline-block`} to={course.href}>Explore {course.name}</Link></section>)}</div><section className={`${panel} p-5 sm:p-8`}><h2 className="text-2xl font-semibold">Published and updated chapters</h2>{latest.length?<NoteLinks notes={latest}/>:<EmptyState compact title="The first notes are on their way." description="Browse the course outlines to see what is planned."/>}</section></CatalogueLayout>}
