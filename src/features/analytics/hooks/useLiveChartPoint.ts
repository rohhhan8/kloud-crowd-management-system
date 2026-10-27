import { useFilters } from '@/features/filters'
import { useIsLive, useLiveSiteOccupancy } from '@/features/live'
import { useCoarseNow } from '@/hooks/useCoarseNow'

const MINUTE_MS = 60_000

export interface LiveChartPoint {
  /** Current time, floored to the minute so the chart is not repositioned every second. */
  at: number
  value: number
}

/**
 * The single "now" point drawn at the end of the occupancy line: only for the `today`
 * preset while the socket is live. Derived on the fly; never stored or merged into history.
 * The value arrives throttled (<= 1/s) from the live occupancy feed.
 */
export function useLiveChartPoint(): LiveChartPoint | null {
  const { siteId, range } = useFilters()
  const minute = useCoarseNow(MINUTE_MS)
  const isLive = useIsLive(siteId)
  const value = useLiveSiteOccupancy(siteId)

  if (range !== 'today' || !isLive || value === null) return null
  return { at: minute.getTime(), value }
}
