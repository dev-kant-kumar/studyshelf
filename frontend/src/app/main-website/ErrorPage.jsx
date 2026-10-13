import { useLocation } from 'react-router-dom'
import CatalogueLayout from './layouts/CatalogueLayout'
import DocumentHead from './shared/components/DocumentHead'
import ErrorState from './shared/components/ErrorState'
export default function ErrorPage() {
  const { pathname } = useLocation()
  return <CatalogueLayout><DocumentHead title="Page not found" description="This Study Shelf page could not be found. Search study notes or return to the library." path={pathname} noindex /><ErrorState variant="missing" /></CatalogueLayout>
}
