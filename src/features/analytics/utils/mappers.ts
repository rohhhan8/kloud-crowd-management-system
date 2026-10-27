import type { DemographicsResponse, OccupancyResponse } from '../schemas'
import type { DemographicsPoint, OccupancyPoint } from '../types'

const byTime = <T extends { time: number }>(a: T, b: T) => a.time - b.time

export const toOccupancyPoints = (res: OccupancyResponse): OccupancyPoint[] =>
  res.buckets.map((b) => ({ time: b.utc, value: b.avg })).sort(byTime)

export const toDemographicsPoints = (res: DemographicsResponse): DemographicsPoint[] =>
  res.buckets.map((b) => ({ time: b.utc, male: b.male, female: b.female })).sort(byTime)

/**
 * For the live "today" view, drop buckets that start after `nowMs` so the line stops at now
 * instead of running to midnight at zero. `null` leaves points untouched (other presets).
 */
export function trimFuturePoints<T extends { time: number }>(
  points: T[],
  nowMs: number | null,
): T[] {
  return nowMs === null ? points : points.filter((p) => p.time <= nowMs)
}
