import { useQuery } from '@tanstack/react-query'
import type { AnalyticsParams } from '../types'
import { useAnalyticsParams } from './useAnalyticsParams'

interface Options<TResponse, TData> {
  queryKey: (params: AnalyticsParams) => readonly unknown[]
  fetcher: (params: AnalyticsParams) => Promise<TResponse>
  select?: (response: TResponse) => TData
  /** Overrides the global filters (used for comparison periods). */
  params?: AnalyticsParams | null
  /** Extra gate, e.g. start comparison queries only after the primary ones settle. */
  enabled?: boolean
}

/**
 * Shared options for every analytics query: fires only when params are ready, never shows
 * another site/range's data while new data loads (cached data for the same key is shown
 * instantly), and is always revalidated on mount.
 */
export function useAnalyticsQuery<TResponse, TData = TResponse>({
  queryKey,
  fetcher,
  select,
  params,
  enabled = true,
}: Options<TResponse, TData>) {
  const filterParams = useAnalyticsParams()
  const resolved = params === undefined ? filterParams : params

  return useQuery({
    queryKey: resolved ? queryKey(resolved) : ['analytics', 'idle'],
    queryFn: () => fetcher(resolved as AnalyticsParams),
    select,
    enabled: resolved !== null && enabled,
    // Always hit the server: every filter change or revisit issues real API requests
    // (identical in-flight requests are still de-duplicated). Data refreshes ~every 5 min
    // via the coarse clock in the query key.
    staleTime: 0,
    refetchOnMount: 'always',
  })
}
