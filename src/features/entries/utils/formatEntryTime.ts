import { formatInTimeZone } from '@/lib/utils/date'

/** "11:05 AM" for single-day (today) views, "27 Oct, 11:05 AM" otherwise. */
export function formatEntryTime(epochMs: number, timeZone: string, showDate: boolean): string {
  return formatInTimeZone(epochMs, timeZone, showDate ? 'd MMM, h:mm a' : 'h:mm a')
}
