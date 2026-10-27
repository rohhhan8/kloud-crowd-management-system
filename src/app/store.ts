import { configureStore } from '@reduxjs/toolkit'
import { authReducer, loggedOut, sessionFor } from '@/features/auth/store/auth.slice'
import { alertsReducer } from '@/features/live/store/alerts.slice'
import { readStoredToken, writeStoredToken } from '@/features/auth/store/persistence'
import { clearExpiryTimer, scheduleExpiry } from '@/features/auth/utils/token'

export function createAppStore() {
  // Expired or malformed stored tokens hydrate to logged-out.
  const store = configureStore({
    reducer: { auth: authReducer, alerts: alertsReducer },
    preloadedState: { auth: sessionFor(readStoredToken()) },
  })

  // Side effects (storage + expiry timer) live outside reducers.
  let syncedToken: string | null | undefined
  const sync = () => {
    const { token } = store.getState().auth
    if (token === syncedToken) return
    syncedToken = token
    writeStoredToken(token)
    if (token) scheduleExpiry(token, () => store.dispatch(loggedOut()))
    else clearExpiryTimer()
  }
  store.subscribe(sync)
  sync()

  return store
}

export const store = createAppStore()

export type AppStore = ReturnType<typeof createAppStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
