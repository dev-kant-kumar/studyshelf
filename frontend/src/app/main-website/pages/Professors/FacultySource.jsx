import { facultySource } from './facultyData'
import { link, muted } from '@/ui/classes'
export default function FacultySource() {
  return <aside className={`mt-8 border-t border-line pt-5 text-sm leading-6 dark:border-night-line ${muted}`} aria-label="Faculty information source"><p>Source: <a className={link} href={facultySource.url}>{facultySource.label}</a>. Retrieved 27 October 2026.</p><p className="mt-1">VBU does not give an update date for these listings. Roles, qualifications, experience, and contact details may have changed. Confirm current details with the department.</p></aside>
}
