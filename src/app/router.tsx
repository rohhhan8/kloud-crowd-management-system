import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter, useRouteError, type RouteObject } from 'react-router'
import { ErrorState } from '@/components/shared/ErrorState'
import { PageSkeleton } from '@/components/shared/PageSkeleton'
import { ROUTES } from '@/config/routes'
import { ProtectedRoute, PublicOnlyRoute } from '@/features/auth'
import { loadAppLayout, PAGE_LOADERS } from './routeModules'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const OverviewPage = lazy(PAGE_LOADERS[ROUTES.overview])
const EntriesPage = lazy(PAGE_LOADERS[ROUTES.entries])
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

const page = (node: ReactNode) => <Suspense fallback={<PageSkeleton />}>{node}</Suspense>

function RouteError() {
  const error = useRouteError()
  const message = error instanceof Error ? error.message : undefined
  return <ErrorState message={message} onRetry={() => window.location.reload()} />
}

export const routes: RouteObject[] = [
  {
    errorElement: <RouteError />,
    HydrateFallback: PageSkeleton,
    children: [
      {
        element: <PublicOnlyRoute />,
        children: [{ path: ROUTES.login, element: page(<LoginPage />) }],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            // The app shell (menus, selects, socket client) stays out of the login path.
            lazy: async () => ({ Component: (await loadAppLayout()).AppLayout }),
            children: [
              { path: ROUTES.overview, element: page(<OverviewPage />) },
              { path: ROUTES.entries, element: page(<EntriesPage />) },
            ],
          },
        ],
      },
      { path: '*', element: page(<NotFoundPage />) },
    ],
  },
]

export const router = createBrowserRouter(routes)
