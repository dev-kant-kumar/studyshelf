import { useEffect, useId, useRef, useState } from 'react'
import { Check, Code2, Copy, RotateCcw } from 'lucide-react'
import { focus } from '@/ui/classes'

export default function CodeBlock({ code, language = 'text' }) {
  const host = useRef(null)
  const editor = useRef(null)
  const helpId = useId()
  const [value, setValue] = useState(code)
  const [ready, setReady] = useState(false)
  const [message, setMessage] = useState('')
  const modified = value !== code
  const label = language.toLowerCase() === 'c' ? 'C' : language
  const lines = value.split('\n')

  useEffect(() => {
    let cancelled = false
    setReady(false)
    setValue(code)
    setMessage('')
    import('./codeEditor.js').then(({ createCodeEditor }) => {
      if (cancelled) return
      editor.current = createCodeEditor(host.current, code, language, helpId, next => {
        setValue(next)
        setMessage('')
      })
      setReady(true)
    }).catch(() => {
      if (!cancelled) setMessage('Editor could not load. You can still read and copy the example.')
    })
    return () => {
      cancelled = true
      editor.current?.destroy()
      editor.current = null
    }
  }, [code, language, helpId])

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
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: code } })
    setMessage('Original code restored.')
  }

  return <div className="code-editor my-6 min-w-0 overflow-hidden rounded-xl border border-line font-sans dark:border-night-line">
    <div className="code-editor-toolbar flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-line px-3 py-1 dark:border-night-line sm:px-4">
      <span className="inline-flex items-center gap-2 text-sm font-semibold"><Code2 size={16} aria-hidden="true" /><span>{label}</span><span className="code-editor-badge">{modified ? 'Modified' : 'Example'}</span></span>
      <div className="flex items-center gap-1 print:hidden">
        <button type="button" onClick={reset} disabled={!ready || !modified} className={`code-editor-action inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm disabled:cursor-default disabled:opacity-40 ${focus}`} aria-label="Reset to original code"><RotateCcw size={15} aria-hidden="true" />Reset</button>
        <button type="button" onClick={copy} className={`code-editor-action inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm ${focus}`}>{message === 'Code copied.' ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}{message === 'Code copied.' ? 'Copied' : 'Copy code'}</button>
      </div>
    </div>
    <div ref={host} className="code-editor-host print:hidden" />
    <pre className={`code-editor-fallback ${ready ? 'hidden print:block' : ''}`} aria-label={`${label} code example`}><code>{lines.map((line, index) => <span className="code-editor-source-line" key={index}><span className="code-editor-line-number" aria-hidden="true" data-line={index + 1} /><span>{line || '\u200b'}{index < lines.length - 1 ? '\n' : ''}</span></span>)}</code></pre>
    <div className="code-editor-status flex flex-wrap justify-between gap-x-4 gap-y-1 border-t border-line px-4 py-2 text-xs dark:border-night-line print:hidden">
      <span id={helpId}>Edit to experiment. Changes last until you leave this page.</span>
      <span>{lines.length} lines · {label}</span>
    </div>
    <span role="status" className="sr-only">{message}</span>
  </div>
}
