import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { iconButton, focus } from './classes'
export default function Drawer({ open, onClose, title, children }) {
  const dialog = useRef(null), close = useRef(onClose)
  useEffect(() => { close.current = onClose }, [onClose])
  useEffect(() => {
    if (!open) return
    const element = dialog.current, trigger = document.activeElement
    element.showModal()
    const wasLocked = document.body.classList.contains('overflow-hidden')
    document.body.classList.add('overflow-hidden')
    return () => { element.close(); if (!wasLocked) document.body.classList.remove('overflow-hidden'); if (trigger?.isConnected) trigger.focus() }
  }, [open])
  return <dialog ref={dialog} className={`fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-[min(90vw,380px)] max-w-none border-0 bg-surface p-0 text-ink shadow-xl backdrop:bg-black/50 dark:bg-night-surface dark:text-night-ink ${focus}`} aria-label={title} onCancel={event => { event.preventDefault(); close.current() }} onClick={event => { if (event.target === event.currentTarget) close.current() }}><div className="h-full overflow-y-auto p-6 pb-[max(24px,env(safe-area-inset-bottom))]"><div className="mb-6 flex items-center justify-between gap-4"><h2 className="font-display text-2xl">{title}</h2><button className={iconButton} type="button" aria-label={`Close ${title.toLowerCase()}`} onClick={onClose}><X size={20} /></button></div>{children}</div></dialog>
}
