import { io, type Socket } from 'socket.io-client'
import { env } from '@/lib/env'
import { buildSocketAuth } from '../socketContract'

export const SOCKET_URL = env.VITE_SOCKET_URL ?? env.VITE_API_BASE_URL

/** Creates (but does not connect) a socket authenticated with the given token. */
export function createSocket(token: string): Socket {
  return io(SOCKET_URL, {
    autoConnect: false,
    auth: buildSocketAuth(token),
    transports: ['websocket'],
    reconnectionAttempts: Infinity,
    reconnectionDelayMax: 10_000,
  })
}
