import { lazy } from 'react'
import { ChartCard } from '@/components/shared/ChartCard'
import { useFilters } from '@/features/filters'
import { useOccupancy } from '../hooks/useAnalytics'

// Recharts stays out of the initial bundle: the chart is its own lazy chunk.
const OccupancyChart = lazy(() => import('./OccupancyChart'))

const LEGEND = (
  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
    <span className="size-2 rounded-full bg-brand" aria-hidden="true" />
    Occupancy
  </span>
)

export function OccupancyChartCard() {
  const query = useOccupancy()
  const { timeZone, range, toUtc } = useFilters()

  return (
    <ChartCard
      title="Overall Occupancy"
      subtitle="Hourly average · live point shows current count"
      query={query}
      headerExtra={LEGEND}
    >
      {(points) => (
        <OccupancyChart
          points={points}
          timeZone={timeZone ?? 'UTC'}
          axisEnd={range === 'today' ? toUtc : undefined}
        />
      )}
    </ChartCard>
  )
}
