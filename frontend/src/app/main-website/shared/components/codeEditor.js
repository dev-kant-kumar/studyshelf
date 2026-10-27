import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { cpp } from '@codemirror/lang-cpp'
import { HighlightStyle, StreamLanguage, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { tags } from '@lezer/highlight'
import { shell } from '@codemirror/legacy-modes/mode/shell'

export function createCodeEditor(parent, code, language, helpId, onChange) {
  const name = language.toLowerCase()
  const syntax = ['c', 'cpp', 'c++'].includes(name) ? cpp() : ['shell', 'bash', 'sh'].includes(name) ? StreamLanguage.define(shell) : []
  return new EditorView({
    parent,
    state: EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        syntax,
        syntaxHighlighting(HighlightStyle.define([
          { tag: tags.keyword, color: 'var(--editor-keyword)' },
          { tag: [tags.typeName, tags.standard(tags.typeName)], color: 'var(--editor-type)' },
          { tag: [tags.string, tags.character, tags.escape], color: 'var(--editor-string)' },
          { tag: [tags.number, tags.bool, tags.null], color: 'var(--editor-number)' },
          { tag: [tags.comment], color: 'var(--editor-muted)', fontStyle: 'italic' },
          { tag: [tags.meta, tags.processingInstruction], color: 'var(--editor-keyword)' },
          { tag: [tags.function(tags.variableName), tags.function(tags.definition(tags.variableName))], color: 'var(--editor-function)' },
          { tag: [tags.operator, tags.punctuation], color: 'var(--editor-fg)' },
        ])),
        indentUnit.of('    '),
        EditorState.tabSize.of(4),
        EditorView.contentAttributes.of({ 'aria-label': `${language} code editor`, 'aria-describedby': helpId, 'spellcheck': 'false' }),
        EditorView.updateListener.of(update => {
          if (update.docChanged) onChange(update.state.doc.toString())
        }),
        EditorView.theme({
          '&': { fontSize: '14px', backgroundColor: 'var(--editor-bg)', color: 'var(--editor-fg)' },
          '&.cm-focused': { outline: '2px solid var(--editor-focus)', outlineOffset: '-2px' },
          '.cm-scroller': { fontFamily: 'Consolas, "Cascadia Code", "SFMono-Regular", monospace', lineHeight: '1.8', overflow: 'auto', maxHeight: '640px' },
          '.cm-content': { padding: '16px 0', caretColor: 'var(--editor-fg)' },
          '.cm-line': { padding: '0 20px 0 12px' },
          '.cm-gutters': { backgroundColor: 'var(--editor-bg)', color: 'var(--editor-muted)', borderRight: '1px solid var(--editor-line)' },
          '.cm-lineNumbers .cm-gutterElement': { minWidth: '40px', padding: '0 10px 0 8px' },
          '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'var(--editor-active)' },
          '.cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection': { backgroundColor: 'var(--editor-selection)' },
          '.cm-cursor': { borderLeftColor: 'var(--editor-fg)' },
          '.cm-matchingBracket': { backgroundColor: 'var(--editor-selection)', outline: '1px solid var(--editor-focus)' },
          '.cm-panels, .cm-tooltip': { backgroundColor: 'var(--editor-toolbar)', color: 'var(--editor-fg)', borderColor: 'var(--editor-line)' },
          '.cm-search input, .cm-search button': { color: 'var(--editor-fg)', background: 'var(--editor-bg)', border: '1px solid var(--editor-line)' },
        }),
      ],
    }),
  })
}
