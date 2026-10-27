import { useState, useSyncExternalStore } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Search } from 'lucide-react'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import DocumentHead from '../../shared/components/DocumentHead'
import Illustration from '../../shared/components/Illustration'
import { button, secondary, panel, eyebrow, muted, focus, link } from '@/ui/classes'
import { roadmap, sources, productionGates, allTopics, progressKey, sanitiseProgress } from './backendRoadmapData.js'

const changeEvent = 'studyshelf-roadmap-progress'
let fallbackProgress = null
function readSnapshot() {
  try { return fallbackProgress ?? window.localStorage.getItem(progressKey) }
  catch { return fallbackProgress }
}
function subscribe(listener) {
  const onStorage = event => { if (event.key === progressKey || event.key === null) { fallbackProgress = null; listener() } }
  window.addEventListener('storage', onStorage)
  window.addEventListener(changeEvent, listener)
  return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(changeEvent, listener) }
}
const serverSnapshot = () => null
function saveProgress(value) {
  try { window.localStorage.setItem(progressKey, value); fallbackProgress = null; return true }
  catch { fallbackProgress = value; return false }
}

export default function NodeRoadmap() {
  const stored = useSyncExternalStore(subscribe, readSnapshot, serverSnapshot)
  let completed
  try { completed = sanitiseProgress(JSON.parse(stored)) } catch { completed = [] }
  const checked = new Set(completed)
  const [query, setQuery] = useState('')
  const [unfinishedOnly, setUnfinishedOnly] = useState(false)
  const [expanded, setExpanded] = useState(new Set([roadmap[0].id]))
  const [notice, setNotice] = useState('')
  const search = query.trim().toLowerCase()
  const visibleStages = roadmap.map(stage => ({ ...stage, groups: stage.groups.map(group => ({ ...group, topics: group.topics.filter(topic => (!unfinishedOnly || !checked.has(topic.id)) && (!search || `${stage.title} ${stage.phase} ${group.title} ${topic.title}`.toLowerCase().includes(search))) })).filter(group => group.topics.length) })).filter(stage => stage.groups.length)
  const visibleCount = visibleStages.reduce((total, stage) => total + stage.groups.reduce((sum, group) => sum + group.topics.length, 0), 0)
  const coreTopics = roadmap.filter(stage => !stage.optional).flatMap(stage => stage.groups.flatMap(group => group.topics))
  const coreDone = coreTopics.filter(topic => checked.has(topic.id)).length
  function toggleTopic(id) {
    const next = new Set(completed)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    const value = JSON.stringify([...next])
    const saved = saveProgress(value)
    setNotice(saved ? 'Progress saved on this browser.' : 'Browser storage is unavailable. Progress will last only for this session.')
    window.dispatchEvent(new Event(changeEvent))
  }
  function toggleStage(id) {
    setExpanded(previous => { const next = new Set(previous); if (next.has(id)) next.delete(id); else next.add(id); return next })
  }
  return <CatalogueLayout>
    <DocumentHead title="Node.js Backend Developer Roadmap - Zero to Production" description="A complete JavaScript and TypeScript backend learning path: detailed topic checklists, Node.js, APIs, PostgreSQL, security, testing, deployment, and production readiness milestones." path="/developers/nodejs-roadmap" />
    <Link className={`${link} inline-flex items-center gap-2 text-sm`} to="/developers"><ArrowLeft size={16} aria-hidden="true" />Developer Shelf</Link>
    <header className="mt-7 grid items-center gap-6 border-b border-line pb-8 lg:grid-cols-[minmax(0,1fr)_340px] dark:border-night-line"><div><p className={eyebrow}>JavaScript + TypeScript / Backend development</p><h1 tabIndex={-1} className="mt-4 max-w-4xl font-display text-3xl leading-tight font-medium tracking-tight sm:text-5xl">Node.js backend developer.<br />From zero to production.</h1><p className={`mt-5 max-w-3xl text-lg leading-relaxed ${muted}`}>Learn to build an API, protect its data, deploy it safely, and keep it working when things fail. Each stage includes the topics to study, something to build, and evidence that you are ready to move on.</p><div className="mt-6 flex flex-wrap gap-3"><a href="#curriculum" className={button}>Start the roadmap <ArrowRight size={17} aria-hidden="true" /></a><a href="#production-ready" className={secondary}>What does production ready mean?</a></div></div><Illustration name="developer-backend" priority sizes="(min-width: 1024px) 340px, 280px" className="mx-auto w-full max-w-[280px] lg:max-w-[340px]" /></header>
    <section aria-labelledby="use-roadmap" className="grid gap-6 py-8 md:grid-cols-2"><div><h2 id="use-roadmap" className="font-display text-2xl">Follow the order. Prove the skills.</h2><p className={`mt-3 leading-relaxed ${muted}`}>Start with JavaScript, then add strict TypeScript. Follow the core stages in order, revisiting earlier topics as your project grows. Check a topic when you can explain it and use it without following a full tutorial.</p><p className={`mt-3 leading-relaxed ${muted}`}>This is a curriculum and practice checklist. The linked documentation supplies the lessons. Completing checkboxes alone does not establish production readiness; the milestones and final review provide the evidence.</p></div><aside className={`${panel} p-5`}><h2 className="font-semibold">One stack to carry through the path</h2><p className={`mt-3 leading-relaxed ${muted}`}>Supported Node.js LTS, JavaScript, strict TypeScript, Express, PostgreSQL, Git, and Docker. Add Redis and a job queue when you reach those stages. Choose one ORM after learning SQL.</p><p className={`mt-3 text-sm leading-relaxed ${muted}`}>The final stage contains optional branches. Learn the trade-offs before adopting a second framework, microservices, or orchestration. There is no fixed completion deadline.</p><a className={`${link} mt-3 inline-block text-sm`} href="#sources">Official documentation and references</a></aside></section>
    <div className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24"><nav aria-label="Roadmap stages" className={`${panel} p-4`}><p className={`${eyebrow} px-2`}>The learning path</p><ol className="mt-3 max-h-[50vh] space-y-1 overflow-y-auto lg:max-h-[65vh]">{roadmap.map((stage, index) => <li key={stage.id}><a className={`flex gap-2 rounded-lg px-2 py-2 text-sm hover:bg-soft dark:hover:bg-night-soft ${focus}`} href={`#${stage.id}`} onClick={() => { setQuery(''); setUnfinishedOnly(false); setExpanded(previous => new Set([...previous, stage.id])) }}><span className="w-5 shrink-0 font-mono text-brand dark:text-night-brand">{String(index + 1).padStart(2, '0')}</span><span>{stage.title}{stage.optional && <span className={`block text-xs ${muted}`}>Optional deeper study</span>}</span></a></li>)}</ol></nav></aside>
      <div className="min-w-0"><section id="curriculum" aria-label="Curriculum and progress" className="scroll-mt-24"><div className={`${panel} p-5`}><div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-lg font-semibold">Your learning progress</h2><span className={`text-sm ${muted}`}>{coreDone} / {coreTopics.length} core topics</span></div><progress className="mt-3 h-2 w-full accent-brand dark:accent-night-brand" value={coreDone} max={coreTopics.length} aria-label="Core topics completed" /><p className={`mt-2 text-sm ${muted}`}>{completed.length} / {allTopics.length} topics including optional study. Saved on this browser when storage is available; no account sync.</p><p role="status" className={`mt-1 min-h-5 text-sm ${muted}`}>{notice}</p><label htmlFor="roadmap-search" className="mt-3 block text-sm font-semibold">Find a topic</label><div className="relative mt-2"><Search aria-hidden="true" size={18} className="absolute top-3.5 left-3 text-subtle dark:text-night-subtle" /><input id="roadmap-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try transactions, JWT, or deployment" className={`min-h-11 w-full rounded-lg border border-line bg-canvas py-2 pr-3 pl-10 dark:border-night-line dark:bg-night-canvas ${focus}`} /></div><div className="mt-4 flex flex-wrap items-center gap-3"><label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={unfinishedOnly} onChange={event => setUnfinishedOnly(event.target.checked)} className={`size-4 accent-brand ${focus}`} />Only unfinished topics</label><button type="button" className={`${secondary} text-sm`} onClick={() => setExpanded(new Set(roadmap.map(stage => stage.id)))}>Expand all</button><button type="button" className={`${secondary} text-sm`} onClick={() => { setQuery(''); setExpanded(new Set()) }}>Collapse all</button></div></div><p aria-live="polite" className={`mt-4 text-sm ${muted}`}>Showing {visibleCount} topics across {visibleStages.length} stages.</p></section>
        <div className="mt-5 space-y-5">{visibleStages.map(stage => {
          const original = roadmap.find(item => item.id === stage.id)
          const topics = original.groups.flatMap(group => group.topics)
          const done = topics.filter(topic => checked.has(topic.id)).length
          const index = roadmap.findIndex(item => item.id === stage.id)
          const isOpen = Boolean(search) || expanded.has(stage.id)
          return <section id={stage.id} key={stage.id} className={`${panel} scroll-mt-24 overflow-hidden`} aria-labelledby={`${stage.id}-heading`}><div className="p-4 sm:p-6"><p className="text-xs font-semibold uppercase tracking-wider text-brand dark:text-night-brand">Stage {String(index + 1).padStart(2, '0')} / {stage.phase}{stage.optional ? ' / Optional' : ''}</p><h2 id={`${stage.id}-heading`} className="mt-2 font-display text-xl sm:text-2xl">{stage.title}</h2><p className={`mt-3 leading-relaxed ${muted}`}>{stage.goal}</p><button className={`mt-4 flex min-h-11 w-full items-center justify-between gap-3 rounded-lg bg-soft px-4 py-2 text-left text-sm font-semibold dark:bg-night-soft ${focus}`} type="button" aria-expanded={isOpen} aria-controls={`${stage.id}-topics`} onClick={() => { if (search) setQuery(''); toggleStage(stage.id) }}><span>{isOpen ? 'Hide topic checklist' : 'Show topic checklist'}</span><span className="shrink-0 font-normal">{done} / {topics.length}</span></button><div id={`${stage.id}-topics`} hidden={!isOpen} className="mt-6 space-y-6">{stage.groups.map(group => <fieldset key={group.id}><legend className="mb-2 font-semibold">{group.title}</legend><div className="space-y-1">{group.topics.map(topic => <label key={topic.id} className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2.5 hover:bg-soft dark:hover:bg-night-soft"><input type="checkbox" checked={checked.has(topic.id)} onChange={() => toggleTopic(topic.id)} className={`mt-1 size-4 shrink-0 accent-brand dark:accent-night-brand ${focus}`} /><span className={`min-w-0 text-sm leading-relaxed ${checked.has(topic.id) ? muted : ''}`}>{topic.title}</span></label>)}</div></fieldset>)}</div></div><div className="grid grid-cols-1 gap-4 border-t border-line bg-soft p-4 sm:grid-cols-2 sm:gap-5 sm:p-6 dark:border-night-line dark:bg-night-soft"><div><h3 className="text-sm font-semibold">Build to learn</h3><p className={`mt-2 text-sm leading-relaxed ${muted}`}>{stage.build}</p></div><div><h3 className="text-sm font-semibold">Ready to move on when...</h3><p className={`mt-2 text-sm leading-relaxed ${muted}`}>{stage.gate}</p></div></div></section>
        })}{visibleStages.length === 0 && <div className={`${panel} p-6`}><h2 className="font-semibold">No matching topics</h2><p className={`mt-2 ${muted}`}>Try a broader term or turn off the unfinished filter.</p><button className={`${secondary} mt-4`} onClick={() => { setQuery(''); setUnfinishedOnly(false) }} type="button">Show all topics</button></div>}</div>
      </div>
    </div>
    <section id="production-ready" aria-labelledby="production-heading" className="mt-12 scroll-mt-24 border-t border-line pt-10 dark:border-night-line"><div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_260px]"><div><p className={eyebrow}>The final practical review</p><h2 id="production-heading" className="mt-3 font-display text-3xl">Build, deploy, break, recover.</h2><p className={`mt-4 max-w-3xl leading-relaxed ${muted}`}>Evolve one internship tracker through the roadmap: users, private applications, attachments, and queued reminders. Deploy it, operate it, and collect the evidence below. Production readiness means you can explain its limits and recover it safely, as well as write its features.</p></div><Illustration name="developer-production" sizes="260px" className="mx-auto w-full max-w-[240px] md:max-w-[260px]" /></div><ol className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">{productionGates.map((gate, index) => <li key={gate} className={`${panel} flex items-start gap-3 p-4`}><span className="mt-0.5 font-mono text-sm text-brand dark:text-night-brand">{String(index + 1).padStart(2, '0')}</span><span className="text-sm leading-relaxed">{gate}</span></li>)}</ol></section>
    <section id="sources" aria-labelledby="sources-heading" className="mt-12 scroll-mt-24 border-t border-line pt-8 dark:border-night-line"><p className={eyebrow}>Keep the documentation nearby</p><h2 id="sources-heading" className="mt-3 font-display text-2xl">Study from the source.</h2><p className={`mt-3 text-sm ${muted}`}>Curriculum references checked on 18 October 2026. The stage order and projects are Study Shelf's suggested learning path. Match documentation to the versions installed in your project.</p><ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">{sources.map(source => <li key={source.href}><a className={link} href={source.href}>{source.title}</a><p className={`mt-1 text-sm leading-relaxed ${muted}`}>{source.note}</p></li>)}</ul></section>
  </CatalogueLayout>
}
