import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import MainWebsiteLayout from './MainWebsiteLayout'
import Loader from './shared/components/Loader'
import ContentBoundary from './shared/components/ContentBoundary'
const ErrorPreview = import.meta.env.DEV ? lazy(() => import('./pages/Note/ErrorPreview')) : null
const ReaderPreview = import.meta.env.DEV ? lazy(() => import('./pages/Note/ReaderPreview')) : null
const Home = lazy(() => import('./pages/Home/Home'))
const Course = lazy(() => import('./pages/Course/Course'))
const Semester = lazy(() => import('./pages/Semester/Semester'))
const Subject = lazy(() => import('./pages/Subject/Subject'))
const Note = lazy(() => import('./pages/Note/Note'))
const Search = lazy(() => import('./pages/Search/Search'))
const Saved = lazy(() => import('./pages/Saved/Saved'))
const Careers = lazy(() => import('./pages/Careers/Careers'))
const Developers = lazy(() => import('./pages/Developers/Developers'))
const NodeRoadmap = lazy(() => import('./pages/Developers/NodeRoadmap.jsx'))
const RoleRoadmap = lazy(() => import('./pages/Developers/RoleRoadmap.jsx'))
const About = lazy(() => import('./pages/About/About'))
const Privacy = lazy(() => import('./pages/Privacy/Privacy'))
const Contact = lazy(() => import('./pages/Contact/Contact'))
const Help = lazy(() => import('./pages/Help/Help'))
const ContentPolicy = lazy(() => import('./pages/ContentPolicy/ContentPolicy'))
const Routine = lazy(() => import('./pages/Routine/Routine.jsx'))
const Professors = lazy(() => import('./pages/Professors/Professors.jsx'))
const Professor = lazy(() => import('./pages/Professors/Professor.jsx'))
const Vbu = lazy(() => import('./pages/Vbu/Vbu'))
const Holidays = lazy(() => import('./pages/Holidays/Holidays.jsx'))
const Updates = lazy(() => import('./pages/Updates/Updates'))
const ErrorPage = lazy(() => import('./ErrorPage'))
function Page({ children }) { const {pathname} = useLocation(); return <ContentBoundary key={pathname} variant="page"><Suspense fallback={<Loader />}>{children}</Suspense></ContentBoundary> }
export default function MainWebsiteRoutes() {
  return <Routes><Route element={<MainWebsiteLayout />}>{import.meta.env.DEV && <Route path="dev/error/:kind" element={<Suspense fallback={<Loader />}><ErrorPreview /></Suspense>} />}{import.meta.env.DEV && <Route path="dev/loader" element={<Loader />} />}{import.meta.env.DEV && <Route path="dev/reader" element={<Page><ReaderPreview /></Page>} />}<Route index element={<Page><Home /></Page>} /><Route path="courses/:course" element={<Page><Course /></Page>} /><Route path="courses/:course/semesters/:semester" element={<Page><Semester /></Page>} /><Route path="courses/:course/semesters/:semester/subjects/:subject" element={<Page><Subject /></Page>} /><Route path="notes/:slug" element={<Page><Note /></Page>} /><Route path="search" element={<Page><Search /></Page>} /><Route path="saved" element={<Page><Saved /></Page>} /><Route path="routine" element={<Page><Routine /></Page>} /><Route path="holidays" element={<Page><Holidays /></Page>} /><Route path="professors" element={<Page><Professors /></Page>} /><Route path="professors/:professor" element={<Page><Professor /></Page>} /><Route path="vbu" element={<Page><Vbu /></Page>} /><Route path="careers" element={<Page><Careers /></Page>} /><Route path="developers/nodejs-roadmap" element={<Page><NodeRoadmap /></Page>} /><Route path="developers/:roadmap" element={<Page><RoleRoadmap /></Page>} /><Route path="developers" element={<Page><Developers /></Page>} /><Route path="about" element={<Page><About /></Page>} /><Route path="privacy" element={<Page><Privacy /></Page>} /><Route path="contact" element={<Page><Contact /></Page>} /><Route path="help" element={<Page><Help /></Page>} /><Route path="content-policy" element={<Page><ContentPolicy /></Page>} /><Route path="updates" element={<Page><Updates /></Page>} /><Route path="*" element={<Page><ErrorPage /></Page>} /></Route></Routes>
}
