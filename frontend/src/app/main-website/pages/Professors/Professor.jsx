import { Link, useParams } from 'react-router-dom'
import {
  Mail,
  Phone,
  ArrowLeft,
  Award,
  BookOpen,
  GraduationCap,
  Calendar,
  Building2,
  Clock,
} from 'lucide-react'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import DocumentHead from '../../shared/components/DocumentHead'
import ErrorPage from '../../ErrorPage'
import { getProfessor, professorHref } from './facultyData'
import FacultySource from './FacultySource'
import ProfessorPhoto from './ProfessorPhoto'
import FacultyRoutineAssignment from './components/FacultyRoutineAssignment'
import { muted, focus } from '@/ui/classes'

export default function Professor() {
  const { professor: id } = useParams()
  const person = getProfessor(id)

  if (!person) return <ErrorPage />

  const isStaff = person.category === 'staff'
  const primaryEmail = person.emails?.[0]
  const primaryPhone = person.phones?.[0]

  return (
    <CatalogueLayout>
      <DocumentHead
        title={`${person.name} - VBU Faculty and Staff`}
        description={
          isStaff
            ? `${person.name}, listed in the VBU Department of Computer Applications departmental staff directory.`
            : `${person.name}, listed by VBU as ${person.designation}. Explore qualifications, ${person.specialization} specialization, and published contact details.`
        }
        path={professorHref(person.id)}
      />

      <Breadcrumbs
        items={[
          { label: 'Professors', href: '/professors' },
          { label: person.name },
        ]}
      />

      {/* Profile Header Banner */}
      <header className="rounded-xl border border-line bg-surface p-4 shadow-xs sm:p-8 dark:border-night-line dark:bg-night-surface">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          <ProfessorPhoto person={person} large />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-selected px-2.5 py-0.5 text-xs font-semibold text-brand dark:bg-night-selected dark:text-night-brand">
                {person.designation}
              </span>
              <span className="flex items-center gap-1 text-xs text-subtle dark:text-night-subtle">
                <Building2 size={13} aria-hidden="true" />
                <span>Dept. of Computer Applications</span>
              </span>
            </div>

            <h1
              tabIndex={-1}
              className="mt-2 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl dark:text-night-ink"
            >
              {person.name}
            </h1>

            <p className={`mt-1 text-xs sm:text-sm ${muted}`}>
              Vinoba Bhave University, Hazaribag, Jharkhand
            </p>

            {/* Program links and fast actions */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              {(person.courses ?? []).map(course => (
                <Link
                  key={course}
                  to={`/courses/${course}`}
                  className={`inline-flex items-center gap-1 rounded-md border border-line bg-soft/60 px-2.5 py-1 text-xs font-bold uppercase text-ink transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-soft/50 dark:text-night-ink dark:hover:border-night-brand dark:hover:text-night-brand ${focus}`}
                >
                  <BookOpen size={12} aria-hidden="true" />
                  <span>{course} Curriculum</span>
                </Link>
              ))}

              {primaryEmail && (
                <a
                  href={`mailto:${primaryEmail}`}
                  className={`inline-flex items-center gap-1.5 rounded-md bg-brand px-3 py-1 text-xs font-semibold text-on-brand shadow-xs transition-opacity hover:opacity-95 dark:bg-night-brand dark:text-night-on-brand ${focus}`}
                >
                  <Mail size={13} aria-hidden="true" />
                  <span>Email</span>
                </a>
              )}

              {primaryPhone && (
                <a
                  href={`tel:+91${primaryPhone}`}
                  className={`inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:hover:border-night-brand dark:hover:text-night-brand ${focus}`}
                >
                  <Phone size={13} aria-hidden="true" />
                  <span>Call</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid: Details on Left, Contacts & Links on Right */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_0.8fr]">
        <div className="space-y-6">
          {/* Academic Profile Details */}
          {!isStaff ? (
            <section
              aria-labelledby="academic-details"
              className="rounded-xl border border-line bg-surface p-4 shadow-xs sm:p-8 dark:border-night-line dark:bg-night-surface"
            >
              <div className="flex items-center gap-2 border-b border-line pb-4 dark:border-night-line">
                <GraduationCap size={18} className="text-brand dark:text-night-brand" aria-hidden="true" />
                <h2 id="academic-details" className="font-display text-xl font-bold text-ink dark:text-night-ink">
                  Academic Credentials
                </h2>
              </div>

              <dl className="mt-5 space-y-5">
                {person.specialization && (
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-subtle dark:text-night-subtle">
                      <Award size={13} aria-hidden="true" />
                      <span>Specialization Area</span>
                    </dt>
                    <dd className="mt-1.5 text-base font-bold text-brand dark:text-night-brand">
                      {person.specialization}
                    </dd>
                  </div>
                )}

                {person.qualification && (
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wider text-subtle dark:text-night-subtle">
                      Qualifications (as recorded by VBU)
                    </dt>
                    <dd className="mt-1.5 text-sm font-medium leading-relaxed text-ink dark:text-night-ink">
                      {person.qualification}
                    </dd>
                  </div>
                )}

                {person.reportedExperienceYears && (
                  <div>
                    <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-subtle dark:text-night-subtle">
                      <Calendar size={13} aria-hidden="true" />
                      <span>Academic Experience</span>
                    </dt>
                    <dd className="mt-1.5 text-sm font-semibold text-ink dark:text-night-ink">
                      {person.reportedExperienceYears} years reported
                    </dd>
                    <dd className={`mt-0.5 text-xs leading-relaxed ${muted}`}>
                      This figure reflects the duration officially reported in university department documentation.
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          ) : (
            <section className="rounded-xl border border-line bg-surface p-6 shadow-xs sm:p-8 dark:border-night-line dark:bg-night-surface">
              <h2 className="font-display text-xl font-bold text-ink dark:text-night-ink">
                Departmental Support Staff
              </h2>
              <p className={`mt-3 text-xs leading-relaxed sm:text-sm ${muted}`}>
                Listed under the Departmental Staff directory for the Department of Computer Applications at Vinoba Bhave University. Support staff facilitate laboratory operations, library resources, and administrative coordination for students.
              </p>
            </section>
          )}

          {/* Current Semester Teaching Schedule (if teaching MCA Sem 1) */}
          <FacultyRoutineAssignment professorId={person.id} />
        </div>

        {/* Sidebar: Contact & Quick Links */}
        <div className="space-y-6">
          {/* Contact Details Card */}
          <section
            aria-labelledby="faculty-contact"
            className="rounded-xl border border-line bg-surface p-6 shadow-xs sm:p-8 dark:border-night-line dark:bg-night-surface"
          >
            <h2 id="faculty-contact" className="font-display text-lg font-bold text-ink dark:text-night-ink">
              Published Contact Details
            </h2>
            <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
              Use these university-listed contact channels for academic inquiries and departmental communication.
            </p>

            {person.emails?.length > 0 && (
              <div className="mt-5">
                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink dark:text-night-ink">
                  <Mail size={14} className="text-brand dark:text-night-brand" aria-hidden="true" />
                  <span>Email Addresses</span>
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {person.emails.map(email => (
                    <li key={email}>
                      <a
                        href={`mailto:${email}`}
                        className={`inline-flex min-h-8 items-center break-all rounded-md bg-soft/60 px-2.5 py-1 text-xs font-mono font-medium text-ink transition-colors hover:bg-selected hover:text-brand dark:bg-night-soft/50 dark:text-night-ink dark:hover:bg-night-selected dark:hover:text-night-brand ${focus}`}
                      >
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {person.phones?.length > 0 && (
              <div className="mt-5">
                <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink dark:text-night-ink">
                  <Phone size={14} className="text-brand dark:text-night-brand" aria-hidden="true" />
                  <span>Phone Numbers</span>
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {person.phones.map(phone => (
                    <li key={phone}>
                      <a
                        href={`tel:+91${phone}`}
                        className={`inline-flex min-h-8 items-center rounded-md bg-soft/60 px-2.5 py-1 text-xs font-mono font-medium text-ink transition-colors hover:bg-selected hover:text-brand dark:bg-night-soft/50 dark:text-night-ink dark:hover:bg-night-selected dark:hover:text-night-brand ${focus}`}
                      >
                        +91 {phone}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!person.emails?.length && !person.phones?.length && (
              <p className={`mt-4 text-xs italic ${muted}`}>
                No direct phone or email contacts are published in the official university directory.
              </p>
            )}
          </section>

          {/* Quick Academic Shortcuts */}
          <section className="rounded-xl border border-line bg-surface p-5 shadow-xs dark:border-night-line dark:bg-night-surface">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink dark:text-night-ink">
              Quick Academic Navigation
            </h3>
            <div className="mt-3 space-y-2">
              <Link
                to="/routine"
                className={`flex items-center justify-between rounded-lg border border-line bg-soft/60 px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-soft/50 dark:text-night-ink dark:hover:border-night-brand dark:hover:text-night-brand ${focus}`}
              >
                <span className="flex items-center gap-2">
                  <Clock size={14} className="text-brand dark:text-night-brand" aria-hidden="true" />
                  <span>Weekly Class Timetable</span>
                </span>
                <span className="rounded bg-selected px-1.5 py-0.2 text-[10px] font-bold text-brand dark:bg-night-selected dark:text-night-brand">
                  Live
                </span>
              </Link>

              <Link
                to="/courses/mca"
                className={`flex items-center justify-between rounded-lg border border-line bg-soft/60 px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-soft/50 dark:text-night-ink dark:hover:border-night-brand dark:hover:text-night-brand ${focus}`}
              >
                <span>MCA Course Syllabus</span>
                <span className="font-mono text-[10px] text-subtle dark:text-night-subtle">4 Sems</span>
              </Link>

              <Link
                to="/courses/bca"
                className={`flex items-center justify-between rounded-lg border border-line bg-soft/60 px-3.5 py-2 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand dark:border-night-line dark:bg-night-soft/50 dark:text-night-ink dark:hover:border-night-brand dark:hover:text-night-brand ${focus}`}
              >
                <span>BCA Course Syllabus</span>
                <span className="font-mono text-[10px] text-subtle dark:text-night-subtle">6 Sems</span>
              </Link>
            </div>
          </section>

          {/* Back Button */}
          <Link
            to="/professors"
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-soft/70 px-4 py-2.5 text-xs font-semibold text-ink transition-colors hover:bg-selected hover:text-brand dark:border-night-line dark:bg-night-soft/60 dark:text-night-ink dark:hover:bg-night-selected dark:hover:text-night-brand ${focus}`}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            <span>All Faculty & Staff</span>
          </Link>
        </div>
      </div>

      {/* Official Data Source Attribution */}
      <FacultySource />
    </CatalogueLayout>
  )
}
