import { Suspense, type ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChartSkeleton } from './ChartSkeleton'
import { QueryBoundary, type BoundaryQuery } from './QueryBoundary'

interface ChartCardProps<TData> {
  title: string
  /** Placeholder shown while loading; should match the chart's shape. */
  skeleton?: ReactNode
  /** Small caption under the title. */
  subtitle?: string
  /** Legend or actions shown at the right of the header. */
  headerExtra?: ReactNode
  query: BoundaryQuery<TData>
  isEmpty?: (data: TData) => boolean
  /** Fixed height so loading, empty and loaded states never shift the layout. */
  className?: string
  children: (data: TData) => ReactNode
}

function ChartEmpty() {
  return (
    <p className="flex h-full min-h-64 items-center justify-center text-center text-sm text-muted-foreground">
      No data for this period. Try another date range.
    </p>
  )
}

/** Card frame + per-widget loading / error (with Retry) / empty states for a chart. */
export function ChartCard<TData>({
  title,
  skeleton = <ChartSkeleton />,
  subtitle,
  headerExtra,
  query,
  isEmpty,
  className,
  children,
}: ChartCardProps<TData>) {
  return (
    <Card className={cn('min-h-96', className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        {headerExtra}
      </CardHeader>
      <CardContent className="min-h-64 flex-1">
        <QueryBoundary
          query={query}
          isEmpty={isEmpty}
          loading={skeleton}
          empty={<ChartEmpty />}
          compactError
        >
          {(data) => <Suspense fallback={skeleton}>{children(data)}</Suspense>}
        </QueryBoundary>
      </CardContent>
    </Card>
  )
}
