import { Bookmark } from 'lucide-react'
import { getNote } from '../../notesData'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import PageIntro from '../../shared/components/PageIntro'
import NoteLinks from '../../shared/components/NoteLinks'
import EmptyState from '../../shared/components/EmptyState'
import DocumentHead from '../../shared/components/DocumentHead'
import { usePreferences } from '../../shared/hooks/preferencesContext'
import { secondary, muted, panel } from '@/ui/classes'
export default function Saved() {
  const { preferences, toggleSaved } = usePreferences(), available = preferences.saved.map(getNote).filter(Boolean), missing = preferences.saved.filter(id => !getNote(id))
  return <CatalogueLayout><DocumentHead title="Saved notes" path="/saved" noindex /><PageIntro eyebrow="Your reading shelf" title="Keep the useful ones close." description="Saved on this device, in this browser. No account needed." />{preferences.saved.length===0 ? <EmptyState title="Your saved shelf is empty." description="When notes are published, use the bookmark button to keep them here for your next study session." href="/courses/mca" action="Browse the syllabus" icon={Bookmark} /> : <>{available.length>0 && <NoteLinks notes={available} />}{missing.map((id,index) => <div key={id} className={`${panel} mb-4 flex flex-wrap items-center justify-between gap-4 p-5`}><p className={muted}>A saved note is no longer available.</p><button className={secondary} type="button" aria-label={`Remove unavailable saved note ${index+1}`} onClick={()=>toggleSaved(id)}>Remove from saved</button></div>)}</>}<p className={`mt-6 text-sm ${muted}`}>Clearing this site’s browser data also clears saved notes and reading preferences.</p></CatalogueLayout>
}
