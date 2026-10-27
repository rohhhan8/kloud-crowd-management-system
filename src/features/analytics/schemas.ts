import { z } from 'zod'

// Confirmed contract. Responses echo siteId/fromUtc/toUtc; they are optional here because
// nothing depends on them.
const echo = {
  siteId: z.string().optional(),
  fromUtc: z.number().optional(),
  toUtc: z.number().optional(),
}

export const footfallSchema = z.object({ ...echo, footfall: z.number() })

export const dwellSchema = z.object({
  ...echo,
  avgDwellMinutes: z.number(),
  dwellRecords: z.number(),
})

// `local` is a display string in the site time zone; we ignore it and format `utc` ourselves.
export const occupancySchema = z.object({
  ...echo,
  timezone: z.string(),
  buckets: z.array(z.object({ utc: z.number(), local: z.string(), avg: z.number() })),
})

export const demographicsSchema = z.object({
  ...echo,
  timezone: z.string(),
  buckets: z.array(
    z.object({ utc: z.number(), local: z.string(), male: z.number(), female: z.number() }),
  ),
})

export type FootfallResponse = z.infer<typeof footfallSchema>
export type DwellResponse = z.infer<typeof dwellSchema>
export type OccupancyResponse = z.infer<typeof occupancySchema>
export type DemographicsResponse = z.infer<typeof demographicsSchema>
