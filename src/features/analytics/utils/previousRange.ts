import type { DateRangePreset } from '@/config/dateRanges'
import { floorToInterval, startOfSiteDay, type EpochRange } from '@/lib/utils/date'

/**
 * The period to compare against.
 * - today: yesterday from its site-day start, up to the SAME elapsed time as now
 *   (now floored to the 5-minute mark).
 * - yesterday / last7days: the preceding period of equal length (whole site days).
 */
export function getPreviousRange(
  preset: DateRangePreset,
  range: EpochRange,
  timeZone: string,
  now: Date,
): EpochRange {
  if (preset === 'today') {
    const fromUtc = startOfSiteDay(range.fromUtc, timeZone, -1)
    const elapsed = Math.max(0, floorToInterval(now.getTime()) - range.fromUtc)
    return { fromUtc, toUtc: fromUtc + elapsed }
  }

  const days = preset === 'yesterday' ? 1 : 7
  return { fromUtc: startOfSiteDay(range.fromUtc, timeZone, -days), toUtc: range.fromUtc - 1 }
}
