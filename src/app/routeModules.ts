import { ROUTES } from '@/config/routes'

/** One loader per code-split page: used by the router's `lazy()` and by link prefetching. */
export const PAGE_LOADERS = {
  [ROUTES.overview]: () => import('@/pages/OverviewPage'),
  [ROUTES.entries]: () => import('@/pages/EntriesPage'),
} as const

export const loadAppLayout = () => import('./layout/AppLayout')

/** Warms the module cache for a page (e.g. on link hover/focus); safe to call repeatedly. */
export function prefetchRoute(path: string) {
  const load = PAGE_LOADERS[path as keyof typeof PAGE_LOADERS]
  if (load) void load()
}
