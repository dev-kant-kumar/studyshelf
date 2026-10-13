import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import CatalogueLayout from './layouts/CatalogueLayout'
import DocumentHead from './shared/components/DocumentHead'
import { button, secondary, muted, eyebrow } from '@/ui/classes'
export default function ErrorPage() { const {pathname}=useLocation(); return <CatalogueLayout><DocumentHead title="Page not found" path={pathname} noindex /><div className="py-12 text-center sm:py-20"><p className={eyebrow}>404 / Page not found</p><h1 className="mt-4 font-display text-3xl font-medium sm:text-4xl" tabIndex={-1}>This shelf doesn’t exist.</h1><p className={`mx-auto mt-5 max-w-md text-lg ${muted}`}>The link may have changed, or the material hasn’t been published. Let’s find your way back.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link className={button} to="/">Back to the library</Link><Link className={secondary} to="/search">Search notes</Link></div></div></CatalogueLayout> }
