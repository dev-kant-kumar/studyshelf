# PostgreSQL checkout lab

Use a disposable local PostgreSQL 18 database. This lab resets its `backend_lab` schema. Never use an application/production database URL.

1. Download `setup.sql`, `checkout.mjs`, and `checkout.test.mjs` into one new local folder.
2. Run `npm init -y` and `npm install pg` in that folder.
3. Set `SQL_LAB_DATABASE_URL` to the local scratch connection URL and `SQL_LAB_ALLOW_RESET=1`.
4. Run `node --test checkout.test.mjs`.

PowerShell example using an optional localhost-only container (requires Docker):

```powershell
docker run --name studyshelf-sql -e POSTGRES_PASSWORD=local-study-only -e POSTGRES_DB=studyshelf -p 127.0.0.1:55432:5432 -d postgres:18
$env:SQL_LAB_DATABASE_URL = 'postgresql://postgres:local-study-only@localhost:55432/studyshelf'
$env:SQL_LAB_ALLOW_RESET = '1'
node --test checkout.test.mjs
```

Expected evidence: a repeated request returns the original order; changing its payload is rejected; two buyers cannot oversell one unit; concurrent copies of a request create one order; an injected line-item error rolls back stock, order, and request claim.

`checkout(pool, input)` takes a trusted authenticated user ID. It is a repository/service example, not an HTTP authentication implementation. The runtime database role must be provisioned for the required tables/sequences. Create `checkout_requests` through migrations in an application; the test creates it after resetting the fixture.

The request table claim and checkout changes commit together under READ COMMITTED. The unique `(user_id, request_key)` key serializes duplicate claims. Request payload fields are compared before replaying a stored outcome. Failed work leaves no committed claim. Keep request records long enough to satisfy the API's retry contract; deleting them too early permits a repeated key to create another order.

This lab does not integrate a payment provider. Persist an outbox/state transition for external actions and make consumers idempotent. A lost network response after COMMIT can be resolved by retrying the same key. Do not retry a new key automatically or charge an external account inside the retry boundary.

The browser practice engine has one connection. Run these concurrency tests on the local server; browser SQL verification is not evidence for the multi-connection tests.
