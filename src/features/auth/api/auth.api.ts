import { http } from '@/lib/http/client'
import { LOGIN_PATH } from '@/lib/http/interceptors'
import type { LoginCredentials } from '../types'

/** The login body is a bare token string or an object carrying `token` or `accessToken`. */
export function extractToken(body: unknown): string {
  if (typeof body === 'string' && body.trim()) return body.trim()

  if (typeof body === 'object' && body !== null) {
    const { token, accessToken } = body as { token?: unknown; accessToken?: unknown }
    if (typeof token === 'string' && token) return token
    if (typeof accessToken === 'string' && accessToken) return accessToken
  }

  throw new Error('Unexpected login response: no token found.')
}

export async function login(credentials: LoginCredentials): Promise<string> {
  const { data } = await http.post<unknown>(LOGIN_PATH, credentials)
  return extractToken(data)
}
