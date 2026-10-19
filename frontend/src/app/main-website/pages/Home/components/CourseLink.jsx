import { ArrowUpRight, BookOpen, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { focus, muted, panel } from '@/ui/classes'
export default function CourseLink({ course }) {
  const available = course.semesters.length > 0
  return <Link className={`${panel} group flex flex-col p-6 transition-colors hover:border-brand dark:hover:border-night-brand motion-reduce:transition-none sm:p-8 ${focus}`} to={course.href}><div className="flex items-center justify-between"><span className="flex size-12 items-center justify-center rounded-xl bg-selected text-brand dark:bg-night-selected dark:text-night-brand"><GraduationCap size={25} aria-hidden="true" /></span><ArrowUpRight className="text-subtle group-hover:text-brand dark:text-night-subtle dark:group-hover:text-night-brand" size={22} aria-hidden="true" /></div><div className="mt-6"><h3 className="font-display text-3xl font-medium">{course.name}</h3><p className={`mt-2 ${muted}`}>{course.description}</p></div><div className={`mt-6 flex items-center gap-2 border-t border-line pt-5 text-sm dark:border-night-line ${muted}`}><BookOpen size={16} aria-hidden="true" /><span>{available ? `${course.noteCount} published notes · ${course.semesters.length} syllabus semesters` : 'Syllabus coming soon'}</span></div></Link>
}
