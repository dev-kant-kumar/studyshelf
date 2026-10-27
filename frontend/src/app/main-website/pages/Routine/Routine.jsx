import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CalendarDays, Clock, ArrowUpRight } from 'lucide-react'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import DocumentHead from '../../shared/components/DocumentHead'
import ProfessorPhoto from '../Professors/ProfessorPhoto'
import { getProfessor, professorHref } from '../Professors/facultyData'
import { routineCourses, days, getRoutine, sessionLabel, teachers, getIndiaClock, sessionStatus, minutesOf, formatDuration, dayDuration } from './routineData'
import { panel, title, muted, focus, eyebrow, secondary, link } from '@/ui/classes'

function Teacher({ code }) {
  const person = getProfessor(teachers[code]?.professorId)
  return person ? <Link className={`${link} inline-flex min-h-10 items-center gap-2 text-sm`} to={professorHref(person.id)}><ProfessorPhoto key={person.id} person={person} small decorative /><span>{person.name}</span></Link> : <span className={`text-sm ${muted}`}>Staff not listed</span>
}
function Choice({ selected, children, onClick }) {
  return <button type="button" aria-pressed={selected} onClick={onClick} className={`min-h-11 shrink-0 rounded-lg border px-4 py-2 text-sm font-semibold ${focus} ${selected ? 'border-brand bg-selected text-brand dark:border-night-brand dark:bg-night-selected dark:text-night-brand' : 'border-line bg-surface hover:bg-soft dark:border-night-line dark:bg-night-surface dark:hover:bg-night-soft'}`}>{children}</button>
}
const slots = [['10:30', '11:30'], ['11:30', '12:30'], ['12:30', '13:30'], ['13:30', '14:00'], ['14:00', '15:00'], ['15:00', '16:00']]

