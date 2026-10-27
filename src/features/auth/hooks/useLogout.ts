import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/config/routes'
import { endSession } from '../utils/session'

/** Ends the session (store + query cache) and returns to the login page. */
export function useLogout() {
  const navigate = useNavigate()
  return useCallback(() => {
    endSession()
    void navigate(ROUTES.login, { replace: true })
  }, [navigate])
}
