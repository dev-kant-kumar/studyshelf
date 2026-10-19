import test from 'node:test'
import assert from 'node:assert/strict'
import { careerFields, careerGroups, filterCareerFields } from '../src/app/main-website/pages/Careers/careerFields.js'
import { publicPages } from '../src/config/publicPages.js'

test('career map has complete fields and only links to published roadmaps', () => {
  assert.equal(careerFields.length, 16)
  assert.equal(new Set(careerFields.map(field => field.id)).size, careerFields.length)
  assert.ok(publicPages.some(page => page.path === '/careers'))
  for (const field of careerFields) {
    assert.match(field.id, /^[a-z0-9-]+$/)
    assert.ok(field.roles.length && field.skills.length && field.start && field.project && field.later)
    assert.ok(careerGroups.includes(field.group))
    for (const [, href] of field.roadmaps ?? []) assert.ok(publicPages.some(page => page.path === href), href)
  }
})

test('career search matches roles and skills while respecting interest filters', () => {
  assert.equal(filterCareerFields().length, 16)
  assert.ok(filterCareerFields('  SOC ANALYST  ').some(field => field.id === 'security'))
  assert.ok(filterCareerFields('SQL', 'Work with data').every(field => field.group === 'Work with data'))
  assert.equal(filterCareerFields('SOC analyst', 'Work with data').length, 0)
  assert.equal(filterCareerFields('no-such-career-zx91').length, 0)
  assert.ok(filterCareerFields('', 'Build software').some(field => field.id === 'mobile'))
})
