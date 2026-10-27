import { lazy } from 'react'
import { ChartCard } from '@/components/shared/ChartCard'
import { ChartSkeleton, DonutSkeleton } from '@/components/shared/ChartSkeleton'
import { useFilters } from '@/features/filters'
import { useDemographics } from '../hooks/useAnalytics'

const DemographicsDonut = lazy(() => import('./DemographicsDonut'))
const DemographicsChart = lazy(() => import('./DemographicsChart'))

/** Donut (share) and time series (trend) share one cached demographics query. */
export function DemographicsSection() {
  const query = useDemographics()
  const { timeZone, range, toUtc } = useFilters()

  return (
    <section aria-labelledby="demographics-heading" className="space-y-3">
      <h2 id="demographics-heading" className="text-lg font-semibold">
        Demographics
      </h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <ChartCard title="Chart of Demographics" query={query} skeleton={<DonutSkeleton />}>
          {(points) => <DemographicsDonut points={points} />}
        </ChartCard>
        <ChartCard
          title="Demographics Analysis"
          query={query}
          skeleton={<ChartSkeleton lines={2} />}
          className="lg:col-span-2"
        >
          {(points) => (
            <DemographicsChart
              points={points}
              timeZone={timeZone ?? 'UTC'}
              axisEnd={range === 'today' ? toUtc : undefined}
            />
          )}
        </ChartCard>
      </div>
    </section>
  )
}
