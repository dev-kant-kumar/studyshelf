import { lazy, Suspense, createElement, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Copy, Printer, Maximize2, Minimize2, List, ArrowLeft, ArrowRight } from 'lucide-react'
import { getNote, getPaper, getCourse, getSemester, notes } from '../../notesData'
import ErrorPage from '../../ErrorPage'
import ReaderLayout from '../../layouts/ReaderLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import DocumentHead from '../../shared/components/DocumentHead'
import NoteSidebar from './components/NoteSidebar'
import SaveButton from '../../shared/components/SaveButton'
import ReadingPreferences from '../../shared/components/ReadingPreferences'
import TableOfContents from '../../shared/components/TableOfContents'
import ContentBoundary from '../../shared/components/ContentBoundary'
import Loader from '../../shared/components/Loader'
import Drawer from '@/ui/Drawer'
import { usePreferences } from '../../shared/hooks/preferencesContext'
import useArticleOutline from '../../shared/hooks/useArticleOutline'
import { title, muted, eyebrow, secondary, focus, link } from '@/ui/classes'
import { formatDate } from '@/lib/format'
import { site } from '@/config/site'

const noteBodies = new Map(notes.map(note => [note.slug, createElement(lazy(note.loadComponent))]))
const prose = 'leading-[1.75] break-words [&_p]:my-5 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24 [&_h2]:font-sans [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-snug [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-24 [&_h3]:font-sans [&_h3]:text-xl [&_h3]:font-semibold [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-2 [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 dark:[&_a]:text-night-brand [&_a]:focus-visible:outline-2 [&_a]:focus-visible:outline-offset-4 [&_pre]:my-6 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-soft [&_pre]:p-5 [&_pre]:text-[15px] dark:[&_pre]:bg-night-soft [&_code]:font-mono [&_img]:max-w-full [&_img]:h-auto [&_h4]:mt-6 [&_h4]:mb-3 [&_h4]:font-semibold [&_hr]:my-8 [&_hr]:border-line dark:[&_hr]:border-night-line [&_figure]:my-8 [&_figcaption]:mt-3 [&_figcaption]:text-sm [&_figcaption]:text-subtle dark:[&_figcaption]:text-night-subtle [&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-brand [&_blockquote]:pl-5 dark:[&_blockquote]:border-night-brand [&_table]:w-full [&_table]:text-base [&_th]:border-b [&_th]:border-line [&_th]:p-3 [&_th]:text-left [&_td]:border-b [&_td]:border-line [&_td]:p-3 dark:[&_th]:border-night-line dark:[&_td]:border-night-line print:[&_pre]:whitespace-pre-wrap print:[&_pre]:break-words print:[&_*]:!text-black print:[&_*]:!bg-transparent print:[&_pre]:overflow-visible print:[&_figure]:break-inside-avoid print:[&_tr]:break-inside-avoid'

