import { jwtDecode, type JwtPayload } from 'jwt-decode'
import type { AuthUser } from '../types'

const EXPIRY_LEEWAY_MS = 10_000
// setTimeout overflows (fires immediately) above 2^31-1 ms.
const MAX_TIMEOUT_MS = 2_147_483_647

interface TokenClaims extends JwtPayload {
  email?: string
}

function decode(token: string): TokenClaims | null {
  try {
    return jwtDecode<TokenClaims>(token)
  } catch {
    return null
  }
}

/** Malformed tokens are treated as expired. Tokens without `exp` never expire client-side. */
export function isTokenExpired(token: string, now: number = Date.now()): boolean {
  const claims = decode(token)
  if (!claims) return true
  if (typeof claims.exp !== 'number') return false
  return claims.exp * 1000 - EXPIRY_LEEWAY_MS <= now
}

export function getUserFromToken(token: string): AuthUser | null {
  const claims = decode(token)
  const id = claims?.email ?? claims?.sub
  return id ? { id } : null
}

function msUntilExpiry(token: string, now: number): number | null {
  const claims = decode(token)
  if (typeof claims?.exp !== 'number') return null
  return Math.max(0, claims.exp * 1000 - EXPIRY_LEEWAY_MS - now)
}

let expiryTimer: ReturnType<typeof setTimeout> | null = null

export function clearExpiryTimer() {
  if (expiryTimer !== null) clearTimeout(expiryTimer)
  expiryTimer = null
}

export function scheduleExpiry(token: string, onExpire: () => void) {
  clearExpiryTimer()
  const delay = msUntilExpiry(token, Date.now())
  if (delay === null) return
  expiryTimer = setTimeout(
    () => {
      // Long-lived tokens exceed the timer limit; re-check instead of firing early.
      if (isTokenExpired(token)) onExpire()
      else scheduleExpiry(token, onExpire)
    },
    Math.min(delay, MAX_TIMEOUT_MS),
  )
}
