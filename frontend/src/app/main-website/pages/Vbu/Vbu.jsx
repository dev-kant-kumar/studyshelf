import { Link } from 'react-router-dom'
import { ArrowUpRight, GraduationCap } from 'lucide-react'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import DocumentHead from '../../shared/components/DocumentHead'
import PageIntro from '../../shared/components/PageIntro'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import SyllabusLabel from '../../shared/components/SyllabusLabel'
import { getCourse } from '../../notesData'
import { panel, muted, link, button, focus, secondary } from '@/ui/classes'

const colleges = [
  { name: 'Annada College, Hazaribag', href: 'https://annadacollege.ac.in/', icon: 'annada' },
  { name: "St. Columba's College, Hazaribag", href: 'https://stcchzb.ac.in/', icon: 'st-columbas' },
  { name: 'Markham College of Commerce, Hazaribag' },
  { name: "K.B. Women's College, Hazaribag", href: 'https://www.kbwomenscollege.in/Default.aspx', icon: 'kb-womens' },
  { name: 'Ramgarh College, Ramgarh', href: 'https://ramgarhcollege.in/', icon: 'ramgarh' },
  { name: 'Chatra College, Chatra', href: 'https://www.chatracollege.co.in/Default/' },
]

function CollegeEntry({ college }) {
  const content = <>
    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white p-1.5">
      {college.icon ? <img src={`/college-icons/${college.icon}.webp`} width={64} height={64} alt="" loading="lazy" decoding="async" className="size-7 object-contain" /> : <GraduationCap size={24} className="text-subtle" aria-hidden="true" />}
    </span>
    <span className="min-w-0 flex-1">{college.name}</span>
    {college.href && <ArrowUpRight size={16} className="shrink-0" aria-hidden="true" />}
  </>
  const className = 'flex min-h-16 items-center gap-3 rounded-lg border border-line p-3 dark:border-night-line'
  return <li>{college.href ? <a href={college.href} className={`${className} hover:border-brand hover:text-brand dark:hover:border-night-brand dark:hover:text-night-brand ${focus}`}>{content}</a> : <div className={className}>{content}</div>}</li>
}

export default function Vbu() {
  const mca = getCourse('mca')
  return <CatalogueLayout>
    <DocumentHead title="VBU BCA & MCA Syllabus - Student Guide" description="Find VBU MCA study notes and syllabus units, with guidance for BCA students at Vinoba Bhave University colleges in Jharkhand." path="/vbu" />
    <Breadcrumbs items={[{ label: 'VBU study guide' }]} />
    <PageIntro eyebrow="Vinoba Bhave University · Jharkhand" title="A study guide for VBU students." description="Find your semester, check your syllabus, and study one topic at a time."><SyllabusLabel course={mca} /></PageIntro>
    <Link className={`${secondary} mb-6`} to="/professors">Explore BCA and MCA professors <ArrowUpRight size={16} aria-hidden="true" /></Link>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-8">
        <section className={`${panel} p-6 sm:p-8`}>
          <h2 className="text-2xl font-semibold">VBU MCA notes and syllabus</h2>
          <p className={`mt-4 leading-7 ${muted}`}>Start with Semester 1, Fundamentals of Computers. All 15 topics in Unit 1 have published chapters, worked examples, revision practice, and questions with answers. Explore the subject catalogue for current chapter coverage, including C programming notes. Topics without published chapters are listed as syllabus outlines.</p>
          <Link className={`${button} mt-5`} to="/courses/mca/semesters/sem1/subjects/paper1#unit1">Read Fundamentals of Computers Unit 1</Link>
          <Link className={`${link} mt-4 block`} to="/courses/mca/semesters/sem1">Browse MCA Semester 1 subjects</Link>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">VBU BCA syllabus and study planning</h2>
          <p className={`mt-4 leading-7 ${muted}`}>Browse six semesters of the supplied VBU BCA CBCS syllabus, including theory units, practical guidance and elective choices. BCA chapter notes are being developed. Check the syllabus version against your course and batch.</p>
          <Link className={`${link} mt-4 inline-block`} to="/courses/mca/semesters/sem1/subjects/paper1#unit1">Explore introductory computing topics</Link><Link className={`${link} mt-3 block`} to="/courses/bca">Browse BCA semesters and subjects</Link>
        </section>
        <section className="border-t border-line pt-7 dark:border-night-line">
          <h2 className="text-2xl font-semibold">Studying at a college under VBU?</h2>
          <p className={`mt-4 leading-7 ${muted}`}>Studying at Annada, St. Columba's, Markham, or another college under VBU? Find explanations, worked examples, and revision questions for the topics in your syllabus.</p>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">{colleges.map(college => <CollegeEntry key={college.name} college={college} />)}</ul>
          <p className={`mt-5 text-sm leading-6 ${muted}`}>Match your subject and unit to the available topics, then save useful chapters for revision.</p>
          <Link className={`${link} mt-4 inline-block`} to="/search">Find a study topic</Link>
        </section>
      </div>
      <aside className="space-y-6">
        <section className={`${panel} p-6`}><h2 className="text-lg font-semibold">Check your syllabus</h2><p className={`mt-3 leading-7 ${muted}`}>Use the syllabus for your course and batch to plan your study. Check your college's outline for the topics and practical work required in your exams.</p><a className={`${link} mt-4 block`} href="https://www.vbu.ac.in/">Official VBU website</a><a className={`${link} mt-3 block`} href="https://www.vbu.ac.in/colleges">Official college directory</a></section>
        <section className={`${panel} p-6`}><h2 className="text-lg font-semibold">Previous-year questions</h2><p className={`mt-3 leading-7 ${muted}`}>Verified VBU question papers are planned. The practice questions in our notes are learning exercises, not published PYQs.</p><Link className={`${link} mt-4 block`} to="/contact">Request a topic or report a correction</Link></section>
        <p className={`text-sm leading-6 ${muted}`}>Study Shelf is an independent learning resource for VBU students.</p>
      </aside>
    </div>
  </CatalogueLayout>
}