export default function Routine() {
  const [params, setParams] = useSearchParams()
  const [clock, setClock] = useState(null)
  useEffect(() => {
    const update = () => setClock(getIndiaClock())
    update()
    const timer = setInterval(update, 30000)
    window.addEventListener('focus', update)
    return () => { clearInterval(timer); window.removeEventListener('focus', update) }
  }, [])
  const course = routineCourses.find(item => item.id === params.get('course')) ?? routineCourses[0]
  const semester = course.semesters.includes(Number(params.get('semester'))) ? Number(params.get('semester')) : 1
  const routine = getRoutine(course.id, semester)
  const weekly = params.get('view') === 'week'
  const day = days.includes(params.get('day')) ? params.get('day') : clock?.day
  const today = day === clock?.day
  const sessions = routine?.days[day] ?? []
  const current = clock && routine?.days[clock.day]?.find(session => sessionStatus(session, clock.minutes) === 'now')
  const next = clock && routine?.days[clock.day]?.find(session => sessionStatus(session, clock.minutes) === 'upcoming' && session.kind !== 'break')
  function change(values) {
    const nextParams = new URLSearchParams(params)
    for (const [key, value] of Object.entries(values)) { if (value == null) nextParams.delete(key); else nextParams.set(key, String(value)) }
    setParams(nextParams, { preventScrollReset: true })
  }
  return <CatalogueLayout>
    <DocumentHead title="BCA & MCA Class Routine" description="Choose your course and semester to see today's class routine, weekly timetable, and linked faculty and departmental staff." path="/routine" />
    <Breadcrumbs items={[{ label: 'Class routine' }]} />
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><p className={eyebrow}>VBU / Your college day</p><h1 className={`${title} mt-3`} tabIndex={-1}>Class routine</h1><p className={`mt-3 leading-7 ${muted}`}>Your classes, times, and people in one place.</p></div><Link className={secondary} to="/professors">Faculty and staff <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
    <div className={`${panel} mb-8 space-y-5 p-4 sm:p-6`}>
      <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Course"><span className="w-20 text-sm font-semibold">Course</span>{routineCourses.map(item => <Choice key={item.id} selected={course.id === item.id} onClick={() => change({ course: item.id, semester: 1 })}>{item.label}</Choice>)}</div>
      <div className="flex flex-wrap items-start gap-3"><span className="w-20 pt-3 text-sm font-semibold">Semester</span><div className="flex min-w-0 flex-1 flex-wrap gap-2" role="group" aria-label="Semester">{course.semesters.map(number => <Choice key={number} selected={semester === number} onClick={() => change({ semester: number })}>Sem {number}</Choice>)}</div></div>
    </div>
    {!routine ? <section className={`${panel} px-6 py-12 text-center`}><CalendarDays size={32} className="mx-auto text-brand dark:text-night-brand" aria-hidden="true" /><h2 className="mt-4 font-display text-2xl">{course.label} Semester {semester} routine not added yet</h2><p className={`mx-auto mt-3 max-w-lg leading-7 ${muted}`}>The schedule will appear here once it is provided. No class times have been assumed for this semester.</p><button type="button" className={`${secondary} mt-6`} onClick={() => change({ course: 'mca', semester: 1 })}>View MCA Semester 1</button></section> : <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-display text-2xl">{course.label} / Semester {semester}</h2><p className={`mt-1 text-sm ${muted}`}>{clock ? `${clock.day}, ${clock.date}` : 'Loading today’s date...'} · India time (IST)</p></div><div className="flex gap-2" role="group" aria-label="Routine view"><Choice selected={!weekly} onClick={() => change({ view: null })}>Day view</Choice><Choice selected={weekly} onClick={() => change({ view: 'week' })}>Full week</Choice></div></div>
      {clock && <div className="mb-6 border-l-4 border-brand bg-selected px-5 py-4 dark:border-night-brand dark:bg-night-selected" role="status"><p className="text-sm font-semibold">{current ? `${sessionLabel(routine, current)} now · until ${current.end}` : next ? `Next today: ${sessionLabel(routine, next)} at ${next.start}` : !routine.days[clock.day]?.length ? 'No classes listed for today.' : 'Today’s scheduled classes have finished.'}</p>{current?.teacher && <Teacher code={current.teacher} />}</div>}
      {weekly ? <div className={`${panel} overflow-x-auto`} tabIndex={0} role="region" aria-label="Weekly timetable, scroll horizontally for all periods"><table className="w-full min-w-[1050px] border-collapse text-left text-sm"><caption className={`px-5 py-4 text-left ${muted}`}>MCA Semester 1 weekly timetable. Lab cells span two periods.</caption><thead className="bg-soft dark:bg-night-soft"><tr><th scope="col" className="p-4">Day</th>{slots.map(([start, end]) => <th key={start} scope="col" className="p-4 font-mono text-xs">{start} - {end}</th>)}</tr></thead><tbody>{days.slice(0, 6).map(weekday => <tr key={weekday} className={`border-t border-line dark:border-night-line ${weekday === clock?.day ? 'bg-selected/40 dark:bg-night-selected/40' : ''}`}><th scope="row" className="p-4">{weekday}<span className={`mt-2 block text-xs font-normal ${muted}`}>{formatDuration(dayDuration(routine.days[weekday]))}</span></th>{routine.days[weekday].map(session => <td key={session.start} colSpan={slots.filter(([start]) => minutesOf(start) >= minutesOf(session.start) && minutesOf(start) < minutesOf(session.end)).length} className={`border-l border-line p-4 align-top dark:border-night-line ${session.kind === 'break' ? 'bg-soft dark:bg-night-soft' : ''}`}><p className="font-semibold">{sessionLabel(routine, session)}</p>{session.kind !== 'class' && session.kind !== 'break' && <p className={`mt-1 text-xs capitalize ${muted}`}>{session.kind}</p>}{session.teacher && <div className="mt-2"><Teacher code={session.teacher} /></div>}</td>)}</tr>)}</tbody></table><p className={`border-t border-line p-4 text-sm dark:border-night-line ${muted}`}>Sunday: no classes listed.</p></div> : <>
        <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Day of week">{days.map(weekday => <Choice key={weekday} selected={day === weekday} onClick={() => change({ day: weekday === clock?.day ? null : weekday })}>{weekday.slice(0, 3)}</Choice>)}</div>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-lg font-semibold">{day || 'Today'}{today ? ' · Today' : ''}</h3>{day && <p className={`text-sm ${muted}`}>Total scheduled time: {formatDuration(dayDuration(sessions))} · excluding recess</p>}</div>
        {!clock && !day ? <p className={muted}>Loading your day...</p> : sessions.length ? <ol className="space-y-3">{sessions.map(session => { const live = today && clock && sessionStatus(session, clock.minutes) === 'now'; return <li key={session.start} className={`${panel} relative flex flex-col gap-3 p-4 sm:flex-row sm:gap-6 sm:p-5 ${live ? '!border-brand dark:!border-night-brand' : ''} ${session.kind === 'break' ? '!bg-soft dark:!bg-night-soft' : ''}`}><div className="flex shrink-0 items-center gap-2 font-mono text-sm sm:w-36"><Clock size={15} aria-hidden="true" /><time>{session.start}</time><span>-</span><time>{session.end}</time></div><span className={`text-xs sm:w-16 sm:shrink-0 sm:self-center ${muted}`}>{formatDuration(minutesOf(session.end) - minutesOf(session.start))}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-3"><h4 className="font-semibold">{sessionLabel(routine, session)}</h4>{live && <span className="rounded bg-selected px-2 py-1 text-xs font-semibold text-brand dark:bg-night-selected dark:text-night-brand">Now</span>}{session.kind === 'lab' && <span className="rounded border border-line px-2 py-1 text-xs dark:border-night-line">Lab · 2 periods</span>}</div>{session.teacher && <div className="mt-1"><Teacher code={session.teacher} /></div>}</div></li> })}</ol> : <div className={`${panel} p-8 text-center`}><h4 className="text-lg font-semibold">No classes listed for {day}</h4><p className={`mt-2 ${muted}`}>Choose another day to see its routine.</p></div>}
      </>}

      <p className={`mt-6 text-sm leading-6 ${muted}`}>Transcribed from the supplied MCA-I routine. <a className={link} href={routine.source.href} download="mca-sem1-routine.png">Download original routine</a>. This is the regular weekly schedule; holiday notices and last-minute changes are not included.</p>
    </>}
  </CatalogueLayout>
}
