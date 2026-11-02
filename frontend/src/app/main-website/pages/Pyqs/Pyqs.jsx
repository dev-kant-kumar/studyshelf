import { useState, useMemo, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import {
  FileText,
  Calendar,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  Download,
  Filter,
  CheckCircle2,
  ExternalLink,
  Layers,
  HelpCircle,
  Eye,
  X,
  Maximize2,
} from 'lucide-react'
import CatalogueLayout from '../../layouts/CatalogueLayout'
import Breadcrumbs from '../../shared/components/Breadcrumbs'
import PageIntro from '../../shared/components/PageIntro'
import DocumentHead from '../../shared/components/DocumentHead'
import StructuredData from '../../shared/components/StructuredData'
import EmptyState from '../../shared/components/EmptyState'
import { getCourse, courses } from '../../notesData'
import { pyqPapers } from '../../notesData/pyqsData'
import { site } from '@/config/site'
import { panel, focus, muted, eyebrow, button, secondary } from '@/ui/classes'

function parseMarkdownTable(text) {
  if (!text || !text.includes('|')) return null
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const tableLines = lines.filter(l => l.startsWith('|') && l.endsWith('|'))
  if (tableLines.length < 2) return null

  const tableStartIndex = lines.findIndex(l => l.startsWith('|') && l.endsWith('|'))
  const tableEndIndex = lines.findLastIndex(l => l.startsWith('|') && l.endsWith('|'))

  const beforeText = lines.slice(0, tableStartIndex).join('\n')
  const afterText = lines.slice(tableEndIndex + 1).join('\n')

  const headers = tableLines[0].split('|').slice(1, -1).map(c => c.trim())
  const rows = tableLines.slice(2).map(line =>
    line.split('|').slice(1, -1).map(c => c.trim())
  )

  return { beforeText, headers, rows, afterText }
}

function QuestionTable({ headers, rows }) {
  if (!headers || !rows || rows.length === 0) return null
  return (
    <div className="my-3 overflow-x-auto rounded-lg border border-line bg-surface dark:border-night-line dark:bg-night-surface">
      <table className="w-full min-w-[280px] border-collapse text-left text-xs">
        <thead className="border-b border-line bg-soft/70 font-semibold text-ink dark:border-night-line dark:bg-night-soft/50 dark:text-night-ink">
          <tr>
            {headers.map((h, i) => (
              <th key={i} scope="col" className="px-3 py-2 text-xs font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line/60 dark:divide-night-line/60">
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-soft/40 dark:hover:bg-night-soft/20">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="px-3 py-2 font-mono text-xs text-subtle dark:text-night-subtle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function QuestionBody({ question }) {
  if (question.table) {
    return (
      <div className="space-y-2">
        <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-ink dark:text-night-ink">
          {question.text}
        </p>
        <QuestionTable headers={question.table.headers} rows={question.table.rows} />
      </div>
    )
  }

  const parsed = parseMarkdownTable(question.text)
  if (parsed) {
    return (
      <div className="space-y-2">
        {parsed.beforeText && (
          <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-ink dark:text-night-ink">
            {parsed.beforeText}
          </p>
        )}
        <QuestionTable headers={parsed.headers} rows={parsed.rows} />
        {parsed.afterText && (
          <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-ink dark:text-night-ink">
            {parsed.afterText}
          </p>
        )}
      </div>
    )
  }

  return (
    <p className="whitespace-pre-line text-sm font-medium leading-relaxed text-ink dark:text-night-ink">
      {question.text}
    </p>
  )
}

function PdfModalViewer({ pdf, onClose }) {
  if (!pdf) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`PDF Viewer: ${pdf.title}`}
    >
      <div className="relative flex h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-2xl dark:border-night-line dark:bg-night-surface">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-line bg-soft/80 px-4 py-3 dark:border-night-line dark:bg-night-soft/60">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-selected font-mono text-xs font-bold text-brand dark:bg-night-selected dark:text-night-brand">
              PDF
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-bold text-ink dark:text-night-ink">
                {pdf.title}
              </h3>
              <p className="truncate text-[11px] text-subtle dark:text-night-subtle">
                {pdf.subtitle || 'Verified Original Exam Paper Archive'}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-medium text-subtle hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:text-night-ink"
              title="Open in new window"
            >
              <ExternalLink size={13} aria-hidden="true" />
              <span className="hidden sm:inline">New Tab</span>
            </a>

            <a
              href={pdf.url}
              download
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1 text-xs font-semibold text-on-brand hover:opacity-90 dark:bg-night-brand dark:text-night-on-brand"
            >
              <Download size={13} aria-hidden="true" />
              <span>Download</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-line p-1 text-subtle hover:bg-soft hover:text-ink dark:border-night-line dark:text-night-subtle dark:hover:bg-night-soft dark:hover:text-night-ink"
              aria-label="Close PDF Viewer"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mobile notice */}
        <div className="flex items-center justify-between border-b border-line bg-amber-50/70 px-4 py-1.5 text-[11px] text-amber-900 sm:hidden dark:border-night-line dark:bg-amber-950/30 dark:text-amber-200">
          <span>Best viewed on desktop or in a separate tab.</span>
          <a
            href={pdf.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            Open Fullscreen
          </a>
        </div>

        {/* PDF Frame / Object */}
        <div className="relative flex-1 bg-zinc-900">
          <object
            data={`${pdf.url}#toolbar=1&navpanes=0`}
            type="application/pdf"
            className="h-full w-full"
          >
            <div className="flex h-full flex-col items-center justify-center p-6 text-center text-white">
              <FileText size={40} className="mb-3 text-white/60" />
              <p className="text-sm font-semibold">
                Unable to render embedded PDF preview directly on this browser.
              </p>
              <p className="mt-1 text-xs text-white/70">
                You can download the PDF or open it in a new window.
              </p>
              <div className="mt-4 flex gap-3">
                <a
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-white/30"
                >
                  Open in New Window
                </a>
                <a
                  href={pdf.url}
                  download
                  className="rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-on-brand hover:opacity-90 dark:bg-night-brand dark:text-night-on-brand"
                >
                  Download PDF
                </a>
              </div>
            </div>
          </object>
        </div>
      </div>
    </div>
  )
}

export default function Pyqs() {
  const { course: routeCourse } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  // Selected course: route param or query param or default to BCA
  const activeCourseId = (routeCourse || searchParams.get('course') || 'bca').toLowerCase()
  const currentCourse = getCourse(activeCourseId) || getCourse('bca')

  const selectedSemester = searchParams.get('semester') || 'all'
  const selectedYear = searchParams.get('year') || 'all'
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaq, setOpenFaq] = useState(null)
  const [activePdf, setActivePdf] = useState(null)
  const [paperViewMode, setPaperViewMode] = useState({}) // { [paperId]: 'questions' | 'pdf' }
  const [expandedPapers, setExpandedPapers] = useState(() => {
    // Expand the first paper by default
    const first = pyqPapers.find(p => p.courseId === activeCourseId)
    return first ? [first.id] : []
  })

  // Keyboard shortcut: close active PDF modal on Escape
  useEffect(() => {
    if (!activePdf) return
    const onKeyDown = e => {
      if (e.key === 'Escape') setActivePdf(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activePdf])

  // Available semesters for this course
  const courseSemesters = currentCourse?.semesters || []

  // Filter papers for current course
  const coursePapers = useMemo(() => {
    return pyqPapers.filter(paper => paper.courseId === activeCourseId)
  }, [activeCourseId])

  // Extract distinct years available
  const availableYears = useMemo(() => {
    const years = [...new Set(coursePapers.map(p => p.year))]
    return years.sort((a, b) => b - a)
  }, [coursePapers])

  // Apply filters
  const filteredPapers = useMemo(() => {
    return coursePapers.filter(paper => {
      if (selectedSemester !== 'all' && paper.semesterId !== selectedSemester) {
        return false
      }
      if (selectedYear !== 'all' && paper.year.toString() !== selectedYear) {
        return false
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchTitle = paper.paperTitle.toLowerCase().includes(query)
        const matchCode = paper.paperCode.toLowerCase().includes(query)
        const matchQuestions = paper.questions.some(q => {
          if (q.text.toLowerCase().includes(query)) return true
          if (q.subQuestions?.some(sub => sub.text.toLowerCase().includes(query))) return true
          return false
        })
        if (!matchTitle && !matchCode && !matchQuestions) return false
      }
      return true
    })
  }, [coursePapers, selectedSemester, selectedYear, searchQuery])

  // Update query params helper
  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value === 'all' || !value) {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setSearchParams(next, { replace: true })
  }

  const togglePaper = paperId => {
    setExpandedPapers(prev =>
      prev.includes(paperId) ? prev.filter(id => id !== paperId) : [...prev, paperId]
    )
  }

  const expandAll = () => setExpandedPapers(filteredPapers.map(p => p.id))
  const collapseAll = () => setExpandedPapers([])

  const isBca = activeCourseId === 'bca'
  const isMca = activeCourseId === 'mca'

  // Dynamic canonical path and SEO details targeting student search queries
  const pagePath = routeCourse ? `/courses/${activeCourseId}/pyqs` : '/pyqs'
  const pageTitle = routeCourse
    ? isMca
      ? 'VBU MCA Previous Year Question Papers (PYQ) - All Semesters'
      : 'VBU BCA Previous Year Question Papers (PYQ) - Exam Archive'
    : 'VBU Previous Year Question Papers (PYQ) - BCA & MCA Archive'

  const pageDescription = routeCourse
    ? isMca
      ? 'Download and practice verified VBU MCA previous year question papers (PYQs). Features 114+ semester questions across Fundamentals of Computers, Data Structures, Operating Systems, DBMS, COA, and MIS.'
      : 'Browse verified VBU BCA previous year question papers (PYQs). Practice semester exam questions, view marks weighting, and prepare for Vinoba Bhave University examinations.'
    : 'Official Vinoba Bhave University (VBU) previous year question papers archive for BCA and MCA students. Browse semester exam papers, question breakdowns, and marks scheme.'

  const breadcrumbsTrail = routeCourse
    ? [{ label: currentCourse.name, href: currentCourse.href }, { label: 'Previous Year Questions' }]
    : [{ label: 'Previous Year Questions' }]

  // Comprehensive FAQs for on-page SEO and Google Rich Results (FAQPage Schema)
  const faqs = useMemo(
    () => [
      {
        id: 'faq-papers-list',
        question: `Where can I find VBU ${currentCourse.name} previous year question papers?`,
        answer: isMca
          ? 'StudyShelf provides verified, transcribed VBU MCA Semester 1 question papers covering Fundamentals of Computers (MCA C1001), Data Structures through C (MCA C1002), Operating System Concepts (MCA C1003), Database Management System (MCA C1004), Computer Organization & Architecture (MCA C1005), and Management Information System (MCA C1006).'
          : 'StudyShelf covers VBU BCA previous year question papers across foundational and core theory modules including Business Communications (BCA F1001), Programming in C (BCA C1002), and related semester modules matching the VBU CBCS syllabus.',
      },
      {
        id: 'faq-marks-scheme',
        question: `What is the examination pattern and marks distribution for VBU ${currentCourse.name}?`,
        answer: isMca
          ? 'Each end-semester theory examination carries 70 marks and a duration of 3 hours. It is divided into two sections: Group A has 8 long-answer questions (candidates answer any four for 10 marks each = 40 marks), and Group B has 10 compulsory brief questions (3 marks each = 30 marks). The remaining 30 marks are evaluated through continuous internal assessments and practicals.'
          : 'VBU BCA end-semester examinations carry 80 marks with 3 hours duration. Question 1 is compulsory, followed by options to answer any four remaining questions from the paper (16 marks each = 64 marks + 16 marks compulsory = 80 marks).',
      },
      {
        id: 'faq-cbcs-compliance',
        question: 'Are these question papers aligned with the official VBU CBCS syllabus?',
        answer:
          'Yes. All question papers in this archive follow the Choice Based Credit System (CBCS) curriculum implemented by Vinoba Bhave University, Hazaribag. Every question paper is tagged with its syllabus paper code and cross-linked to topic study notes on StudyShelf.',
      },
      {
        id: 'faq-preparation-strategy',
        question: `How should students practice with these ${currentCourse.name} PYQs?`,
        answer:
          'Students should time their answers to match real exam conditions: allocate approximately 35 minutes for each 10-mark long answer and 5 minutes for each 3-mark brief answer. Reviewing past papers also highlights high-weightage topics across units.',
      },
    ],
    [currentCourse.name, isMca]
  )

  // Structured Data (JSON-LD) for Google Rich Snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle,
    description: pageDescription,
    numberOfItems: filteredPapers.length,
    itemListElement: filteredPapers.map((paper, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${paper.paperCode}: ${paper.paperTitle} (${paper.year})`,
      url: `${site.url}${pagePath}#${paper.id}`,
    })),
  }

  return (
    <CatalogueLayout>
      <DocumentHead
        title={pageTitle}
        description={pageDescription}
        path={pagePath}
      />

      <StructuredData data={faqSchema} />
      <StructuredData data={itemListSchema} />

      <Breadcrumbs items={breadcrumbsTrail} />

      {/* Header section */}
      <div className="mb-8">
        <PageIntro
          eyebrow={`VBU ${currentCourse.name} Examination Papers`}
          title={`VBU ${currentCourse.name} Previous Year Questions`}
          description={`Verified semester exam question papers with question breakdowns, sub-parts, and marks distribution for Vinoba Bhave University.`}
        >
          {/* Course Tabs */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/courses/bca/pyqs"
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${focus} ${
                isBca
                  ? 'bg-brand text-on-brand dark:bg-night-brand dark:text-night-on-brand shadow-sm'
                  : 'border border-line bg-surface text-subtle hover:bg-soft hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:bg-night-soft dark:hover:text-night-ink'
              }`}
            >
              <BookOpen size={16} aria-hidden="true" />
              <span>BCA Papers</span>
            </Link>

            <Link
              to="/courses/mca/pyqs"
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${focus} ${
                isMca
                  ? 'bg-brand text-on-brand dark:bg-night-brand dark:text-night-on-brand shadow-sm'
                  : 'border border-line bg-surface text-subtle hover:bg-soft hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:bg-night-soft dark:hover:text-night-ink'
              }`}
            >
              <BookOpen size={16} aria-hidden="true" />
              <span>MCA Papers</span>
            </Link>

            <Link
              to={currentCourse.href}
              className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium text-subtle hover:bg-soft hover:text-brand dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:bg-night-soft dark:hover:text-night-brand ${focus}`}
            >
              <span>View Full Syllabus</span>
              <ExternalLink size={14} aria-hidden="true" />
            </Link>
          </div>
        </PageIntro>
      </div>

      {/* Metrics Banner */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className={`${panel} p-4 sm:p-5`}>
          <p className={eyebrow}>Exam Archives</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink dark:text-night-ink">
            {coursePapers.length}
          </p>
          <p className={`mt-0.5 text-xs ${muted}`}>Papers Indexed</p>
        </div>

        <div className={`${panel} p-4 sm:p-5`}>
          <p className={eyebrow}>Total Questions</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink dark:text-night-ink">
            {coursePapers.reduce((sum, p) => sum + p.questions.length, 0)}
          </p>
          <p className={`mt-0.5 text-xs ${muted}`}>Questions Extracted</p>
        </div>

        <div className={`${panel} p-4 sm:p-5`}>
          <p className={eyebrow}>Covered Years</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-ink dark:text-night-ink">
            {availableYears.length > 0 ? `${Math.min(...availableYears)} - ${Math.max(...availableYears)}` : 'Current'}
          </p>
          <p className={`mt-0.5 text-xs ${muted}`}>University Sessions</p>
        </div>

        <div className={`${panel} p-4 sm:p-5`}>
          <p className={eyebrow}>Syllabus Match</p>
          <p className="mt-2 flex items-center gap-1.5 text-2xl font-bold tracking-tight text-ink dark:text-night-ink">
            <span>CBCS</span>
            <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          </p>
          <p className={`mt-0.5 text-xs ${muted}`}>Verified Paper Codes</p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle dark:text-night-subtle"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search paper by subject title, code, or question topic..."
              className={`w-full rounded-lg border border-line bg-surface py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-subtle hover:border-brand/50 focus:border-brand dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:placeholder:text-night-subtle dark:focus:border-night-brand ${focus}`}
              aria-label="Filter question papers"
            />
          </div>

          {/* Quick expand/collapse toggles */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className={`rounded-lg border border-line bg-surface px-3 py-2 text-xs font-medium text-subtle hover:bg-soft hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:bg-night-soft dark:hover:text-night-ink ${focus}`}
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className={`rounded-lg border border-line bg-surface px-3 py-2 text-xs font-medium text-subtle hover:bg-soft hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:bg-night-soft dark:hover:text-night-ink ${focus}`}
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Filter Pills: Semester & Year */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-subtle dark:text-night-subtle">
            <Filter size={14} aria-hidden="true" />
            <span>Semester:</span>
          </div>

          <button
            type="button"
            onClick={() => updateFilter('semester', 'all')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${focus} ${
              selectedSemester === 'all'
                ? 'bg-selected font-semibold text-brand dark:bg-night-selected dark:text-night-brand'
                : 'border border-line bg-surface text-subtle hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:text-night-ink'
            }`}
          >
            All Semesters
          </button>

          {courseSemesters.map(sem => (
            <button
              key={sem.id}
              type="button"
              onClick={() => updateFilter('semester', sem.id)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${focus} ${
                selectedSemester === sem.id
                  ? 'bg-selected font-semibold text-brand dark:bg-night-selected dark:text-night-brand'
                  : 'border border-line bg-surface text-subtle hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:text-night-ink'
              }`}
            >
              {sem.title}
            </button>
          ))}

          {availableYears.length > 1 && (
            <>
              <div className="mx-1 h-4 w-px bg-line dark:bg-night-line" aria-hidden="true" />
              <div className="flex items-center gap-1.5 text-xs font-medium text-subtle dark:text-night-subtle">
                <Calendar size={14} aria-hidden="true" />
                <span>Year:</span>
              </div>

              <button
                type="button"
                onClick={() => updateFilter('year', 'all')}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${focus} ${
                  selectedYear === 'all'
                    ? 'bg-selected font-semibold text-brand dark:bg-night-selected dark:text-night-brand'
                    : 'border border-line bg-surface text-subtle hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:text-night-ink'
                }`}
              >
                All Years
              </button>

              {availableYears.map(yr => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => updateFilter('year', yr.toString())}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${focus} ${
                    selectedYear === yr.toString()
                      ? 'bg-selected font-semibold text-brand dark:bg-night-selected dark:text-night-brand'
                      : 'border border-line bg-surface text-subtle hover:text-ink dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:text-night-ink'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Question Papers List */}
      <section aria-label="Question Papers List">
        {filteredPapers.length === 0 ? (
          <EmptyState
            title="No question papers found"
            description="No question papers match the selected semester or search filters. Additional past papers are regularly verified and added."
          >
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSearchParams(new URLSearchParams(), { replace: true })
                }}
                className={button}
              >
                Clear Filters
              </button>
            </div>
          </EmptyState>
        ) : (
          <div className="space-y-6">
            {filteredPapers.map(paper => {
              const isExpanded = expandedPapers.includes(paper.id)
              const notesLink = `/courses/${paper.courseId}/semesters/${paper.semesterId}/subjects/${paper.paperId}`

              return (
                <article
                  key={paper.id}
                  id={paper.id}
                  className={`${panel} overflow-hidden transition-shadow hover:shadow-sm`}
                >
                  {/* Paper Card Header */}
                  <div className="border-b border-line bg-soft/30 p-4 sm:p-6 dark:border-night-line dark:bg-night-soft/20">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-md bg-selected px-2.5 py-0.5 text-xs font-semibold text-brand dark:bg-night-selected dark:text-night-brand">
                            {paper.paperCode}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {paper.printedCode && (
                            <span className="rounded-md border border-line bg-surface px-2 py-0.5 text-xs text-subtle dark:border-night-line dark:bg-night-surface dark:text-night-subtle">
                              Printed: {paper.printedCode}
                            </span>
                          )}
                          <span className="rounded-md border border-line bg-surface px-2 py-0.5 text-xs font-medium text-subtle dark:border-night-line dark:bg-night-surface dark:text-night-subtle">
                            {paper.semesterTitle}
                          </span>
                          <span className="rounded-md border border-line bg-surface px-2 py-0.5 text-xs font-medium text-subtle dark:border-night-line dark:bg-night-surface dark:text-night-subtle">
                            Year {paper.year} ({paper.session})
                          </span>
                          <span className="text-xs text-subtle dark:text-night-subtle">
                            · {paper.examType}
                          </span>
                        </div>

                        <h2 className="mt-2.5 font-display text-xl font-bold tracking-tight text-ink dark:text-night-ink sm:text-2xl">
                          {paper.paperTitle}
                        </h2>

                        {/* Exam specs */}
                        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-subtle dark:text-night-subtle">
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} aria-hidden="true" />
                            <span>Time: {paper.timeAllowed}</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Award size={14} aria-hidden="true" />
                            <span>Full Marks: {paper.fullMarks}</span>
                          </span>
                          <span>Pass Marks: {paper.passMarks}</span>
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div className="flex shrink-0 items-center gap-2 pt-1 sm:pt-0">
                        {paper.pdfUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              setActivePdf({
                                url: paper.pdfUrl,
                                title: `${paper.paperCode}: ${paper.paperTitle}`,
                                subtitle: `${paper.semesterTitle} · Year ${paper.year} (${paper.session})`,
                              })
                            }
                            className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-selected dark:border-night-line dark:bg-night-surface dark:text-night-brand dark:hover:bg-night-selected ${focus}`}
                            title="View original exam paper PDF"
                          >
                            <Eye size={14} aria-hidden="true" />
                            <span>View PDF</span>
                          </button>
                        )}

                        <Link
                          to={notesLink}
                          className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-subtle transition-colors hover:border-brand/40 hover:text-brand dark:border-night-line dark:bg-night-surface dark:text-night-subtle dark:hover:border-night-brand/40 dark:hover:text-night-brand ${focus}`}
                        >
                          <Layers size={14} aria-hidden="true" />
                          <span>Study Notes</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => togglePaper(paper.id)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-soft dark:border-night-line dark:bg-night-surface dark:text-night-ink dark:hover:bg-night-soft ${focus}`}
                          aria-expanded={isExpanded}
                        >
                          <span>{isExpanded ? 'Hide Paper' : 'View Questions'}</span>
                          {isExpanded ? (
                            <ChevronUp size={15} aria-hidden="true" />
                          ) : (
                            <ChevronDown size={15} aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Paper Instructions */}
                    {paper.instructions && (
                      <div className="mt-3.5 rounded-lg border border-line/60 bg-surface/70 px-3.5 py-2 text-xs leading-relaxed text-subtle dark:border-night-line/60 dark:bg-night-surface/60 dark:text-night-subtle">
                        <span className="font-semibold text-ink dark:text-night-ink">Instructions: </span>
                        {paper.instructions}
                      </div>
                    )}
                  </div>

                  {/* Expanded Paper Content */}
                  {isExpanded && (
                    <div className="p-4 sm:p-6">
                      {/* View mode switcher */}
                      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 dark:border-night-line">
                        <div className="flex items-center gap-2">
                          {paper.pdfUrl ? (
                            <div className="inline-flex rounded-lg border border-line bg-soft/50 p-0.5 dark:border-night-line dark:bg-night-soft/30">
                              <button
                                type="button"
                                onClick={() =>
                                  setPaperViewMode(prev => ({ ...prev, [paper.id]: 'questions' }))
                                }
                                className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                                  (paperViewMode[paper.id] || 'questions') === 'questions'
                                    ? 'bg-surface text-ink shadow-sm dark:bg-night-surface dark:text-night-ink'
                                    : 'text-subtle hover:text-ink dark:text-night-subtle dark:hover:text-night-ink'
                                }`}
                              >
                                Questions ({paper.questions.length})
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setPaperViewMode(prev => ({ ...prev, [paper.id]: 'pdf' }))
                                }
                                className={`inline-flex items-center gap-1 rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                                  paperViewMode[paper.id] === 'pdf'
                                    ? 'bg-surface text-brand shadow-sm dark:bg-night-surface dark:text-night-brand'
                                    : 'text-subtle hover:text-ink dark:text-night-subtle dark:hover:text-night-ink'
                                }`}
                              >
                                <Eye size={12} aria-hidden="true" />
                                <span>Original Scanned PDF</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-ink dark:text-night-ink">
                              All Questions ({paper.questions.length})
                            </span>
                          )}
                        </div>

                        {paper.pdfUrl ? (
                          <div className="flex items-center gap-3 text-xs">
                            <button
                              type="button"
                              onClick={() =>
                                setActivePdf({
                                  url: paper.pdfUrl,
                                  title: `${paper.paperCode}: ${paper.paperTitle}`,
                                  subtitle: `${paper.semesterTitle} · Year ${paper.year} (${paper.session})`,
                                })
                              }
                              className="inline-flex items-center gap-1 font-semibold text-brand hover:underline dark:text-night-brand"
                            >
                              <Maximize2 size={13} aria-hidden="true" />
                              <span>Full Screen Viewer</span>
                            </button>
                            <span className="text-line dark:text-night-line">·</span>
                            <a
                              href={paper.pdfUrl}
                              download
                              className="inline-flex items-center gap-1 text-subtle hover:text-ink hover:underline dark:text-night-subtle dark:hover:text-night-ink"
                            >
                              <Download size={13} aria-hidden="true" />
                              <span>Download PDF</span>
                            </a>
                          </div>
                        ) : (
                          <span className="text-xs italic text-subtle dark:text-night-subtle">
                            Transcribed Question Archive
                          </span>
                        )}
                      </div>

                      {/* Content: Inline PDF or Questions List */}
                      {paper.pdfUrl && paperViewMode[paper.id] === 'pdf' ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs text-subtle dark:text-night-subtle">
                            <span>Embedded PDF viewer. Scroll or zoom within the frame.</span>
                            <a
                              href={paper.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium text-brand hover:underline dark:text-night-brand"
                            >
                              Open in New Window
                            </a>
                          </div>
                          <div className="h-[650px] w-full overflow-hidden rounded-xl border border-line bg-zinc-900 shadow-inner dark:border-night-line">
                            <object
                              data={`${paper.pdfUrl}#toolbar=1`}
                              type="application/pdf"
                              className="h-full w-full"
                            >
                              <iframe
                                src={`${paper.pdfUrl}#toolbar=1`}
                                title={paper.paperTitle}
                                className="h-full w-full border-0"
                              />
                            </object>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6 pt-2 divide-y divide-line/60 dark:divide-night-line/60">
                        {paper.questions.map((q, qIndex) => {
                          const showSectionHeader =
                            q.section &&
                            (qIndex === 0 || paper.questions[qIndex - 1].section !== q.section)

                          return (
                            <div key={q.id} className="pt-4 first:pt-0">
                              {showSectionHeader && (
                                <div className="mb-4 mt-6 first:mt-0 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line bg-soft/60 px-4 py-2.5 dark:border-night-line dark:bg-night-soft/40">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-brand dark:text-night-brand">
                                      {q.section}
                                    </span>
                                    {q.section.toUpperCase().includes('B') && (
                                      <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                                        Compulsory Section
                                      </span>
                                    )}
                                  </div>
                                  {q.sectionNote && (
                                    <span className="text-xs font-medium text-subtle dark:text-night-subtle">
                                      {q.sectionNote}
                                    </span>
                                  )}
                                </div>
                              )}

                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-soft font-mono text-xs font-bold text-ink dark:bg-night-soft dark:text-night-ink">
                                    Q{q.number}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    {/* Only show badge if NOT covered by the section-level rule */}
                                    {(!q.section || (!q.sectionNote && q.compulsory)) && q.compulsory && (
                                      <span className="mb-1 inline-block rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                                        Compulsory
                                      </span>
                                    )}
                                    {!q.section && q.marks && (
                                      <span className="mb-1 ml-2 inline-block rounded bg-soft px-1.5 py-0.5 font-mono text-[11px] font-medium text-subtle dark:bg-night-soft dark:text-night-subtle">
                                        [{q.marks} Marks]
                                      </span>
                                    )}

                                    <QuestionBody question={q} />
                                  </div>
                                </div>
                              </div>

                              {/* Sub questions if any */}
                              {q.subQuestions && q.subQuestions.length > 0 && (
                                <div className="mt-3 ml-10 space-y-3 rounded-lg border border-line/60 bg-soft/20 p-3 dark:border-night-line/60 dark:bg-night-soft/10">
                                  {q.subQuestions.map((sub, idx) => (
                                    <div key={idx} className="text-xs leading-relaxed">
                                      <div className="flex items-start justify-between gap-3">
                                        <p className="text-ink dark:text-night-ink whitespace-pre-line">
                                          <strong className="mr-1.5 font-mono font-bold text-brand dark:text-night-brand">
                                            ({sub.part})
                                          </strong>
                                          <span>{sub.text}</span>
                                        </p>
                                        {sub.marks && (
                                          <span className="shrink-0 font-mono text-[10px] text-subtle dark:text-night-subtle">
                                            [{sub.marks}M]
                                          </span>
                                        )}
                                      </div>

                                      {/* MCQ options if any */}
                                      {sub.options && (
                                        <ul className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                          {sub.options.map((opt, optIdx) => (
                                            <li
                                              key={optIdx}
                                              className="rounded border border-line/50 bg-surface px-2.5 py-1 text-subtle dark:border-night-line/50 dark:bg-night-surface dark:text-night-subtle"
                                            >
                                              <span className="mr-1.5 font-semibold text-ink dark:text-night-ink">
                                                {String.fromCharCode(65 + optIdx)}.
                                              </span>
                                              <span>{opt}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )}
              </article>
              )
            })}
          </div>
        )}
      </section>

      {/* Frequently Asked Questions (SEO & Student Knowledge Base) */}
      <section className="mt-14" aria-labelledby="pyq-faq-heading">
        <div className="mb-6">
          <p className={eyebrow}>Examination Help</p>
          <h2 id="pyq-faq-heading" className="mt-1 font-display text-xl font-bold tracking-tight text-ink dark:text-night-ink sm:text-2xl">
            Frequently Asked Questions
          </h2>
          <p className={`mt-1 text-xs sm:text-sm ${muted}`}>
            Common questions regarding Vinoba Bhave University {currentCourse.name} examinations and question pattern.
          </p>
        </div>

        <div className={`${panel} divide-y divide-line overflow-hidden dark:divide-night-line`}>
          {faqs.map(faq => {
            const isOpen = openFaq === faq.id
            return (
              <div key={faq.id} className="transition-colors">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  className={`flex w-full items-center justify-between gap-4 p-4 text-left font-sans transition-colors hover:bg-soft dark:hover:bg-night-soft sm:p-5 ${focus}`}
                >
                  <span className="text-sm font-semibold text-ink dark:text-night-ink sm:text-base">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={18} className="shrink-0 text-brand dark:text-night-brand" aria-hidden="true" />
                  ) : (
                    <ChevronDown size={18} className="shrink-0 text-subtle dark:text-night-subtle" aria-hidden="true" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-line/60 bg-soft/20 px-4 py-3.5 text-xs leading-relaxed text-subtle dark:border-night-line/60 dark:bg-night-soft/10 dark:text-night-subtle sm:px-5 sm:text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Contribution and Help Banner */}
      <div className="mt-12 rounded-xl border border-line/80 bg-soft/40 p-6 dark:border-night-line/80 dark:bg-night-soft/30">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-ink dark:text-night-ink">
              Have recent VBU Question Papers?
            </h3>
            <p className={`mt-1 max-w-xl text-xs sm:text-sm ${muted}`}>
              Help fellow students by contributing your previous semester question papers. Verified papers are transcribed and cross-linked with topic syllabus notes.
            </p>
          </div>
          <Link
            to="/contact"
            className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-on-brand shadow-sm transition-colors hover:bg-brand-hover dark:bg-night-brand dark:text-night-on-brand ${focus}`}
          >
            <span>Contribute Papers</span>
          </Link>
        </div>
      </div>

      {/* Modal PDF Viewer */}
      {activePdf && (
        <PdfModalViewer
          pdf={activePdf}
          onClose={() => setActivePdf(null)}
        />
      )}
    </CatalogueLayout>
  )
}
