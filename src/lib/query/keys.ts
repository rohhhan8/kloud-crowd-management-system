interface AnalyticsKeyParams {
  siteId: string
  fromUtc: number
  toUtc: number
}

const analyticsKey = (metric: string) => (params: AnalyticsKeyParams) =>
  ['analytics', metric, params.siteId, params.fromUtc, params.toUtc] as const

export interface EntriesKeyParams extends AnalyticsKeyParams {
  pageNumber: number
  pageSize: number
}

export const queryKeys = {
  sites: {
    all: () => ['sites'] as const,
  },
  entries: {
    list: (p: EntriesKeyParams) =>
      ['entries', p.siteId, p.fromUtc, p.toUtc, p.pageNumber, p.pageSize] as const,
  },
  live: {
    all: () => ['live'] as const,
    occupancy: (siteId: string) => ['live', 'occupancy', siteId] as const,
  },
  analytics: {
    all: () => ['analytics'] as const,
    footfall: analyticsKey('footfall'),
    dwell: analyticsKey('dwell'),
    occupancy: analyticsKey('occupancy'),
    demographics: analyticsKey('demographics'),
  },
}
