import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Search, Bookmark, ChevronUp } from 'lucide-react'
import { site } from '@/config/site'
import { PreferencesContext } from '../hooks/preferencesContext'
import { container, focus, muted } from '@/ui/classes'

export default function Footer() {
  const preferencesContext = useContext(PreferencesContext)
  const savedCount = preferencesContext?.preferences?.saved?.length || 0

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="mt-auto border-t border-line bg-surface dark:border-night-line dark:bg-night-surface print:hidden">
      {/* Student Quick Utility Strip */}
      <div className="border-b border-line/60 bg-soft/40 dark:border-night-line/60 dark:bg-night-soft/30">
        <div className={`${container} flex flex-wrap items-center justify-between gap-3 py-3.5 text-xs sm:text-sm`}>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              to="/search"
              className={`inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-subtle transition-colors hover:border-brand/40 hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:border-night-brand/40 dark:hover:text-night-ink ${focus}`}
              aria-label="Search study notes and syllabus"
            >
              <Search size={15} className="text-brand dark:text-night-brand" aria-hidden="true" />
              <span>Search notes, units and roadmaps...</span>
              <kbd className="hidden rounded border border-line bg-soft px-1.5 py-0.5 font-mono text-[11px] font-semibold text-subtle dark:border-night-line dark:bg-night-soft dark:text-night-subtle sm:inline-block">
                /
              </kbd>
            </Link>

            <Link
              to="/saved"
              className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-subtle transition-colors hover:border-brand/40 hover:text-brand dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:border-night-brand/40 dark:hover:text-night-brand ${focus}`}
              aria-label="View saved study notes"
            >
              <Bookmark size={15} className="text-brand dark:text-night-brand" aria-hidden="true" />
              <span>Saved Notes</span>
              {savedCount > 0 ? (
                <span className="rounded-full bg-selected px-1.5 py-0.2 text-xs font-semibold text-brand dark:bg-night-selected dark:text-night-brand">
                  {savedCount}
                </span>
              ) : (
                <span className="text-xs text-subtle/70 dark:text-night-subtle/70">(0)</span>
              )}
            </Link>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-subtle transition-colors hover:bg-soft hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:bg-night-soft dark:hover:text-night-ink ${focus}`}
            aria-label="Scroll back to top of the page"
          >
            <ChevronUp size={15} aria-hidden="true" />
            <span>Back to top</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Column Directory */}
      <div className={container}>
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Column 1 & 2: Brand, Mission & Scope */}
          <div className="space-y-4 lg:col-span-2">
            <div>
              <Link
                className={`inline-flex items-center gap-2.5 font-display text-2xl font-bold tracking-tight text-ink dark:text-night-ink ${focus}`}
                to="/"
                aria-label={`${site.name} homepage`}
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-brand text-on-brand shadow-sm dark:bg-night-brand dark:text-night-on-brand">
                  <BookOpen size={20} aria-hidden="true" />
                </span>
                <span>{site.name}</span>
              </Link>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-brand dark:text-night-brand">
                BCA & MCA Academic Library & Developer Shelf
              </p>
            </div>

            <p className={`max-w-md text-sm leading-relaxed ${muted}`}>
              Focused university study notes, verified syllabus unit outlines, practical code examples, and structured developer roadmaps for Vinoba Bhave University students and ambitious software builders.
            </p>

            <div className={`space-y-1 pt-1 text-xs leading-normal ${muted}`}>
              <p>
                Notes authored by{' '}
                <a
                  href="https://devkantkumar.com/"
                  className={`font-medium underline underline-offset-4 hover:text-brand dark:hover:text-night-brand ${focus}`}
                >
                  Dev Kant Kumar
                </a>
              </p>
              <p>
                Built by{' '}
                <a
                  href="https://unyrisetech.com/"
                  className={`font-medium underline underline-offset-4 hover:text-brand dark:hover:text-night-brand ${focus}`}
                >
                  Unyrise Tech
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Academic Syllabuses */}
          <nav aria-label="Academic syllabus navigation" className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink dark:text-night-ink">
              Academic Library
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/courses/mca"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  MCA Syllabus & Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/courses/bca"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  BCA Syllabus & Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/routine"
                  className={`inline-flex items-center gap-1.5 text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  <span>Class Timetable (Routine)</span>
                  <span className="rounded bg-selected px-1 py-0.5 text-[10px] font-semibold text-brand dark:bg-night-selected dark:text-night-brand">
                    Live
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/professors"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  Faculty & Staff Directory
                </Link>
              </li>
              <li>
                <Link
                  to="/vbu"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  VBU Student Guide
                </Link>
              </li>
              <li>
                <Link
                  to="/updates"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  Latest Syllabus Updates
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 3: Developer Roadmaps */}
          <nav aria-label="Developer roadmaps navigation" className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink dark:text-night-ink">
              Developer Shelf
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/developers"
                  className={`inline-flex items-center font-medium text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  Developer Shelf Overview
                </Link>
              </li>
              <li>
                <Link
                  to="/developers/nodejs-roadmap"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  Node.js Backend Roadmap
                </Link>
              </li>
              <li>
                <Link
                  to="/developers/frontend-roadmap"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  Frontend Developer
                </Link>
              </li>
              <li>
                <Link
                  to="/developers/python-backend-roadmap"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  Python Backend Developer
                </Link>
              </li>
              <li>
                <Link
                  to="/developers/java-backend-roadmap"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  Java Backend Developer
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  Career Explorer
                </Link>
              </li>
            </ul>
          </nav>

          {/* Column 4: Platform & Support */}
          <nav aria-label="Platform and support navigation" className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink dark:text-night-ink">
              Platform & Help
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/search"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  Search Note Archive
                </Link>
              </li>
              <li>
                <Link
                  to="/saved"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  Saved Notes on Device
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  About Study Shelf
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  Help and FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  Contact & Corrections
                </Link>
              </li>
              <li>
                <Link
                  to="/content-policy"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  Content Standards
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className={`inline-flex items-center text-subtle transition-colors hover:text-brand dark:text-night-subtle dark:hover:text-night-brand ${focus}`}
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Curriculum Alignment Notice */}
        <div className="mb-10 rounded-xl border border-line bg-soft/50 p-4 text-xs leading-relaxed text-subtle dark:border-night-line dark:bg-night-soft/40 dark:text-night-subtle sm:p-5">
          <p>
            <strong className="font-semibold text-ink dark:text-night-ink">Academic Curriculum Notice:</strong> Study Shelf provides independent educational explanations, code samples, and revision summaries aligned with the Vinoba Bhave University (Hazaribag) CBCS syllabus structure. Course codes, semester layouts, and topic outlines reflect official curriculum documents. Study Shelf is maintained for student reference and is not officially affiliated with or endorsed by Vinoba Bhave University.
          </p>
        </div>

        {/* Bottom Bar: Legal Links & Attribution */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-6 text-xs text-subtle dark:border-night-line dark:text-night-subtle sm:flex-row">
          <p>
            <span>
              Notes by{' '}
              <a
                href={site.authorUrl}
                className={`underline underline-offset-4 hover:text-brand dark:hover:text-night-brand ${focus}`}
              >
                {site.author}
              </a>
              .
            </span>{' '}
            <span>
              Built by{' '}
              <a
                href={site.companyUrl}
                className={`underline underline-offset-4 hover:text-brand dark:hover:text-night-brand ${focus}`}
              >
                Unyrise Tech
              </a>
              .
            </span>
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/privacy" className={`hover:text-brand dark:hover:text-night-brand ${focus}`}>
              Privacy
            </Link>
            <span>-</span>
            <Link to="/content-policy" className={`hover:text-brand dark:hover:text-night-brand ${focus}`}>
              Content Policy
            </Link>
            <span>-</span>
            <Link to="/help" className={`hover:text-brand dark:hover:text-night-brand ${focus}`}>
              Help & FAQ
            </Link>
            <span>-</span>
            <Link to="/contact" className={`hover:text-brand dark:hover:text-night-brand ${focus}`}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
