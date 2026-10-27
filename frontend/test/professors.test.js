import test from 'node:test'
import assert from 'node:assert/strict'
import { professors, departmentPeople, getProfessor, professorHref, filterProfessors, facultySource } from '../src/app/main-website/pages/Professors/facultyData.js'

test('faculty identities are unique and stable for profile and future routine links', () => {
  assert.equal(professors.length, 7)
  assert.equal(new Set(professors.map(person => person.id)).size, professors.length)
  assert.equal(facultySource.url, 'https://www.vbu.ac.in/mca')
  for (const person of professors) {
    assert.match(person.id, /^[a-z]+(?:-[a-z]+)*$/)
    assert.equal(getProfessor(person.id), person)
    assert.equal(professorHref(person.id), `/professors/${person.id}`)
    assert.ok(person.name && person.qualification && person.specialization)
    for (const phone of person.phones) assert.match(phone, /^\d{10}$/)
    for (const email of person.emails) assert.match(email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/)
  }
  assert.equal(getProfessor('unknown'), undefined)
})

test('faculty search supports names, specializations, qualifications, and empty results', () => {
  assert.equal(filterProfessors('   ').length, departmentPeople.length)
  assert.deepEqual(filterProfessors('SANTOSH singh').map(person => person.id), ['santosh-kumar-singh'])
  assert.deepEqual(filterProfessors('software engineering').map(person => person.id), ['manish-kumar'])
  assert.ok(filterProfessors('M.Tech').some(person => person.id === 'rahul-prasad'))
  assert.equal(filterProfessors('nonexistent faculty').length, 0)
})


test('departmental staff have distinct identities without invented academic credentials', () => {
  assert.equal(departmentPeople.length, 11)
  assert.equal(new Set(departmentPeople.map(person => person.id)).size, 11)
  for (const person of departmentPeople.filter(person => person.category === 'staff')) {
    assert.equal(getProfessor(person.id), person)
    assert.equal(person.designation, 'Departmental staff')
    assert.equal(person.qualification, undefined)
  }
})
