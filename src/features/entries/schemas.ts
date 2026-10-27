import { z } from 'zod'

// Confirmed contract for POST /api/analytics/entry-exit. Echoed request fields are optional.
const recordSchema = z.object({
  personId: z.string(),
  personName: z.string(),
  gender: z.string(),
  zoneId: z.string(),
  zoneName: z.string(),
  // Unknown severities degrade to "low" instead of failing the whole page.
  severity: z.enum(['high', 'medium', 'low']).catch('low'),
  entryUtc: z.number(),
  exitUtc: z.number().nullable(),
  dwellMinutes: z.number().nullable(),
})

export const entriesResponseSchema = z.object({
  siteId: z.string().optional(),
  fromUtc: z.number().optional(),
  toUtc: z.number().optional(),
  pageSize: z.number(),
  pageNumber: z.number(),
  totalRecords: z.number(),
  totalPages: z.number(),
  records: z.array(recordSchema),
})

export type EntriesResponse = z.infer<typeof entriesResponseSchema>
export type EntryRecord = EntriesResponse['records'][number]
