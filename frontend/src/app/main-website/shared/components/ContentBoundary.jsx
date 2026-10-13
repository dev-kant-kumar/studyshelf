import { Component } from 'react'
import ErrorState from './ErrorState'
import DocumentHead from './DocumentHead'
export default class ContentBoundary extends Component {
  state={failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  render() {
    if (!this.state.failed) return this.props.children
    const variant = this.props.variant ?? 'note'
    const content = <ErrorState variant={variant} title={this.props.title} />
    if (variant === 'note') return content
    return <>
      <DocumentHead title="Page could not load" description="Return to the Study Shelf library or reload the page to continue learning." path={typeof window === 'undefined' ? '/' : window.location.pathname} noindex />
      {variant === 'app' ? <main id="main-content" className="flex min-h-dvh items-center bg-canvas font-sans text-ink dark:bg-night-canvas dark:text-night-ink">{content}</main> : content}
    </>
  }
}
