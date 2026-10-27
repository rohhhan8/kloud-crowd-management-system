import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z.url(),
  /** Socket.IO origin; defaults to the API origin. */
  VITE_SOCKET_URL: z.url().optional(),
})

const parsed = envSchema.safeParse(import.meta.env)

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${z.prettifyError(parsed.error)}`)
}

export const env = parsed.data


