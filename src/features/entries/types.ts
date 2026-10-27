export type Severity = 'high' | 'medium' | 'low'

/** Request body for POST /api/analytics/entry-exit (pageNumber is 1-based). */
export interface EntriesParams {
  siteId: string
  fromUtc: number
  toUtc: number
  pageNumber: number
  pageSize: number
}

/** UI row. `key` is unique even though personId repeats across entries/zones. */
export interface EntryRow {
  key: string
  name: string
  genderLabel: string
  zoneName: string
  severity: Severity
  entryUtc: number
  /** null while the visitor is still inside. */
  exitUtc: number | null
  dwellMinutes: number | null
}
