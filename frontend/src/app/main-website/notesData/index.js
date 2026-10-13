import { buildCatalogue } from './buildCatalogue'
const syllabuses = import.meta.glob('./*/syllabus.js', { eager: true })
const content = import.meta.glob('./*/semesters/*/*/*/*/main.jsx')
export const catalogue = buildCatalogue(syllabuses, content)
export const courses = catalogue.courses
export const notes = catalogue.notes
export const getCourse = id => courses.find(course => course.id === id)
export const getSemester = (courseId, semesterId) => getCourse(courseId)?.semesters.find(semester => semester.id === semesterId)
export const getPaper = (courseId, semesterId, paperId) => getSemester(courseId, semesterId)?.papers.find(paper => paper.id === paperId)
export const getNote = slug => notes.find(note => note.slug === slug)
export const searchNotes = query => {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  return terms.length ? notes.filter(note => terms.every(term => `${note.title} ${note.summary} ${note.paperTitle} ${note.courseName} ${(note.tags ?? []).join(' ')}`.toLowerCase().includes(term))) : []
}
