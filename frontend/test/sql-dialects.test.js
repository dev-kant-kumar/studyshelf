import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { defaultSqlDialect, isSqlLanguage, resolveSqlExample, sanitiseSqlDialect, sqlDialects } from '../src/lib/sqlDialects.js'
import { sanitisePreferences } from '../src/lib/preferences.js'
import { resolveEditorLanguage } from '../src/app/main-website/shared/components/editorLanguages.js'

const unit = new URL('../src/app/main-website/notesData/MCA/semesters/sem1/paper4/unit1/', import.meta.url)
const examples = readdirSync(unit, { withFileTypes: true }).filter(entry => entry.isDirectory()).flatMap(entry => {
  const path = new URL(`${entry.name}/chapter.json`, unit)
  if (!existsSync(path)) return []
  return JSON.parse(readFileSync(path, 'utf8')).sections.flatMap(section => [section, ...(section.subsections || [])]).filter(section => section.code)
})

test('SQL selection upgrades existing preferences and recognises dialect labels', () => {
  assert.equal(defaultSqlDialect, 'postgresql')
  for (const value of [null, {}, { sqlDialect: 'invalid' }]) {
    assert.equal(sanitisePreferences(value).sqlDialect, 'postgresql')
  }
  for (const dialect of sqlDialects) {
    assert.equal(sanitisePreferences({ sqlDialect: dialect.value }).sqlDialect, dialect.value)
    assert.ok(resolveEditorLanguage(dialect.language), dialect.value)
  }
  for (const label of ['SQL', 'language-sql', 'postgresql', 'oracle', 'pl/sql', 'mariadb', 'sqlite', 'mssql', 'application/sql']) assert.ok(isSqlLanguage(label), label)
  for (const label of ['c', 'javascript', 'text', 'pseudocode']) assert.equal(isSqlLanguage(label), false)
  assert.equal(sanitiseSqlDialect('__proto__'), 'postgresql')
})

test('every published SQL example has explicit code for each selectable DBMS', () => {
  assert.equal(examples.length, 8)
  for (const example of examples) {
    assert.equal(example.code, example.sqlVariants.postgresql.code, example.title)
    for (const dialect of sqlDialects) {
      const result = resolveSqlExample(example.code, example.sqlVariants, dialect.value)
      assert.equal(result.available, true, `${example.title}: ${dialect.value}`)
      assert.ok(result.code && result.note)
      assert.equal(result.language, dialect.language)
      if (result.download) {
        const path = new URL('../public' + result.download.href, import.meta.url)
        assert.ok(readFileSync(path, 'utf8').replaceAll('\r\n', '\n').includes(result.code), result.download.href)
      }
    }
  }
})

test('an unauthored variant is identified as original SQL instead of being falsely translated', () => {
  const original = "SELECT 'BEGIN; AS example' FROM demo;"
  const result = resolveSqlExample(original, null, 'oracle')
  assert.equal(result.code, original)
  assert.equal(result.language, 'sql')
  assert.equal(result.available, false)
  assert.match(result.note, /Oracle.*not been provided/)
})

test('Oracle, MySQL, and SQL Server examples preserve critical dialect differences', () => {
  for (const example of examples) {
    const variants = example.sqlVariants
    assert.doesNotMatch(variants.oracle.code, /\b(?:FROM|JOIN)\s+\w+\s+AS\b/i)
    if (example.code.includes('CREATE TABLE Enrolment')) {
      for (const dialect of ['mysql', 'mariadb']) {
        assert.match(variants[dialect].code, /ENGINE=InnoDB/)
        assert.equal((variants[dialect].code.match(/FOREIGN KEY/g) || []).length, 2)
      }
    }
    if (example.code.startsWith('EXPLAIN')) {
      assert.match(variants.oracle.code, /^EXPLAIN PLAN FOR/)
      assert.match(variants.oracle.code, /DBMS_XPLAN\.DISPLAY/)
      assert.match(variants.sqlite.code, /^EXPLAIN QUERY PLAN/)
      assert.match(variants.sqlserver.code, /^SET SHOWPLAN_TEXT ON;\nGO\n/)
    }
    if (example.code.includes('CREATE VIEW MCAStudents')) {
      assert.match(variants.sqlserver.code, /\nGO\n\nCREATE VIEW/)
      assert.doesNotMatch(variants.oracle.code, /VALUES\s*\([^;]+\),\s*\(/)
    }
  }
})
