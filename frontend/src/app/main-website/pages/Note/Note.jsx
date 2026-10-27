import { lazy, Suspense, createElement, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Copy,
  Printer,
  Maximize2,
  Minimize2,
  List,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Calendar,
  User,
} from 'lucide-react'
import { getNote, getPaper, getCourse, getSemester, notes } from '../../notesData'
import ErrorPage from '../../ErrorPage'
import ReaderLayout from '../../layouts/ReaderLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import DocumentHead from '../../shared/components/DocumentHead'
import NoteSidebar from './components/NoteSidebar'
import PrintDialog from './components/PrintDialog'
import SaveButton from '../../shared/components/SaveButton'
import ReadingPreferences from '../../shared/components/ReadingPreferences'
import TableOfContents from '../../shared/components/TableOfContents'
import ContentBoundary from '../../shared/components/ContentBoundary'
import Loader from '../../shared/components/Loader'
import Drawer from '@/ui/Drawer'
import { usePreferences } from '../../shared/hooks/preferencesContext'
import useArticleOutline from '../../shared/hooks/useArticleOutline'
import { title, muted, focus, link } from '@/ui/classes'
import { formatDate } from '@/lib/format'
import { site } from '@/config/site'

const noteBodies = new Map(notes.map(note => [note.slug, createElement(lazy(note.loadComponent))]))
const prose = 'leading-[1.75] break-words [&_p]:my-5 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2]:font-sans [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-snug [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-24 [&_h3]:font-sans [&_h3]:text-xl [&_h3]:font-semibold [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-2 [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 dark:[&_a]:text-night-brand [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_pre]:my-6 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-soft [&_pre]:p-5 [&_pre]:text-[15px] dark:[&_pre]:bg-night-soft [&_code]:font-mono [&_img]:max-w-full [&_img]:h-auto [&_h4]:mt-6 [&_h4]:mb-3 [&_h4]:font-semibold [&_hr]:my-8 [&_hr]:border-line dark:[&_hr]:border-night-line [&_figure]:my-8 [&_figcaption]:mt-3 [&_figcaption]:text-sm [&_figcaption]:text-subtle dark:[&_figcaption]:text-night-subtle [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-brand [&_blockquote]:pl-5 dark:[&_blockquote]:border-night-brand [&_table]:w-full [&_table]:border-collapse [&_table]:text-base [&_th]:border-b [&_th]:border-line [&_th]:bg-soft/50 [&_th]:p-3 [&_th]:text-left dark:[&_th]:border-night-line dark:[&_th]:bg-night-soft/50 [&_td]:border-b [&_td]:border-line [&_td]:p-3 dark:[&_td]:border-night-line print:[&_pre]:whitespace-pre-wrap print:[&_pre]:break-words print:[&_*]:!text-black print:[&_*]:!bg-transparent print:[&_pre]:overflow-visible'

