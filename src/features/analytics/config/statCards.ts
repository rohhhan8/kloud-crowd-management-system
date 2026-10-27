import { useDwellStat, useFootfallStat, useOccupancyStat } from '../hooks/useStatCards'
import type { StatCardState } from '../types'

interface StatCardConfig {
  id: string
  useStat: () => StatCardState
}

/** Cards are grouped as in the design: occupancy + footfall share one card, dwell has its own. */
export const STAT_CARD_GROUPS: readonly (readonly StatCardConfig[])[] = [
  [
    { id: 'occupancy', useStat: useOccupancyStat },
    { id: 'footfall', useStat: useFootfallStat },
  ],
  [{ id: 'dwell', useStat: useDwellStat }],
]
