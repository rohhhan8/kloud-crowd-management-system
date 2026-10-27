import { skipToken, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { useSocket } from '../socket/SocketContext'
import type { LiveOccupancy } from '../types'

/** Reads the live cache entry (never fetches); `select` limits re-renders to what is used. */
function useLiveEntry<T>(siteId: string | null, select: (data: LiveOccupancy) => T) {
  const { data } = useQuery({
    queryKey: queryKeys.live.occupancy(siteId ?? ''),
    queryFn: skipToken,
    staleTime: Infinity,
    gcTime: Infinity,
    select,
  })
  return data
}

const selectTotal = (data: LiveOccupancy) => data.total

/** Live site total, or null until one has arrived. Re-renders on every throttled update. */
export function useLiveSiteOccupancy(siteId: string | null) {
  const total = useLiveEntry(siteId, selectTotal)
  return total ?? null
}

/** True while connected AND a live value exists; re-renders only when that flips. */
export function useIsLive(siteId: string | null) {
  const hasValue = useLiveEntry(siteId, () => true)
  const { status } = useSocket()
  return status === 'connected' && hasValue === true
}
