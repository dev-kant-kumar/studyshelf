import mcaSyllabus from '../../notesData/MCA/syllabus.js'

export const routineCourses = [
  { id: 'mca', label: 'MCA', semesters: mcaSyllabus.semesters.map(semester => semester.number) },
  { id: 'bca', label: 'BCA', semesters: [1, 2, 3, 4, 5, 6] },
]
export const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const teachers = {
  MK: { professorId: 'manish-kumar' },
  SKSRIV: { professorId: 'santosh-kumar-srivastava' },
  MB: { professorId: 'manisha-baxla' },
  RP: { professorId: 'rahul-prasad' },
  SKSINGH: { professorId: 'santosh-kumar-singh' },
  ASINGH: { professorId: 'ashutosh-kumar-singh' },
  AK: { professorId: 'abhishek-kumar' },
  AA: { professorId: 'arshad-alam' },
}
export const subjects = {
  'M-DBMS': 'Database Management Systems',
  'M-DS': 'Data Structures',
  'M-CO': 'Computer Organization',
  'M-MIS': 'Management Information Systems',
  'M-OS': 'Operating Systems',
  'M-FIT': 'Fundamentals of Information Technology',
  LIB: 'Library', TUTORIAL: 'Tutorial', RECESS: 'Recess',
}
const entry = (start, end, subject, teacher, kind = 'class') => ({ start, end, subject, teacher, kind })
const recess = () => entry('13:30', '14:00', 'RECESS', null, 'break')
export const mcaSemesterOne = {
  course: 'mca', semester: 1,
  papers: { 'M-FIT': { class: 'paper1' }, 'M-DS': { class: 'paper2', lab: 'paper8' }, 'M-OS': { class: 'paper3' }, 'M-DBMS': { class: 'paper4', lab: 'paper9' }, 'M-CO': { class: 'paper5' }, 'M-MIS': { class: 'paper6' } },
  source: { label: 'Supplied MCA-I routine', href: '/routines/mca-sem1.png', receivedOn: '2026-10-27' },
  days: {
    Monday: [entry('10:30', '12:30', 'M-DBMS', 'AK', 'lab'), entry('12:30', '13:30', 'M-DS', 'SKSRIV'), recess(), entry('14:00', '15:00', 'LIB', 'AA', 'library'), entry('15:00', '16:00', 'M-MIS', 'RP')],
    Tuesday: [entry('10:30', '11:30', 'M-DBMS', 'MK'), entry('11:30', '12:30', 'M-DS', 'SKSRIV'), entry('12:30', '13:30', 'M-CO', 'MB'), recess(), entry('14:00', '15:00', 'M-MIS', 'RP'), entry('15:00', '16:00', 'M-OS', 'SKSINGH')],
    Wednesday: [entry('10:30', '11:30', 'M-CO', 'MB'), entry('11:30', '12:30', 'M-DBMS', 'MK'), entry('12:30', '13:30', 'M-DS', 'SKSRIV'), recess(), entry('14:00', '15:00', 'M-OS', 'SKSINGH'), entry('15:00', '16:00', 'M-FIT', 'ASINGH')],
    Thursday: [entry('10:30', '11:30', 'M-CO', 'MB'), entry('11:30', '12:30', 'M-MIS', 'RP'), entry('12:30', '13:30', 'M-OS', 'SKSINGH'), recess(), entry('14:00', '15:00', 'M-DBMS', 'MK'), entry('15:00', '16:00', 'M-FIT', 'ASINGH')],
    Friday: [entry('10:30', '11:30', 'M-DBMS', 'MK'), entry('11:30', '13:30', 'M-DS', 'AK', 'lab'), recess(), entry('14:00', '15:00', 'TUTORIAL', 'RP', 'tutorial'), entry('15:00', '16:00', 'M-FIT', 'ASINGH')],
    Saturday: [entry('10:30', '11:30', 'M-CO', 'MB'), entry('11:30', '12:30', 'M-DS', 'SKSRIV'), entry('12:30', '13:30', 'M-FIT', 'ASINGH'), recess(), entry('14:00', '15:00', 'M-OS', 'SKSINGH'), entry('15:00', '16:00', 'M-MIS', 'RP')],
    Sunday: [],
  },
}
export const routines = [mcaSemesterOne]
export const getRoutine = (course, semester) => routines.find(routine => routine.course === course && routine.semester === Number(semester))
export const minutesOf = time => Number(time.slice(0, 2)) * 60 + Number(time.slice(3))
export function getIndiaClock(date = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date).map(part => [part.type, part.value]))
  return { day: parts.weekday, minutes: Number(parts.hour) * 60 + Number(parts.minute), date: `${parts.day} ${parts.month} ${parts.year}` }
}
export function sessionStatus(session, minutes) {
  if (minutes < minutesOf(session.start)) return 'upcoming'
  return minutes < minutesOf(session.end) ? 'now' : 'finished'
}

export function sessionLabel(routine, session) {
  const paperId = routine.papers?.[session.subject]?.[session.kind]
  const semester = routine.course === 'mca' && mcaSyllabus.semesters.find(item => item.number === routine.semester)
  const paper = semester?.papers.find(item => item.id === paperId)
  return paper ? `Paper ${paper.id.replace('paper', '')} · ${paper.title.replace(/\s+/g, ' ').trim()}` : subjects[session.subject] ?? 'Session'
}

export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60), remainder = minutes % 60
  return [hours ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : '', remainder ? `${remainder} min` : ''].filter(Boolean).join(' ') || '0 min'
}
export function dayDuration(sessions) {
  return sessions.reduce((total, session) => total + (session.kind === 'break' ? 0 : minutesOf(session.end) - minutesOf(session.start)), 0)
}
