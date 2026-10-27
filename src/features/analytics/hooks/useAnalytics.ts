import { useCallback } from 'react'
import { useFilters } from '@/features/filters'
import { queryKeys } from '@/lib/query/keys'
import { getDemographics, getDwell, getFootfall, getOccupancy } from '../api/analytics.api'
import type { DemographicsResponse, OccupancyResponse } from '../schemas'
import type { AnalyticsParams } from '../types'
import { toDemographicsPoints, toOccupancyPoints, trimFuturePoints } from '../utils/mappers'
import { useAnalyticsQuery } from './useAnalyticsQuery'

export interface MetricOptions {
  /** Overrides the global filters (comparison periods). */
  params?: AnalyticsParams | null
  enabled?: boolean
}

export const useFootfall = (options?: MetricOptions) =>
  useAnalyticsQuery({ queryKey: queryKeys.analytics.footfall, fetcher: getFootfall, ...options })

export const useDwell = (options?: MetricOptions) =>
  useAnalyticsQuery({ queryKey: queryKeys.analytics.dwell, fetcher: getDwell, ...options })

/** "Now" bound for trimming future buckets; only the live "today" view is trimmed. */
function useTrimBound(): number | null {
  const { range, now } = useFilters()
  return range === 'today' ? now.getTime() : null
}

export function useOccupancy() {
  const nowMs = useTrimBound()
  const select = useCallback(
    (res: OccupancyResponse) => trimFuturePoints(toOccupancyPoints(res), nowMs),
    [nowMs],
  )
  return useAnalyticsQuery({
    queryKey: queryKeys.analytics.occupancy,
    fetcher: getOccupancy,
    select,
  })
}

export function useDemographics() {
  const nowMs = useTrimBound()
  const select = useCallback(
    (res: DemographicsResponse) => trimFuturePoints(toDemographicsPoints(res), nowMs),
    [nowMs],
  )
  return useAnalyticsQuery({
    queryKey: queryKeys.analytics.demographics,
    fetcher: getDemographics,
    select,
  })
}
