import { QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { endSession } from '@/features/auth/utils/session'
import { http } from '@/lib/http/client'
import { attachInterceptors, setUnauthorizedHandler } from '@/lib/http/interceptors'
import { queryClient } from '@/lib/queryClient'
import { ROUTES } from '@/config/routes'
import { router } from './router'
import { store } from './store'

attachInterceptors(http, { getToken: () => store.getState().auth.token })

setUnauthorizedHandler(() => {
  // Already signed out (e.g. a stray request after logout): nothing to do.
  if (!store.getState().auth.token) return
  endSession()
  toast.error('Your session has expired. Please sign in again.')
  const { pathname, search, hash } = router.state.location
  void router.navigate(ROUTES.login, { replace: true, state: { from: { pathname, search, hash } } })
})

export function Providers() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors />
      </QueryClientProvider>
    </Provider>
  )
}
