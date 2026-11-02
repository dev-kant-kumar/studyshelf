import { useState } from 'react'
import { Link } from 'react-router-dom'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import TopicChapter from '../TopicChapter'
import SqlDiagram from './SqlDiagram'
import SqlExample from './SqlExample'
import { lessons, lessonHref } from './data/course.js'
import { studyGuides } from './data/studyGuides.js'
import StudyReview from './StudyReview'
import { focus } from '@/ui/classes'

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
export default function Unit3Lesson({ id, collegeChapter }) {
  const current = lessons.find(lesson => lesson.id === id)
  const guide = studyGuides[id]
  const [showSolution, setShowSolution] = useState(false)
  const [showCollege, setShowCollege] = useState(false)
  if (!current || !guide) throw new Error(`Unknown Unit 3 lesson or study guide: ${id}`)
  return <>
    <nav aria-label="Ways to study this topic" className="my-6 flex flex-wrap gap-x-5 gap-y-3 border-b border-line pb-4 text-base dark:border-night-line"><a href="#learn">Learn step by step</a><a href="#practice">Practise</a><a href="#exam-preparation">Exam preparation</a><a href="#interview-preparation">Interview preparation</a></nav>
    {guide.before.length > 0 && <p className="text-base">Before this lesson: {guide.before.map((prerequisite,index) => <span key={prerequisite}>{index > 0 ? ', ' : ''}<Link to={lessonHref(prerequisite)}>{lessons.find(lesson => lesson.id === prerequisite)?.title}</Link></span>)}.</p>}
    <div id="learn" className="scroll-mt-24">{guide.introduction && <p><Inline text={guide.introduction} /></p>}{current.sections.map((section,i) => <section key={section.title}><h2>{i+1}. {section.title}</h2>{section.blocks.map((block,j) => <Block key={j} block={block} />)}</section>)}</div>
    <section id="practice" className="scroll-mt-24"><h2>Practice: apply the skill</h2><p><Inline text={current.practice.task} /></p>{current.practiceRunnable !== false && <SqlExample block={{ title: 'Write your query', solution: true, language: 'postgresql', code: `-- ${current.practice.task}\n`, runnable: true, explanation: 'Write and run your own solution here. Predict the result before inspecting the explained solution.' }} />}<details><summary className={focus}>Show a hint</summary><p>{current.practice.hint}</p></details><details onToggle={event => setShowSolution(event.currentTarget.open)}><summary className={focus}>Show solution and explanation</summary>{showSolution && <SqlExample block={{ title: 'Explained solution', solution: true, language: 'postgresql', code: current.practice.solution, explanation: current.practice.explanation, expected: current.practice.expected, runnable: current.practiceRunnable !== false }} />}</details><p>Change one boundary, missing value, or relationship and explain how the result should change. A successful query run does not by itself prove that it answers the intended business question.</p></section>
    <StudyReview guide={guide} />
    {id === 'capstone' && <section><h2>Download and run the checkout lab</h2><p>The companion implementation claims a request key in the same transaction as the stock reservation and order. It returns the stored result for an identical retry and rejects reuse with a different payload. Download all four files into one local project and follow the README.</p><ul>{['README.md','setup.sql','checkout.mjs','checkout.test.mjs'].map(file => <li key={file}><a href={`/examples/sql-backend/${file}`} download>{file}</a></li>)}</ul><p>The tests exercise actual independent PostgreSQL connections, including competing buyers, concurrent duplicate requests, and rollback after an injected line-item failure.</p></section>}
    {collegeChapter && <section><h2>College examples: Oracle and other DBMS variants</h2><p>The examples below preserve the syllabus-oriented SQL/PLSQL material and DBMS selector. Run the corresponding <Link to="/notes/mca-sem1-paper4-unit3-sql-foundations">U3 dataset setup</Link> from the expanded college section in SQL foundations. Do not mix the U3 tables with the shop dataset used above.</p><details onToggle={event => setShowCollege(event.currentTarget.open)}><summary className={focus}>Show college explanations, DBMS variants, revision, and questions</summary>{showCollege && <TopicChapter chapter={collegeChapter} supplementary />}</details></section>}
    <section><h2>Practice environment and technical references</h2><p>Run uses a fresh sample database in your browser. Backend examples use PostgreSQL; the actual result identifies its version. <a href="/examples/sql-backend/setup.sql" download>Download the shop setup</a> for local practice. Multi-session and server-operation labs require a local server. College DBMS variants use the separately identified U3 dataset.</p><ul>{current.references.map(ref => <li key={ref.url}><a href={ref.url}>{ref.title}</a></li>)}</ul></section>
  </>
}
