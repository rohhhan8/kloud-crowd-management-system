import { Navigate, Outlet } from 'react-router'
import { ROUTES } from '@/config/routes'
import { useAuth } from '../hooks/useAuth'

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) return <Navigate to={ROUTES.overview} replace />
  return <Outlet />
}
