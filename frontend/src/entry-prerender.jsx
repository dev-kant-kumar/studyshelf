import { createElement } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { MemoryRouter } from 'react-router-dom'
import MainWebsite from './app/main-website/MainWebsite'
import { courses, notes } from './app/main-website/notesData'
import { publicPages } from './config/publicPages'
import { site } from './config/site'
export { site }
export const paths = ['/', ...publicPages.map(page => page.path), '/search', '/saved', ...courses.flatMap(course => [course.href, ...course.semesters.flatMap(semester => [semester.href, ...semester.papers.map(paper => paper.href)])]), ...notes.map(note => note.href)]
export const noteDates = Object.fromEntries(notes.filter(note => note.updatedAt).map(note => [note.href, note.updatedAt]))
export async function render(path) {
  let failure
  const { prelude } = await prerenderToNodeStream(createElement(MemoryRouter, { initialEntries: [path] }, createElement(MainWebsite)), { onError(error) { failure = error } })
  if (failure) throw failure
  prelude.setEncoding('utf8')
  let html = ''
  for await (const chunk of prelude) html += chunk
  return html
}
