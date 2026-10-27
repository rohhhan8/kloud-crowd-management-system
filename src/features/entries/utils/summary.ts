import { formatInteger } from '@/lib/utils/format'

/** "Showing 1–10 of 3,687" (or "No entries" when there are none). */
export function getRangeSummary(page: number, size: number, totalRecords: number): string {
  if (totalRecords === 0) return 'No entries'
  const start = (page - 1) * size + 1
  const end = Math.min(page * size, totalRecords)
  return `Showing ${formatInteger(start)}–${formatInteger(end)} of ${formatInteger(totalRecords)}`
}
