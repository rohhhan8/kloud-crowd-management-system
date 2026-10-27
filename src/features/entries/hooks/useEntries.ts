import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useFilters } from '@/features/filters'
import { queryKeys } from '@/lib/query/keys'
import { getEntries } from '../api/entries.api'
import type { EntriesParams } from '../types'
import { mapEntry } from '../utils/mapEntry'

const ENTRIES_STALE_TIME = 30_000

const entriesQuery = (params: EntriesParams) => ({
  queryKey: queryKeys.entries.list(params),
  queryFn: () => getEntries(params),
  staleTime: ENTRIES_STALE_TIME,
})

interface UseEntriesArgs {
  pageNumber: number
  pageSize: number
}

export function useEntries({ pageNumber, pageSize }: UseEntriesArgs) {
  const { siteId, fromUtc, toUtc, isReady } = useFilters()
  const queryClient = useQueryClient()

  const params = useMemo<EntriesParams | null>(
    () => (isReady && siteId ? { siteId, fromUtc, toUtc, pageNumber, pageSize } : null),
    [isReady, siteId, fromUtc, toUtc, pageNumber, pageSize],
  )

  const query = useQuery({
    queryKey: params ? queryKeys.entries.list(params) : ['entries', 'idle'],
    queryFn: () => getEntries(params as EntriesParams),
    staleTime: ENTRIES_STALE_TIME,
    enabled: params !== null,
    placeholderData: keepPreviousData,
    // Every fetch shows the table skeleton, so no silent refetch when the tab regains focus.
    refetchOnWindowFocus: false,
  })

  const totalPages = query.data?.totalPages ?? 0
  const settled = query.isSuccess && !query.isPlaceholderData

  // Prefetch ONLY the next page, once the current one has resolved (the API is slow).
  useEffect(() => {
    if (!params || !settled || params.pageNumber >= totalPages) return
    void queryClient.prefetchQuery(entriesQuery({ ...params, pageNumber: params.pageNumber + 1 }))
  }, [params, settled, totalPages, queryClient])

  const records = query.data?.records
  const rows = useMemo(() => records?.map(mapEntry) ?? [], [records])

  return {
    rows,
    totalRecords: query.data?.totalRecords ?? 0,
    totalPages,
    isLoading: query.isPending,
    isFetching: query.isFetching,
    isPlaceholderData: query.isPlaceholderData,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
