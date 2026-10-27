import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthStatus, AuthUser } from '../types'
import { getUserFromToken, isTokenExpired } from '../utils/token'

export interface AuthState {
  token: string | null
  user: AuthUser | null
  status: AuthStatus
}

const LOGGED_OUT: AuthState = { token: null, user: null, status: 'unauthenticated' }

/** A token is only accepted when it decodes, identifies a user and has not expired. */
export function sessionFor(token: string | null): AuthState {
  if (!token) return LOGGED_OUT
  const user = getUserFromToken(token)
  if (!user || isTokenExpired(token)) return LOGGED_OUT
  return { token, user, status: 'authenticated' }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: LOGGED_OUT,
  reducers: {
    loggedIn: (_state, action: PayloadAction<string>) => sessionFor(action.payload),
    loggedOut: () => LOGGED_OUT,
  },
})

export const { loggedIn, loggedOut } = authSlice.actions
export const authReducer = authSlice.reducer

interface WithAuth {
  auth: AuthState
}

export const selectToken = (state: WithAuth) => state.auth.token
export const selectUser = (state: WithAuth) => state.auth.user
export const selectIsAuthenticated = (state: WithAuth) => state.auth.status === 'authenticated'
