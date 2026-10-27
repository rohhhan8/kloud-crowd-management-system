import { store } from '@/app/store'
import { queryClient } from '@/lib/queryClient'
import { loggedOut } from '../store/auth.slice'

/** Clears auth state and all cached server data. */
export function endSession() {
  store.dispatch(loggedOut())
  queryClient.clear()
}
