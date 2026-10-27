import type { ReactNode } from 'react'
import { normalizeError } from '@/lib/http/errors'
import { ErrorState } from './ErrorState'
import { PageSkeleton } from './PageSkeleton'

/** The subset of a TanStack query result the boundary needs (a UseQueryResult fits). */
export interface BoundaryQuery<TData> {
  data: TData | undefined
  error: unknown
  isPending: boolean
  isError: boolean
  refetch: () => unknown
}

interface QueryBoundaryProps<TData> {
  query: BoundaryQuery<TData>
  /** Custom loading UI; defaults to a page skeleton. */
  loading?: ReactNode
  /** Rendered when the data is empty (see `isEmpty`). */
  empty?: ReactNode
  /** Defaults to treating empty arrays as empty. */
  isEmpty?: (data: TData) => boolean
  /** Smaller error state for use inside cards. */
  compactError?: boolean
  /** Replaces the default ErrorState, e.g. to keep a card frame around the error. */
  errorFallback?: (error: { message: string; onRetry: () => void }) => ReactNode
  children: (data: TData) => ReactNode
}

const defaultIsEmpty = (data: unknown) => Array.isArray(data) && data.length === 0

export function QueryBoundary<TData>({
  query,
  loading = <PageSkeleton />,
  empty,
  isEmpty = defaultIsEmpty,
  compactError,
  errorFallback,
  children,
}: QueryBoundaryProps<TData>) {
  if (query.isPending) return <>{loading}</>

  if (query.isError) {
    const message = normalizeError(query.error).message
    const onRetry = () => void query.refetch()
    if (errorFallback) return <>{errorFallback({ message, onRetry })}</>
    return <ErrorState compact={compactError} message={message} onRetry={onRetry} />
  }

  if (empty !== undefined && isEmpty(query.data as TData)) return <>{empty}</>

  return <>{children(query.data as TData)}</>
}
