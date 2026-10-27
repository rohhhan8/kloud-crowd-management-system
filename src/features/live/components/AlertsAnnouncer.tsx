import { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '@/app/hooks'
import { selectUnreadCount } from '../store/alerts.slice'

const ANNOUNCE_INTERVAL_MS = 5000

/** Screen-reader summary ("3 new alerts"), at most once per 5 s; individual events are not announced. */
export function AlertsAnnouncer() {
  const unread = useAppSelector(selectUnreadCount)
  const [message, setMessage] = useState('')
  const announced = useRef(0)
  const lastAt = useRef(0)

  useEffect(() => {
    if (unread === 0) {
      announced.current = 0
      return
    }
    if (unread <= announced.current) return

    const wait = Math.max(0, ANNOUNCE_INTERVAL_MS - (Date.now() - lastAt.current))
    const timer = setTimeout(() => {
      lastAt.current = Date.now()
      announced.current = unread
      setMessage(`${unread} new alert${unread === 1 ? '' : 's'}`)
    }, wait)
    return () => clearTimeout(timer)
  }, [unread])

  return (
    <div aria-live="polite" className="sr-only">
      {message}
    </div>
  )
}
