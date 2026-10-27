import Illustration from '../../shared/components/Illustration'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import PageIntro from '../../shared/components/PageIntro'
import DocumentHead from '../../shared/components/DocumentHead'
import Dropdown from '@/ui/Dropdown'
import { site } from '@/config/site'
import { panel, muted, button, link } from '@/ui/classes'
const options=[{value:'correction',label:'Report a correction'},{value:'request',label:'Request a topic'},{value:'support',label:'Reading or website help'},{value:'sharing',label:'Sharing or permissions'},{value:'general',label:'General question'}]
const field='mt-2 min-h-11 w-full rounded-lg border border-outline bg-canvas px-3 py-2.5 text-base outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand dark:border-night-outline dark:bg-night-canvas dark:focus-visible:border-night-brand dark:focus-visible:ring-night-brand'
export default function Contact(){
  const [params]=useSearchParams()
  const [type,setType]=useState('correction'),[page,setPage]=useState(params.get('page')??''),[subject,setSubject]=useState(''),[message,setMessage]=useState(''),[status,setStatus]=useState(''),[name,setName]=useState(''),[email,setEmail]=useState('')
  function submit(event){
    event.preventDefault()
    if (![name,email,subject,message].every(value=>value.trim())) { setStatus('Please complete your name, email, subject, and message.'); return }
    setStatus('Message submission is not available yet. Your message has not been sent. Please email Study Shelf directly for now.')
  }
  return <CatalogueLayout><DocumentHead title="Contact Study Shelf" description="Contact Study Shelf about note corrections, subject requests, reading help, or sharing questions." path="/contact"/><PageIntro eyebrow="Contact Study Shelf" title="Help make the next topic clearer." description="Found a mistake, need help reading, or want a topic covered? Tell us what would help."/>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className={`${panel} p-4 sm:p-8`}><h2 className="text-2xl font-semibold">Write your message</h2><p className={`mt-3 leading-7 ${muted}`}>For a correction, include the section heading, what seems wrong, and a suggested correction or source. For a topic request, include your course, semester, subject, and unit.</p>
        <noscript><p className="mt-6">Enable JavaScript to use this form, or email Study Shelf using the address shown.</p></noscript><form data-interactive-form onSubmit={submit} className="mt-6 space-y-5"><div className="grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"><label className="block font-semibold" htmlFor="contact-name">Name<input id="contact-name" name="name" autoComplete="name" placeholder="Your full name" required maxLength={100} value={name} onChange={event=>setName(event.target.value)} className={field}/></label><label className="block font-semibold" htmlFor="contact-email">Email<input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254} value={email} onChange={event=>setEmail(event.target.value)} className={field}/></label></div><input type="hidden" name="category" value={type}/><div><label className="mb-2 block font-semibold" htmlFor="contact-reason">What is this about?</label><Dropdown id="contact-reason" label="What is this about?" options={options} value={type} onChange={setType}/></div>
          <label className="block font-semibold" htmlFor="contact-subject">Subject<input id="contact-subject" name="subject" required maxLength={150} value={subject} onChange={event=>setSubject(event.target.value)} className={field} placeholder="A short description of your question"/></label>
          <label className="block font-semibold" htmlFor="contact-page">Chapter or page link <span className={`font-normal ${muted}`}>(optional)</span><input id="contact-page" name="pageUrl" type="url" maxLength={1500} value={page} onChange={event=>setPage(event.target.value)} className={field} placeholder="https://…"/></label>
          <label className="block font-semibold" htmlFor="contact-message">Message<textarea id="contact-message" name="message" required maxLength={5000} rows={7} value={message} onChange={event=>setMessage(event.target.value)} className={`${field} resize-y`} placeholder="Explain the issue or what you would like to learn."/></label>
          <p id="contact-availability" className={`text-sm leading-6 ${muted}`}>Form submission is coming soon. For now, email Study Shelf using the address alongside this form. Fields are kept only while this page is open.</p>
          <button type="submit" className={button} aria-describedby="contact-availability">Send message</button><p role="status" className={`text-sm ${muted}`}>{status}</p>
        </form>
      </section>
      <aside className="space-y-5"><section className={`${panel} p-6`}><Illustration name="contact-message" sizes="160px" className="mx-auto w-32 sm:w-40"/><h2 className="mt-4 text-xl font-semibold">Study Shelf support</h2>{site.contactEmail?<a className={`${link} mt-3 block break-all`} href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>:<p className={`mt-3 leading-7 ${muted}`}>Our dedicated contact address will appear here when it is available.</p>}<p className={`mt-4 text-sm leading-6 ${muted}`}>Questions, corrections, and requests are welcome. Include enough detail to identify the chapter or problem.</p></section><section className={`${panel} p-6`}><h2 className="text-xl font-semibold">Need a quick answer?</h2><p className={`mt-3 leading-7 ${muted}`}>Find help with saved notes, printing, reading controls, syllabus coverage, and practice questions.</p><Link className={`${link} mt-4 inline-flex items-center gap-2`} to="/help">Help and FAQs<ArrowRight size={17} aria-hidden="true"/></Link></section><Link className={`${link} block text-sm`} to="/content-policy">How we handle sources and corrections</Link></aside>
    </div>
  </CatalogueLayout>
}
