import { Search, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { focus, eyebrow } from '@/ui/classes'
const topics = ['computer generations', 'network topologies', 'transmission media', 'multiplexing', 'computer systems']
const topicDuration = 3600
export default function SearchField({ id = 'library-search', defaultValue = '', onSearch, prominent = false }) {
  const navigate = useNavigate()
  const [topicIndex, setTopicIndex] = useState(0)
  const [focused, setFocused] = useState(false)
  const [inputState, setInputState] = useState({ initial: defaultValue, value: defaultValue })
  const hasValue = Boolean(inputState.initial === defaultValue ? inputState.value : defaultValue)
  const [motionAllowed, setMotionAllowed] = useState(false)
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setMotionAllowed(!preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  const rotating = prominent && motionAllowed && !focused && !hasValue
  useEffect(() => {
    if (!rotating) return
    const timer = window.setInterval(() => setTopicIndex(index => (index + 1) % topics.length), topicDuration)
    return () => window.clearInterval(timer)
  }, [rotating])
  function submit(event) { event.preventDefault(); const query = new FormData(event.currentTarget).get('q').trim(); if (onSearch) onSearch(query); else navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search') }
  return <form className="w-full" role="search" onSubmit={submit}>
    <label className={`mb-3 block ${prominent ? eyebrow : 'text-sm font-semibold'}`} htmlFor={id}>{prominent ? 'What are you studying today?' : 'Search by topic or subject'}</label>
    <div className="flex min-h-14 items-center gap-3 rounded-xl border border-outline bg-surface px-3 focus-within:ring-2 focus-within:ring-brand dark:border-night-outline dark:bg-night-surface dark:focus-within:ring-night-brand sm:pl-5">
      <Search className="shrink-0 text-subtle dark:text-night-subtle" size={21} aria-hidden="true" />
      <div className="relative min-w-0 flex-1">
        <input className="w-full min-w-0 bg-transparent py-4 text-base placeholder:text-subtle dark:placeholder:text-night-subtle outline-none focus:outline-none focus-visible:outline-none" key={defaultValue} id={id} name="q" type="search" placeholder={rotating ? '' : prominent ? 'Try a topic, like computer generations' : 'Search by topic or subject'} defaultValue={defaultValue} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onChange={event => setInputState({ initial: defaultValue, value: event.target.value })} autoComplete="off" />
        {rotating && <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center gap-1 overflow-hidden text-base text-subtle dark:text-night-subtle">
          <span className="shrink-0">Try<span className="hidden sm:inline"> a topic, like</span></span>
          <span key={topicIndex} className="search-topic-suggestion min-w-0 truncate">{topics[topicIndex]}</span>
        </div>}
      </div>
      <button className={`my-2 flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand text-on-brand hover:bg-brand-hover dark:bg-night-brand dark:text-night-on-brand dark:hover:bg-night-brand-hover ${focus}`} type="submit" aria-label="Search notes"><ArrowRight size={21} /></button>
    </div>
  </form>
}
