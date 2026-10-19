import test from 'node:test'
import assert from 'node:assert/strict'
import bca from '../src/app/main-website/notesData/BCA/syllabus.js'
import { buildCatalogue } from '../src/app/main-website/notesData/buildCatalogue.js'

test('BCA import preserves all six semesters, elective choices and supplied practical guidance', () => {
  const { courses, notes } = buildCatalogue({ './BCA/syllabus.js': { default: bca } }, {})
  const course=courses[0], papers=course.semesters.flatMap(semester => semester.papers)
  assert.equal(course.semesters.length, 6)
  assert.deepEqual(course.semesters.map(semester => semester.papers.length), [8,8,8,8,9,8])
  assert.equal(course.semesters[0].papers[0].code, 'BCA F1001')
  assert.equal(course.semesters[0].papers[3].code, 'BCA C1004')
  assert.equal(papers.length,49)
  assert.equal(papers.flatMap(paper => paper.units).length,156)
  assert.equal(papers.filter(paper => paper.practicalText).length,17)
  assert.equal(notes.length,0, 'Syllabus import must not claim that BCA chapters are published')
  assert.ok(course.semesters.every(semester => semester.credits===25))
  for (const semester of course.semesters.slice(4)) assert.equal(semester.papers.filter(paper => paper.kind==='elective').length,2)
  for (const paper of papers) {
    assert.ok(paper.units.length || paper.practicalText)
    for (const unit of paper.units) {
      assert.ok(unit.title && unit.syllabusText)
      assert.ok(unit.sourcePage>=11 && unit.sourcePage<=59)
      assert.ok(!/Text Book:|Referential Books:/i.test(unit.syllabusText))
    }
  }
})

test('conflicting BCA source headings and codes remain traceable', () => {
  const papers=bca.semesters.flatMap(semester => semester.papers)
  const accounting=papers.find(paper => paper.code==='BCA C6003')
  assert.equal(accounting.title,'Accounting and Financial Management')
  assert.match(accounting.detailTitle,/OPTIMIZATION TECHNIQUES/)
  assert.equal(accounting.units[0].title,'ACCOUNTING')
  assert.ok(accounting.sourceNote)
  for (const code of ['BCA F1001','BCA C6006','BCA E6007','BCA E6008','BCA P4008']) assert.ok(papers.find(paper => paper.code===code).sourceNote)
  assert.equal(papers.find(paper => paper.code==='BCA E6007').detailPage,58)
  assert.equal(papers.find(paper => paper.code==='BCA E6008').detailPage,59)
})
