import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { loggedIn, selectIsAuthenticated, selectUser } from '../store/auth.slice'
import { endSession } from '../utils/session'

export function useAuth() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const login = useCallback((token: string) => dispatch(loggedIn(token)), [dispatch])

  return { user, isAuthenticated, login, logout: endSession }
}
