import { Link } from 'react-router-dom'
import { focus, muted } from '@/ui/classes'
export default function TopicCoverage({ unit }) {
  if (!unit.topicCoverage?.length) return null
  const covered = unit.topicCoverage.filter(topic => topic.notes.length).length
  return <div className="mt-5 rounded-lg bg-soft p-4 dark:bg-night-soft">
    <h3 className="text-sm font-semibold">Syllabus coverage: {covered} of {unit.topicCoverage.length} topics</h3>
    <p className={`mt-2 text-sm ${muted}`}>{covered === unit.topicCoverage.length ? 'Every listed topic has published material. Use the practice questions to check your understanding.' : 'This unit is in progress. Topics marked upcoming still need their own notes.'}</p>
    <ul className="mt-3 space-y-2">{unit.topicCoverage.map(topic => <li key={topic.id} className="flex items-start justify-between gap-3 text-sm"><span className="min-w-0">{topic.notes.length ? <Link to={topic.notes[0].href} className={`text-brand underline underline-offset-4 dark:text-night-brand ${focus}`}>{topic.title}</Link> : topic.title}</span><span className={`shrink-0 rounded px-2 py-0.5 text-xs ${topic.notes.length ? 'bg-selected text-brand dark:bg-night-selected dark:text-night-brand' : muted}`}>{topic.notes.length ? 'Covered' : 'Upcoming'}</span></li>)}</ul>
  </div>
}
