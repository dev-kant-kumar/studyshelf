import { FileText, CheckCircle2, Award, Clock } from 'lucide-react'
import { panel, muted } from '@/ui/classes'

export default function ExaminationPattern({ course }) {
  const isMca = course.id === 'mca'

  return (
    <section className="mt-12" aria-labelledby="exam-pattern-heading">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand dark:text-night-brand">
          Academic Guidelines
        </p>
        <h2 id="exam-pattern-heading" className="mt-2 font-display text-2xl font-medium text-ink dark:text-night-ink sm:text-3xl">
          CBCS Examination & Evaluation Scheme
        </h2>
        <p className={`mt-2 text-sm leading-relaxed ${muted}`}>
          Official Vinoba Bhave University examination regulations for {isMca ? 'MCA' : 'BCA'} programs under the Choice Based Credit System (CBCS).
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <div className={`${panel} p-4 sm:p-5`}>
          <div className="flex items-center gap-2 text-brand dark:text-night-brand">
            <FileText size={18} aria-hidden="true" />
            <h3 className="font-semibold text-ink dark:text-night-ink">External Exam</h3>
          </div>
          <p className="mt-2.5 font-display text-xl font-semibold text-ink dark:text-night-ink sm:mt-3 sm:text-2xl">
            70 Marks
          </p>
          <p className={`mt-1 text-xs leading-relaxed ${muted}`}>
            End-semester written university theory exam conducted at designated examination centers.
          </p>
        </div>

        <div className={`${panel} p-4 sm:p-5`}>
          <div className="flex items-center gap-2 text-brand dark:text-night-brand">
            <Award size={18} aria-hidden="true" />
            <h3 className="font-semibold text-ink dark:text-night-ink">Internal Sessional</h3>
          </div>
          <p className="mt-2.5 font-display text-xl font-semibold text-ink dark:text-night-ink sm:mt-3 sm:text-2xl">
            30 Marks
          </p>
          <p className={`mt-1 text-xs leading-relaxed ${muted}`}>
            Mid-semester assessment, classroom attendance, assignments, and departmental continuous evaluation.
          </p>
        </div>

        <div className={`${panel} p-4 sm:p-5`}>
          <div className="flex items-center gap-2 text-brand dark:text-night-brand">
            <CheckCircle2 size={18} aria-hidden="true" />
            <h3 className="font-semibold text-ink dark:text-night-ink">Passing Standard</h3>
          </div>
          <p className="mt-2.5 font-display text-xl font-semibold text-ink dark:text-night-ink sm:mt-3 sm:text-2xl">
            40% Theory / 50% Lab
          </p>
          <p className={`mt-1 text-xs leading-relaxed ${muted}`}>
            Minimum aggregate score required in theory papers and practical lab sessional tests to qualify.
          </p>
        </div>

        <div className={`${panel} p-4 sm:p-5`}>
          <div className="flex items-center gap-2 text-brand dark:text-night-brand">
            <Clock size={18} aria-hidden="true" />
            <h3 className="font-semibold text-ink dark:text-night-ink">Exam Duration</h3>
          </div>
          <p className="mt-2.5 font-display text-xl font-semibold text-ink dark:text-night-ink sm:mt-3 sm:text-2xl">
            3 Hours
          </p>
          <p className={`mt-1 text-xs leading-relaxed ${muted}`}>
            Allocated duration for all end-semester theory examinations across regular and elective papers.
          </p>
        </div>
      </div>
    </section>
  )
}
