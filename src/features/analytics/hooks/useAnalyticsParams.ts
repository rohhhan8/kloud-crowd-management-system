import { useFilters } from '@/features/filters'
import type { AnalyticsParams } from '../types'

/** Current filters as request params; `null` until sites have loaded. */
export function useAnalyticsParams(): AnalyticsParams | null {
  const { siteId, fromUtc, toUtc, isReady } = useFilters()
  return isReady && siteId ? { siteId, fromUtc, toUtc } : null
}
