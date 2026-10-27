import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: ReactNode
  /** Trend, caption, etc. */
  footer?: ReactNode
}

/** Presentational stat block (frameless; wrap in a Card/group); `dl` ties label to value. */
export function StatCard({ label, value, footer }: StatCardProps) {
  return (
    <div className="min-h-28">
      <dl className="space-y-1.5">
        <dt className="text-sm font-medium">{label}</dt>
        <dd className="text-2xl font-semibold tracking-tight">{value}</dd>
      </dl>
      {footer && <div className="mt-2 text-xs">{footer}</div>}
    </div>
  )
}
