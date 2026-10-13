export default function Loader({ label = 'Opening your shelf', compact = false }) {
  return <div role="status" aria-live="polite" className={`shelf-loader flex flex-col items-center justify-center gap-5 px-4 text-center ${compact ? 'min-h-56 py-10' : 'min-h-[55vh] py-16'}`}>
    <div aria-hidden="true" className="relative flex size-20 items-center justify-center rounded-2xl bg-selected text-brand dark:bg-night-selected dark:text-night-brand">
      <svg viewBox="0 0 64 64" fill="none" className="size-14" aria-hidden="true">
        <path d="M32 18C25 13 17 13 9 15v32c8-2 16-2 23 3 7-5 15-5 23-3V15c-8-2-16-2-23 3Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M32 18v32M15 23c4-1 8 0 12 2M15 30c4-1 8 0 12 2M15 37c4-1 8 0 12 2M37 25c4-2 8-3 12-2M37 32c4-2 8-3 12-2M37 39c4-2 8-3 12-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".55" />
        <path className="shelf-loader-page" d="M32 18c6-5 12-7 19-7v31c-7 0-13 3-19 8Z" fill="currentColor" opacity=".25" />
      </svg>
    </div>
    <div><p className="font-display text-xl font-medium">{label}</p><span aria-hidden="true" className="mt-4 flex justify-center gap-1.5">{[0, 1, 2].map(index => <span key={index} className="shelf-loader-dot size-1.5 rounded-full bg-brand dark:bg-night-brand" style={{ animationDelay: `${index * 160}ms` }} />)}</span></div>
  </div>
}
