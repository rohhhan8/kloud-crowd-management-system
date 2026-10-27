import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { getSites } from '../api/sites.api'

const SITES_STALE_TIME = 10 * 60_000

export function useSites() {
  return useQuery({
    queryKey: queryKeys.sites.all(),
    queryFn: getSites,
    staleTime: SITES_STALE_TIME,
  })
}
