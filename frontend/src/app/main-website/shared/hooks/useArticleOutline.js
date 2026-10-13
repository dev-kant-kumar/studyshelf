import { useEffect, useState } from 'react'
export default function useArticleOutline(article, slug) {
  const [headings,setHeadings]=useState([]), [active,setActive]=useState(''), [minutes,setMinutes]=useState(null)
  useEffect(()=>{
    const element=article.current
    if(!element)return
    function scan(){
      const seen=new Set()
      const items=[...element.querySelectorAll('h2,h3')].map((heading,index)=>{
        const base=heading.id || `section-${heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || index}`
        let id=base, suffix=2
        while(seen.has(id))id=`${base}-${suffix++}`
        seen.add(id);heading.id=id
        return {id,text:heading.textContent,level:Number(heading.tagName.slice(1))}
      })
      setHeadings(previous=>JSON.stringify(previous)===JSON.stringify(items)?previous:items)
      const body=element.cloneNode(true)
      body.querySelectorAll('[role="status"],[role="alert"],button').forEach(node=>node.remove())
      const words=body.textContent.trim().split(/\s+/).filter(Boolean).length
      setMinutes(words>0?Math.max(1,Math.ceil(words/200)):null)
    }
    const frame=requestAnimationFrame(scan), observer=new MutationObserver(scan)
    observer.observe(element,{childList:true,subtree:true,characterData:true})
    return ()=>{cancelAnimationFrame(frame);observer.disconnect()}
  },[article,slug])
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{
      const visible=entries.filter(entry=>entry.isIntersecting)
      if(visible.length)setActive(visible[0].target.id)
    },{rootMargin:'-96px 0px -65% 0px'})
    headings.forEach(heading=>{const element=document.getElementById(heading.id);if(element)observer.observe(element)})
    return ()=>observer.disconnect()
  },[headings])
  return {headings,active,minutes}
}
