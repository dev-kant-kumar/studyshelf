import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { PGlite } from '@electric-sql/pglite'

const server = await createServer({ server: { middlewareMode: true, hmr: false }, appType: 'custom' })
const db = await PGlite.create()
const setup = await readFile(new URL('../public/examples/sql-backend/setup.sql', import.meta.url), 'utf8')
let verified = 0
let assertions = 0
function normalize(value) {
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map(normalize)
  if (value !== null && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key,v]) => [key,normalize(v)]))
  // Compare driver-independent SQL values; numeric and bigint parsers differ.
  return value === null ? null : String(value)
}
try {
  const { lessons, modules } = await server.ssrLoadModule('/src/app/main-website/pages/Sql/data/course.js')
  assert.equal(new Set(lessons.map(lesson => lesson.id)).size, lessons.length)
  assert.equal(modules.length, 5)
  const cases = lessons.flatMap(lesson => [
    ...lesson.sections.flatMap(section => section.blocks.filter(block => block.type === 'code' && block.runnable).map(block => ({ ...block, context: `${lesson.id}: ${block.title}` }))),
    ...(lesson.practiceRunnable === false ? [] : [{ code: lesson.practice.solution, expected: lesson.practice.expected, context: `${lesson.id}: exercise` }]),
  ])
  for (const example of cases) {
    try {
      await db.exec('ROLLBACK')
      await db.exec('DISCARD ALL')
      await db.exec(setup)
      const results = await db.exec(example.code)
      const result = example.resultIndex !== undefined ? results[example.resultIndex] : results.filter(result => result.fields.length).at(-1)
      if (example.expected) { assert.deepEqual(normalize(result?.rows), normalize(example.expected)); assertions++ }
      else assert.ok(result, 'Example should produce an inspectable result')
      verified++
    } catch (error) { throw new Error(`${example.context}: ${error.message}`, { cause: error }) }
  }
  console.log(`Verified ${verified} SQL examples/exercise solutions; ${assertions} exact result assertions on PostgreSQL ${(await db.query('SHOW server_version')).rows[0].server_version}.`)
  console.log('Two-session concurrency, external drivers, role provisioning, backups, and host operations require the documented real-server labs.')
} finally { await db.close(); await server.close() }
