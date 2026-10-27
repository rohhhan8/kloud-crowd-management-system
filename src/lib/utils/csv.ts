const FORMULA_START = /^[=+\-@\t\r]/

/**
 * One CSV cell. Cells that spreadsheets would evaluate as formulas (`= + - @`) are prefixed
 * with a single quote (CSV/formula injection guard); quotes are doubled and fields containing
 * separators, quotes or newlines are wrapped in quotes.
 */
export function escapeCsvCell(value: string | number | null | undefined): string {
  let text = value === null || value === undefined ? '' : String(value)
  if (typeof value === 'string' && FORMULA_START.test(text)) text = `'${text}`
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

export function toCsv(
  header: readonly string[],
  rows: readonly (readonly (string | number | null | undefined)[])[],
): string {
  return [header, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\r\n')
}