export default function Note({ preview: fixture }) {
  const preview = import.meta.env.DEV ? fixture : undefined
  const { slug } = useParams()
  const note = preview?.note ?? getNote(slug)
  const { preferences, remember } = usePreferences()
  const article = useRef(null)
  const [focusMode, setFocusMode] = useState(false)
  const [drawer, setDrawer] = useState(false)
  const [message, setMessage] = useState('')
  const { headings, active, minutes } = useArticleOutline(article, slug)


  useEffect(() => {
    if (note && !preview) remember(note.slug)
  }, [note, remember, preview])

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
      setMessage('Link copied.')
    } catch {
      setMessage('Could not copy the link. Copy the address from your browser instead.')
    }
  }

  const size = {
    16: 'text-base',
    18: 'text-[17px] sm:text-lg',
    20: 'text-xl',
    22: 'text-[22px]',
  }[preferences.readerSize]

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
      <ReaderLayout focusMode={focusMode} sidebar={sidebar} toc={toc}>
        {preview && (
          <p className="mb-6 rounded-lg border border-outline bg-soft p-4 font-sans text-sm dark:border-night-outline dark:bg-night-soft">
            Development reader preview. This layout fixture is excluded from the public catalogue and production build.
          </p>
        )}
        <Breadcrumbs
          items={[
            { label: course.name, href: course.href },
            { label: semester.title, href: semester.href },
            { label: paper.title, href: paper.href },
            { label: note.title },
          ]}
        />
        <div className="mb-6 print:mb-4">
          <p className={eyebrow}>{course.name} · {paper.code}</p>
          <h1 className={`${title} mt-4`} tabIndex={-1}>{note.title}</h1>
          <p className={`mt-4 text-lg leading-relaxed ${muted}`}>{note.summary}</p>
          <div className={`mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm ${muted}`}>
            <span>By {note.author ?? site.author}</span>
            {note.updatedAt && <span>Updated {formatDate(note.updatedAt)}</span>}
            {minutes && <span>{minutes} min read</span>}
          </div>
        </div>
        <div className="mb-6 space-y-4 border-y border-line py-4 dark:border-night-line print:hidden">
          <div className="flex flex-wrap gap-2">
            {!preview && <SaveButton label note={note} />}
            <button className={secondary} type="button" onClick={copy}>
              <Copy size={17} aria-hidden="true" />Copy link
            </button>
            <button className={secondary} type="button" onClick={() => window.print()}>
              <Printer size={17} aria-hidden="true" />Print
            </button>
            <button
              className={secondary}
              type="button"
              aria-pressed={focusMode}
              onClick={() => setFocusMode(value => !value)}
            >
              {focusMode ? <Minimize2 size={17} aria-hidden="true" /> : <Maximize2 size={17} aria-hidden="true" />}
              {focusMode ? 'Exit focus mode' : 'Focus mode'}
            </button>
            {!focusMode && (
              <button
                className={`${secondary} lg:hidden`}
                type="button"
                onClick={() => setDrawer(true)}
              >
                <List size={17} aria-hidden="true" />Subject notes
              </button>
            )}
          </div>
          <ReadingPreferences />
          <p className={`text-sm ${muted}`} role="status">{message}</p>
        </div>
        {!focusMode && (
          <details className="mb-6 rounded-lg border border-line p-4 dark:border-night-line xl:hidden print:hidden">
            <summary className={`min-h-8 cursor-pointer font-semibold ${focus}`}>On this page</summary>
            <div className="mt-4">{toc}</div>
          </details>
        )}
        {!preview && currentUnit && (
          <nav aria-label="Unit topic navigation" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-soft px-4 py-3 font-sans text-sm dark:bg-night-soft print:hidden">
            <span>Unit {currentUnit.number} · Topic {topicPosition + 1} of {currentUnit.notes.length}</span>
            <Link className={link} to={currentUnit.href}>All Unit {currentUnit.number} topics</Link>
          </nav>
        )}
        <div
          ref={article}
          className={`${prose} ${size} ${preferences.readerFont === 'serif' ? 'font-display' : 'font-sans'} ${focusMode ? 'mx-auto max-w-[76ch]' : 'w-full'} print:font-sans print:text-base print:text-black dark:print:text-black`}
        >
          <ContentBoundary key={slug}>
            <Suspense fallback={<Loader compact label="Loading your chapter" />}>
              {preview?.body ?? noteBodies.get(slug)}
            </Suspense>
          </ContentBoundary>
        </div>
        <p className="mt-6 hidden text-sm print:block">
          {site.url}{note.href} · Notes by {site.author}
        </p>
        <div className="mt-10 grid grid-cols-1 gap-3 border-t border-line pt-6 dark:border-night-line sm:grid-cols-2 sm:gap-4 print:hidden">
          {previous && (
            <Link className={`${secondary} min-w-0 justify-start`} to={previous.href}>
              <ArrowLeft size={17} className="shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <span className={`block text-xs ${muted}`}>Previous note</span>
                <span className="line-clamp-1">{previous.title}</span>
              </span>
            </Link>
          )}
          {next && (
            <Link className={`${secondary} min-w-0 justify-start sm:col-start-2`} to={next.href}>
              <span className="min-w-0">
                <span className={`block text-xs ${muted}`}>Next note</span>
                <span className="line-clamp-1">{next.title}</span>
              </span>
              <ArrowRight size={17} className="shrink-0" aria-hidden="true" />
            </Link>
          )}
        </div>
        <p className={`mt-8 text-sm print:hidden ${muted}`}>
          Spot an error? <Link className={link} to={`/contact?page=${encodeURIComponent(site.url + note.href)}`}>Report it to Study Shelf</Link> with this page link.
        </p>
      </ReaderLayout>
      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Subject notes">
        <div onClick={event => { if (event.target.closest('a')) setDrawer(false) }}>
          {sidebar}
        </div>
      </Drawer>
    </>
  )
}