export default function Note({ preview: fixture }) {
  const preview = import.meta.env.DEV ? fixture : undefined
  const { slug } = useParams()
  const note = preview?.note ?? getNote(slug)
  const { preferences, remember } = usePreferences()
  const article = useRef(null)
  const [focusMode, setFocusMode] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [tocDrawer, setTocDrawer] = useState(false)
  const [copied, setCopied] = useState(false)
  const [progress, setProgress] = useState(0)
  const { headings, active, minutes } = useArticleOutline(article, slug)

  // Multi-scope print state
  const [printModalOpen, setPrintModalOpen] = useState(false)
  const [printScope, setPrintScope] = useState('topic') // 'topic' | 'unit' | 'paper'
  const [isPreparingPrint, setIsPreparingPrint] = useState(false)
  const [printProgressText, setPrintProgressText] = useState('')
  const [printedDate] = useState(() => formatDate(new Date().toISOString().slice(0, 10)))

  useEffect(() => {
    if (note && !preview) remember(note.slug)
  }, [note, remember, preview])

  // Track scroll reading progress percentage
  useEffect(() => {
    function onScroll() {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) {
        setProgress(0)
        return
      }
      const current = Math.min(100, Math.max(0, Math.round((window.scrollY / total) * 100)))
      setProgress(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [slug])

  // Reset print scope back to 'topic' when printing dialog finishes or closes
  useEffect(() => {
    function onAfterPrint() {
      setPrintScope('topic')
    }
    window.addEventListener('afterprint', onAfterPrint)
    return () => window.removeEventListener('afterprint', onAfterPrint)
  }, [])

  if (!note) return <ErrorPage />

  const paper = preview?.paper ?? getPaper(note.courseId, note.semesterId, note.paperId)
  const course = preview?.course ?? getCourse(note.courseId)
  const semester = preview?.semester ?? getSemester(note.courseId, note.semesterId)
  const currentUnit = paper.units.find(unit => unit.id === note.unitId)
  const topicPosition = currentUnit?.notes.findIndex(item => item.slug === note.slug)
  const sequence = paper.units.flatMap(unit => unit.notes)
  const position = sequence.findIndex(item => item.slug === note.slug)
  const previous = sequence[position - 1]
  const next = sequence[position + 1]

  const sidebar = (
    <NoteSidebar
      paper={paper}
      currentNoteId={note.slug}
      currentUnitId={note.unitId}
    />
  )

  const toc = <TableOfContents headings={headings} active={active} />

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // Browser permissions fallback
    }
  }

  async function handlePrintScope(scope) {
    let targets = [note]
    if (scope === 'unit' && currentUnit) {
      targets = currentUnit.notes
    } else if (scope === 'paper') {
      targets = sequence
    }

    if (scope === 'topic') {
      setPrintScope('topic')
      setPrintModalOpen(false)
      setTimeout(() => window.print(), 120)
      return
    }

    setIsPreparingPrint(true)
    setPrintProgressText(`Loading ${targets.length} topics and solutions...`)

    try {
      await Promise.all(targets.map(item => item.loadComponent()))
    } catch (err) {
      console.error('Failed to pre-load components for print', err)
    }

    setPrintScope(scope)
    setIsPreparingPrint(false)
    setPrintModalOpen(false)

    // Give React a tick to mount all targets before triggering the browser print engine
    setTimeout(() => {
      window.print()
    }, 450)
  }

  const size = {
    16: 'text-base',
    18: 'text-[17px] sm:text-lg',
    20: 'text-xl',
    22: 'text-[22px]',
  }[preferences.readerSize]

  const ghostButton = `inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium text-subtle transition-colors hover:bg-soft hover:text-ink dark:text-night-subtle dark:hover:bg-night-soft dark:hover:text-night-ink ${focus}`

  return (
    <>
      <DocumentHead
        title={note.title}
        seoTitle={note.seoTitle ?? `${note.title} - VBU ${course.name} Notes`}
        description={note.summary}
        path={note.href}
        article={note}
        noindex={Boolean(preview)}
      />

      {/* Top Reading Progress Bar */}
      <div
        className="fixed top-16 inset-x-0 z-30 h-0.5 bg-line/30 dark:bg-night-line/30 print:hidden"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      >
        <div
          className="h-full bg-brand transition-[width] duration-150 ease-out dark:bg-night-brand"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ReaderLayout focusMode={focusMode} sidebar={sidebar} toc={toc}>
        {preview && (
          <p className="mb-6 rounded-lg border border-outline bg-soft p-4 font-sans text-sm dark:border-night-outline dark:bg-night-soft">
            Development reader preview. This layout fixture is excluded from the public catalogue and production build.
          </p>
        )}

        {/* Breadcrumb Trail */}
        <div className="print:hidden">
          <Breadcrumbs
            items={[
              { label: course.name, href: course.href },
              { label: semester.title, href: semester.href },
              { label: paper.title, href: paper.href },
              { label: note.title },
            ]}
          />
        </div>

        {/* Note Header (Exactly one H1 for both Screen and Single-Topic Print) */}
        <header className={`mb-6 print:mb-4 ${printScope !== 'topic' ? 'print:hidden' : ''}`}>
          {/* Eyebrow metadata trail (screen only) */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-subtle dark:text-night-subtle print:hidden">
            <span className="text-brand dark:text-night-brand">{course.name}</span>
            <span>·</span>
            <span>{paper.code}</span>
            {currentUnit && (
              <>
                <span>·</span>
                <Link to={currentUnit.href} className="hover:text-brand dark:hover:text-night-brand hover:underline">
                  Unit {currentUnit.number}
                </Link>
                <span>·</span>
                <span className="font-normal text-subtle/80 dark:text-night-subtle/80">
                  Topic {topicPosition + 1} of {currentUnit.notes.length}
                </span>
              </>
            )}
          </div>

          {/* Printable Document Header for Single-Topic Print */}
          <div className="hidden print:block mb-4 border-b-2 border-black pb-3 print:mb-3 print:pb-2">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-600 print:text-[10px]">
              Vinoba Bhave University, Hazaribag · Study Shelf Academic Notes
            </div>
            <div className="mt-1 text-sm font-semibold text-gray-800 print:text-xs">
              {course.name} ({course.description}) · {semester.title} · {paper.code}: {paper.title}
            </div>
            {currentUnit && (
              <div className="mt-0.5 text-xs text-gray-600 print:text-[11px]">
                Unit {currentUnit.number}: {currentUnit.title} · Topic {topicPosition + 1} of {currentUnit.notes.length}
              </div>
            )}
          </div>

          <h1 className={`${title} mt-3 text-2xl font-bold tracking-tight text-ink sm:text-3xl lg:text-4xl dark:text-night-ink print:text-xl print:font-bold print:text-black print:mt-1`} tabIndex={-1}>
            {note.title}
          </h1>

          <p className="mt-3 text-base sm:text-lg leading-relaxed text-subtle dark:text-night-subtle max-w-3xl print:text-xs print:text-gray-700 print:mt-1">
            {note.summary}
          </p>

          <div className={`mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm ${muted} print:mt-2 print:text-xs print:text-gray-500`}>
            <span className="inline-flex items-center gap-1.5">
              <User size={14} className="text-subtle dark:text-night-subtle print:hidden" aria-hidden="true" />
              By {note.author ?? site.author}
            </span>
            {note.updatedAt && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} className="text-subtle dark:text-night-subtle print:hidden" aria-hidden="true" />
                Updated {formatDate(note.updatedAt)}
              </span>
            )}
            {minutes && (
              <span className="inline-flex items-center gap-1.5 print:hidden">
                <Clock size={14} className="text-subtle dark:text-night-subtle" aria-hidden="true" />
                {minutes} min read
              </span>
            )}
            <span className="hidden print:inline">
              · Printed on {printedDate}
            </span>
          </div>
        </header>

        {/* Clean Hairline Reading Controls */}
        <div className="my-6 flex flex-wrap items-center justify-between gap-3 border-y border-line/60 py-2.5 dark:border-night-line/60 print:hidden">
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            {!preview && (
              <SaveButton
                label
                note={note}
                className={ghostButton}
              />
            )}

            <button
              type="button"
              onClick={copy}
              className={ghostButton}
              title="Copy note link to clipboard"
            >
              {copied ? (
                <Check size={15} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              ) : (
                <Copy size={15} aria-hidden="true" />
              )}
              <span>{copied ? 'Copied' : 'Copy link'}</span>
            </button>

            {/* Print button triggers the print scope modal */}
            <button
              type="button"
              onClick={() => setPrintModalOpen(true)}
              className={ghostButton}
              title="Print or export to PDF (Topic, Unit, or Paper)"
            >
              <Printer size={15} aria-hidden="true" />
              <span>Print</span>
            </button>

            <button
              type="button"
              aria-pressed={focusMode}
              onClick={() => setFocusMode(value => !value)}
              className={`inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                focusMode
                  ? 'bg-selected text-brand dark:bg-night-selected dark:text-night-brand'
                  : 'text-subtle hover:bg-soft hover:text-ink dark:text-night-subtle dark:hover:bg-night-soft dark:hover:text-night-ink'
              } ${focus}`}
              title="Toggle distraction-free focus mode"
            >
              {focusMode ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}
              <span className="hidden xs:inline">{focusMode ? 'Exit focus' : 'Focus'}</span>
            </button>

            {!focusMode && (
              <button
                type="button"
                onClick={() => setDrawer(true)}
                className={`${ghostButton} lg:hidden`}
                title="Browse paper notes and topics"
              >
                <List size={15} aria-hidden="true" />
                <span>Notes</span>
              </button>
            )}
          </div>

          {/* Typography Controls */}
          <ReadingPreferences />
        </div>

        {/* Mobile / Tablet In-Page "On this page" TOC */}
        {!focusMode && headings.length > 0 && (
          <details className="group mb-6 text-sm xl:hidden print:hidden border-b border-line/50 pb-3 dark:border-night-line/50">
            <summary className={`flex cursor-pointer items-center justify-between rounded-lg py-1.5 text-subtle transition-colors hover:text-ink dark:text-night-subtle dark:hover:text-night-ink ${focus}`}>
              <div className="flex items-center gap-2">
                <BookOpen size={15} className="text-brand dark:text-night-brand shrink-0" aria-hidden="true" />
                <span className="font-medium text-ink dark:text-night-ink">On this page</span>
                <span className="text-xs text-subtle dark:text-night-subtle">({headings.length} sections)</span>
              </div>
              <ChevronDown
                size={15}
                className="transition-transform duration-200 group-open:rotate-180 shrink-0"
                aria-hidden="true"
              />
            </summary>
            <div className="border-l border-line/60 pl-3 pt-2.5 dark:border-night-line/60">
              <TableOfContents headings={headings} active={active} hideTitle />
            </div>
          </details>
        )}

        {/* Single-Topic View (Screen & Print for 'topic' scope) */}
        <div className={printScope !== 'topic' ? 'print:hidden' : ''}>
          {/* Reading Body */}
          <div
            ref={article}
            className={`${prose} ${size} ${
              preferences.readerFont === 'serif' ? 'font-display' : 'font-sans'
            } max-w-[78ch] ${focusMode ? 'mx-auto' : ''} print:max-w-none print:font-sans print:text-base print:text-black dark:print:text-black`}
          >
            <ContentBoundary key={slug}>
              <Suspense fallback={<Loader compact label="Loading your chapter" />}>
                {preview?.body ?? noteBodies.get(slug)}
              </Suspense>
            </ContentBoundary>
          </div>

          <p className="mt-8 hidden text-xs text-gray-500 border-t border-gray-300 pt-3 print:block print:mt-3 print:pt-1.5 print:text-[10px]">
            {site.url}{note.href} · Notes by {site.author} · Study Shelf
          </p>
        </div>

        {/* Multi-Topic Print View: Full Unit or Full Paper */}
        {printScope !== 'topic' && (
          <div className="hidden print:block">
            {/* Multi-Topic Cover Header */}
            <div className="mb-10 border-b-2 border-black pb-6 text-center print:mb-4 print:pb-3">
              <div className="text-xs font-bold uppercase tracking-widest text-gray-600 print:text-[10px]">
                Vinoba Bhave University, Hazaribag · Study Shelf Academic Notes
              </div>
              <h2 className="mt-2 text-3xl font-bold text-black print:text-xl print:mt-1">
                {paper.title} ({paper.code})
              </h2>
              <p className="mt-1 text-sm font-semibold text-gray-800 print:text-xs">
                {course.name} ({course.description}) · {semester.title}
              </p>
              {printScope === 'unit' && currentUnit && (
                <div className="mt-3 inline-block rounded border border-gray-400 bg-gray-100 px-3 py-1 text-sm font-bold text-gray-900 print:mt-1.5 print:text-xs print:px-2 print:py-0.5">
                  Complete Unit {currentUnit.number}: {currentUnit.title} ({currentUnit.notes.length} Topics)
                </div>
              )}
              {printScope === 'paper' && (
                <div className="mt-3 inline-block rounded border border-gray-400 bg-gray-100 px-3 py-1 text-sm font-bold text-gray-900 print:mt-1.5 print:text-xs print:px-2 print:py-0.5">
                  Complete Paper Curriculum ({paper.units.length} Units · {sequence.length} Topics)
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500 print:mt-1 print:text-[10px]">
                Printed on {printedDate} · {site.url}
              </div>
            </div>

            {/* Sequence of All Topics in Selected Scope */}
            {(printScope === 'unit' ? currentUnit?.notes || [] : sequence).map((item, idx) => {
              const itemUnit = paper.units.find(u => u.id === item.unitId)
              const itemIndex = itemUnit?.notes.findIndex(n => n.slug === item.slug) ?? idx
              return (
                <article
                  key={item.slug}
                  className={`${prose} print:text-black mb-12 print:mb-0 print:pb-0 ${idx > 0 ? 'print-page-break print:pt-0' : ''}`}
                >
                  {/* Topic Header */}
                  <div className="mb-6 border-b border-gray-400 pb-3 print:mb-3 print:pb-2">
                    <div className="text-xs font-semibold uppercase tracking-wider text-gray-600 print:text-[10px]">
                      Unit {itemUnit?.number} · Topic {itemIndex + 1} of {itemUnit?.notes.length}
                    </div>
                    <h2 className="mt-1 text-2xl font-bold text-black print:text-lg print:mt-0.5">{item.title}</h2>
                    <p className="mt-1 text-sm text-gray-700 print:text-xs">{item.summary}</p>
                    <div className="mt-2 text-xs text-gray-500 print:mt-1 print:text-[10px]">
                      By {item.author ?? site.author} · {item.updatedAt && `Updated ${formatDate(item.updatedAt)}`}
                    </div>
                  </div>

                  {/* Topic Content Body */}
                  <Suspense fallback={<p className="text-sm text-gray-500">Loading topic content...</p>}>
                    {noteBodies.get(item.slug)}
                  </Suspense>

                  {/* Topic End Footer */}
                  <div className="mt-8 border-t border-gray-300 pt-2 text-xs text-gray-500 print:mt-4 print:pt-1 print:text-[10px]">
                    Study Shelf · {item.title} · {site.url}{item.href}
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {/* Previous and Next Topic Navigation Cards */}
        <nav aria-label="Topic navigation" className="mt-12 border-t border-line pt-8 dark:border-night-line print:hidden">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {previous ? (
              <Link
                to={previous.href}
                className={`group flex items-start gap-3 rounded-xl border border-line bg-surface p-4 text-left transition-all hover:border-brand/40 hover:bg-soft/70 dark:border-night-line dark:bg-night-surface dark:hover:border-night-brand/40 dark:hover:bg-night-soft/70 shadow-xs ${focus}`}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-soft text-subtle transition-colors group-hover:bg-selected group-hover:text-brand dark:bg-night-soft dark:text-night-subtle dark:group-hover:bg-night-selected dark:group-hover:text-night-brand">
                  <ArrowLeft size={16} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-subtle dark:text-night-subtle">
                    Previous topic
                  </span>
                  <span className="mt-1 block font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand line-clamp-2 text-sm sm:text-base">
                    {previous.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}

            {next && (
              <Link
                to={next.href}
                className={`group flex items-start justify-between gap-3 rounded-xl border border-line bg-surface p-4 text-right transition-all hover:border-brand/40 hover:bg-soft/70 dark:border-night-line dark:bg-night-surface dark:hover:border-night-brand/40 dark:hover:bg-night-soft/70 shadow-xs sm:col-start-2 ${focus}`}
              >
                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-subtle dark:text-night-subtle">
                    Next topic
                  </span>
                  <span className="mt-1 block font-semibold text-ink group-hover:text-brand dark:text-night-ink dark:group-hover:text-night-brand line-clamp-2 text-sm sm:text-base">
                    {next.title}
                  </span>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-soft text-subtle transition-colors group-hover:bg-selected group-hover:text-brand dark:bg-night-soft dark:text-night-subtle dark:group-hover:bg-night-selected dark:group-hover:text-night-brand">
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              </Link>
            )}
          </div>

          {/* Back to top helper */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-subtle hover:text-ink dark:text-night-subtle dark:hover:text-night-ink ${focus}`}
            >
              <ArrowUp size={14} aria-hidden="true" />
              Back to top of note
            </button>
          </div>
        </nav>

        <p className={`mt-8 text-sm print:hidden ${muted}`}>
          Spot an error? <Link className={link} to={`/contact?page=${encodeURIComponent(site.url + note.href)}`}>Report it to Study Shelf</Link> with this page link.
        </p>
      </ReaderLayout>

      {/* Mobile Floating Quick Navigation Bar */}
      <div className="fixed bottom-4 inset-x-3 z-30 mx-auto flex max-w-sm items-center justify-between rounded-full border border-line/80 bg-surface/90 px-3.5 py-2 shadow-lg backdrop-blur-md dark:border-night-line/80 dark:bg-night-surface/90 lg:hidden print:hidden">
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-ink hover:text-brand dark:text-night-ink dark:hover:text-night-brand ${focus}`}
        >
          <List size={15} aria-hidden="true" />
          <span>Topics</span>
        </button>

        {headings.length > 0 && (
          <button
            type="button"
            onClick={() => setTocDrawer(true)}
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-ink hover:text-brand dark:text-night-ink dark:hover:text-night-brand ${focus}`}
          >
            <BookOpen size={15} aria-hidden="true" />
            <span>Outline</span>
          </button>
        )}

        {/* Mobile Print Trigger */}
        <button
          type="button"
          onClick={() => setPrintModalOpen(true)}
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-ink hover:text-brand dark:text-night-ink dark:hover:text-night-brand ${focus}`}
        >
          <Printer size={15} aria-hidden="true" />
          <span>Print</span>
        </button>

        <span className="font-mono text-[11px] font-semibold text-brand dark:text-night-brand px-1">
          {progress}%
        </span>

        <div className="flex items-center gap-1">
          {previous && (
            <Link
              to={previous.href}
              title="Previous note"
              aria-label="Previous note"
              className={`flex size-7 items-center justify-center rounded-full text-subtle hover:bg-soft hover:text-ink dark:text-night-subtle dark:hover:bg-night-soft dark:hover:text-night-ink ${focus}`}
            >
              <ArrowLeft size={14} aria-hidden="true" />
            </Link>
          )}
          {next && (
            <Link
              to={next.href}
              title="Next note"
              aria-label="Next note"
              className={`flex size-7 items-center justify-center rounded-full text-subtle hover:bg-soft hover:text-ink dark:text-night-subtle dark:hover:bg-night-soft dark:hover:text-night-ink ${focus}`}
            >
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Back to top"
            aria-label="Back to top"
            className={`flex size-7 items-center justify-center rounded-full text-subtle hover:bg-soft hover:text-ink dark:text-night-subtle dark:hover:bg-night-soft dark:hover:text-night-ink ${focus}`}
          >
            <ArrowUp size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Print Options Dialog (Topic, Unit, or Paper) */}
      <PrintDialog
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        note={note}
        currentUnit={currentUnit}
        paper={paper}
        onPrint={handlePrintScope}
        isPreparing={isPreparingPrint}
        progressText={printProgressText}
      />

      {/* Mobile Drawer for Subject Notes */}
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Subject notes">
        <div className="-mx-6 -mb-6 flex min-h-0 flex-col" onClick={event => { if (event.target.closest('a')) setDrawer(false) }}>
          {sidebar}
        </div>
      </Drawer>

      {/* Mobile Drawer for Chapter Outline / TOC */}
      <Drawer open={tocDrawer} onClose={() => setTocDrawer(false)} title="Chapter outline">
        <div onClick={event => { if (event.target.closest('a')) setTocDrawer(false) }}>
          <TableOfContents headings={headings} active={active} hideTitle onSelect={() => setTocDrawer(false)} />
        </div>
      </Drawer>
    </>
  )
}
