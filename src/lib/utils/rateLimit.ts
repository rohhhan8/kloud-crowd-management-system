/** Returns a gate that answers `true` at most once per `ms` window. */
export function createRateLimit(ms: number, now: () => number = Date.now) {
  let last = Number.NEGATIVE_INFINITY
  return () => {
    const t = now()
    if (t - last < ms) return false
    last = t
    return true
  }
}
