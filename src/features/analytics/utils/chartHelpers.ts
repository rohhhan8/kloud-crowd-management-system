const HOUR_MS = 3_600_000

/** Hour-of-day ticks for short spans; weekday + hour once the span exceeds ~1.5 days. */
export function getTimeAxisPattern(points: readonly { time: number }[]): string {
  const first = points[0]?.time
  const last = points.at(-1)?.time
  return first !== undefined && last !== undefined && last - first > 36 * HOUR_MS
    ? 'EEE H:mm'
    : 'H:mm'
}

/** The point with the highest value (first one wins ties); null for no points. */
export function getPeak<T>(points: readonly T[], pick: (point: T) => number): T | null {
  return points.reduce<T | null>((best, p) => (best && pick(best) >= pick(p) ? best : p), null)
}

/** Hourly ticks for the data, extended to `axisEnd` so a trimmed "today" line keeps the full-day axis. */
export function buildTicks(points: readonly { time: number }[], axisEnd?: number): number[] {
  const ticks = points.map((p) => p.time)
  const last = ticks.at(-1)
  if (last === undefined || axisEnd === undefined) return ticks
  for (let t = last + HOUR_MS; t <= axisEnd; t += HOUR_MS) ticks.push(t)
  return ticks
}
