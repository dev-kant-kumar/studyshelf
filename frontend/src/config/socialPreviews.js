const previews = {
  site: { path: '/social-preview-site.png', alt: 'Study Shelf - BCA and MCA study resources and developer learning' },
  mca: { path: '/social-preview-vbu-mca.png', alt: 'Study Shelf - VBU MCA study notes, syllabus and revision' },
  bca: { path: '/social-preview-bca.png', alt: 'Study Shelf - BCA learning and computing concepts, course material coming soon' },
  developers: { path: '/social-preview-developers.png', alt: 'Developer Shelf - roadmaps, projects and practical development' },
}

export function getSocialPreview(path = '/', article = false) {
  const pathname = path.split(/[?#]/)[0]
  if (/^\/developers(?:\/|$)/.test(pathname)) return previews.developers
  for (const course of ['mca', 'bca']) {
    if (new RegExp(`^/courses/${course}(?:/|$)`).test(pathname)
      || new RegExp(`^/notes/${course}-`).test(pathname)
      || article?.courseId === course) return previews[course]
  }
  return previews.site
}
