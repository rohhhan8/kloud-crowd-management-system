import { postValidated } from '@/lib/http/validated'
import { entriesResponseSchema, type EntriesResponse } from '../schemas'
import type { EntriesParams } from '../types'

export const getEntries = (params: EntriesParams): Promise<EntriesResponse> =>
  postValidated('/api/analytics/entry-exit', entriesResponseSchema, params)
