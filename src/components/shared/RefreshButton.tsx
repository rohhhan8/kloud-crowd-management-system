import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RefreshButtonProps {
  label: string
  isFetching: boolean
  onRefresh: () => unknown
}

export function RefreshButton({ label, isFetching, onRefresh }: RefreshButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={label}
      title={label}
      onClick={() => void onRefresh()}
    >
      <RefreshCw className={cn(isFetching && 'animate-spin')} aria-hidden="true" />
    </Button>
  )
}
