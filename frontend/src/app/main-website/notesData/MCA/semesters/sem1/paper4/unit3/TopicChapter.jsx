import FAQ from '@/app/main-website/shared/components/FAQ'
import Figure from '@/app/main-website/shared/components/Figure'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import { Link } from 'react-router-dom'
import { unit3Lessons, lessonHref } from '@/app/main-website/pages/Sql/data/course'

const diagrams = import.meta.glob('./diagrams/*.svg', { eager: true, query: '?url', import: 'default' })
function TeachingContent({ content, nested = false }) {
  const ExampleHeading = nested ? 'h4' : 'h3'
  return <>
    {content.paragraphs?.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
    {content.points && <ul>{content.points.map(item => <li key={item}>{item}</li>)}</ul>}
    {content.steps && <ol>{content.steps.map(step => <li key={step.title}><strong>{step.title}</strong> {step.text}</li>)}</ol>}
    {content.diagram && <Figure src={diagrams[`./diagrams/${content.diagram}.svg`]} alt={content.alt} caption={content.caption} width={960} height={content.diagramHeight || 600} />}
    {content.table && <ComparisonTable {...content.table} />}
    {content.code && <CodeBlock language="sql" code={content.code} sqlVariants={content.sqlVariants} />}
    {content.links && <ul>{content.links.map(link => <li key={link.href}><a href={link.href} download={link.download || undefined}>{link.label}</a></li>)}</ul>}
    {content.example && <><ExampleHeading>Worked example</ExampleHeading>{content.example.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</>}
  </>
}
export default function TopicChapter({ chapter }) {
  return <>
    <p>{chapter.intro}</p>
    <aside className="my-6 border-l-4 border-brand bg-soft p-5 dark:border-night-brand dark:bg-night-soft"><strong>Study this topic in depth</strong><p>Continue with <Link to={lessonHref(unit3Lessons[chapter.id] ?? 'start')}>the SQL for backend engineers lessons</Link> for worked queries, visible results, browser practice, explained exercises, and PostgreSQL application labs. These notes retain the MCA syllabus and DBMS variants.</p></aside>
    {chapter.id !== 'sql-foundations' && <p>Use the <a href="/notes/mca-sem1-paper4-unit3-sql-foundations">shared Unit 3 setup</a> before running these examples. Each exercise states any additional objects or changes it makes.</p>}
    <h2>What you will learn</h2>
    <ul>{chapter.outcomes.map(item => <li key={item}>{item}</li>)}</ul>
    {chapter.sections.map(section => <section key={section.title}>
      <h2>{section.title}</h2>
      <TeachingContent content={section} />
      {section.subsections?.map(subsection => <section key={subsection.title}>
        <h3>{subsection.title}</h3>
        <TeachingContent content={subsection} nested />
      </section>)}
    </section>)}
    <h2>Review checklist</h2>
    <ul>{chapter.revision.map(item => <li key={item}>{item}</li>)}</ul>
    <FAQ showGuide={false} title="Questions and answers" items={chapter.questions.map(question => ({ ...question, answer: <>{question.answer.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</> }))} />
    <h2>References</h2>
    <ul>{chapter.references.map(reference => <li key={reference.url}><a href={reference.url}>{reference.title}</a></li>)}</ul>
    {chapter.next && <p>Continue with <a href={`/notes/mca-sem1-paper4-unit3-${chapter.next.id}`}>{chapter.next.title}</a>.</p>}
  </>
}
