import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TrendIndicatorProps {
  /** Percent change, or null when there is nothing to compare against. */
  change: number | null
  /** e.g. "yesterday" */
  comparedTo: string
  /** Comparison data is still being fetched. */
  loading?: boolean
}

/** Arrow + text; direction is conveyed by icon and wording, never colour alone. */
export function TrendIndicator({ change, comparedTo, loading }: TrendIndicatorProps) {
  if (loading) return <span className="text-muted-foreground">Loading comparison…</span>

  if (change === null) {
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <Minus className="size-4" aria-hidden="true" />
        No comparison data
      </span>
    )
  }

  const rounded = Math.round(Math.abs(change))
  if (rounded === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground">
        <Minus className="size-4" aria-hidden="true" />
        No change vs {comparedTo}
      </span>
    )
  }

  const up = change > 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <span
      className={cn('inline-flex items-center gap-1', up ? 'text-emerald-700' : 'text-red-700')}
    >
      <Icon className="size-4" aria-hidden="true" />
      {rounded}% {up ? 'More' : 'Less'} than {comparedTo}
    </span>
  )
}
