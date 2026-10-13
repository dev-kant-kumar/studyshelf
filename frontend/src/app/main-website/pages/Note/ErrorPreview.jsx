import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ContentBoundary from '../../shared/components/ContentBoundary'
import { button, container } from '@/ui/classes'

function Failure({ failed }) {
  if (failed) throw new Error('Development-only error boundary verification')
  return <p className="mt-4">Content loaded successfully.</p>
}

export default function ErrorPreview() {
  const { kind } = useParams()
  const [failed, setFailed] = useState(false)
  if (kind === 'app' && failed) throw new Error('Development-only application failure')
  return <div className={`${container} py-10`}>
    <button className={`${button} mb-6`} onClick={() => setFailed(true)}>Trigger loading error</button>
    <ContentBoundary variant={kind === 'page' ? 'page' : 'note'}><Failure failed={failed} /></ContentBoundary>
  </div>
}
