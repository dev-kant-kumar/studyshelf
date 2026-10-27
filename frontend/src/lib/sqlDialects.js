export const defaultSqlDialect = 'postgresql'
export const sqlDialects = [
  { value: 'postgresql', label: 'PostgreSQL', language: 'postgresql' },
  { value: 'oracle', label: 'Oracle', language: 'plsql' },
  { value: 'mysql', label: 'MySQL', language: 'mysql' },
  { value: 'mariadb', label: 'MariaDB', language: 'mariadb' },
  { value: 'sqlite', label: 'SQLite', language: 'sqlite' },
  { value: 'sqlserver', label: 'SQL Server', language: 'mssql' },
]

export function sanitiseSqlDialect(value) {
  return sqlDialects.some(dialect => dialect.value === value) ? value : defaultSqlDialect
}

export function isSqlLanguage(language) {
  return /^(sql|postgresql|postgres|pgsql|oracle|plsql|pl\/sql|mysql|mariadb|mariadb sql|sqlite|mssql|tsql|t-sql|ms sql|sqlserver|text\/x-sql|application\/sql)$/i.test(String(language).trim().replace(/^(?:language|lang)-/i, ''))
}

export function resolveSqlExample(code, variants, dialect) {
  const selected = sqlDialects.find(item => item.value === sanitiseSqlDialect(dialect))
  const variant = variants && Object.hasOwn(variants, selected.value) ? variants[selected.value] : null
  if (variant && typeof variant.code === 'string') {
    return { ...variant, label: selected.label, language: selected.language, available: true }
  }
  return {
    code, label: 'Original SQL', language: 'sql', available: false,
    note: `A ${selected.label} version has not been provided for this example. The original SQL is shown.`,
  }
}
