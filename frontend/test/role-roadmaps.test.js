import test from 'node:test'
import assert from 'node:assert/strict'
import { roleRoadmaps, sanitiseRoleProgress } from '../src/app/main-website/pages/Developers/roleRoadmapData.js'
import { publicPages } from '../src/config/publicPages.js'

test('each role has a published route, unique stable topics, milestones and references', () => {
  assert.equal(new Set(roleRoadmaps.map(role => role.slug)).size, roleRoadmaps.length)
  for (const role of roleRoadmaps) {
    assert.ok(publicPages.some(page => page.path === `/developers/${role.slug}`))
    assert.ok(role.prerequisites && role.project && role.description)
    const ids = role.stages.flatMap(stage => [stage.id, ...stage.topics.map(topic => topic.id)])
    assert.equal(new Set(ids).size, ids.length)
    assert.ok(ids.every(id => /^[a-z0-9-]+$/.test(id)))
    assert.ok(role.stages.length >= 8)
    for (const stage of role.stages) assert.ok(stage.build && stage.gate && stage.topics.length >= 4)
    assert.ok(role.sources.length >= 3)
    for (const source of role.sources) assert.equal(new URL(source.href).protocol, 'https:')
  }
})

test('role progress rejects corrupt or obsolete values and remains scoped to its roadmap', () => {
  const [frontend, python] = roleRoadmaps
  const id = frontend.stages[0].topics[0].id
  assert.deepEqual(sanitiseRoleProgress([id, id, 'obsolete', null, {}], frontend), [id])
  assert.deepEqual(sanitiseRoleProgress([id], python), [])
  for (const value of [null, {}, 42, 'broken']) assert.deepEqual(sanitiseRoleProgress(value, frontend), [])
})
