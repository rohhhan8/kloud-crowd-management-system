export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  /** Email or subject claim, whichever the JWT carries. */
  id: string
}

export type AuthStatus = 'authenticated' | 'unauthenticated'
