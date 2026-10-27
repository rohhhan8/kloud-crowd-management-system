export type AlertSeverity = 'high' | 'medium' | 'low'

export type AlertAction = 'entry' | 'exit' | 'zone-entry' | 'zone-exit' | 'unknown'

export interface AlertItem {
  id: string
  action: AlertAction
  personName?: string
  zoneId?: string
  zoneName: string
  siteId?: string
  severity: AlertSeverity
  /** Epoch ms. */
  time: number
}

export type SocketStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected' | 'error'

export interface LiveOccupancy {
  total: number
}
