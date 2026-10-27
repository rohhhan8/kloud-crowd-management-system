import { useEffect, useRef } from 'react'
import { useSocket } from './SocketContext'

/**
 * Subscribes to a socket event for the component's lifetime. The latest handler is kept in a
 * ref, so a new handler identity never resubscribes; cleanup always unsubscribes.
 */
export function useSocketEvent<T>(event: string, handler: (payload: T) => void) {
  const { socket } = useSocket()
  const handlerRef = useRef(handler)

  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    if (!socket) return
    const listener = (payload: T) => handlerRef.current(payload)
    socket.on(event, listener)
    return () => {
      socket.off(event, listener)
    }
  }, [socket, event])
}
