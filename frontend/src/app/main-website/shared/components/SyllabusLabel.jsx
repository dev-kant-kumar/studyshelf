import { GraduationCap } from 'lucide-react'
import { muted } from '@/ui/classes'
export default function SyllabusLabel({ course }) {
  if (!course.university && !course.version && !course.session) return null
  return <div className={`mt-5 flex items-start gap-3 text-sm ${muted}`}><GraduationCap className="mt-0.5 shrink-0" size={21} aria-hidden="true" /><div>{course.university && <strong className="block font-semibold">{course.university}</strong>}{(course.session || course.version) && <span className="mt-1 block">{course.session ? `Session ${course.session} · CBCS` : course.version}</span>}</div></div>
}
