import { z } from 'zod'
import type { Site } from '../types'

// Confirmed contract: GET /api/sites returns a plain array of these.
const zoneSchema = z.object({
  zoneId: z.string(),
  name: z.string(),
  securityLevel: z.enum(['high', 'medium', 'low']),
})

const siteSchema = z.object({
  siteId: z.string(),
  name: z.string(),
  city: z.string(),
  country: z.string(),
  timezone: z.string().min(1),
  zones: z.array(zoneSchema),
})

export function normalizeSite(raw: unknown): Site {
  const parsed = siteSchema.safeParse(raw)
  if (!parsed.success) throw new Error('Unexpected site format.')

  const { siteId, zones, ...rest } = parsed.data
  return {
    ...rest,
    id: siteId,
    zones: zones.map(({ zoneId, ...zone }) => ({ ...zone, id: zoneId })),
  }
}

export function normalizeSitesResponse(raw: unknown): Site[] {
  if (!Array.isArray(raw)) throw new Error('Unexpected sites response: expected an array.')
  return raw.map(normalizeSite)
}
