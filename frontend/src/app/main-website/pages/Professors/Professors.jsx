import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Search } from 'lucide-react'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import DocumentHead from '../../shared/components/DocumentHead'
import { panel, title, muted, focus, eyebrow, secondary } from '@/ui/classes'
import { departmentPeople, filterProfessors, professorHref } from './facultyData'
import FacultySource from './FacultySource'
import ProfessorPhoto from './ProfessorPhoto'

export default function Professors() {
  const [query, setQuery] = useState('')
  const results = filterProfessors(query)
  return <CatalogueLayout>
    <DocumentHead title="VBU BCA & MCA Faculty and Staff" description="Find BCA and MCA professors, their specializations, qualifications, and published contact details." path="/professors" />
    <Breadcrumbs items={[{ label: 'Professors' }]} />
    <div className="mb-8 max-w-2xl"><p className={eyebrow}>VBU / Department of Computer Applications</p><h1 className={`${title} mt-3`} tabIndex={-1}>Faculty and departmental staff.</h1><p className={`mt-4 text-lg leading-8 ${muted}`}>Find your BCA and MCA professors and the staff supporting your department.</p></div>
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div className="w-full sm:max-w-md"><label htmlFor="faculty-search" className="mb-2 block text-sm font-semibold">Search faculty and staff</label><div className={`${panel} flex items-center gap-3 px-3 focus-within:ring-2 focus-within:ring-brand`}><Search size={18} className={muted} aria-hidden="true" /><input id="faculty-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Name, specialization, or qualification" className="min-h-12 w-full min-w-0 bg-transparent text-base outline-none" /></div></div><p role="status" className={`text-sm ${muted}`}>{results.length} of {departmentPeople.length} people</p></div>
    {['faculty', 'staff'].map(category => { const people = results.filter(person => (person.category ?? 'faculty') === category); return people.length > 0 && <section key={category} className="mt-8" aria-label={category === 'staff' ? 'Departmental staff' : 'Faculty members'}><h2 className="mb-4 font-display text-2xl">{category === 'staff' ? 'Departmental staff' : 'Faculty members'}</h2><ul className="grid gap-4 md:grid-cols-2">{people.map(person => <li key={person.id}><Link to={professorHref(person.id)} className={`${panel} group flex h-full items-start gap-4 p-5 transition-colors hover:border-brand dark:hover:border-night-brand sm:p-6 ${focus}`}><ProfessorPhoto person={person} /><div className="min-w-0 flex-1"><p className={`text-xs ${muted}`}>{person.designation}</p><h3 className="mt-1 font-display text-xl leading-snug">{person.name}</h3>{person.specialization && <p className="mt-4 text-sm font-semibold text-brand dark:text-night-brand">{person.specialization}</p>}{person.qualification && <p className={`mt-2 text-sm leading-6 ${muted}`}>{person.qualification}</p>}<span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold">View profile <ArrowUpRight size={15} aria-hidden="true" /></span></div></Link></li>)}</ul></section> })}
    {!results.length && <div className={`${panel} p-8 text-center`}><h2 className="text-xl font-semibold">No faculty or staff match your search</h2><p className={`mt-2 ${muted}`}>Try a name or an area such as software engineering.</p><button type="button" className={`${secondary} mt-5`} onClick={() => setQuery('')}>Clear search</button></div>}
    <FacultySource />
  </CatalogueLayout>
}
