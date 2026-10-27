import { QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/lib/http/errors'

const MAX_RETRIES = 2

function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= MAX_RETRIES) return false
  if (!(error instanceof ApiError)) return false
  // status null = network error/timeout; never retry 4xx.
  return error.status === null || error.status >= 500
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: shouldRetry },
    mutations: { retry: false },
  },
})
