import { Info } from 'lucide-react'
import { muted, link } from '@/ui/classes'
export default function SyllabusNotice({ course }) {
  if (!course.versionNote && !course.source?.url) return null
  return <aside aria-label="Syllabus source and version" className={`mt-8 flex items-start gap-2 border-t border-line pt-5 text-sm leading-relaxed dark:border-night-line ${muted}`}>
    <Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
    <div>{course.versionNote && <p>{course.versionNote}</p>}{course.source?.url && <>
      <p className="mt-2">Syllabus version: {course.version}. A study session label does not confirm that this syllabus applies to your batch.</p>
      <a className={`${link} mt-2 inline-block`} href={course.source.url}>Read the official VBU {course.name} syllabus (PDF)</a>
    </>}</div>
  </aside>
}
