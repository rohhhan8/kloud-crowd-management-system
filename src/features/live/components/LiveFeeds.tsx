import { useFilters } from '@/features/filters'
import { useAlertsFeed } from '../hooks/useAlertsFeed'
import { useLiveOccupancyFeed } from '../hooks/useLiveOccupancyFeed'

/** Renders nothing; wires socket events for the selected site into the store/cache. */
export function LiveFeeds() {
  const { siteId } = useFilters()
  useLiveOccupancyFeed(siteId)
  useAlertsFeed(siteId)
  return null
}
