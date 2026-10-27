import { PGlite } from '@electric-sql/pglite'
import setup from '../../../../../public/examples/sql-backend/setup.sql?raw'

self.onmessage = async ({ data }) => {
  let db
  try {
    db = await PGlite.create()
    const version = (await db.query('SHOW server_version')).rows[0].server_version
    self.postMessage({ type: 'ready', version })
    await db.exec(setup)
    await db.exec("SET statement_timeout = '10s'")
    const results = await db.exec(data.code)
    self.postMessage({ type: 'result', version, results: results.map(result => ({
      fields: result.fields, rows: result.rows.slice(0, 100), totalRows: result.rows.length,
      affectedRows: result.affectedRows,
    })) })
  } catch (error) {
    self.postMessage({ type: 'error', message: error.message, code: error.code, hint: error.hint })
  } finally { await db?.close() }
}
