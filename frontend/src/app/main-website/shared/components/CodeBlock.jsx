import { useContext, useEffect, useId, useRef, useState } from 'react'
import { Check, Code2, Copy, RotateCcw } from 'lucide-react'
import { focus } from '@/ui/classes'
import Dropdown from '@/ui/Dropdown'
import { defaultSqlDialect, isSqlLanguage, resolveSqlExample, sanitiseSqlDialect, sqlDialects } from '@/lib/sqlDialects'
import { PreferencesContext } from '../hooks/preferencesContext'

export default function CodeBlock({ code, language = 'text', sqlVariants }) {
  const preferencesContext = useContext(PreferencesContext)
  const [localDialect, setLocalDialect] = useState(defaultSqlDialect)
  const sql = isSqlLanguage(language)
  const dialect = sanitiseSqlDialect(preferencesContext?.preferences.sqlDialect ?? localDialect)
  const source = sql ? resolveSqlExample(code, sqlVariants, dialect) : { code, language, label: language.toLowerCase() === 'c' ? 'C' : language }
  const originalCode = source.code
  const editorLanguage = source.language
  const documentKey = `${sql ? dialect : ''}\0${editorLanguage}\0${originalCode}`
  const host = useRef(null)
  const editor = useRef(null)
  const drafts = useRef(new Map())
  const helpId = useId()
  const [draftValues, setDraftValues] = useState({})
  const [readyKey, setReadyKey] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const value = Object.hasOwn(draftValues, documentKey) ? draftValues[documentKey] : originalCode
  const ready = readyKey === documentKey
  const message = feedback?.key === documentKey ? feedback.text : ''
  const modified = value !== originalCode
  const label = source.label
  const lines = value.split('\n')
  function setMessage(text) { setFeedback({ key: documentKey, text }) }
  function selectDialect(next) {
    if (preferencesContext) preferencesContext.update({ sqlDialect: next })
    else setLocalDialect(next)
  }

  useEffect(() => {
    let cancelled = false
    let view = null
    import('./codeEditor.js').then(({ createCodeEditor }) => {
      if (cancelled) return
      view = createCodeEditor(host.current, drafts.current.get(documentKey) ?? originalCode, editorLanguage, helpId, next => {
        drafts.current.set(documentKey, next)
        setDraftValues(previous => ({ ...previous, [documentKey]: next }))
        setFeedback(null)
      })
      editor.current = view
      setReadyKey(documentKey)
    }).catch(() => {
      if (!cancelled) setFeedback({ key: documentKey, text: 'Editor could not load. You can still read and copy the example.' })
    })
    return () => {
      cancelled = true
      view?.destroy()
      if (editor.current === view) editor.current = null
    }
  }, [documentKey, originalCode, editorLanguage, helpId])

  async function copy() {
    try {
      await navigator.clipboard.writeText(editor.current?.state.doc.toString() ?? value)
      setMessage('Code copied.')
    } catch {
      setMessage('Could not copy code. Select and copy it manually.')
    }
  }

  function reset() {
    const view = editor.current
    if (!view) return
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: originalCode } })
    setMessage('Original code restored.')
  }

  return <div className="code-editor my-6 min-w-0 rounded-xl border border-line font-sans dark:border-night-line">
    <div className="code-editor-toolbar flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-t-xl border-b border-line px-3 py-1 dark:border-night-line sm:px-4">
      <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm font-semibold"><Code2 size={16} aria-hidden="true" /><span>{sql ? 'SQL' : label}</span>{sql && <Dropdown compact label="SQL database" options={sqlDialects} value={dialect} onChange={selectDialect} className="w-32 print:hidden" />}<span className="hidden print:inline">{sql ? label : ''}</span><span className="code-editor-badge">{modified ? 'Modified' : 'Example'}</span></div>
      <div className="flex items-center gap-1 print:hidden">
        <button type="button" onClick={reset} disabled={!ready || !modified} className={`code-editor-action inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm disabled:cursor-default disabled:opacity-40 ${focus}`} aria-label="Reset to original code"><RotateCcw size={15} aria-hidden="true" />Reset</button>
        <button type="button" onClick={copy} className={`code-editor-action inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm ${focus}`}>{message === 'Code copied.' ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{message === 'Code copied.' ? 'Copied' : 'Copy code'}</button>
      </div>
    </div>
    {source.note && <p className="!m-0 border-b border-line px-4 py-3 font-sans text-sm leading-relaxed dark:border-night-line">{source.note}</p>}
    <div className="min-w-0 overflow-hidden print:overflow-visible">
      <div ref={host} className="code-editor-host print:hidden" />
      <pre className={`code-editor-fallback ${ready ? 'hidden print:block' : ''}`} aria-label={`${label} code example`}><code>{lines.map((line, index) => <span className="code-editor-source-line" key={index}><span className="code-editor-line-number" aria-hidden="true" data-line={index + 1} /><span>{line || '\u200b'}{index < lines.length - 1 ? '\n' : ''}</span></span>)}</code></pre>
    </div>
    <div className="code-editor-status flex flex-wrap justify-between gap-x-4 gap-y-1 rounded-b-xl border-t border-line px-4 py-2 text-xs dark:border-night-line print:hidden">
      <span id={helpId}>{sql ? 'Edit or copy this version. Each DBMS keeps its edits until you leave this page.' : 'Edit to experiment. Changes last until you leave this page.'}</span>
      <span>{lines.length} lines · {label}</span>
      {source.download && <a className={`w-full underline underline-offset-2 ${focus}`} href={source.download.href} download={source.download.filename}>Download SQL for {label}</a>}
    </div>
    <span role="status" className="sr-only">{message}</span>
  </div>
}
