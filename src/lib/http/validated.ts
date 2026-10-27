import type { z } from 'zod'
import { http } from './client'
import { ApiError } from './errors'

// The backend answers analytics-style calls in ~1.5-3.5s and appears to serialise them, so
// several parallel requests can queue past the default 15s client timeout.
export const SLOW_REQUEST_TIMEOUT_MS = 40_000

const UNEXPECTED_RESPONSE = 'Received an unexpected response from the server.'

/** POSTs a body and validates the response. Never logs or echoes the payload. */
export async function postValidated<T>(
  path: string,
  schema: z.ZodType<T>,
  body: object,
): Promise<T> {
  const { data } = await http.post<unknown>(path, body, { timeout: SLOW_REQUEST_TIMEOUT_MS })
  const parsed = schema.safeParse(data)
  if (!parsed.success) throw new ApiError(null, UNEXPECTED_RESPONSE)
  return parsed.data
}
