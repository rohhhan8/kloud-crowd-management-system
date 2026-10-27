import { getPresetConfig } from '@/config/dateRanges'
import { useFilters } from '@/features/filters'
import { formatDuration, formatInteger } from '@/lib/utils/format'
import type { StatCardState } from '../types'
import { useDwellComparison, useFootfallComparison } from './useComparison'
import { useLiveOccupancy } from './useLiveOccupancy'

/** Each hook adapts one metric to the uniform shape the stat card container renders. */

export function useOccupancyStat(): StatCardState {
  const { value, label, isLoading, error, refetch } = useLiveOccupancy()
  return {
    label: 'Live Occupancy',
    value: value === null ? null : formatInteger(value),
    caption: label,
    isLoading,
    error,
    refetch,
  }
}

export function useFootfallStat(): StatCardState {
  const { range } = useFilters()
  const preset = getPresetConfig(range)
  const { current, change, isComparisonLoading, isLoading, error, refetch } =
    useFootfallComparison()
  return {
    label: range === 'today' ? "Today's Footfall" : 'Footfall',
    value: current === null ? null : formatInteger(current),
    trend: { change, comparedTo: preset.comparedTo, loading: isComparisonLoading },
    isLoading,
    error,
    refetch,
  }
}

export function useDwellStat(): StatCardState {
  const { range } = useFilters()
  const preset = getPresetConfig(range)
  const { current, change, isComparisonLoading, isLoading, error, refetch } = useDwellComparison()
  return {
    label: 'Avg Dwell Time',
    value: current === null ? null : formatDuration(current),
    trend: { change, comparedTo: preset.comparedTo, loading: isComparisonLoading },
    isLoading,
    error,
    refetch,
  }
}
