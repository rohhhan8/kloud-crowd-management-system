import { memo } from 'react'
import { ErrorState } from '@/components/shared/ErrorState'
import { QueryBoundary } from '@/components/shared/QueryBoundary'
import { StatCard } from '@/components/shared/StatCard'
import { TrendIndicator } from '@/components/shared/TrendIndicator'
import { Skeleton } from '@/components/ui/skeleton'
import type { StatCardState } from '../types'

interface StatCardContainerProps {
  /** Hook adapting one metric to a StatCardState (see statCards config). */
  useStat: () => StatCardState
}

const NO_VALUE = '—'

/** Renders one stat card with its own loading / error / data states. */
function StatCardContainerBase({ useStat }: StatCardContainerProps) {
  const stat = useStat()
  const { label } = stat

  const query = {
    data: stat,
    error: stat.error,
    isPending: stat.isLoading,
    isError: Boolean(stat.error),
    refetch: stat.refetch,
  }

  return (
    <QueryBoundary
      query={query}
      loading={
        <StatCard
          label={label}
          value={<Skeleton className="h-9 w-24" />}
          footer={<Skeleton className="h-4 w-40" />}
        />
      }
      errorFallback={({ message, onRetry }) => (
        <StatCard
          label={label}
          value={NO_VALUE}
          footer={<ErrorState compact title="Couldn't load" message={message} onRetry={onRetry} />}
        />
      )}
    >
      {({ value, caption, trend }) => (
        <StatCard
          label={label}
          value={value ?? NO_VALUE}
          footer={
            trend ? (
              <TrendIndicator {...trend} />
            ) : (
              <span className="text-muted-foreground">{caption}</span>
            )
          }
        />
      )}
    </QueryBoundary>
  )
}

export const StatCardContainer = memo(StatCardContainerBase)
