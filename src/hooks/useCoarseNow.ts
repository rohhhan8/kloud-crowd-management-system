import { useEffect, useState } from 'react'
import { floorToInterval } from '@/lib/utils/date'

const FIVE_MINUTES_MS = 300_000

/**
 * A Date that only changes every `intervalMs` (floored to the interval mark), so query
 * keys derived from "now" stay stable and data refreshes about every 5 minutes.
 */
export function useCoarseNow(intervalMs = FIVE_MINUTES_MS): Date {
  const [now, setNow] = useState(() => new Date(floorToInterval(Date.now(), intervalMs)))

  useEffect(() => {
    const id = setInterval(
      () => setNow(new Date(floorToInterval(Date.now(), intervalMs))),
      intervalMs,
    )
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
