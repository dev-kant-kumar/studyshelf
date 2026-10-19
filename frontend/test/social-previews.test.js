import test from 'node:test'
import assert from 'node:assert/strict'
import { getSocialPreview } from '../src/config/socialPreviews.js'

test('shared links select the matching course or developer preview', () => {
  for (const path of ['/courses/mca', '/courses/mca/semesters/sem1', '/notes/mca-sem1-paper1-unit1-introduction']) {
    assert.equal(getSocialPreview(path).path, '/social-preview-vbu-mca.png')
  }
  for (const path of ['/courses/bca', '/courses/bca/semesters/sem1', '/notes/bca-sem1-paper1-unit1-introduction']) {
    assert.equal(getSocialPreview(path).path, '/social-preview-bca-syllabus.png')
  }
  for (const path of ['/developers', '/developers/nodejs-roadmap']) {
    assert.equal(getSocialPreview(path).path, '/social-preview-developers.png')
  }
  assert.equal(getSocialPreview('/notes/custom', { courseId: 'bca' }).path, '/social-preview-bca-syllabus.png')
})

test('root and general pages use the complete site preview without prefix collisions', () => {
  for (const path of ['/', '/about', '/vbu', '/courses/mcas', '/developers-other', '/courses/bca-extra']) {
    assert.equal(getSocialPreview(path).path, '/social-preview-site.png')
  }
  assert.equal(getSocialPreview('/courses/bca?source=share#topics').path, '/social-preview-bca-syllabus.png')
})
