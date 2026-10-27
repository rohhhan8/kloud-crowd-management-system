import { memo, type ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { columnClass } from '@/lib/utils/table'

export interface DataTableColumn<T> {
  id: string
  header: string
  cell: (row: T) => ReactNode
  /** Placeholder shown in this column while loading (defaults to a plain bar). */
  skeleton?: ReactNode
  className?: string
  /** Hide the column below this breakpoint. */
  hideBelow?: 'md' | 'lg'
}

interface DataTableProps<T> {
  columns: readonly DataTableColumn<T>[]
  rows: readonly T[]
  getRowKey: (row: T) => string
  /** Screen-reader-only table caption. */
  caption: string
  /** Initial load: renders `skeletonRows` placeholder rows. */
  isLoading?: boolean
  skeletonRows?: number
  /** Refetching with previous rows visible: dims the body and sets aria-busy. */
  isFetching?: boolean
  emptyMessage?: string
}

function DataTableBase<T>({
  columns,
  rows,
  getRowKey,
  caption,
  isLoading = false,
  skeletonRows = 10,
  isFetching = false,
  emptyMessage = 'No data.',
}: DataTableProps<T>) {
  const showEmpty = !isLoading && rows.length === 0

  return (
    <Table aria-busy={isLoading || isFetching}>
      <TableCaption className="sr-only">{caption}</TableCaption>
      <TableHeader className="bg-muted/60">
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.id} scope="col" className={columnClass(column)}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className={cn('transition-opacity', isFetching && 'opacity-50')}>
        {isLoading &&
          Array.from({ length: skeletonRows }, (_, i) => (
            <TableRow key={`skeleton-${i}`}>
              {columns.map((column) => (
                <TableCell key={column.id} className={columnClass(column)}>
                  {column.skeleton ?? <Skeleton className="h-5 w-full max-w-40" />}
                </TableCell>
              ))}
            </TableRow>
          ))}
        {!isLoading &&
          rows.map((row) => (
            <TableRow key={getRowKey(row)}>
              {columns.map((column) => (
                <TableCell key={column.id} className={columnClass(column)}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        {showEmpty && (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

/** Memoised: only re-renders when rows/columns/loading flags actually change. */
export const DataTable = memo(DataTableBase) as typeof DataTableBase
