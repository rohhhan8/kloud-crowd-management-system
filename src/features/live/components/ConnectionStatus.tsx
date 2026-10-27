import { cn } from '@/lib/utils'
import { useSocket } from '../socket/SocketContext'
import type { SocketStatus } from '../types'

const DISPLAY: Record<SocketStatus, { text: string; dot: string }> = {
  connected: { text: 'Live', dot: 'bg-green-500' },
  connecting: { text: 'Connecting...', dot: 'bg-amber-500' },
  reconnecting: { text: 'Reconnecting...', dot: 'bg-amber-500' },
  disconnected: { text: 'Offline', dot: 'bg-neutral-400' },
  error: { text: 'Offline', dot: 'bg-red-500' },
}

/** Dot plus text, so colour is never the only signal. */
export function ConnectionStatus() {
  const { status } = useSocket()
  const { text, dot } = DISPLAY[status]

  return (
    <span role="status" className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span aria-hidden="true" className={cn('size-2 rounded-full', dot)} />
      <span className="hidden sm:inline">{text}</span>
      <span className="sr-only sm:hidden">{text}</span>
    </span>
  )
}
