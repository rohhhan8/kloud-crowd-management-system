import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { loggedOut } from '@/features/auth/store/auth.slice'
import type { AlertItem } from '../types'

export const MAX_ALERTS = 50

export interface AlertsState {
  items: AlertItem[]
  unreadCount: number
  /** Ids of items received since the drawer was last opened (highlighted until read). */
  unreadIds: string[]
  /** Whether the alerts drawer is open (so a shortcut can open it). */
  drawerOpen: boolean
}

const initialState: AlertsState = { items: [], unreadCount: 0, unreadIds: [], drawerOpen: false }

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    alertReceived: (state, action: PayloadAction<AlertItem>) => {
      if (state.items.some((item) => item.id === action.payload.id)) return
      state.items.unshift(action.payload)
      state.items.length = Math.min(state.items.length, MAX_ALERTS)
      state.unreadIds.unshift(action.payload.id)
      state.unreadIds.length = Math.min(state.unreadIds.length, MAX_ALERTS)
      state.unreadCount += 1
    },
    /** Zeroes the bell count; highlights stay until `clearHighlights`. */
    markAllRead: (state) => {
      state.unreadCount = 0
    },
    clearHighlights: (state) => {
      state.unreadIds = []
    },
    clear: (state) => ({ ...initialState, drawerOpen: state.drawerOpen }),
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.drawerOpen = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loggedOut, () => initialState)
  },
})

export const { alertReceived, markAllRead, clearHighlights, clear, setDrawerOpen } =
  alertsSlice.actions
export const alertsReducer = alertsSlice.reducer

interface WithAlerts {
  alerts: AlertsState
}

export const selectAlerts = (state: WithAlerts) => state.alerts.items
export const selectUnreadCount = (state: WithAlerts) => state.alerts.unreadCount
export const selectDrawerOpen = (state: WithAlerts) => state.alerts.drawerOpen
export const selectUnreadIds = (state: WithAlerts) => state.alerts.unreadIds
