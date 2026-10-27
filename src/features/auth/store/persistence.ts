const STORAGE_KEY = 'auth'

/** Storage can throw (private mode, blocked site data); auth must degrade to logged-out. */
export function readStoredToken(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function writeStoredToken(token: string | null) {
  try {
    if (token) localStorage.setItem(STORAGE_KEY, token)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Session simply won't survive a refresh.
  }
}
