import test from 'node:test'
import assert from 'node:assert/strict'
import { roadmap, allTopics, sanitiseProgress, productionGates } from '../src/app/main-website/pages/Developers/backendRoadmapData.js'

test('roadmap anchors and persisted topic identifiers are unique', () => {
  const ids = [...roadmap.map(stage => stage.id), ...allTopics.map(topic => topic.id)]
  assert.equal(new Set(ids).size, ids.length)
  assert.ok(ids.every(id => /^[a-z0-9-]+$/.test(id)))
  for (const stage of roadmap) {
    assert.ok(stage.build && stage.gate && stage.goal)
    assert.ok(stage.groups.every(group => group.topics.length > 0))
  }
  assert.ok(productionGates.length >= 10)
})

test('saved progress rejects malformed, obsolete, and duplicate values', () => {
  const id = allTopics[0].id
  assert.deepEqual(sanitiseProgress([id, id, 'obsolete-topic', null, {}, 42]), [id])
  for (const value of [null, {}, 'bad', 42]) assert.deepEqual(sanitiseProgress(value), [])
  assert.deepEqual(sanitiseProgress(allTopics.map(topic => topic.id)), allTopics.map(topic => topic.id))
})
