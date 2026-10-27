import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Search,
  Bookmark,
  Menu,
  GraduationCap,
  Code,
  Compass,
  Clock,
} from 'lucide-react'
import { site } from '@/config/site'
import { courses } from '../../notesData'
import ThemeControl from './ThemeControl'
import Drawer from '@/ui/Drawer'
import { usePreferences } from '../hooks/preferencesContext'
import { container, iconButton, focus } from '@/ui/classes'

export default function Header() {
  const [open, setOpen] = useState(false)
  const { preferences } = usePreferences()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const savedCount = preferences.saved.length

  const headerWidth =
    pathname.startsWith('/notes/') || pathname === '/dev/reader'
      ? 'w-full px-4 sm:px-6 lg:px-5 2xl:px-6'
      : container

  // Global '/' keyboard shortcut to jump to search
  useEffect(() => {
    const handleKeyDown = e => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) &&
        !document.activeElement?.isContentEditable
      ) {
        e.preventDefault()
        navigate('/search')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  const desktopNavLinkClass = ({ isActive }) =>
    `relative flex h-16 items-center px-3 text-sm font-medium transition-colors motion-reduce:transition-none ${focus} ${
      isActive
        ? 'font-semibold text-brand dark:text-night-brand after:absolute after:bottom-0 after:left-1.5 after:right-1.5 after:h-0.5 after:rounded-full after:bg-brand dark:after:bg-night-brand'
        : 'text-subtle hover:text-ink dark:text-night-subtle dark:hover:text-night-ink'
    }`

  const drawerNavClass = ({ isActive }) =>
    `flex min-h-10 items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${focus} ${
      isActive
        ? 'bg-selected text-brand dark:bg-night-selected dark:text-night-brand'
        : 'text-subtle hover:bg-soft hover:text-ink dark:text-night-subtle dark:hover:bg-night-soft dark:hover:text-night-ink'
    }`

  return (
    <>
      <a
        className={`fixed top-2 left-4 z-[100] -translate-y-24 rounded-lg bg-brand px-4 py-3 text-on-brand transition-transform focus:translate-y-0 ${focus}`}
        href="#main-content"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur-sm dark:border-night-line dark:bg-night-surface/95 print:hidden">
        <div className={`${headerWidth} flex h-16 items-center justify-between gap-3`}>
          {/* Brand Logo */}
          <Link
            className={`inline-flex shrink-0 items-center gap-2.5 font-display text-xl font-bold tracking-tight text-ink dark:text-night-ink ${focus}`}
            to="/"
            aria-label={`${site.name} home`}
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand text-on-brand shadow-sm dark:bg-night-brand dark:text-night-on-brand">
              <BookOpen aria-hidden="true" size={20} />
            </span>
            <span>{site.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden h-16 items-center gap-1 lg:flex" aria-label="Main navigation">
            {courses.map(course => (
              <NavLink className={desktopNavLinkClass} key={course.id} to={course.href}>
                {course.name}
              </NavLink>
            ))}
            <NavLink className={desktopNavLinkClass} to="/routine">
              <span>Routine</span>
            </NavLink>
            <NavLink className={desktopNavLinkClass} to="/developers">
              Developers
            </NavLink>
            <NavLink className={desktopNavLinkClass} to="/careers">
              Careers
            </NavLink>
          </nav>

          {/* Desktop Actions: Search Pill, Saved, Theme */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              to="/search"
              className={`inline-flex items-center gap-2 rounded-lg border border-line bg-soft/40 px-3 py-1.5 text-xs text-subtle transition-colors hover:border-brand/40 hover:bg-surface hover:text-ink dark:border-night-line dark:bg-night-soft/30 dark:text-night-subtle dark:hover:border-night-brand/40 dark:hover:bg-night-surface dark:hover:text-night-ink ${focus}`}
              aria-label="Search notes"
            >
              <Search size={14} className="text-brand dark:text-night-brand" aria-hidden="true" />
              <span>Search</span>
              <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] font-semibold text-subtle dark:border-night-line dark:bg-night-surface dark:text-night-subtle">
                /
              </kbd>
            </Link>

            <NavLink
              to="/saved"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${focus} ${
                  isActive
                    ? 'border-brand/40 bg-selected text-brand dark:border-night-brand/40 dark:bg-night-selected dark:text-night-brand'
                    : 'border-line bg-soft/40 text-subtle hover:border-brand/40 hover:bg-surface hover:text-ink dark:border-night-line dark:bg-night-soft/30 dark:text-night-subtle dark:hover:border-night-brand/40 dark:hover:bg-night-surface dark:hover:text-night-ink'
                }`
              }
              aria-label={`Saved notes, ${savedCount} saved`}
            >
              <Bookmark size={14} className="text-brand dark:text-night-brand" aria-hidden="true" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="rounded-full bg-brand/10 px-1.5 py-0.2 text-[10px] font-bold text-brand dark:bg-night-brand/20 dark:text-night-brand">
                  {savedCount}
                </span>
              )}
            </NavLink>

            <ThemeControl />
          </div>

          {/* Mobile Actions: Search Trigger & Menu Trigger */}
          <div className="flex items-center gap-1 lg:hidden">
            <Link className={iconButton} to="/search" aria-label="Search notes">
              <Search size={20} />
            </Link>
            <Link
              className={iconButton}
              to="/saved"
              aria-label={`Saved notes, ${savedCount} saved`}
            >
              <span className="relative">
                <Bookmark size={20} />
                {savedCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-on-brand dark:bg-night-brand dark:text-night-on-brand">
                    {savedCount}
                  </span>
                )}
              </span>
            </Link>
            <button
              className={iconButton}
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Structured Mobile Drawer */}
      <Drawer open={open} onClose={() => setOpen(false)} title="Study Shelf Menu">
        <nav className="space-y-6" aria-label="Mobile navigation">
          {/* Academic Syllabuses */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink dark:text-night-ink">
              <GraduationCap size={15} className="text-brand dark:text-night-brand" aria-hidden="true" />
              <span>Academic Library</span>
            </p>
            <div className="space-y-1">
              <NavLink className={drawerNavClass} to="/courses/mca" onClick={() => setOpen(false)}>
                <span>MCA Syllabus & Notes</span>
                <span className="rounded bg-soft px-1.5 py-0.5 text-[11px] font-mono text-subtle dark:bg-night-soft dark:text-night-subtle">PG</span>
              </NavLink>
              <NavLink className={drawerNavClass} to="/courses/bca" onClick={() => setOpen(false)}>
                <span>BCA Syllabus & Notes</span>
                <span className="rounded bg-soft px-1.5 py-0.5 text-[11px] font-mono text-subtle dark:bg-night-soft dark:text-night-subtle">UG</span>
              </NavLink>
              <NavLink className={drawerNavClass} to="/routine" onClick={() => setOpen(false)}>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-brand dark:text-night-brand" aria-hidden="true" />
                  <span>Class Routine</span>
                </span>
                <span className="rounded bg-selected px-1.5 py-0.5 text-[10px] font-semibold text-brand dark:bg-night-selected dark:text-night-brand">
                  Live
                </span>
              </NavLink>
              <NavLink className={drawerNavClass} to="/professors" onClick={() => setOpen(false)}>
                <span>Faculty Directory</span>
              </NavLink>
              <NavLink className={drawerNavClass} to="/holidays" onClick={() => setOpen(false)}>
                <span>Holiday Calendar 2026</span>
              </NavLink>
              <NavLink className={drawerNavClass} to="/vbu" onClick={() => setOpen(false)}>
                <span>VBU Student Guide</span>
              </NavLink>
            </div>
          </div>

          {/* Developer Shelf */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink dark:text-night-ink">
              <Code size={15} className="text-brand dark:text-night-brand" aria-hidden="true" />
              <span>Developer Shelf</span>
            </p>
            <div className="space-y-1">
              <NavLink className={drawerNavClass} to="/developers" onClick={() => setOpen(false)}>
                <span>Developer Roadmaps</span>
              </NavLink>
              <NavLink className={drawerNavClass} to="/careers" onClick={() => setOpen(false)}>
                <span>Career Explorer</span>
              </NavLink>
            </div>
          </div>

          {/* Student Tools */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink dark:text-night-ink">
              <Compass size={15} className="text-brand dark:text-night-brand" aria-hidden="true" />
              <span>Tools & Guidance</span>
            </p>
            <div className="space-y-1">
              <NavLink className={drawerNavClass} to="/search" onClick={() => setOpen(false)}>
                <span>Search Notes Archive</span>
              </NavLink>
              <NavLink className={drawerNavClass} to="/saved" onClick={() => setOpen(false)}>
                <span>Saved Notes on Device</span>
                {savedCount > 0 && (
                  <span className="rounded-full bg-selected px-2 py-0.5 text-xs font-semibold text-brand dark:bg-night-selected dark:text-night-brand">
                    {savedCount}
                  </span>
                )}
              </NavLink>
              <NavLink className={drawerNavClass} to="/about" onClick={() => setOpen(false)}>
                <span>About Study Shelf</span>
              </NavLink>
              <NavLink className={drawerNavClass} to="/help" onClick={() => setOpen(false)}>
                <span>Help and FAQs</span>
              </NavLink>
              <NavLink className={drawerNavClass} to="/contact" onClick={() => setOpen(false)}>
                <span>Contact & Feedback</span>
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Theme Control in Mobile Drawer */}
        <div className="mt-8 border-t border-line pt-6 dark:border-night-line">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink dark:text-night-ink">
            Colour theme
          </p>
          <ThemeControl id="mobile-theme" />
        </div>
      </Drawer>
    </>
  )
}
