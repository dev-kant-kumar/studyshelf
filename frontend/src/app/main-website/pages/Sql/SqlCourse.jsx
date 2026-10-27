import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReaderLayout from '../../layouts/ReaderLayout'
import DocumentHead from '../../shared/components/DocumentHead'
import TableOfContents from '../../shared/components/TableOfContents'
import ReadingPreferences from '../../shared/components/ReadingPreferences'
import ComparisonTable from '../../shared/components/ComparisonTable'
import useArticleOutline from '../../shared/hooks/useArticleOutline'
import { usePreferences } from '../../shared/hooks/preferencesContext'
import ErrorPage from '../../ErrorPage'
import SqlDiagram from './SqlDiagram'
import SqlExample from './SqlExample'
import { modules, lessons, lessonHref } from './data/course'
import { focus, link, title, muted, secondary, eyebrow } from '@/ui/classes'

function Inline({ text }) {
  return String(text).split(/(`[^`]+`|\*\*[^*]+\*\*|==[^=]+==)/g).map((part,index) => part.startsWith('`') ? <code key={index} className="rounded bg-soft px-1 font-mono text-[0.9em] dark:bg-night-soft">{part.slice(1,-1)}</code> : part.startsWith('**') ? <strong key={index}>{part.slice(2,-2)}</strong> : part.startsWith('==') ? <mark key={index} className="bg-selected text-ink dark:bg-night-selected dark:text-night-ink">{part.slice(2,-2)}</mark> : part)
}
function Block({ block }) {
  if (block.type === 'code') return <SqlExample block={block} />
  if (block.type === 'table') return <ComparisonTable {...block} />
  if (block.type === 'diagram') return <SqlDiagram {...block} />
  if (block.type === 'note') return <aside className="my-6 border-l-4 border-brand bg-soft p-5 dark:border-night-brand dark:bg-night-soft"><p className="!mt-0 font-semibold">{block.title}</p><p className="!mb-0"><Inline text={block.text} /></p></aside>
  return <p><Inline text={block.text} /></p>
}
function LessonNav({ id }) {
  const [query, setQuery] = useState('')
  return <nav aria-label="SQL lessons" className="flex min-h-0 flex-col p-4">
    <Link to="/developers/sql" className={`${link} mb-4 font-semibold`}>SQL for backend engineers</Link>
    <label className="text-sm">Find a lesson<input type="search" value={query} onChange={event => setQuery(event.target.value)} className={`mt-2 mb-4 w-full rounded-lg border border-line bg-surface p-2 dark:border-night-line dark:bg-night-surface ${focus}`} /></label>
    <div data-sidebar-scroll className="min-h-0 overflow-y-auto overscroll-contain">{modules.map(module => {
      const visible = module.lessons.filter(item => `${item.title} ${item.summary}`.toLowerCase().includes(query.toLowerCase()))
      return visible.length > 0 && <section key={module.id} className="mb-5"><h2 className={`${eyebrow} mb-2`}>{module.title}</h2><ol className="space-y-1">{visible.map(item => <li key={item.id}><Link to={lessonHref(item.id)} aria-current={id === item.id ? 'page' : undefined} className={`block rounded-lg px-3 py-2 text-sm leading-snug ${focus} ${id === item.id ? 'bg-selected text-brand dark:bg-night-selected dark:text-night-brand' : 'hover:bg-soft dark:hover:bg-night-soft'}`}>{item.title}</Link></li>)}</ol></section>
    })}{!lessons.some(item => `${item.title} ${item.summary}`.toLowerCase().includes(query.toLowerCase())) && <p className="text-sm">No matching lesson. Try a SQL keyword or a broader term.</p>}</div>
  </nav>
}
const prose = 'leading-[1.8] break-words [&_p]:my-5 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2]:font-semibold [&_h2]:text-2xl [&_h3]:mt-7 [&_h3]:mb-3 [&_h3]:scroll-mt-24 [&_h3]:text-xl [&_h3]:font-semibold [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 dark:[&_a]:text-night-brand [&_li]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_summary]:cursor-pointer [&_summary]:font-semibold [&_summary]:py-3 [&_pre]:overflow-x-auto print:[&_pre]:whitespace-pre-wrap'

export default function SqlCourse() {
  const { lesson: id } = useParams()
  const current = lessons.find(item => item.id === id)
  const article = useRef(null)
  const { headings, active, minutes } = useArticleOutline(article, id)
  const { preferences } = usePreferences()
  const index = lessons.findIndex(item => item.id === id)
  if (id && !current) return <ErrorPage />
  const nav = <LessonNav id={id} />
  const name = current?.title ?? 'SQL for backend engineers'
  const description = current?.summary ?? 'Learn SQL and PostgreSQL through worked queries, browser practice, schema design, Node.js integration, concurrency labs, security, performance, and recovery.'
  return <ReaderLayout sidebar={nav} toc={<TableOfContents headings={headings} active={active} />}>
    <DocumentHead title={name} description={description} path={id ? lessonHref(id) : '/developers/sql'} />
    <div className="mb-6 text-sm"><Link className={link} to="/developers">Developer Shelf</Link><span aria-hidden="true"> / </span><Link className={link} to="/developers/sql">SQL</Link>{current && <span> / {current.module}</span>}</div>
    <details className="mb-6 rounded-xl border border-line dark:border-night-line lg:hidden"><summary className={`p-4 font-semibold ${focus}`}>Choose a SQL lesson</summary>{nav}</details>
    <header className="border-b border-line pb-7 dark:border-night-line"><p className={eyebrow}>{current ? `${current.module} / Lesson ${index+1} of ${lessons.length}` : 'PostgreSQL / From first query to backend operations'}</p><h1 tabIndex={-1} className={`${title} mt-4`}>{name}</h1><p className={`mt-4 text-lg ${muted}`}>{description}</p><p className={`mt-4 text-sm ${muted}`}>By Dev Kant Kumar · Documentation baseline: PostgreSQL 18 · Reviewed 27 October 2026{minutes ? ` · ${minutes} min reading, plus practice` : ''}</p><div className="mt-5 flex flex-wrap gap-3"><a className={secondary} href="/examples/sql-backend/setup.sql" download>Download sample database</a>{current && <a className={secondary} href="#practice">Try the exercise</a>}</div><div className="mt-5"><ReadingPreferences /></div></header>
    <article ref={article} key={id ?? 'index'} className={`${prose} mt-6`} style={{ fontSize: `${preferences.readerSize || 18}px`, fontFamily: preferences.readerFont === 'serif' ? 'Literata, serif' : undefined }}>
      {current ? <>
        <aside className="my-6 rounded-lg border border-line p-4 text-base dark:border-night-line"><strong>Before you begin</strong><p className="!mb-0">{index > 0 ? <>Build on <Link to={lessonHref(lessons[index-1].id)}>{lessons[index-1].title}</Link>. </> : 'No prior SQL knowledge is required. '}Examples use the <Link to={lessonHref('sample-schema')}>shared shop schema</Link>. Browser Run starts with fresh sample data; server/application labs are labelled separately.</p></aside>
        {current.sections.map((section,i) => <section key={section.title} id={`lesson-section-${i+1}`}><h2>{section.title}</h2>{section.blocks.map((block,j) => <Block key={j} block={block} />)}</section>)}
        <section id="practice"><h2>Practice: apply the skill</h2><p><Inline text={current.practice.task} /></p>{current.practiceRunnable !== false && <SqlExample block={{ title: 'Write your query', solution: true, language: 'postgresql', code: `-- ${current.practice.task}\n`, runnable: true, explanation: 'Write and run your own solution here. Compare its rows with your prediction, then inspect the explained solution below.' }} />}<details><summary className={focus}>Show a hint</summary><p>{current.practice.hint}</p></details><details><summary className={focus}>Show solution and explanation</summary><SqlExample block={{ title: 'Explained solution', solution: true, language: 'postgresql', code: current.practice.solution, explanation: current.practice.explanation, expected: current.practice.expected, runnable: current.practiceRunnable !== false }} /></details><p className={`text-sm ${muted}`}>Before revealing the solution, predict the result and write your own query. Change one input or boundary and explain how the output should change.</p></section>
        <section><h2>Reference and further reading</h2><ul>{current.references.map(ref => <li key={ref.url}><a href={ref.url}>{ref.title}</a></li>)}</ul><p>The explanations and examples here are original. References identify engine contracts and version-specific details. Multi-session and operational labs require a local server; browser execution alone does not validate those behaviors.</p></section>
      </> : <>
        <section><h2>Learn, run, explain, and build</h2><p>This path connects SQL syntax to the work of a backend engineer: correct queries, protected data, concurrent requests, measured performance, and recovery. Each lesson provides explanations, commented code, expected results where deterministic, practice, an explained solution, and primary references.</p><p>Start with the first module if SQL is new. Use the lesson search for reference. Browser examples run on real embedded PostgreSQL in an isolated worker; they do not connect to your application database. The engine loads only when you run an example. Local labs teach behavior that needs multiple connections, a driver, or server administration.</p><p><strong>Core outcome:</strong> build a checkout service that cannot oversell, cannot expose another customer’s orders, and can recover from failed work. Later lessons introduce specialist tools such as full-text search and partitioning with their adoption boundaries.</p></section>
        {modules.map(module => <section key={module.id}><h2>{module.title}</h2><ol>{module.lessons.map(item => <li key={item.id}><Link to={lessonHref(item.id)}><strong>{item.title}</strong></Link><p className={`!mt-1 text-base ${muted}`}>{item.summary}</p></li>)}</ol></section>)}
        <section><h2>Oracle, college study, and portability</h2><p>SQL concepts transfer, but engine features, types, procedural languages, and concurrency behavior differ. This course keeps its runnable engine explicit. Use the <Link to="/notes/mca-sem1-paper4-unit3-sql-foundations">MCA Unit 3 lessons</Link> for the existing Oracle and other DBMS variants and syllabus mapping. PostgreSQL PL/pgSQL is not Oracle PL/SQL.</p></section>
      </>}
    </article>
    <nav aria-label="SQL lesson navigation" className="mt-10 grid gap-4 border-t border-line pt-6 dark:border-night-line sm:grid-cols-2">{current && index > 0 ? <Link className={`${secondary} justify-start`} to={lessonHref(lessons[index-1].id)}>Previous: {lessons[index-1].title}</Link> : <Link className={`${secondary} justify-start`} to="/developers/sql">Course overview</Link>}{index < lessons.length-1 && <Link className={`${secondary} justify-start`} to={lessonHref(lessons[index+1].id)}>Next: {lessons[index+1].title}</Link>}</nav>
  </ReaderLayout>
}
