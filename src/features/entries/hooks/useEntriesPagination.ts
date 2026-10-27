import { useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router'

const PAGE_PARAM = 'page'
const SIZE_PARAM = 'size'

export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]

const DEFAULT_PAGE = 1
const DEFAULT_SIZE: PageSize = 10

function parsePage(value: string | null): number {
  const n = Number(value)
  return value !== null && Number.isInteger(n) && n >= 1 ? n : DEFAULT_PAGE
}

function parseSize(value: string | null): PageSize {
  const n = Number(value)
  return PAGE_SIZE_OPTIONS.find((option) => option === n) ?? DEFAULT_SIZE
}

/** Pagination state lives in the URL (`?page=&size=`); invalid values fall back to defaults. */
export function useEntriesPagination() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get(PAGE_PARAM))
  const size = parseSize(searchParams.get(SIZE_PARAM))

  const setPage = useCallback(
    (next: number, replace = false) =>
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          params.set(PAGE_PARAM, String(next))
          return params
        },
        { replace },
      ),
    [setSearchParams],
  )

  const setSize = useCallback(
    (next: number) =>
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev)
        params.set(SIZE_PARAM, String(parseSize(String(next))))
        params.delete(PAGE_PARAM)
        return params
      }),
    [setSearchParams],
  )

  return { page, size, setPage, setSize }
}

/**
 * Clamps an out-of-range page back to the last page (replacing the history entry).
 * Pass `null` while the total is unknown or stale.
 */
export function useClampPage(
  page: number,
  totalPages: number | null,
  setPage: (page: number, replace?: boolean) => void,
) {
  useEffect(() => {
    if (totalPages !== null && totalPages > 0 && page > totalPages) setPage(totalPages, true)
  }, [page, totalPages, setPage])
}
