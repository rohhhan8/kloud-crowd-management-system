import { z } from 'zod'
import type { AlertAction, AlertItem, AlertSeverity } from './types'

/**
 * The ONLY file that knows the wire format of the Socket.IO API.
 * Verified against the dev backend with the test account (names and field names only):
 *  - connects to the API origin; auth works via the handshake `auth: { token }` (Bearer header
 *    also works, `?token=` query does not)
 *  - no subscribe/join emit is needed: events for every site are broadcast, so we filter by siteId
 *  - `alert` ~70/min, `live_occupancy` ~50/min across all sites; `sim:event` mirrors `alert`
 */
export const SOCKET_EVENTS = { alert: 'alert', liveOccupancy: 'live_occupancy' } as const

/** Handshake auth payload. */
export const buildSocketAuth = (token: string) => ({ token })

/** Handshake errors whose message suggests a bad/expired token: never retry these. */
export const AUTH_ERROR_PATTERN = /unauthorized|jwt|token|auth/i

const text = z.string().min(1)
const timeValue = z.union([z.number(), z.string()])

const alertSchema = z.object({
  eventId: z.union([z.string(), z.number()]).optional(),
  action: text.optional(),
  type: text.optional(),
  event: text.optional(),
  direction: text.optional(),
  zoneId: text.optional(),
  zoneName: text.optional(),
  zone: text.optional(),
  siteId: text.optional(),
  severity: text.optional(),
  level: text.optional(),
  personName: text.optional(),
  name: text.optional(),
  timestamp: timeValue.optional(),
  ts: timeValue.optional(),
  time: timeValue.optional(),
  entryUtc: timeValue.optional(),
  utc: timeValue.optional(),
})

const occupancySchema = z.object({
  siteId: text.optional(),
  zoneId: text.optional(),
  siteOccupancy: z.number().optional(),
  zoneOccupancy: z.number().optional(),
  count: z.number().optional(),
  occupancy: z.number().optional(),
  live: z.number().optional(),
  total: z.number().optional(),
  avg: z.number().optional(),
})

export interface OccupancyEvent {
  siteId?: string
  zoneId?: string
  /** Occupancy of the zone (or of the site when there is no zone id). */
  count: number
  /** Site-wide total, when the event carries one. */
  siteTotal?: number
}

function toEpochMs(value: string | number | undefined): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    if (!Number.isNaN(parsed)) return parsed
  }
  return Date.now()
}

function toSeverity(value: string | undefined): AlertSeverity {
  const v = value?.toLowerCase()
  return v === 'high' || v === 'medium' || v === 'low' ? v : 'low'
}

const ACTIONS: readonly AlertAction[] = ['entry', 'exit', 'zone-entry', 'zone-exit']

/** Exact match only; anything else is `unknown` and gets a neutral label. */
function toAction(value: string | undefined): AlertAction {
  const v = value?.toLowerCase()
  return ACTIONS.find((action) => action === v) ?? 'unknown'
}

export function parseAlertEvent(raw: unknown): AlertItem | null {
  const parsed = alertSchema.safeParse(raw)
  if (!parsed.success) return null
  const e = parsed.data

  const action = toAction(e.action ?? e.type ?? e.event ?? e.direction)
  const zoneName = e.zoneName ?? e.zone
  // `eventId` is unique per event and doubles as the dedupe key; events without it are dropped.
  if (e.eventId === undefined || !zoneName) return null

  const time = toEpochMs(e.timestamp ?? e.ts ?? e.time ?? e.entryUtc ?? e.utc)
  const personName = e.personName ?? e.name
  return {
    id: String(e.eventId),
    action,
    personName,
    zoneId: e.zoneId,
    zoneName,
    siteId: e.siteId,
    severity: toSeverity(e.severity ?? e.level),
    time,
  }
}

export function parseOccupancyEvent(raw: unknown): OccupancyEvent | null {
  const parsed = occupancySchema.safeParse(raw)
  if (!parsed.success) return null
  const e = parsed.data

  const count =
    e.zoneOccupancy ?? e.count ?? e.occupancy ?? e.live ?? e.total ?? e.avg ?? e.siteOccupancy
  if (count === undefined) return null
  return { siteId: e.siteId, zoneId: e.zoneId, count, siteTotal: e.siteOccupancy }
}
