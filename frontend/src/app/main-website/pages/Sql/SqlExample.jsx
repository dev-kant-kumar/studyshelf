import { useEffect, useRef, useState } from 'react'
import CodeBlock from '../../shared/components/CodeBlock'
import ComparisonTable from '../../shared/components/ComparisonTable'
import { secondary, muted } from '@/ui/classes'

function displayValue(value) {
  if (value === null) return 'NULL'
  if (value instanceof Date) return value.toISOString()
  if (typeof value === 'object') return JSON.stringify(value).slice(0, 10000)
  return String(value).slice(0, 10000)
}
export function ResultTable({ rows, caption, fields }) {
  const names = fields?.map(field => field.name) ?? Object.keys(rows[0] ?? {})
  if (!rows.length) return <p className={muted}>{caption}: 0 rows.</p>
  return <ComparisonTable caption={caption} headers={names} rows={rows.map(row => names.map(name => displayValue(row[name])))} />
}

export default function SqlExample({ block }) {
  const [value, setValue] = useState(block.code)
  const [state, setState] = useState({ status: 'idle' })
  const running = useRef(null)
  const timer = useRef(null)
  function stop() { running.current?.terminate(); running.current = null; clearTimeout(timer.current) }
  useEffect(() => () => { running.current?.terminate(); clearTimeout(timer.current) }, [])
  function cancel() { stop(); setState({ status: 'cancelled' }) }
  function run() {
    stop()
    setState({ status: 'loading' })
    const worker = new Worker(new URL('./sql.worker.js', import.meta.url), { type: 'module' })
    running.current = worker
    worker.onmessage = ({ data }) => {
      if (running.current !== worker) return
      if (data.type === 'ready') setState({ status: 'running', version: data.version })
      else { setState({ status: data.type, executedSql: value, ...data }); stop() }
    }
    worker.onerror = () => { setState({ status: 'error', message: 'The practice engine could not load. Retry, or download the setup and run locally with PostgreSQL.' }); stop() }
    timer.current = setTimeout(() => { stop(); setState({ status: 'error', message: 'Practice stopped after 45 seconds. Reduce the query or retry after the engine assets are cached.' }) }, 45000)
    worker.postMessage({ code: value })
  }
  const busy = ['loading', 'running'].includes(state.status)
  const Heading = block.solution ? 'h4' : 'h3'
  return <div className="my-6">
    <Heading className="font-semibold">{block.title}</Heading>
    <CodeBlock code={block.code} language={block.language ?? 'postgresql'} fixedDialect={block.language === 'postgresql' ? 'postgresql' : undefined} onValueChange={setValue} />
    {block.runnable && <div className="print:hidden">
      <div className="flex flex-wrap items-center gap-3"><button type="button" className={secondary} onClick={run} disabled={busy}>{busy ? 'Running...' : 'Run with fresh sample data'}</button>{busy && <button type="button" className={secondary} onClick={cancel}>Cancel</button>}</div>
      <p className={`mt-2 text-sm ${muted}`}>Runs locally in your browser using embedded PostgreSQL. Each run resets the sample database. No query is sent to an application database.</p>
      <div aria-live="polite" aria-busy={busy}>
        {busy && <p className="mt-3">{state.status === 'loading' ? 'Loading the practice engine on demand...' : `Executing on PostgreSQL ${state.version}...`}</p>}
        {state.status === 'cancelled' && <p>Run cancelled. The temporary database was discarded.</p>}
        {state.status === 'error' && <div className="my-4 border-l-4 border-brand bg-soft p-4 dark:bg-night-soft dark:border-night-brand"><strong>Query did not complete{state.code ? ` (${state.code})` : ''}</strong><p>{state.message}</p>{state.hint && <p>Hint: {state.hint}</p>}</div>}
        {state.status === 'result' && <div className="mt-4"><p className="font-semibold">Actual results - PostgreSQL {state.version}</p>{state.executedSql !== value && <p className="text-sm">These results are from your previous run. Run again to execute your edits.</p>}{state.results.length === 0 && <p>No SQL statements were executed. Write a statement in the editor, then run again.</p>}{state.results.map((result, index) => <div key={index}>{result.fields.length ? <ResultTable rows={result.rows} fields={result.fields} caption={`Statement ${index + 1}: ${result.totalRows} row${result.totalRows === 1 ? '' : 's'}${result.totalRows > 100 ? ' (first 100 shown)' : ''}`} /> : <p className={`my-2 text-sm ${muted}`}>Statement {index + 1}: complete{result.affectedRows ? `, ${result.affectedRows} affected rows` : ''}.</p>}</div>)}</div>}
      </div>
    </div>}
    <p>{block.explanation}</p>
    {block.expected && <ResultTable rows={block.expected} caption="Expected result for the original example" />}
  </div>
}
