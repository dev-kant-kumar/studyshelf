import test from 'node:test'
import assert from 'node:assert/strict'
import { classHighlighter, highlightTree } from '@lezer/highlight'
import { editorLanguages, resolveEditorLanguage } from '../src/app/main-website/shared/components/editorLanguages.js'

test('code labels, extensions, filenames, and MIME types resolve to the appropriate grammar', () => {
  const cases = {
    js: 'JavaScript', ' JavaScript ': 'JavaScript', 'language-js': 'JavaScript',
    jsx: 'JSX', ts: 'TypeScript', typescriptreact: 'TSX',
    py: 'Python', python3: 'Python', 'example.py': 'Python',
    c: 'C', cpp: 'C++', 'c++': 'C++', cs: 'C#', csharp: 'C#',
    java: 'Java', go: 'Go', rs: 'Rust', php: 'PHP', rb: 'Ruby',
    sql: 'SQL', postgres: 'PostgreSQL', mysql: 'MySQL', sqlite: 'SQLite',
    bash: 'Shell', sh: 'Shell', ps1: 'PowerShell', Dockerfile: 'Dockerfile',
    html: 'HTML', css: 'CSS', json: 'JSON', yml: 'YAML', md: 'Markdown',
    'application/json': 'JSON', 'text/html': 'HTML',
  }
  for (const [label, name] of Object.entries(cases)) {
    assert.equal(resolveEditorLanguage(label)?.name, name, label)
  }
  for (const label of ['', 'text', 'text/plain', 'plaintext', 'Pseudocode', 'Performance model', 'unrecognised language', 'constructor', '__proto__', null]) {
    assert.equal(resolveEditorLanguage(label), null, String(label))
  }
})

test('every language advertised by the catalogue can load its installed grammar', async () => {
  for (const description of editorLanguages) {
    const support = await description.load()
    assert.ok(support.language.parser, description.name)
    assert.equal(resolveEditorLanguage(description.name), description)
  }
})

test('representative languages produce syntax tokens, including SQL keywords and literals', async () => {
  const samples = {
    sql: "SELECT 'Asha', 82 FROM Student; -- result\n",
    c: 'int main(void) { return 0; }',
    python: 'def greet():\n    return "hello"\n',
    javascript: 'const count = 42; // example\n',
    java: 'public class Example { int count = 42; }',
    html: '<div class="example">Hello</div>',
    css: '.example { color: red; }',
    json: '{"count": 42}',
    bash: 'echo "hello" # greeting\n',
    tsx: 'const view = <div>Hello</div>;',
  }
  for (const [label, code] of Object.entries(samples)) {
    const support = await resolveEditorLanguage(label).load()
    const tokens = []
    highlightTree(support.language.parser.parse(code), classHighlighter, (from, to, classes) => {
      tokens.push({ text: code.slice(from, to), classes })
    })
    assert.ok(tokens.length > 0, label)
    if (label === 'sql') {
      for (const text of ['SELECT', "'Asha'", '82']) {
        assert.ok(tokens.some(token => token.text === text), `SQL highlights ${text}`)
      }
    }
  }
})
