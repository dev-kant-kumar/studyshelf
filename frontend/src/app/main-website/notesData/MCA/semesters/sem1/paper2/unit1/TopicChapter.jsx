import FAQ from '@/app/main-website/shared/components/FAQ'
import CodeBlock from '@/app/main-website/shared/components/CodeBlock'
import ComparisonTable from '@/app/main-website/shared/components/ComparisonTable'

function Inline({ children }) {
  return String(children).split(/(`[^`]+`)/g).map((part, index) => part.startsWith('`') && part.endsWith('`')
    ? <code key={index} className="rounded bg-soft px-1 py-0.5 text-[0.9em] text-brand dark:bg-night-soft dark:text-night-brand">{part.slice(1, -1)}</code>
    : part)
}

function Block({ block }) {
  switch (block.type) {
    case 'paragraph': return <p><Inline>{block.text}</Inline></p>
    case 'list': return <ul>{block.items.map((item, index) => <li key={index}><Inline>{item}</Inline></li>)}</ul>
    case 'steps': return <ol>{block.items.map((item, index) => <li key={index}><Inline>{item}</Inline></li>)}</ol>
    case 'code': return <div>
      <p className="!mb-0 font-sans text-sm font-semibold"><Inline>{block.title}</Inline><span className="ml-2 font-normal text-subtle dark:text-night-subtle">{block.kind === 'program' ? 'Complete program' : block.kind === 'invalid' ? 'Incorrect example - do not execute' : block.kind === 'illustration' ? 'Syntax template' : block.language === 'shell' ? 'Terminal command' : 'Focused example'}</span></p>
      <CodeBlock code={block.code} language={block.language || 'c'} />
    </div>
    case 'output': return <div className="my-6 overflow-hidden rounded-lg border border-line dark:border-night-line">
      <div className="border-b border-line bg-soft px-4 py-2 font-sans text-xs font-semibold dark:border-night-line dark:bg-night-soft">{block.title || 'Expected output'}</div>
      <pre className="!m-0 !rounded-none !bg-transparent !p-4"><code>{block.text}</code></pre>
    </div>
    case 'table': return <ComparisonTable caption={block.caption} headers={block.headers.map(item => <Inline key={item}>{item}</Inline>)} rows={block.rows.map(row => row.map((cell, index) => <Inline key={index}>{cell}</Inline>))} />
    case 'callout': return <aside className="my-6 rounded-r-lg border-l-4 border-brand bg-selected px-5 py-4 dark:border-night-brand dark:bg-night-selected">
      <p className="!mt-0 !mb-2 font-sans font-semibold">{block.title}</p><p className="!my-0"><Inline>{block.text}</Inline></p>
    </aside>
    case 'memory': return <figure className="my-6 rounded-lg border border-line p-4 dark:border-night-line">
      <div className="flex flex-wrap gap-2 font-mono text-sm">{block.cells.map((cell, index) => <div key={index} className="min-w-16 flex-1 overflow-hidden rounded border border-line text-center dark:border-night-line"><div className="bg-soft px-2 py-1 text-xs text-subtle dark:bg-night-soft dark:text-night-subtle">{cell.label}</div><div className="px-3 py-3 font-semibold">{cell.value}</div></div>)}</div>
      <figcaption><Inline>{block.caption}</Inline></figcaption>
    </figure>
    default: return null
  }
}

export default function TopicChapter({ chapter }) {
  return <>
    <p><Inline>{chapter.intro}</Inline></p>
    <h2>What you will learn</h2>
    <ul>{chapter.outcomes.map(item => <li key={item}>{item}</li>)}</ul>
    <h2>Before you begin</h2>
    <p><Inline>{chapter.prerequisites}</Inline></p>
    <p className="font-sans text-sm text-subtle dark:text-night-subtle">Language baseline: C11. Complete programs can be compiled as supplied; focused examples belong inside the stated context. Practice is original. Standard rules, toolchain behaviour, and teaching assumptions are identified separately.</p>
    {chapter.sections.map(section => <section key={section.title}>
      <h2>{section.title}</h2>
      {section.blocks?.map((block, index) => <Block key={index} block={block} />)}
      {section.paragraphs?.map((paragraph, index) => <p key={index}><Inline>{paragraph}</Inline></p>)}
      {section.code && <CodeBlock language={section.language || 'c'} code={section.code} />}
      {section.example && <><h3>Worked example and checkpoints</h3>{section.example.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</>}
      {section.rule && <p className="font-sans text-xs text-subtle dark:text-night-subtle">Rule reference: <a href={section.source || 'https://www.open-std.org/jtc1/sc22/wg14/www/docs/n1570.pdf'}>{section.rule}</a></p>}
    </section>)}
    <h2>Revision checklist</h2>
    <ul>{chapter.revision.map(item => <li key={item}>{item}</li>)}</ul>
    <h2>Original practice with answers</h2>
    <FAQ title="Practice questions and explained answers" items={chapter.questions.map(question => ({ ...question, answer: <>{question.answer.map((paragraph, index) => <p key={index}><Inline>{paragraph}</Inline></p>)}</> }))} />
    <h2>References for verification</h2>
    <ul>{chapter.references.map(reference => <li key={reference.url}><a href={reference.url}>{reference.title}</a></li>)}</ul>
    <h2>Next topic</h2>
    <p><Inline>{chapter.next}</Inline></p>
  </>
}
