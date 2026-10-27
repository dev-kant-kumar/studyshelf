import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import DocumentHead from '../../shared/components/DocumentHead'
import ErrorPage from '../../ErrorPage'
import { roleRoadmaps, sanitiseRoleProgress } from './roleRoadmapData'
import { button, secondary, panel, eyebrow, muted, focus, link } from '@/ui/classes'

function RoadmapContent({ roadmap }) {
  const progressKey = `studyshelf-${roadmap.slug}-progress-v1`
  const [completed, setCompleted] = useState(() => {
    try { return sanitiseRoleProgress(JSON.parse(localStorage.getItem(progressKey)), roadmap) }
    catch { return [] }
  })
  const [query, setQuery] = useState('')
  const [unfinishedOnly, setUnfinishedOnly] = useState(false)
  const [notice, setNotice] = useState('')
  const checked = new Set(completed)
  const allTopics = roadmap.stages.flatMap(stage => stage.topics)
  const search = query.trim().toLowerCase()
  const stages = roadmap.stages.map(stage => ({ ...stage, topics: stage.topics.filter(topic => (!unfinishedOnly || !checked.has(topic.id)) && (!search || `${stage.title} ${topic.title}`.toLowerCase().includes(search))) })).filter(stage => stage.topics.length)
  function toggle(id) {
    const next = checked.has(id) ? completed.filter(value => value !== id) : [...completed, id]
    setCompleted(next)
    try { localStorage.setItem(progressKey, JSON.stringify(next)); setNotice('Progress saved on this browser.') }
    catch { setNotice('Browser storage is unavailable. Progress will last only while this page stays open.') }
  }
  return <CatalogueLayout>
    <DocumentHead title={`${roadmap.title} Roadmap - Foundations to Deployment`} description={roadmap.description} path={`/developers/${roadmap.slug}`} />
    <Link className={`${link} inline-flex items-center gap-2 text-sm`} to="/developers"><ArrowLeft size={16} aria-hidden="true" />Developer Shelf</Link>
    <header className="mt-7 border-b border-line pb-8 dark:border-night-line"><p className={eyebrow}>{roadmap.stack}</p><h1 tabIndex={-1} className="mt-4 max-w-3xl font-display text-3xl font-medium leading-tight sm:text-5xl">{roadmap.title} roadmap.</h1><p className={`mt-5 max-w-3xl text-lg leading-relaxed ${muted}`}>{roadmap.description}</p><a className={`${button} mt-6 inline-flex`} href="#curriculum">Start the learning path <ArrowRight size={17} aria-hidden="true" /></a></header>
    <section aria-label="Before you start" className="grid gap-6 py-8 md:grid-cols-2"><div><h2 className="font-display text-2xl">Start here</h2><p className={`mt-3 leading-relaxed ${muted}`}>{roadmap.prerequisites}</p><p className={`mt-3 leading-relaxed ${muted}`}>Follow the stages in order. Check a topic when you can explain it and use it. Use the official resources below for lessons; this roadmap is a curriculum and practice checklist.</p></div><aside className={`${panel} p-5`}><h2 className="font-semibold">One project to grow with you</h2><p className={`mt-3 leading-relaxed ${muted}`}>{roadmap.project}</p><p className={`mt-3 text-sm leading-relaxed ${muted}`}>There is no fixed completion deadline. Passing a checklist does not guarantee employment or production readiness; demonstrate each milestone and explain your decisions.</p></aside></section>
    <div className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)]"><aside className="lg:sticky lg:top-24"><nav aria-label="Roadmap stages" className={`${panel} p-4`}><p className={eyebrow}>Follow the sequence</p><ol className="mt-3 space-y-1">{roadmap.stages.map((stage, index) => <li key={stage.id}><a className={`flex gap-3 rounded-lg px-2 py-2 text-sm hover:bg-soft dark:hover:bg-night-soft ${focus}`} href={`#${stage.id}`} onClick={() => { setQuery(''); setUnfinishedOnly(false) }}><span className="font-mono text-brand dark:text-night-brand">{String(index + 1).padStart(2, '0')}</span>{stage.title}</a></li>)}</ol></nav></aside>
    <div className="min-w-0"><section id="curriculum" aria-label="Curriculum and progress" className={`${panel} scroll-mt-24 p-5`}><div className="flex flex-wrap items-baseline justify-between gap-3"><h2 className="text-lg font-semibold">Your learning progress</h2><span className={`text-sm ${muted}`}>{completed.length} / {allTopics.length} topics</span></div><progress className="mt-3 h-2 w-full accent-brand" value={completed.length} max={allTopics.length} aria-label="Topics completed" /><p className={`mt-2 text-sm ${muted}`}>Progress is saved separately for this roadmap on this browser; no account sync.</p><label htmlFor="role-search" className="mt-4 block text-sm font-semibold">Find a topic</label><div className="relative mt-2"><Search size={18} aria-hidden="true" className="absolute top-3.5 left-3" /><input id="role-search" type="search" value={query} onChange={event => setQuery(event.target.value)} className={`min-h-11 w-full rounded-lg border border-line bg-canvas py-2 pr-3 pl-10 dark:border-night-line dark:bg-night-canvas ${focus}`} /></div><label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={unfinishedOnly} onChange={event => setUnfinishedOnly(event.target.checked)} className={`size-4 accent-brand ${focus}`} />Show unfinished topics only</label><p role="status" className={`mt-2 text-sm ${muted}`}>{notice}</p></section>
    <div className="mt-6 space-y-6">{stages.map(stage => <section id={stage.id} key={stage.id} className={`${panel} scroll-mt-24 p-4 sm:p-6`}><p className={eyebrow}>Stage {roadmap.stages.findIndex(item => item.id === stage.id) + 1}</p><h2 className="mt-2 font-display text-xl sm:text-2xl">{stage.title}</h2><fieldset className="mt-5 space-y-2"><legend className="sr-only">{stage.title} topics</legend>{stage.topics.map(topic => <label key={topic.id} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg p-2 hover:bg-soft dark:hover:bg-night-soft"><input type="checkbox" checked={checked.has(topic.id)} onChange={() => toggle(topic.id)} className={`mt-1 size-4 shrink-0 accent-brand ${focus}`} /><span className="text-sm leading-relaxed">{topic.title}</span></label>)}</fieldset><div className="mt-5 grid grid-cols-1 gap-4 border-t border-line pt-5 dark:border-night-line sm:grid-cols-2 sm:gap-5"><div><h3 className="font-semibold">Build this</h3><p className={`mt-2 text-sm leading-relaxed ${muted}`}>{stage.build}</p></div><div><h3 className="font-semibold">Ready to move on?</h3><p className={`mt-2 text-sm leading-relaxed ${muted}`}>{stage.gate}</p></div></div></section>)}</div>
    {!stages.length && <p role="status" className={`py-8 ${muted}`}>No topics match these filters. <button type="button" className={secondary} onClick={() => { setQuery(''); setUnfinishedOnly(false) }}>Show all topics</button></p>}
    <section id="sources" className="mt-10 border-t border-line pt-8 dark:border-night-line"><h2 className="font-display text-2xl">Official learning resources</h2><p className={`mt-3 text-sm ${muted}`}>Choose supported releases and use documentation matching the versions in your project. Explore other frameworks after completing the core path.</p><ul className="mt-4 space-y-3">{roadmap.sources.map(source => <li key={source.href}><a className={link} href={source.href}>{source.title}</a></li>)}</ul></section></div></div>
  </CatalogueLayout>
}
export default function RoleRoadmap() {
  const { roadmap: slug } = useParams()
  const roadmap = roleRoadmaps.find(item => item.slug === slug)
  return roadmap ? <RoadmapContent key={roadmap.slug} roadmap={roadmap} /> : <ErrorPage />
}
