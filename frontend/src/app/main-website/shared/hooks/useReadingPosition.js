import { useEffect } from 'react'

// Keep refresh recovery separate from normal navigation and section links.
export default function useReadingPosition(article, slug) {
  useEffect(() => {
    if (!slug || !article.current) return
    const key = `studyshelf-reading:${slug}`
    let saved
    try { saved = JSON.parse(sessionStorage.getItem(key)) } catch { /* Storage can be unavailable. */ }
    const reload = performance.getEntriesByType('navigation')[0]?.type === 'reload'
    let restoring = Boolean(reload && saved && saved.hash === location.hash && Number.isFinite(saved.y))
    let frame, timer, saveTimer
    const root = article.current
    function snapshot() {
      if (restoring) return
      const heading = [...root.querySelectorAll('h2[id], h3[id]')].filter(node => node.getBoundingClientRect().top <= 110).at(-1)
      try {
        sessionStorage.setItem(key, JSON.stringify({ y: window.scrollY, hash: location.hash, heading: heading?.id, offset: heading?.getBoundingClientRect().top }))
      } catch { /* Reading still works when storage is blocked. */ }
    }
    function restore() {
      if (!restoring || !root.querySelector('h2, h3')) return
      const heading = saved.heading && document.getElementById(saved.heading)
      const y = heading && Number.isFinite(saved.offset) ? window.scrollY + heading.getBoundingClientRect().top - saved.offset : saved.y
      window.scrollTo({ top: Math.max(0, y), behavior: 'instant' })
    }
    function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(restore) }
    const mutations = new MutationObserver(schedule)
    const resize = new ResizeObserver(schedule)
    function finish() {
      restoring = false
      mutations.disconnect()
      resize.disconnect()
      cancelAnimationFrame(frame)
    }
    function onScroll() {
      if (restoring) return
      clearTimeout(saveTimer)
      saveTimer = setTimeout(snapshot, 150)
    }
    function interrupt(event) {
      if (event.type === 'keydown' && !['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) return
      finish()
    }
    if (restoring) {
      mutations.observe(root, { childList: true, subtree: true })
      resize.observe(root)
      schedule()
      timer = setTimeout(() => { restore(); finish() }, 4000)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pagehide', snapshot)
    for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) window.addEventListener(type, interrupt, { passive: true })
    return () => {
      snapshot()
      finish()
      clearTimeout(timer)
      clearTimeout(saveTimer)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pagehide', snapshot)
      for (const type of ['wheel', 'touchstart', 'pointerdown', 'keydown']) window.removeEventListener(type, interrupt)
    }
  }, [article, slug])
}
