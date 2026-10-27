export function PageSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className="space-y-4 p-6">
      <span className="sr-only">Loading…</span>
      <div className="h-8 w-1/3 animate-pulse rounded-lg bg-muted" />
      <div className="h-4 w-2/3 animate-pulse rounded-lg bg-muted" />
      <div className="h-64 w-full animate-pulse rounded-lg bg-muted" />
    </div>
  )
}
