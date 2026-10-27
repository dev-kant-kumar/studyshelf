import test from 'node:test'
import assert from 'node:assert/strict'
import { chooseScrollTarget, validScrollPosition } from '../src/lib/scrollNavigation.js'

const saved = { y: 8500, hash: '', heading: 'section-example', offset: 100 }
const navigation = { initial: false, reload: true, navigationType: 'PUSH', pathnameChanged: true, hash: '', readingPosition: saved }

test('a topic link after a document reload starts at the top, never at old reading progress', () => {
  assert.equal(chooseScrollTarget(navigation).mode, 'top')
  assert.equal(chooseScrollTarget({ ...navigation, navigationType: 'REPLACE' }).mode, 'top')
})

test('only the initial reload restores matching note progress', () => {
  assert.deepEqual(chooseScrollTarget({ ...navigation, initial: true }), { mode: 'position', position: saved })
  assert.equal(chooseScrollTarget({ ...navigation, initial: true, reload: false }).mode, 'top')
  assert.equal(chooseScrollTarget({ ...navigation, initial: true, hash: '#other' }).mode, 'anchor')
})

test('Back and Forward restore their own history entry rather than another visit to the same note', () => {
  const entry = { y: 1400, hash: '' }
  assert.deepEqual(chooseScrollTarget({ ...navigation, navigationType: 'POP', entryPosition: entry }), { mode: 'position', position: entry })
  assert.equal(chooseScrollTarget({ ...navigation, navigationType: 'POP', entryPosition: null }).mode, 'top')
})

test('section links take precedence over page-top resets and query filters keep their position', () => {
  assert.equal(chooseScrollTarget({ ...navigation, hash: '#unit3' }).mode, 'anchor')
  assert.equal(chooseScrollTarget({ ...navigation, pathnameChanged: false }).mode, 'preserve')
  assert.equal(chooseScrollTarget({ ...navigation, pathnameChanged: false, hash: '#section' }).mode, 'anchor')
})

test('corrupt storage cannot select an invalid scroll target', () => {
  for (const value of [null, {}, { y: -1 }, { y: '500' }, { y: Infinity }]) {
    assert.ok(!validScrollPosition(value))
    assert.equal(chooseScrollTarget({ ...navigation, initial: true, readingPosition: value }).mode, 'top')
  }
})

test('fresh document visits ignore stale default-entry storage but cross-document history can recover', () => {
  const visit = { ...navigation, initial: true, reload: false, navigationType: 'POP', entryPosition: saved }
  assert.equal(chooseScrollTarget(visit).mode, 'top')
  assert.equal(chooseScrollTarget({ ...visit, historyTraversal: true }).mode, 'position')
})
