import { GraduationCap } from 'lucide-react'
import { muted } from '@/ui/classes'
export default function SyllabusLabel({ course }) {
  if (!course.university && !course.version && !course.session) return null
  return <div className={`mt-5 flex items-center gap-3 text-sm ${muted}`}>
    {course.universityLogo ? <img src={course.universityLogo} srcSet={`${course.universityLogo} 64w, ${course.universityLogo.replace('-64.', '-128.')} 128w`} sizes="48px" width={64} height={58} alt="" decoding="async" className="h-auto w-12 shrink-0" /> : <GraduationCap className="shrink-0" size={21} aria-hidden="true" />}
    <div>{course.university && <strong className="block font-semibold">{course.university}</strong>}{(course.session || course.version) && <span className="mt-1 block">{course.session ? `Session ${course.session} · CBCS` : course.version}</span>}</div>
  </div>
}
