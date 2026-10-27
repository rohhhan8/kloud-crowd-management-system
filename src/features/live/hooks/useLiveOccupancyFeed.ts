import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/keys'
import { parseOccupancyEvent, SOCKET_EVENTS } from '../socketContract'
import { useSocketEvent } from '../socket/useSocketEvent'
import type { LiveOccupancy } from '../types'

const FLUSH_INTERVAL_MS = 1000

/**
 * Keeps per-zone counts for the selected site and publishes the site total to the query cache,
 * at most once per second. Events for other sites are ignored; state resets on site change.
 */
export function useLiveOccupancyFeed(siteId: string | null) {
  const queryClient = useQueryClient()
  const zones = useRef(new Map<string, number>())
  const siteTotal = useRef<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastFlush = useRef(0)
  const dirty = useRef(false)

  useEffect(() => {
    const zoneMap = zones.current
    zoneMap.clear()
    siteTotal.current = null
    dirty.current = false
    queryClient.removeQueries({ queryKey: queryKeys.live.all() })
    return () => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = null
    }
  }, [siteId, queryClient])

  const flush = (id: string) => {
    timer.current = null
    if (!dirty.current) return
    dirty.current = false
    lastFlush.current = Date.now()
    const total = siteTotal.current ?? [...zones.current.values()].reduce((a, b) => a + b, 0)
    queryClient.setQueryData<LiveOccupancy>(queryKeys.live.occupancy(id), { total })
  }

  useSocketEvent<unknown>(SOCKET_EVENTS.liveOccupancy, (raw) => {
    const event = parseOccupancyEvent(raw)
    if (!event || !siteId) return
    if (event.siteId && event.siteId !== siteId) return

    if (event.zoneId) zones.current.set(event.zoneId, event.count)
    siteTotal.current = event.siteTotal ?? (event.zoneId ? siteTotal.current : event.count)
    dirty.current = true

    if (timer.current) return
    const wait = Math.max(0, FLUSH_INTERVAL_MS - (Date.now() - lastFlush.current))
    timer.current = setTimeout(() => flush(siteId), wait)
  })
}
