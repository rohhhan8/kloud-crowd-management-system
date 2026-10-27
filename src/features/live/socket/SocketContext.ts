import { createContext, useContext } from 'react'
import type { Socket } from 'socket.io-client'
import type { SocketStatus } from '../types'

export interface SocketContextValue {
  socket: Socket | null
  status: SocketStatus
}

export const SocketContext = createContext<SocketContextValue>({
  socket: null,
  status: 'disconnected',
})

export function useSocket() {
  return useContext(SocketContext)
}
