import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import pg from 'pg'
import { checkout, requestSchema } from './checkout.mjs'

// Explicit opt-in because this resets ONLY backend_lab in the selected database.
if (!process.env.SQL_LAB_DATABASE_URL || process.env.SQL_LAB_ALLOW_RESET !== '1') {
  throw new Error('Set SQL_LAB_DATABASE_URL to a disposable database and SQL_LAB_ALLOW_RESET=1. This resets backend_lab.')
}
const pool = new pg.Pool({ connectionString: process.env.SQL_LAB_DATABASE_URL, max: 5 })
pool.on('error', error => console.error('Idle pool error', error.code))
const fixture = await readFile(new URL('./setup.sql', import.meta.url), 'utf8')
async function reset() {
  const client = await pool.connect()
  try { await client.query(fixture); await client.query(requestSchema) }
  finally { client.release() }
}
const input = { userId: 1, productId: 1, quantity: 1, requestKey: 'request-a' }

test('checkout database contract', async t => {
  try {
    await t.test('commits one order, replays the same request, and rejects a changed payload', async () => {
      await reset()
      const first = await checkout(pool, input)
      const second = await checkout(pool, input)
      assert.equal(first.replayed, false)
      assert.deepEqual(second, { orderId: first.orderId, replayed: true })
      await assert.rejects(checkout(pool, { ...input, quantity: 2 }), { code: 'REQUEST_CONFLICT' })
      assert.equal((await pool.query('SELECT stock FROM backend_lab.products WHERE id=1')).rows[0].stock, 4)
    })
    await t.test('competing buyers cannot oversell one remaining unit', async () => {
      await reset()
      await pool.query('UPDATE backend_lab.products SET stock=1 WHERE id=1')
      const results = await Promise.allSettled([
        checkout(pool, input), checkout(pool, { ...input, userId: 2, requestKey: 'request-b' }),
      ])
      assert.equal(results.filter(result => result.status === 'fulfilled').length, 1)
      assert.equal(results.find(result => result.status === 'rejected').reason.code, 'UNAVAILABLE')
      assert.equal((await pool.query('SELECT stock FROM backend_lab.products WHERE id=1')).rows[0].stock, 0)
      assert.equal(Number((await pool.query('SELECT COUNT(*) AS n FROM backend_lab.orders')).rows[0].n), 6)
    })
    await t.test('simultaneous copies of one request produce one order', async () => {
      await reset()
      const results = await Promise.all([checkout(pool,input), checkout(pool,input)])
      assert.equal(results[0].orderId, results[1].orderId)
      assert.equal(results.filter(result => result.replayed).length, 1)
      assert.equal((await pool.query('SELECT stock FROM backend_lab.products WHERE id=1')).rows[0].stock, 4)
    })
    await t.test('a downstream database failure rolls back reservation and order', async () => {
      await reset()
      await pool.query(`CREATE FUNCTION backend_lab.fail_line() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN RAISE EXCEPTION 'Injected line failure'; END $$`)
      await pool.query(`CREATE TRIGGER fail_line BEFORE INSERT ON backend_lab.order_items
        FOR EACH ROW EXECUTE FUNCTION backend_lab.fail_line()`)
      await assert.rejects(checkout(pool,input), { code: 'P0001' })
      assert.equal((await pool.query('SELECT stock FROM backend_lab.products WHERE id=1')).rows[0].stock, 5)
      assert.equal(Number((await pool.query('SELECT COUNT(*) AS n FROM backend_lab.orders')).rows[0].n), 5)
      assert.equal(Number((await pool.query('SELECT COUNT(*) AS n FROM backend_lab.checkout_requests')).rows[0].n), 0)
    })
  } finally { await pool.end() }
})
