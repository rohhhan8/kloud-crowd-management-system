import { cn } from '@/lib/utils'

const HIDE_CLASSES = { md: 'hidden md:table-cell', lg: 'hidden lg:table-cell' } as const

/** Classes for a column cell: responsive hiding plus any custom class. */
export const columnClass = (column: { className?: string; hideBelow?: 'md' | 'lg' }) =>
  cn(column.hideBelow && HIDE_CLASSES[column.hideBelow], column.className)
