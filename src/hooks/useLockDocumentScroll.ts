import { useEffect } from 'react'

/**
 * Stops the browser window from scrolling while mounted, for app-shell layouts where an
 * inner region (e.g. <main>) is the only scroll container. Prevents double scrollbars.
 */
export function useLockDocumentScroll() {
  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [])
}
