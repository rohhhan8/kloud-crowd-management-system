/** Request body shared by all four analytics endpoints (epoch milliseconds). */
export interface AnalyticsParams {
  siteId: string
  fromUtc: number
  toUtc: number
}

export interface OccupancyPoint {
  time: number
  value: number
}

export interface DemographicsPoint {
  time: number
  male: number
  female: number
}

export interface GenderShare {
  malePct: number
  femalePct: number
  total: number
}

/** Uniform view-model every stat card hook returns; the container only renders this. */
export interface StatCardState {
  label: string
  /** Formatted value, or null when there is no data. */
  value: string | null
  /** Small caption (e.g. "Hourly avg"). */
  caption?: string
  trend?: { change: number | null; comparedTo: string; loading?: boolean }
  isLoading: boolean
  error: unknown
  refetch: () => unknown
}
