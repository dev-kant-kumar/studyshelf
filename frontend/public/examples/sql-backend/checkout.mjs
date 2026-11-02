// PostgreSQL checkout lab. Install pg in a separate local project.
// Caller must supply an authenticated user ID, never trust a body.userId value.
export const requestSchema = `
CREATE TABLE IF NOT EXISTS backend_lab.checkout_requests (
  user_id integer NOT NULL REFERENCES backend_lab.users(id),
  request_key text NOT NULL,
  product_id integer NOT NULL REFERENCES backend_lab.products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  order_id integer REFERENCES backend_lab.orders(id),
  PRIMARY KEY (user_id, request_key)
);`

function failure(code, message) { return Object.assign(new Error(message), { code }) }

export async function checkout(pool, { userId, productId, quantity, requestKey }) {
  for (const value of [userId, productId, quantity]) {
    if (!Number.isSafeInteger(value) || value <= 0 || value > 2147483647) throw failure('INVALID_INPUT', 'Positive bounded integers required')
  }
  if (typeof requestKey !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(requestKey)) throw failure('INVALID_INPUT', 'Invalid request key')
  const client = await pool.connect()
  let discard = false
  try {
    await client.query('BEGIN')
    await client.query("SET LOCAL statement_timeout = '5s'")
    await client.query("SET LOCAL lock_timeout = '3s'")
    // The unique key serializes contenders for this user's request.
    const claim = await client.query(`
      INSERT INTO backend_lab.checkout_requests (user_id,request_key,product_id,quantity)
      VALUES ($1,$2,$3,$4) ON CONFLICT (user_id,request_key) DO NOTHING RETURNING user_id`,
    [userId,requestKey,productId,quantity])
    if (claim.rowCount === 0) {
      // READ COMMITTED: this new statement sees the winning committed request.
      const { rows } = await client.query(`SELECT product_id,quantity,order_id
        FROM backend_lab.checkout_requests WHERE user_id=$1 AND request_key=$2`, [userId,requestKey])
      const prior = rows[0]
      if (!prior || prior.product_id !== productId || prior.quantity !== quantity) throw failure('REQUEST_CONFLICT', 'Request key used for a different payload')
      if (!prior.order_id) throw failure('INCOMPLETE_REQUEST', 'Stored request has no completed outcome')
      await client.query('COMMIT')
      return { orderId: prior.order_id, replayed: true }
    }
    const reserved = await client.query(`UPDATE backend_lab.products SET stock=stock-$2
      WHERE id=$1 AND stock >= $2 RETURNING price`, [productId,quantity])
    if (reserved.rowCount !== 1) throw failure('UNAVAILABLE', 'Insufficient stock')
    const { rows } = await client.query(`INSERT INTO backend_lab.orders
      (user_id,status,created_at,idempotency_key) VALUES ($1,'pending',CURRENT_TIMESTAMP,$2) RETURNING id`,
    [userId,`${userId}:${requestKey}`])
    const orderId = rows[0].id
    await client.query(`INSERT INTO backend_lab.order_items (order_id,product_id,quantity,unit_price)
      VALUES ($1,$2,$3,$4)`, [orderId,productId,quantity,reserved.rows[0].price])
    await client.query(`UPDATE backend_lab.checkout_requests SET order_id=$3
      WHERE user_id=$1 AND request_key=$2`, [userId,requestKey,orderId])
    await client.query('COMMIT')
    return { orderId, replayed: false }
  } catch (error) {
    try { await client.query('ROLLBACK') } catch { discard = true }
    throw error
  } finally { client.release(discard) }
}

export async function checkoutWithRetry(pool, input, attempts = 3) {
  for (let attempt = 0; ; attempt++) {
    try { return await checkout(pool, input) }
    catch (error) {
      if (!['40001','40P01'].includes(error.code) || attempt + 1 >= attempts) throw error
      await new Promise(resolve => setTimeout(resolve, 25 * 2 ** attempt + Math.random() * 25))
    }
  }
}
