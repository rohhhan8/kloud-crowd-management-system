import { TZDate } from '@date-fns/tz'
import type { DateRangePreset } from '@/config/dateRanges'

export interface EpochRange {
  fromUtc: number
  toUtc: number
}

const FIVE_MINUTES_MS = 300_000

/** Round an epoch down to a multiple of `intervalMs` (default 5 minutes). */
export const floorToInterval = (epochMs: number, intervalMs = FIVE_MINUTES_MS) =>
  Math.floor(epochMs / intervalMs) * intervalMs

/** Start of the day (00:00 wall-clock in `timeZone`) that contains `epochMs`, shifted by days. */
export function startOfSiteDay(epochMs: number, timeZone: string, offsetDays = 0): number {
  const local = new TZDate(epochMs, timeZone)
  return new TZDate(
    local.getFullYear(),
    local.getMonth(),
    local.getDate() + offsetDays,
    0,
    0,
    0,
    0,
    timeZone,
  ).getTime()
}

/**
 * Epoch-millisecond bounds for a preset using DAY BOUNDARIES IN THE SITE'S TIME ZONE.
 * `toUtc` is the last millisecond of the final day (next day start - 1), so DST days of
 * 23h/25h are handled. Bounds are day-aligned, never `Date.now()`, so the result is
 * stable for a given preset within a site-day and safe to use in query keys.
 */
export function getRangeForPreset(
  preset: DateRangePreset,
  timeZone: string,
  now: Date = new Date(),
): EpochRange {
  const t = now.getTime()
  const endOfDay = (offsetDays: number) => startOfSiteDay(t, timeZone, offsetDays + 1) - 1

  switch (preset) {
    case 'today':
      return { fromUtc: startOfSiteDay(t, timeZone), toUtc: endOfDay(0) }
    case 'yesterday':
      return { fromUtc: startOfSiteDay(t, timeZone, -1), toUtc: endOfDay(-1) }
    case 'last7days':
      return { fromUtc: startOfSiteDay(t, timeZone, -6), toUtc: endOfDay(0) }
  }
}

const formatters = new Map<string, Intl.DateTimeFormat>()

function getFormatter(timeZone: string) {
  let formatter = formatters.get(timeZone)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    })
    formatters.set(timeZone, formatter)
  }
  return formatter
}

const longMonthFormatters = new Map<string, Intl.DateTimeFormat>()

function formatLongMonth(epochMs: number, timeZone: string) {
  let formatter = longMonthFormatters.get(timeZone)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', { timeZone, month: 'long' })
    longMonthFormatters.set(timeZone, formatter)
  }
  return formatter.format(epochMs)
}

/**
 * The single place all time display goes through. Supported pattern tokens (date-fns style):
 * yyyy, MMMM, MMM, EEE, dd, d, HH, H, h, mm, ss, a. Uses Intl so date-fns' formatter stays out of the bundle.
 */
export function formatInTimeZone(epochMs: number, timeZone: string, pattern: string): string {
  const parts: Record<string, string> = {}
  for (const part of getFormatter(timeZone).formatToParts(epochMs)) parts[part.type] = part.value

  const tokens: Record<string, string> = {
    yyyy: parts.year ?? '',
    MMMM: pattern.includes('MMMM') ? formatLongMonth(epochMs, timeZone) : '',
    MMM: parts.month ?? '',
    EEE: parts.weekday ?? '',
    dd: (parts.day ?? '').padStart(2, '0'),
    d: parts.day ?? '',
    HH: (parts.hour ?? '').padStart(2, '0'),
    H: String(Number(parts.hour)),
    h: String(Number(parts.hour) % 12 || 12),
    mm: parts.minute ?? '',
    ss: parts.second ?? '',
    a: Number(parts.hour) < 12 ? 'AM' : 'PM',
  }
  return pattern.replace(
    /yyyy|MMMM|MMM|EEE|HH|dd|ss|H|h|mm|a|d/g,
    (token) => tokens[token] ?? token,
  )
}
