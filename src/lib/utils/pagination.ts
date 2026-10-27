export type PageItem = number | 'ellipsis'

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i)

/**
 * Page numbers to render, always including the first and last page, e.g. `1 … 4 5 6 … 369`.
 * The slot count is constant (siblingCount * 2 + 5) so the control does not jump around, and
 * an ellipsis is only used where it hides at least two pages. Small totals show every page.
 */
export function getPageWindow(page: number, totalPages: number, siblingCount = 1): PageItem[] {
  if (totalPages < 1) return []

  const slots = siblingCount * 2 + 5
  if (totalPages <= slots) return range(1, totalPages)

  const current = Math.min(Math.max(page, 1), totalPages)
  const left = Math.max(current - siblingCount, 1)
  const right = Math.min(current + siblingCount, totalPages)
  const showLeftDots = left > 3
  const showRightDots = right < totalPages - 2
  const edgeCount = siblingCount * 2 + 3

  if (!showLeftDots && showRightDots) return [...range(1, edgeCount), 'ellipsis', totalPages]
  if (showLeftDots && !showRightDots) {
    return [1, 'ellipsis', ...range(totalPages - edgeCount + 1, totalPages)]
  }
  return [1, 'ellipsis', ...range(left, right), 'ellipsis', totalPages]
}
