import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
export default function RouteFocus() {
  const { pathname, hash } = useLocation()
  const previous = useRef(pathname)
  useEffect(() => {
    const changed = previous.current !== pathname
    previous.current = pathname
    if (!changed && !hash) return
    let done = false
    function focusTarget() {
      let id
      try { id = decodeURIComponent(hash.slice(1)) } catch { id = hash.slice(1) }
      const target = hash ? document.getElementById(id) : document.querySelector('main h1')
      if (!target) return
      if (hash) target.scrollIntoView()
      else { target.focus({ preventScroll: true }); window.scrollTo(0, 0) }
      done = true
      observer.disconnect()
    }
    const observer = new MutationObserver(() => { if (!done) focusTarget() })
    observer.observe(document.getElementById('main-content'), { childList: true, subtree: true })
    const frame = requestAnimationFrame(focusTarget)
    return () => { cancelAnimationFrame(frame); observer.disconnect() }
  }, [pathname, hash])
  return null
}
