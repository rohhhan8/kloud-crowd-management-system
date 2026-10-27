import { useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { useAppDispatch } from '@/app/hooks'
import { createRateLimit } from '@/lib/utils/rateLimit'
import { parseAlertEvent, SOCKET_EVENTS } from '../socketContract'
import { useSocketEvent } from '../socket/useSocketEvent'
import { alertReceived, clear } from '../store/alerts.slice'

const TOAST_INTERVAL_MS = 10_000

/** Feeds alerts for the selected site into the store; clears them when the site changes. */
export function useAlertsFeed(siteId: string | null) {
  const dispatch = useAppDispatch()
  const allowToast = useMemo(() => createRateLimit(TOAST_INTERVAL_MS), [])

  useEffect(() => {
    dispatch(clear())
  }, [siteId, dispatch])

  useSocketEvent<unknown>(SOCKET_EVENTS.alert, (raw) => {
    const alert = parseAlertEvent(raw)
    if (!alert || !siteId) return
    if (alert.siteId && alert.siteId !== siteId) return

    dispatch(alertReceived(alert))
    if (alert.severity === 'high' && allowToast()) {
      toast.warning(`High severity alert in ${alert.zoneName}`)
    }
  })
}
