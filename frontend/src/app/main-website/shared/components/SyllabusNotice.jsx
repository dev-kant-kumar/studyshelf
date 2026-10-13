import { Info } from 'lucide-react'
import { muted } from '@/ui/classes'
export default function SyllabusNotice({ course }) { return course.versionNote ? <div className={`mt-8 flex items-start gap-2 border-t border-line pt-5 text-sm leading-relaxed dark:border-night-line ${muted}`}><Info size={16} className="mt-0.5 shrink-0" aria-hidden="true" /><p>{course.versionNote}</p></div> : null }
