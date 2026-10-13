import Note from './Note'
import CodeBlock from '../../shared/components/CodeBlock'
import Callout from '../../shared/components/Callout'
import ComparisonTable from '../../shared/components/ComparisonTable'
import Figure from '../../shared/components/Figure'
const note = { slug: 'reader-preview', title: 'A place for clear explanations', summary: 'A development fixture for checking the reading experience before publishing the first note.', href: '/dev/reader', author: 'Dev Kant Kumar' }
const course = { name: 'MCA', href: '/courses/mca' }
const semester = { title: 'Semester 1', href: '/courses/mca/semesters/sem1' }
const paper = { title: 'Reader preview', code: 'Layout fixture', href: '/courses/mca/semesters/sem1', units: [{ id: 'preview', number: 1, notes: [] }] }
const diagram = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 160"><rect width="640" height="160" rx="12" fill="#edf2fa"/><g fill="#17243b" font-family="sans-serif" font-size="22" text-anchor="middle"><text x="110" y="85">Question</text><text x="320" y="85">Explanation</text><text x="530" y="85">Practice</text></g><g stroke="#2457c5" stroke-width="3"><path d="M180 78h60m-12-8 12 8-12 8M400 78h60m-12-8 12 8-12 8" fill="none"/></g></svg>')}`
const body = <>
  <h2>Begin with the idea</h2><p>A useful study note introduces one idea, explains it in plain language, and connects it to something the reader already understands. This text exists only to exercise the layout. It is not part of the published syllabus or notes.</p>
  <Callout type="definition"><p>Use a definition when a term needs a precise meaning. Keep examples nearby so the reader can connect the term to its use.</p></Callout>
  <h3>Make room for examples</h3><p>Code stays inside its own scrolling area, even on a small screen. Readers can copy it, adjust their reading font, and save real notes when they become available.</p>
  <CodeBlock language="JavaScript" code={`function explain(topic) {
  return "Start with " + topic + ", then work through an example."
}

console.log(explain("one clear idea"))`} />
  <h2>Compare related ideas</h2><ComparisonTable caption="Ways to revisit a topic" headers={['Approach', 'What to do', 'When it helps']} rows={[["Read", "Review the explanation and its examples", "When a topic is new"],["Recall", "Explain the idea without looking at the note", "When checking understanding"],["Practice", "Apply it to a small problem", "When connecting theory to use"]]} />
  <h2>See the relationship</h2><Figure src={diagram} alt="A question leads to an explanation, which leads to practice." caption="A layout fixture showing the progression from question to practice." width={640} height={160} />
  <h2>Begin with the idea</h2><p>This repeated heading checks that every section receives a unique link. A table of contents should remain useful after content loads and when moving between notes.</p>
  <Callout type="key"><p>Focus mode keeps the article and reading controls together. Exit focus mode returns the surrounding subject navigation.</p></Callout>
  <h2>A longer heading that should wrap comfortably when reading on a narrow screen</h2><p>Increase the text size and switch between light and dark themes. Paragraphs, headings, callouts, code, and tables should remain legible without forcing the whole page to scroll sideways.</p>
  <ul><li>Check a heading link.</li><li>Try the code copy action.</li><li>Open the diagram with the keyboard.</li></ul>
</>
const preview = { note, course, semester, paper, body }
export default function ReaderPreview() { return <Note preview={preview} /> }
