import axios from 'axios'
import type { ApiErrorBody } from '@/types/api'

export class ApiError extends Error {
  readonly status: number | null
  readonly code?: string

  constructor(status: number | null, message: string, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

const NETWORK_MESSAGE = "Can't reach the server. Check your connection and try again."

function messageForStatus(status: number | null): string {
  if (status === null) return NETWORK_MESSAGE
  if (status === 400 || status === 422) return 'The request was invalid.'
  if (status === 401) return 'Your session has expired. Please sign in again.'
  if (status === 403) return "You don't have permission to do that."
  if (status === 404) return "We couldn't find what you were looking for."
  if (status === 429) return 'Too many requests. Please wait a moment and try again.'
  if (status >= 500) return 'Something went wrong on our side. Please try again.'
  return 'Something went wrong. Please try again.'
}

function serverMessage(data: unknown): string | undefined {
  if (typeof data !== 'object' || data === null) return undefined
  const { message, errorMessage } = data as ApiErrorBody
  const text = message ?? errorMessage
  return typeof text === 'string' && text.trim() ? text : undefined
}

export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null
    const message =
      status === null
        ? NETWORK_MESSAGE
        : (serverMessage(error.response?.data) ?? messageForStatus(status))
    return new ApiError(status, message, error.code)
  }

  return new ApiError(null, error instanceof Error ? error.message : messageForStatus(null))
}
