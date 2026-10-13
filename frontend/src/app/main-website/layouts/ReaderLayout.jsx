export default function ReaderLayout({ children, sidebar, toc, focusMode }) {
  return <div className={`w-full ${focusMode ? 'mx-auto max-w-[1080px]' : 'grid items-start lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_240px] 2xl:grid-cols-[300px_minmax(0,1fr)_280px]'} print:block print:max-w-none`}>
    {!focusMode && <aside aria-label="Subject notes" className="sticky top-16 hidden h-[calc(100dvh-64px)] overflow-y-auto overscroll-contain border-r border-line bg-surface px-4 py-6 dark:border-night-line dark:bg-night-surface lg:block lg:px-5 print:hidden">{sidebar}</aside>}
    <div className="min-w-0 px-4 py-8 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 print:p-0">{children}</div>
    {!focusMode && <aside aria-label="Chapter contents" className="sticky top-16 hidden max-h-[calc(100dvh-64px)] overflow-y-auto overscroll-contain border-l border-line px-5 py-8 dark:border-night-line xl:block 2xl:px-6 print:hidden">{toc}</aside>}
  </div>
}
