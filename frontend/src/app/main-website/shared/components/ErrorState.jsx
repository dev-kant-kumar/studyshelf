import { useEffect, useRef } from 'react'
import { BookOpen, Search, RotateCcw, ArrowRight, Unplug } from 'lucide-react'
import { button, secondary, muted, eyebrow, link } from '@/ui/classes'

export default function ErrorState({ variant = 'page', title }) {
  const heading = useRef(null)
  const missing = variant === 'missing'
  const compact = variant === 'note'
  const Heading = compact ? 'h2' : 'h1'
  useEffect(() => { heading.current?.focus({ preventScroll: true }) }, [])
  const path = typeof window === 'undefined' ? '' : window.location.origin + window.location.pathname
  return <section className={`mx-auto flex w-full flex-col items-center px-4 text-center ${compact ? 'rounded-xl border border-line py-10 dark:border-night-line' : 'max-w-3xl py-12 sm:py-20'}`} aria-label={missing ? 'Page not found' : 'Loading error'}>
    <div aria-hidden="true" className="relative mb-7 flex size-24 items-center justify-center rounded-2xl bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
      <BookOpen size={48} strokeWidth={1.5} />
      <span className="absolute -bottom-2 -right-2 flex size-9 items-center justify-center rounded-full border-4 border-canvas bg-brand text-on-brand dark:border-night-canvas dark:bg-night-brand dark:text-night-on-brand">{missing ? <Search size={17} /> : <Unplug size={17} />}</span>
    </div>
    <p className={eyebrow}>{missing ? '404 / Page not found' : compact ? 'Chapter unavailable' : 'Something went wrong'}</p>
    <Heading ref={heading} tabIndex={-1} className={`mt-4 font-display font-medium outline-none ${compact ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}>{title ?? (missing ? 'This page is off the shelf.' : compact ? 'We could not open this chapter.' : 'We could not open this page.')}</Heading>
    <p className={`mt-4 max-w-lg leading-7 ${muted}`}>{missing ? 'The link may have changed or the page may have moved. Search for your topic or browse the library to keep learning.' : 'Try loading it again. If the problem continues, return to the library or let us know.'}</p>
    <div className="mt-7 flex flex-wrap justify-center gap-3">
      {!missing && <button type="button" className={button} onClick={() => window.location.reload()}><RotateCcw size={17} aria-hidden="true" />Reload page</button>}
      <a className={missing ? button : secondary} href="/">Back to the library<ArrowRight size={17} aria-hidden="true" /></a>
      <a className={secondary} href="/search"><Search size={17} aria-hidden="true" />Search notes</a>
    </div>
    {missing ? <a className={`${link} mt-6 text-sm`} href="/vbu">Browse the VBU student guide</a> : <a className={`${link} mt-6 text-sm`} href={`/contact?page=${encodeURIComponent(path)}`}>Report this problem</a>}
  </section>
}
