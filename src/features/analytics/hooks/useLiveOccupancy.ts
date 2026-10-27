import { useIsLive, useLiveSiteOccupancy } from '@/features/live'
import { useFilters } from '@/features/filters'
import { useOccupancy } from './useAnalytics'

/**
 * The live socket total while connected; otherwise the average of the most recent hourly
 * bucket that has started (buckets later today are future hours and must not be used).
 */
export function useLiveOccupancy() {
  const query = useOccupancy()
  const { now, siteId } = useFilters()
  const live = useLiveSiteOccupancy(siteId)
  const isLive = useIsLive(siteId)

  if (isLive && live !== null) {
    return {
      value: live,
      isLive: true,
      label: 'Live',
      isLoading: false,
      error: null,
      refetch: query.refetch,
    }
  }

  const latest = query.data?.findLast((point) => point.time <= now.getTime())
  return {
    value: latest ? Math.round(latest.value) : null,
    isLive: false,
    label: 'Hourly avg',
    isLoading: query.isPending,
    error: query.error,
    refetch: query.refetch,
  }
}
