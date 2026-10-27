import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function ReaderLayout({ children, sidebar, toc, focusMode }) {
  const subjectNotes = useRef(null)
  const { pathname } = useLocation()
  useEffect(() => {
    const sidebar = subjectNotes.current
    if (!sidebar) return
    const scrollable = sidebar.querySelector('[data-sidebar-scroll]') ?? sidebar
    function revealCurrentTopic() {
      if (!sidebar.clientHeight) return
      const active = sidebar.querySelector('[aria-current="page"]')
      if (!active) return
      const unit = active.closest('section')
      const bounds = scrollable.getBoundingClientRect()
      const topic = active.getBoundingClientRect()
      const unitTop = (unit ?? active).getBoundingClientRect().top
      // Scroll only this panel, keeping the unit heading visible when it fits.
      const visibleTop = bounds.top
      const visibleHeight = bounds.height
      if (visibleHeight <= 0) return
      const relativeTop = topic.bottom - unitTop <= visibleHeight - 32
        ? unitTop - visibleTop + scrollable.scrollTop - 16
        : topic.top - visibleTop + scrollable.scrollTop - visibleHeight / 3
      scrollable.scrollTo({ top: Math.max(0, relativeTop), behavior: 'instant' })
    }
    let frame = requestAnimationFrame(revealCurrentTopic)
    const settled = setTimeout(revealCurrentTopic, 250)
    function onWindowScroll() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(revealCurrentTopic)
    }
    function stopRecovery() {
      clearTimeout(settled)
      clearTimeout(recovery)
      window.removeEventListener('scroll', onWindowScroll)
      for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) window.removeEventListener(event, stopRecovery)
    }
    // Follow initial article restoration, then leave all manual scrolling alone.
    const recovery = setTimeout(() => { revealCurrentTopic(); stopRecovery() }, 4200)
    window.addEventListener('scroll', onWindowScroll, { passive: true })
    for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) window.removeEventListener(event, stopRecovery, { passive: true })
    window.addEventListener('pageshow', revealCurrentTopic)
    const resize = new ResizeObserver(revealCurrentTopic)
    resize.observe(scrollable)
    return () => { stopRecovery(); cancelAnimationFrame(frame); window.removeEventListener('pageshow', revealCurrentTopic); resize.disconnect() }
  }, [pathname, focusMode])
  return <div className={`w-full ${focusMode ? 'mx-auto max-w-[1080px]' : 'grid items-start lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_240px] 2xl:grid-cols-[300px_minmax(0,1fr)_280px]'} print:block print:max-w-none`}>
    {!focusMode && <aside ref={subjectNotes} aria-label="Subject notes" className="sticky top-16 hidden h-[calc(100dvh-64px)] flex-col border-r border-line bg-surface dark:border-night-line dark:bg-night-surface lg:flex print:hidden">{sidebar}</aside>}
    <div className="min-w-0 px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 print:p-0">{children}</div>
    {!focusMode && <aside aria-label="Chapter contents" className="sticky top-16 hidden max-h-[calc(100dvh-64px)] overflow-y-auto overscroll-contain border-l border-line px-5 py-8 dark:border-night-line xl:block 2xl:px-6 print:hidden">{toc}</aside>}
  </div>
}
