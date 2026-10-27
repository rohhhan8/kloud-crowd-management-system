/** Percent change vs the previous value; null when there is nothing to compare against. */
export function percentChange(current: number, previous: number | null | undefined): number | null {
  if (previous === null || previous === undefined || previous === 0) return null
  return ((current - previous) / previous) * 100
}
