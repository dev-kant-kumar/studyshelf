import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { chooseScrollTarget } from '@/lib/scrollNavigation'

function readStored(key) {
  try { return JSON.parse(sessionStorage.getItem(key)) } catch { return null }
}
function writeStored(key, value) {
  try { sessionStorage.setItem(key, JSON.stringify(value)) } catch { /* Navigation also works without storage. */ }
}
function capturePosition(main, hash) {
  const heading = [...main.querySelectorAll('h2[id], h3[id]')].filter(node => node.getBoundingClientRect().top <= 110).at(-1)
  return { y: window.scrollY, hash, heading: heading?.id, offset: heading?.getBoundingClientRect().top }
}

export default function RouteFocus() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const previous = useRef(null)
  const documentEntry = useRef(null)

  useLayoutEffect(() => {
    const original = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => { window.history.scrollRestoration = original }
  }, [])

  useLayoutEffect(() => {
    const { pathname, search, hash, key } = location
    const main = document.getElementById('main-content')
    if (!main) return
    if (!documentEntry.current) documentEntry.current = { key, active: true }
    if (key !== documentEntry.current.key) documentEntry.current.active = false
    const initial = documentEntry.current.active
    const pathnameChanged = previous.current?.pathname !== pathname
    previous.current = { pathname }
    const entryKey = `studyshelf-scroll:${key}:${pathname}${search}${hash}`
    const readingKey = pathname.startsWith('/notes/') ? `studyshelf-reading:${pathname.slice('/notes/'.length)}` : pathname.startsWith('/developers/sql/') ? `studyshelf-reading:${pathname}` : null
    const plan = chooseScrollTarget({
      initial,
      reload: performance.getEntriesByType('navigation')[0]?.type === 'reload',
      historyTraversal: performance.getEntriesByType('navigation')[0]?.type === 'back_forward',
      navigationType, pathnameChanged, hash,
      entryPosition: readStored(entryKey),
      readingPosition: readingKey ? readStored(readingKey) : null,
    })
    let recovering = plan.mode !== 'preserve'
    let lastPosition = plan.position ?? (plan.mode === 'preserve' ? capturePosition(main, hash) : { y: 0, hash })
    let frame, timer, saveTimer, focused = false
    function save() {
      if (!recovering) lastPosition = capturePosition(main, hash)
      writeStored(entryKey, lastPosition)
      if (readingKey) writeStored(readingKey, lastPosition)
    }
    function stopRecovery() {
      recovering = false
      mutations.disconnect()
      resize.disconnect()
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
    function focus(target) {
      if (focused || navigationType === 'POP') return
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
      focused = true
    }
    function restore(allowFallback = false) {
      if (!recovering || !main.querySelector('h1')) return
      if (plan.mode === 'top') {
        window.scrollTo({ top: 0, behavior: 'instant' })
        focus(main.querySelector('h1'))
        stopRecovery()
      } else if (plan.mode === 'anchor') {
        let id
        try { id = decodeURIComponent(hash.slice(1)) } catch { id = hash.slice(1) }
        const target = document.getElementById(id)
        if (!target) return
        target.scrollIntoView({ behavior: 'instant', block: 'start' })
        focus(target)
      } else {
        const saved = plan.position
        const heading = saved.heading && document.getElementById(saved.heading)
        // Wait for a lazy chapter before falling back to an absolute offset.
        if (saved.heading && !heading && !allowFallback) return
        const y = heading && main.contains(heading) && Number.isFinite(saved.offset)
          ? window.scrollY + heading.getBoundingClientRect().top - saved.offset : saved.y
        window.scrollTo({ top: Math.max(0, y), behavior: 'instant' })
      }
    }
    function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => restore()) }
    const mutations = new MutationObserver(schedule)
    const resize = new ResizeObserver(schedule)
    if (recovering) {
      // Reset immediately, then repeat once the new lazy page has its heading.
      if (plan.mode === 'top') window.scrollTo({ top: 0, behavior: 'instant' })
      mutations.observe(main, { childList: true, subtree: true, attributes: true, attributeFilter: ['id'] })
      resize.observe(main)
      schedule()
      timer = setTimeout(() => { restore(true); stopRecovery(); save() }, 4000)
    }
    function onScroll() {
      if (recovering) return
      // Capture now; cleanup must never read the next page's already-committed DOM.
      lastPosition = capturePosition(main, hash)
      clearTimeout(saveTimer)
      saveTimer = setTimeout(() => {
        writeStored(entryKey, lastPosition)
        if (readingKey) writeStored(readingKey, lastPosition)
      }, 150)
    }
    function interrupt(event) {
      if (event.type === 'keydown' && !['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) return
      stopRecovery()
      lastPosition = capturePosition(main, hash)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', save)
    for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) window.addEventListener(event, interrupt, { passive: true })
    return () => {
      writeStored(entryKey, lastPosition)
      if (readingKey) writeStored(readingKey, lastPosition)
      stopRecovery()
      clearTimeout(saveTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', save)
      for (const event of ['wheel', 'touchstart', 'pointerdown', 'keydown']) window.removeEventListener(event, interrupt)
    }
  }, [location, navigationType])
  return null
}
