import type { AlertAction } from '../types'

/** Single source for how each wire `direction` is described in the UI. */
export const ALERT_ACTION_LABELS: Record<AlertAction, string> = {
  entry: 'Entered',
  exit: 'Exited',
  'zone-entry': 'Entered zone',
  'zone-exit': 'Exited zone',
  unknown: 'Activity',
}
