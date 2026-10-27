import type { UseQueryResult } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useFilters } from '@/features/filters'
import type { AnalyticsParams } from '../types'
import { percentChange } from '../utils/percentChange'
import { getPreviousRange } from '../utils/previousRange'
import { useDwell, useFootfall, type MetricOptions } from './useAnalytics'
import { useAnalyticsParams } from './useAnalyticsParams'

/** Params for the comparison period, or null while filters are not ready. */
function usePreviousParams(): AnalyticsParams | null {
  const params = useAnalyticsParams()
  const { range, timeZone, now } = useFilters()

  return useMemo(() => {
    if (!params || !timeZone) return null
    const previous = getPreviousRange(range, params, timeZone, now)
    return { siteId: params.siteId, ...previous }
  }, [params, range, timeZone, now])
}

/**
 * True once the primary footfall and dwell queries for the current range are no longer
 * fetching (success or error). Comparison queries wait for this so the primary data and
 * charts are not queued behind them on the slow backend.
 */
export function usePrimarySettled(): boolean {
  const footfall = useFootfall()
  const dwell = useDwell()
  return !footfall.isFetching && !dwell.isFetching
}

/** Current vs previous period for a numeric metric. A failed previous query only drops the trend. */
function useComparison<TResponse>(
  useMetric: (options?: MetricOptions) => UseQueryResult<TResponse>,
  pick: (response: TResponse) => number,
) {
  const previousParams = usePreviousParams()
  const primarySettled = usePrimarySettled()
  const current = useMetric()
  const previous = useMetric({ params: previousParams, enabled: primarySettled })

  const currentValue = current.data === undefined ? null : pick(current.data)
  // Not ready, or fetching: the previous data may belong to an old range (placeholder).
  const isComparisonLoading = previousParams !== null && (!primarySettled || previous.isFetching)
  const previousValue =
    previous.data === undefined || isComparisonLoading ? null : pick(previous.data)

  return {
    current: currentValue,
    previous: previousValue,
    change:
      currentValue !== null && previousValue !== null
        ? percentChange(currentValue, previousValue)
        : null,
    isComparisonLoading,
    isLoading: current.isPending,
    error: current.error,
    refetch: () => Promise.all([current.refetch(), previous.refetch()]),
  }
}

export const useFootfallComparison = () => useComparison(useFootfall, (r) => r.footfall)

export const useDwellComparison = () => useComparison(useDwell, (r) => r.avgDwellMinutes)
