import test from 'node:test'
import assert from 'node:assert/strict'
import { mcaSemesterOne, getRoutine, teachers, subjects, minutesOf, formatClassTime, formatDuration, dayDuration, sessionLabel, sessionStatus, getIndiaClock } from '../src/app/main-website/pages/Routine/routineData.js'
import { getProfessor } from '../src/app/main-website/pages/Professors/facultyData.js'

test('transcribed routine covers each period without overlaps, gaps, or broken staff references', () => {
  let classes = 0
  for (const [day, entries] of Object.entries(mcaSemesterOne.days)) {
    if (day === 'Sunday') { assert.deepEqual(entries, []); continue }
    assert.equal(entries[0].start, '10:30')
    assert.equal(entries.at(-1).end, '16:00')
    entries.forEach((entry, index) => {
      assert.ok(subjects[entry.subject])
      assert.ok(minutesOf(entry.end) > minutesOf(entry.start))
      if (index) assert.equal(entry.start, entries[index - 1].end)
      if (entry.kind === 'break') {
        assert.equal(entry.start, '13:30')
        assert.equal(entry.end, '14:00')
      } else {
        classes++
        assert.ok(getProfessor(teachers[entry.teacher]?.professorId), entry.teacher)
      }
    })
  }
  assert.equal(classes, 28)
  assert.equal(mcaSemesterOne.days.Monday[0].kind, 'lab')
  assert.equal(mcaSemesterOne.days.Monday[0].end, '12:30')
  assert.equal(mcaSemesterOne.days.Friday[1].start, '11:30')
  assert.equal(mcaSemesterOne.days.Friday[1].end, '13:30')
  assert.equal(getProfessor(teachers.AK.professorId).name, 'Abhishek Kumar')
  assert.equal(getProfessor(teachers.AA.professorId).name, 'Arshad Alam')
})

test('only provided course and semester schedules are available', () => {
  assert.equal(getRoutine('mca', '1'), mcaSemesterOne)
  assert.equal(getRoutine('bca', 1), undefined)
  assert.equal(getRoutine('mca', 2), undefined)
})

test('today is computed in India time including the midnight boundary', () => {
  const before = getIndiaClock(new Date('2026-10-26T18:29:00Z'))
  const after = getIndiaClock(new Date('2026-10-26T18:30:00Z'))
  assert.equal(before.day, 'Monday')
  assert.equal(before.minutes, 1439)
  assert.equal(after.day, 'Tuesday')
  assert.equal(after.minutes, 0)
  assert.equal(after.date, '27 October 2026')
})

test('session boundaries switch from upcoming to now to finished', () => {
  const entry = mcaSemesterOne.days.Tuesday[0]
  assert.equal(sessionStatus(entry, minutesOf('10:29')), 'upcoming')
  assert.equal(sessionStatus(entry, minutesOf('10:30')), 'now')
  assert.equal(sessionStatus(entry, minutesOf('11:29')), 'now')
  assert.equal(sessionStatus(entry, minutesOf('11:30')), 'finished')
})


test('readable routine labels use syllabus paper numbers and full titles, including labs', () => {
  const routine = mcaSemesterOne
  assert.equal(sessionLabel(routine, routine.days.Tuesday[0]), 'MCA C1004 · Database Management System')
  assert.equal(sessionLabel(routine, routine.days.Tuesday[1]), 'MCA C1002 · Data Structures through C')
  assert.equal(sessionLabel(routine, routine.days.Monday[0]), 'MCA P1009 · Database Management System Lab')
  assert.equal(sessionLabel(routine, routine.days.Friday[1]), 'MCA P1008 · Data Structures Lab')
  assert.equal(sessionLabel(routine, routine.days.Monday[3]), 'Library')
})


test('duration totals count merged labs once and exclude recess', () => {
  assert.equal(dayDuration(mcaSemesterOne.days.Monday), 300)
  assert.equal(dayDuration(mcaSemesterOne.days.Friday), 300)
  assert.equal(dayDuration(mcaSemesterOne.days.Sunday), 0)
  assert.equal(formatDuration(120), '2 hours')
  assert.equal(formatDuration(90), '1 hour 30 min')
  assert.equal(formatDuration(30), '30 min')
  assert.equal(formatDuration(0), '0 min')
})


test('class timing displays AM and PM correctly across noon and midnight', () => {
  assert.equal(formatClassTime('00:00'), '12:00 AM')
  assert.equal(formatClassTime('10:30'), '10:30 AM')
  assert.equal(formatClassTime('12:30'), '12:30 PM')
  assert.equal(formatClassTime('14:00'), '2:00 PM')
  assert.equal(formatClassTime('16:00'), '4:00 PM')
})
