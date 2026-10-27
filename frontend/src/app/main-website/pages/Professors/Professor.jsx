import { Link, useParams } from 'react-router-dom'
import { Mail, Phone, ArrowLeft } from 'lucide-react'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import DocumentHead from '../../shared/components/DocumentHead'
import ErrorPage from '../../ErrorPage'
import { panel, title, muted, link, eyebrow, secondary } from '@/ui/classes'
import { getProfessor, professorHref } from './facultyData'
import FacultySource from './FacultySource'
import ProfessorPhoto from './ProfessorPhoto'

export default function Professor() {
  const { professor: id } = useParams()
  const person = getProfessor(id)
  if (!person) return <ErrorPage />
  return <CatalogueLayout>
    <DocumentHead title={`${person.name} - VBU Faculty and Staff`} description={person.category === 'staff' ? `${person.name}, listed in the VBU Department of Computer Applications departmental staff directory.` : `${person.name}, listed by VBU as ${person.designation}. Explore qualifications, ${person.specialization} specialization, and published contact details.`} path={professorHref(person.id)} />
    <Breadcrumbs items={[{ label: 'Professors', href: '/professors' }, { label: person.name }]} />
    <header className="mb-8 flex flex-wrap items-center gap-5 border-l-4 border-brand pl-5 dark:border-night-brand"><ProfessorPhoto person={person} large /><div><p className={eyebrow}>VBU department listing</p><h1 className={`${title} mt-3`} tabIndex={-1}>{person.name}</h1><p className={`mt-3 text-lg ${muted}`}>{person.designation}</p><p className={`mt-1 ${muted}`}>Department of Computer Applications</p><div className="mt-3 flex gap-3">{(person.courses ?? []).map(course => <Link key={course} to={`/courses/${course}`} className={`${link} text-sm uppercase`}>{course}</Link>)}</div></div></header>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      {person.category === 'staff' ? <section className={`${panel} p-6 sm:p-8`}><h2 className="font-display text-2xl">Departmental staff</h2><p className={`mt-4 leading-7 ${muted}`}>Listed in the Departmental Staff section of the VBU MCA page. Further profile details are not available from the linked document.</p></section> : <section className={`${panel} p-6 sm:p-8`} aria-labelledby="academic-details"><h2 id="academic-details" className="font-display text-2xl">Academic details</h2><dl className="mt-6 space-y-6"><div><dt className={`text-sm ${muted}`}>Specialization</dt><dd className="mt-2 text-xl font-semibold text-brand dark:text-night-brand">{person.specialization}</dd></div><div><dt className={`text-sm ${muted}`}>Qualifications as listed</dt><dd className="mt-2 leading-7">{person.qualification}</dd></div><div><dt className={`text-sm ${muted}`}>Experience reported by VBU</dt><dd className="mt-2">{person.reportedExperienceYears} years</dd><dd className={`mt-1 text-sm leading-6 ${muted}`}>This is the value on the source page, not a calculation of current experience.</dd></div></dl></section>}
      <section className={`${panel} p-6 sm:p-8`} aria-labelledby="faculty-contact"><h2 id="faculty-contact" className="font-display text-2xl">Published contact details</h2><p className={`mt-3 text-sm leading-6 ${muted}`}>Use these department-listed contacts for academic enquiries. Availability has not been confirmed.</p>{!person.emails.length && !person.phones.length && <p className={`mt-5 text-sm ${muted}`}>No contact details are available in the department listing.</p>}{person.emails.length > 0 && <><h3 className="mt-6 flex items-center gap-2 text-sm font-semibold"><Mail size={16} aria-hidden="true" />Email</h3><ul className="mt-2 space-y-2">{person.emails.map(email => <li key={email}><a className={`${link} inline-flex min-h-9 items-center break-all text-sm`} href={`mailto:${email}`}>{email}</a></li>)}</ul></>}{person.phones.length > 0 && <><h3 className="mt-6 flex items-center gap-2 text-sm font-semibold"><Phone size={16} aria-hidden="true" />Phone</h3><ul className="mt-2 space-y-2">{person.phones.map(phone => <li key={phone}><a className={`${link} inline-flex min-h-9 items-center font-mono text-sm`} href={`tel:+91${phone}`}>+91 {phone}</a></li>)}</ul></>}</section>
    </div><FacultySource /><Link className={`${secondary} mt-8`} to="/professors"><ArrowLeft size={16} aria-hidden="true" />All faculty and staff</Link>
  </CatalogueLayout>
}
