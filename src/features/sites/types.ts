export type SecurityLevel = 'high' | 'medium' | 'low'

export interface Zone {
  id: string
  name: string
  securityLevel: SecurityLevel
}

/** Internal UI model; the API shape is isolated in `api/normalizers.ts`. */
export interface Site {
  id: string
  name: string
  city: string
  country: string
  /** IANA time zone, e.g. "Asia/Dubai". All day boundaries and time display use it. */
  timezone: string
  zones: Zone[]
}
