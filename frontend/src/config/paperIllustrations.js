import illustrations from './illustrations.json'
export function getPaperIllustration(courseId, semesterId, paperId) {
  const name = `${courseId}-${semesterId}-${paperId}`
  return illustrations[name] ? name : undefined
}
