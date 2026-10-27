/** "Ada Lovelace" -> "AL", "Ada" -> "A", "" -> "?". */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  const letters = [parts[0], parts.length > 1 ? parts.at(-1) : undefined]
  return (
    letters
      .map((part) => part?.[0] ?? '')
      .join('')
      .toUpperCase() || '?'
  )
}
