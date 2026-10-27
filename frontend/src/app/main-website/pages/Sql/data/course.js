import foundations from './foundations.js'
import queries from './queries.js'
import design from './design.js'
import engineering from './engineering.js'
import operations from './operations.js'
import { syntaxLesson, dataAccessLesson } from './reference.js'

export const modules = [
  { id: 'foundations', title: 'Start and query', lessons: [foundations[0], syntaxLesson, ...foundations.slice(1)] },
  { id: 'queries', title: 'Write and combine', lessons: queries },
  { id: 'design', title: 'Model and evolve', lessons: design },
  { id: 'engineering', title: 'Build reliable services', lessons: [...engineering, dataAccessLesson] },
  { id: 'operations', title: 'Test and operate', lessons: operations },
]
export const lessons = modules.flatMap(module => module.lessons.map(lesson => ({ ...lesson, module: module.title })))
export const lessonHref = id => `/developers/sql/${id}`
export function searchSqlLessons(query) {
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return []
  return lessons.filter(lesson => {
    const text = `${lesson.title} ${lesson.summary} ${lesson.sections.map(section => `${section.title} ${section.blocks.map(block => block.text ?? block.title ?? '').join(' ')}`).join(' ')}`.toLowerCase()
    return words.every(word => text.includes(word))
  })
}
export const unit3Lessons = {
  'sql-foundations': 'start', 'basic-sql': 'select', 'advanced-sql': 'joins',
  'database-languages': 'transactions', 'set-operations': 'subqueries-sets',
  'aggregate-functions': 'aggregation', 'null-values': 'nulls', views: 'views-procedures',
  subqueries: 'subqueries-sets', 'integrity-constraints': 'schema-design',
  'sql-constraints': 'schema-design', indexing: 'indexes', cursors: 'views-procedures',
  'stored-procedures': 'views-procedures', triggers: 'views-procedures',
}
