import { LanguageDescription } from '@codemirror/language'
import { languages } from '@codemirror/language-data'

const aliases = {
  bash: 'shell', zsh: 'shell', sh: 'shell', shellscript: 'shell', console: 'shell',
  nodejs: 'javascript', 'node.js': 'javascript', javascriptreact: 'jsx',
  typescriptreact: 'tsx', python3: 'python', py3: 'python',
  postgres: 'postgresql', pgsql: 'postgresql', 'pl/sql': 'plsql',
  tsql: 'ms sql', mssql: 'ms sql', mariadb: 'mariadb sql',
  csharp: 'c#', 'c-sharp': 'c#', cplusplus: 'c++',
  'text/javascript': 'javascript', 'application/javascript': 'javascript',
  'text/typescript': 'typescript', 'application/typescript': 'typescript',
  'text/html': 'html', 'text/css': 'css', 'application/json': 'json',
  'application/xml': 'xml', 'text/xml': 'xml', 'text/x-python': 'python',
  'text/x-csrc': 'c', 'text/x-c++src': 'c++', 'text/x-java': 'java',
  'text/x-sql': 'sql', 'application/sql': 'sql',
}
const plainText = new Set(['', 'text', 'txt', 'plain', 'plaintext', 'text/plain', 'none'])

export function resolveEditorLanguage(label) {
  const original = String(label ?? '').trim()
  const name = original.toLowerCase().replace(/^(?:language|lang)-/, '')
  if (plainText.has(name)) return null
  const canonical = Object.hasOwn(aliases, name) ? aliases[name] : name
  return LanguageDescription.matchLanguageName(languages, canonical, false)
    || LanguageDescription.matchFilename(languages, original)
    || LanguageDescription.matchFilename(languages, `example.${canonical}`)
}

export { languages as editorLanguages }
