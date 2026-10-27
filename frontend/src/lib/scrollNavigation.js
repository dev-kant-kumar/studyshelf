export function validScrollPosition(value) {
  return value && Number.isFinite(value.y) && value.y >= 0
}

// A document reload applies only to its initial router entry, never to later links.
export function chooseScrollTarget({ initial, reload, historyTraversal, navigationType, pathnameChanged, hash, entryPosition, readingPosition }) {
  if (initial && reload && validScrollPosition(readingPosition) && readingPosition.hash === hash) {
    return { mode: 'position', position: readingPosition }
  }
  if (navigationType === 'POP' && (!initial || reload || historyTraversal) && validScrollPosition(entryPosition)) {
    return { mode: 'position', position: entryPosition }
  }
  if (hash) return { mode: 'anchor' }
  if (!initial && !pathnameChanged) return { mode: 'preserve' }
  return { mode: 'top' }
}
