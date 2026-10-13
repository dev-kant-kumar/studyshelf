import { useEffect, useRef, useState } from 'react'
import { Maximize2, X } from 'lucide-react'
import { focus, iconButton, secondary } from '@/ui/classes'
export default function Figure({ src, alt, caption, width, height }) {
  const [open, setOpen] = useState(false)
  const dialog = useRef(null)
  useEffect(() => {
    if (!open) return
    const element = dialog.current, trigger = document.activeElement
    const locked = document.body.classList.contains('overflow-hidden')
    element.showModal()
    document.body.classList.add('overflow-hidden')
    return () => { element.close(); if (!locked) document.body.classList.remove('overflow-hidden'); if (trigger?.isConnected) trigger.focus() }
  }, [open])
  return <figure className="my-8">
    <img src={src} alt={alt} width={width} height={height} loading="lazy" className="h-auto max-w-full rounded-lg" />
    {caption && <figcaption className="mt-3 font-sans text-sm text-subtle dark:text-night-subtle">{caption}</figcaption>}
    <button type="button" className={`${secondary} mt-3 font-sans print:hidden`} onClick={() => setOpen(true)} aria-haspopup="dialog"><Maximize2 size={16} aria-hidden="true" />Enlarge diagram</button>
    <dialog ref={dialog} aria-label={caption || 'Enlarged diagram'} className={`fixed inset-0 m-auto max-h-[90dvh] w-[min(94vw,1200px)] max-w-none overflow-auto rounded-xl border border-line bg-surface p-4 text-ink shadow-xl backdrop:bg-black/60 dark:border-night-line dark:bg-night-surface dark:text-night-ink sm:p-6 ${focus}`} onCancel={event => { event.preventDefault(); setOpen(false) }} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setOpen(false) } }}>
      <div className="mb-4 flex items-center justify-between gap-4"><p className="!my-0 font-sans text-base font-semibold">{caption || 'Enlarged diagram'}</p><button type="button" className={iconButton} aria-label="Close enlarged diagram" onClick={() => setOpen(false)}><X size={20} /></button></div>
      {open && <img src={src} alt={alt} className="h-auto w-full rounded-lg" />}
    </dialog>
  </figure>
}
