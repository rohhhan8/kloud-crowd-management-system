import { useCallback } from 'react'
import { useFilters } from '@/features/filters'
import { useCsvExport } from '@/hooks/useCsvExport'
import { formatInTimeZone } from '@/lib/utils/date'
import type { EntryRow } from '../types'

const HEADER = ['Name', 'Sex', 'Zone', 'Severity', 'Entry', 'Exit', 'Dwell (minutes)'] as const
const TIME_PATTERN = 'dd MMM yyyy HH:mm'

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Exports the rows of the current page, with times in the selected site's time zone. */
export function useEntriesExport(rows: readonly EntryRow[], page: number) {
  const { site, timeZone, range, fromUtc, toUtc } = useFilters()
  const exportCsv = useCsvExport()
  const zone = timeZone ?? 'UTC'

  return useCallback(() => {
    const day = (ms: number) => formatInTimeZone(ms, zone, 'ddMMMyyyy')
    const filename = `entries_${slug(site?.name ?? 'site')}_${range}_${day(fromUtc)}-${day(toUtc)}_page${page}.csv`
    const time = (ms: number | null) =>
      ms === null ? '' : formatInTimeZone(ms, zone, TIME_PATTERN)
    exportCsv(
      filename,
      HEADER,
      rows.map((r) => [
        r.name,
        r.genderLabel,
        r.zoneName,
        r.severity,
        time(r.entryUtc),
        time(r.exitUtc),
        r.dwellMinutes,
      ]),
    )
  }, [exportCsv, rows, page, site, range, fromUtc, toUtc, zone])
}
