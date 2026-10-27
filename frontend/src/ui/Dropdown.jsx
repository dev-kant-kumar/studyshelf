import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { focus } from './classes'

// A select-only combobox. Focus stays on the trigger while arrows explore options.
export default function Dropdown({ id, label, options, value, onChange, icon: Icon, disabled = false, compact = false, className = '', focusClassName = focus }) {
  const generated = useId()
  const controlId = id || `dropdown-${generated}`
  const listId = `${controlId}-options`
  const selected = Math.max(0, options.findIndex(option => option.value === value))
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(selected)
  const [above, setAbove] = useState(false)
  const root = useRef(null), trigger = useRef(null), list = useRef(null)
  const typed = useRef({ text: '', at: 0 })

  useEffect(() => {
    if (!open) return
    function outside(event) { if (!root.current.contains(event.target)) setOpen(false) }
    function dismiss() { setOpen(false) }
    document.addEventListener('pointerdown', outside)
    window.addEventListener('resize', dismiss)
    return () => { document.removeEventListener('pointerdown', outside); window.removeEventListener('resize', dismiss) }
  }, [open])
  useEffect(() => {
    if (!open) return
    const menu = list.current, option = menu?.children[active]
    if (!option) return
    // Keep keyboard selection visible inside the menu without scrolling the page.
    const top = option.getBoundingClientRect().top - menu.getBoundingClientRect().top + menu.scrollTop
    const bottom = top + option.offsetHeight
    if (top < menu.scrollTop) menu.scrollTop = top
    else if (bottom > menu.scrollTop + menu.clientHeight) menu.scrollTop = bottom - menu.clientHeight
  }, [active, open])

  function show(index = selected) {
    if (disabled || !options.length) return
    const rect = trigger.current.getBoundingClientRect()
    setAbove(window.innerHeight - rect.bottom < Math.min(options.length * 44 + 12, 240) && rect.top > window.innerHeight - rect.bottom)
    setActive(index)
    typed.current = { text: '', at: 0 }
    setOpen(true)
  }
  function choose(index) {
    onChange(options[index].value)
    setOpen(false)
    trigger.current.focus()
  }
  function keyDown(event) {
    if (disabled || !options.length) return
    if (event.key === 'Tab') { setOpen(false); return }
    if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); return }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault()
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : Math.max(0, Math.min(options.length - 1, active + (event.key === 'ArrowDown' ? 1 : -1)))
      if (open) setActive(next)
      else show(event.key === 'Home' || event.key === 'End' ? next : selected)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (open) choose(active)
      else show()
      return
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault()
      const now = Date.now(), text = (now - typed.current.at < 700 ? typed.current.text : '') + event.key.toLowerCase()
      typed.current = { text, at: now }
      const start = open ? active : selected
      const repeated = [...text].every(character => character === text[0])
      const query = repeated ? text[0] : text
      const matches = options.map((option, index) => ({ label: option.label.toLowerCase(), index }))
      const ordered = [...matches.slice(start + 1), ...matches.slice(0, start + 1)]
      const match = ordered.find(option => option.label.startsWith(query))
      if (match) { if (open) setActive(match.index); else show(match.index) }
    }
  }
  return <div ref={root} className={`relative inline-block max-w-full ${className}`} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
    <button ref={trigger} id={controlId} type="button" role="combobox" aria-label={label} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? listId : undefined} aria-activedescendant={open ? `${listId}-${active}` : undefined} disabled={disabled || !options.length} onClick={() => open ? setOpen(false) : show()} onKeyDown={keyDown} className={`flex ${compact ? 'min-h-8 gap-2 px-2 py-1' : 'min-h-11 gap-3 px-3 py-2'} w-full items-center justify-between rounded-lg border border-outline bg-surface text-left font-sans text-sm text-ink transition-colors hover:bg-soft disabled:cursor-not-allowed disabled:opacity-50 dark:border-night-outline dark:bg-night-surface dark:text-night-ink dark:hover:bg-night-soft motion-reduce:transition-none ${focusClassName}`}>
      {Icon && <Icon size={17} className="shrink-0" aria-hidden="true" />}
      <span className="min-w-0 flex-1 truncate">{options[selected]?.label || 'Choose an option'}</span>
      <ChevronDown size={16} className={`shrink-0 transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
    </button>
    {open && <ul ref={list} id={listId} role="listbox" aria-label={label} className={`absolute right-0 z-50 max-h-60 min-w-full max-w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border border-line bg-surface p-1.5 font-sans text-sm text-ink shadow-lg dark:border-night-line dark:bg-night-surface dark:text-night-ink ${above ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
      {options.map((option, index) => <li key={option.value} id={`${listId}-${index}`} role="option" aria-selected={option.value === value} onPointerMove={() => setActive(index)} onMouseDown={event => event.preventDefault()} onClick={() => choose(index)} className={`flex min-h-11 cursor-pointer items-center justify-between gap-4 whitespace-nowrap rounded-lg px-3 py-2 ${active === index ? 'bg-selected text-brand dark:bg-night-selected dark:text-night-brand' : 'text-ink dark:text-night-ink'}`}><span>{option.label}</span><Check size={16} aria-hidden="true" className={`shrink-0 ${option.value === value ? 'visible' : 'invisible'}`} /></li>)}
    </ul>}
  </div>
}
