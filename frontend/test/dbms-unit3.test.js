import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import syllabus from '../src/app/main-website/notesData/MCA/syllabus.js'

const root = new URL('../src/app/main-website/notesData/MCA/semesters/sem1/paper4/unit3/', import.meta.url)
const unit = syllabus.semesters.find(item => item.id === 'sem1').papers.find(item => item.id === 'paper4').units.find(item => item.id === 'unit3')
const load = id => JSON.parse(readFileSync(new URL(`${id}/chapter.json`, root), 'utf8'))

test('DBMS Unit 3 maps every distinct syllabus topic to authored, separately routed content', () => {
  assert.equal(unit.topics.length, 17)
  assert.equal(unit.notes.length, 15)
  assert.match(unit.syllabusText, /Cursors, Stored procedures and triggers/)
  for (const topic of unit.topics) assert.equal(unit.notes.filter(note => note.coveredTopics.includes(topic.id)).length, 1, topic.id)
  const questionIds = new Set()
  for (const note of unit.notes) {
    assert.equal(note.status, 'published')
    assert.ok(existsSync(new URL(`${note.id}/main.jsx`, root)))
    const chapter = load(note.id)
    assert.equal(chapter.id, note.id)
    assert.ok(chapter.sections.length >= 5 && chapter.outcomes.length >= 3 && chapter.questions.length >= 3)
    for (const question of chapter.questions) {
      assert.ok(!questionIds.has(question.id), question.id)
      questionIds.add(question.id)
      assert.ok(question.answer.every(paragraph => paragraph.length > 60))
    }
    if (chapter.next) assert.ok(unit.notes.some(item => item.id === chapter.next.id))
  }
})

test('Unit 3 SQL variants and downloadable exercises agree with their displayed source', () => {
  const dialects = ['postgresql', 'oracle', 'mysql', 'mariadb', 'sqlite', 'sqlserver']
  for (const note of unit.notes) {
    for (const section of load(note.id).sections) {
      if (!section.code) continue
      assert.equal(section.code, section.sqlVariants.postgresql.code)
      for (const dialect of dialects) {
        const variant = section.sqlVariants[dialect]
        assert.ok(variant.code && variant.note, `${note.id}: ${dialect}`)
        if (variant.download) {
          const file = new URL('../public' + variant.download.href, import.meta.url)
          assert.ok(readFileSync(file, 'utf8').replaceAll('\r\n', '\n').includes(variant.code), variant.download.href)
        }
      }
    }
  }
  for (const id of ['cursors', 'stored-procedures']) {
    const example = load(id).sections.find(section => section.sqlVariants)
    assert.match(example.sqlVariants.sqlite.note, /does not|has no/)
  }
})

test('instructional figures have files, accessible descriptions, and reserved dimensions', () => {
  const diagrams = readdirSync(new URL('diagrams/', root)).filter(name => name.endsWith('.svg'))
  assert.equal(diagrams.length, 11)
  for (const note of unit.notes) for (const section of load(note.id).sections) {
    if (!section.diagram) continue
    assert.ok(diagrams.includes(section.diagram + '.svg'))
    assert.ok(section.alt.length > 50 && section.caption.length > 40)
    const svg = readFileSync(new URL(`diagrams/${section.diagram}.svg`, root), 'utf8')
    assert.ok(svg.includes(`height="${section.diagramHeight}"`))
  }
})
