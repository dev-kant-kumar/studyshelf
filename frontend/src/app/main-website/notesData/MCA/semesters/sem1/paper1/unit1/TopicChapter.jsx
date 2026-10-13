import FAQ from '@/app/main-website/shared/components/FAQ'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
export default function TopicChapter({ chapter }) {
  return <>
    <p>{chapter.intro}</p>
    <h2>What you will learn</h2>
    <ul>{chapter.outcomes.map(item => <li key={item}>{item}</li>)}</ul>
    {chapter.sections.map(section => <section key={section.title}>
      <h2>{section.title}</h2>
      {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      {section.table && <ComparisonTable {...section.table} />}
      {section.code && <CodeBlock language="text" code={section.code} />}
      {section.example && <><h3>Worked example</h3>{section.example.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</>}
    </section>)}
    <h2>Revision and practice</h2>
    <ul>{chapter.revision.map(item => <li key={item}>{item}</li>)}</ul>
    <FAQ items={chapter.questions.map(question => ({ ...question, answer: <>{question.answer.map((paragraph, i) => <p key={i}>{paragraph}</p>)}</> }))} />
    <h2>References and further exploration</h2>
    <p>The explanations and practice above are the study material. These primary sources let you verify standards, examine historical evidence, and continue investigating.</p>
    <ul>{chapter.references.map(reference => <li key={reference.url}><a href={reference.url}>{reference.title}</a></li>)}</ul>
  </>
}
