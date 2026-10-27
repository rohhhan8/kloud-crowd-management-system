import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
  /** Tighter layout for widgets/cards. */
  compact?: boolean
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  compact,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 p-6 text-center',
        compact ? 'h-full min-h-32 gap-2 p-3' : 'min-h-64',
      )}
    >
      <AlertTriangle
        className={cn('text-destructive', compact ? 'size-6' : 'size-10')}
        aria-hidden="true"
      />
      <h2 className={cn('font-semibold', compact ? 'text-sm' : 'text-lg')}>{title}</h2>
      <p className="max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button size={compact ? 'sm' : 'default'} onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}
