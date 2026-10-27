/** Only the global filters travel between pages; page-specific params (page, size) do not. */
const CARRIED_PARAMS = ['site', 'range'] as const

/** The `?site=&range=` part of `search` (empty string when neither is present). */
export function carriedSearch(search: string): string {
  const current = new URLSearchParams(search)
  const carried = new URLSearchParams()
  for (const key of CARRIED_PARAMS) {
    const value = current.get(key)
    if (value !== null) carried.set(key, value)
  }
  const text = carried.toString()
  return text ? `?${text}` : ''
}
