import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { DEFAULT_DATE_RANGE, isDateRangePreset, type DateRangePreset } from '@/config/dateRanges'
import { useSites } from '@/features/sites'
import { useCoarseNow } from '@/hooks/useCoarseNow'
import { getRangeForPreset } from '@/lib/utils/date'

const SITE_PARAM = 'site'
const RANGE_PARAM = 'range'
const PAGE_PARAM = 'page'

/**
 * Global filters; the URL (`?site=<id>&range=<preset>`) is the source of truth.
 * Presets are evaluated in the SELECTED SITE's time zone and sent to the API as UTC epoch
 * milliseconds. `isReady` is false until sites have loaded, so no analytics query fires early.
 */
export function useFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: sites } = useSites()
  const now = useCoarseNow()

  const rangeParam = searchParams.get(RANGE_PARAM)
  const range: DateRangePreset = isDateRangePreset(rangeParam) ? rangeParam : DEFAULT_DATE_RANGE

  const siteParam = searchParams.get(SITE_PARAM)
  const firstSite = sites?.[0] ?? null
  const matchedSite = sites?.find((s) => s.id === siteParam) ?? null
  const site = matchedSite ?? firstSite
  const timeZone = site?.timezone ?? null

  const updateParam = useCallback(
    (key: string, value: string, replace = false, resetPage = false) =>
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set(key, value)
          if (resetPage) next.delete(PAGE_PARAM)
          return next
        },
        { replace },
      ),
    [setSearchParams],
  )

  // Missing or unknown site: fall back to the first site without adding history entries.
  useEffect(() => {
    if (firstSite && !matchedSite) updateParam(SITE_PARAM, firstSite.id, true)
  }, [firstSite, matchedSite, updateParam])

  // `now` only ticks every 5 minutes and bounds are day-aligned, so values stay stable
  // within a site-day while still rolling over at midnight.
  const { fromUtc, toUtc } = useMemo(
    () => getRangeForPreset(range, timeZone ?? 'UTC', now),
    [range, timeZone, now],
  )

  return {
    site,
    siteId: site?.id ?? null,
    timeZone,
    range,
    fromUtc,
    toUtc,
    now,
    // Changing site or range starts over on page 1.
    setSite: useCallback((id: string) => updateParam(SITE_PARAM, id, false, true), [updateParam]),
    setRange: useCallback(
      (preset: DateRangePreset) => updateParam(RANGE_PARAM, preset, false, true),
      [updateParam],
    ),
    isReady: site !== null,
  }
}
