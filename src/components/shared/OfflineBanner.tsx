import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

/** Shown only while the browser reports it is offline. */
export function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null

  return (
    <div
      role="alert"
      className="flex shrink-0 items-center justify-center gap-2 bg-amber-100 px-4 py-1.5 text-sm text-amber-900"
    >
      <WifiOff className="size-4" aria-hidden="true" />
      You are offline. Data may be out of date until your connection returns.
    </div>
  )
}
