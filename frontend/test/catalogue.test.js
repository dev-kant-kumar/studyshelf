import { existsSync } from 'node:fs'
import test from 'node:test'
import assert from 'node:assert/strict'
import { buildCatalogue } from '../src/app/main-website/notesData/buildCatalogue.js'
import mca from '../src/app/main-website/notesData/MCA/syllabus.js'

const path = './MCA/semesters/sem1/paper1/unit1/introduction/main.jsx'
const load = async () => ({ default: () => null })
function fixture(status = 'published') {
  return { './MCA/syllabus.js': { default: { id: 'mca', name: 'MCA', description: 'MCA course', semesters: [{ id: 'sem1', number: 1, title: 'Semester 1', papers: [{ id: 'paper1', title: 'Computers', units: [{ id: 'unit1', number: 1, title: 'Introduction', notes: [{ id: 'introduction', title: 'Introduction note', summary: 'A first note', status }] }] }] }] } } }
}

test('supplied curriculum retains all semesters, papers, units and elective alternatives', () => {
  const unit = mca.semesters[0].papers[0].units[0]
  const content = Object.fromEntries(unit.notes.map(note => [`./MCA/semesters/sem1/paper1/unit1/${note.id}/main.jsx`, load]))
  const { courses, notes } = buildCatalogue({ './MCA/syllabus.js': { default: mca } }, content)
  assert.equal(courses[0].semesters.length, 4)
  const papers = courses[0].semesters.flatMap(sem => sem.papers)
  assert.equal(papers.length, 36)
  assert.equal(papers.filter(paper => paper.kind === 'elective').length, 6)
  assert.equal(papers.flatMap(paper => paper.units).length, 120)
  assert.equal(notes.length, 15)
  assert.equal(courses[0].noteCount, 15)
  for (const contentPath of Object.keys(content)) assert.ok(existsSync(new URL('../src/app/main-website/notesData/' + contentPath.slice(2), import.meta.url)))
  const coverage = courses[0].semesters[0].papers[0].units[0].topicCoverage
  assert.equal(coverage.length, 15)
  for (const topic of coverage) {
    assert.equal(topic.notes.length, 1, `${topic.id} has its own published chapter`)
    assert.equal(topic.notes[0].id, topic.id)
  }
  assert.equal(new Set(unit.notes.map(note => note.order)).size, 15)
  assert.equal(notes[0].slug, 'mca-sem1-paper1-unit1-introduction')
  assert.equal(papers.find(paper => paper.code === 'MCA P4005').marks, 450)
  assert.equal(papers.find(paper => paper.code === 'MCA C2001').units.length, 6)
  assert.equal(papers.find(paper => paper.code === 'MCA C3005').units.length, 4)
})
test('one published note propagates to all counts, links and reader loader', async () => {
  const { courses, notes } = buildCatalogue(fixture(), { [path]: load })
  assert.equal(notes[0].href, '/notes/mca-sem1-paper1-unit1-introduction')
  assert.equal(notes[0].loadComponent, load)
  assert.equal(courses[0].noteCount, 1)
  assert.equal(courses[0].semesters[0].papers[0].noteCount, 1)
  assert.equal(typeof (await notes[0].loadComponent()).default, 'function')
})
test('metadata edits propagate without changing page data', () => {
  const modules = fixture()
  modules['./MCA/syllabus.js'].default.semesters[0].papers[0].title = 'Renamed subject'
  const result = buildCatalogue(modules, { [path]: load })
  assert.equal(result.notes[0].paperTitle, 'Renamed subject')
})
test('drafts are absent from reader lookup and counts even without a content file', () => {
  const { courses, notes } = buildCatalogue(fixture('draft'), {})
  assert.equal(notes.length, 0)
  assert.equal(courses[0].noteCount, 0)
})
test('published missing content fails loudly instead of creating broken links', () => {
  assert.throws(() => buildCatalogue(fixture(), {}), /missing content/)
})
test('duplicate IDs and unsafe folder IDs are rejected', () => {
  const modules = fixture()
  const sem = modules['./MCA/syllabus.js'].default.semesters[0]
  sem.papers.push({ ...sem.papers[0] })
  assert.throws(() => buildCatalogue(modules, {}), /duplicate ID/)
  const bad = fixture()
  bad['./MCA/syllabus.js'].default.semesters[0].id = '../outside'
  assert.throws(() => buildCatalogue(bad, {}), /invalid ID/)
})


test('topic coverage includes published teaching and retains uncovered syllabus topics', () => {
  const modules = fixture()
  const unit = modules['./MCA/syllabus.js'].default.semesters[0].papers[0].units[0]
  unit.topics = [{ id: 'definition', title: 'Definition' }, { id: 'history', title: 'History' }]
  unit.notes[0].coveredTopics = ['definition']
  const result = buildCatalogue(modules, { [path]: load })
  const coverage = result.courses[0].semesters[0].papers[0].units[0].topicCoverage
  assert.equal(coverage.length, 2)
  assert.equal(coverage[0].notes[0].slug, result.notes[0].slug)
  assert.equal(coverage[1].notes.length, 0)
  unit.notes[0].status = 'draft'
  const draft = buildCatalogue(modules, {})
  assert.equal(draft.courses[0].semesters[0].papers[0].units[0].topicCoverage[0].notes.length, 0)
})
test('unknown covered topics fail validation rather than hiding a syllabus mismatch', () => {
  const modules = fixture()
  modules['./MCA/syllabus.js'].default.semesters[0].papers[0].units[0].notes[0].coveredTopics = ['not-in-syllabus']
  assert.throws(() => buildCatalogue(modules, { [path]: load }), /unknown covered topic/)
})
