import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { Socket } from 'socket.io-client'
import { useAppSelector } from '@/app/hooks'
import { selectToken } from '@/features/auth/store/auth.slice'
import { endSession } from '@/features/auth/utils/session'
import { AUTH_ERROR_PATTERN } from '../socketContract'
import type { SocketStatus } from '../types'
import { createSocket } from './createSocket'
import { SocketContext } from './SocketContext'

/**
 * Owns the single socket for the protected area: created when a token exists, re-created when
 * the token changes, and fully torn down (listeners + connection) on logout/unmount.
 */
export function SocketProvider({ children }: { children: ReactNode }) {
  const token = useAppSelector(selectToken)
  // Written only from socket callbacks; `token` ties the state to the socket's own session.
  const [state, setState] = useState<{
    token: string
    socket: Socket
    status: SocketStatus
  } | null>(null)

  useEffect(() => {
    if (!token) return
    const socket = createSocket(token)
    const setStatus = (status: SocketStatus) => setState({ token, socket, status })
    let authFailed = false
    let wasDown = false

    socket.on('connect', () => {
      setStatus('connected')
      if (wasDown) toast.success('Live updates restored')
      wasDown = false
    })
    socket.on('disconnect', (reason) => {
      // `io client disconnect` is our own teardown; anything else will be retried.
      if (reason === 'io client disconnect') return
      wasDown = true
      setStatus('reconnecting')
    })
    socket.on('connect_error', (error) => {
      if (AUTH_ERROR_PATTERN.test(error.message)) {
        if (authFailed) return
        authFailed = true
        socket.io.opts.reconnection = false
        socket.disconnect()
        setStatus('error')
        endSession() // existing global logout; ProtectedRoute redirects to login
        return
      }
      wasDown = true
      setStatus('reconnecting')
    })
    socket.io.on('reconnect_attempt', () => setStatus('reconnecting'))

    // Deferred a tick: StrictMode's immediate mount/unmount/mount must not abort a handshake
    // half-way (that leaks an open connection); the first run is cancelled before it starts.
    const connectTimer = setTimeout(() => socket.connect(), 0)

    return () => {
      clearTimeout(connectTimer)
      socket.disconnect()
      socket.removeAllListeners()
      socket.io.removeAllListeners()
      socket.offAny()
    }
  }, [token])

  const value = useMemo(() => {
    if (!token) return { socket: null, status: 'disconnected' as const }
    if (state?.token !== token) return { socket: null, status: 'connecting' as const }
    return { socket: state.socket, status: state.status }
  }, [token, state])
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
