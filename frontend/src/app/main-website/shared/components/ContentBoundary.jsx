import { Component } from 'react'
import { secondary, panel, muted } from '@/ui/classes'
export default class ContentBoundary extends Component {
  state={failed:false}
  static getDerivedStateFromError(){return {failed:true}}
  render(){return this.state.failed?<div className={`${panel} p-6`} role="alert"><h2 className="text-lg font-semibold">{this.props.title ?? 'This note could not load.'}</h2><p className={`mt-2 ${muted}`}>Check your connection, then reload the page.</p><button type="button" className={`${secondary} mt-4`} onClick={()=>window.location.reload()}>Reload page</button></div>:this.props.children}
}
