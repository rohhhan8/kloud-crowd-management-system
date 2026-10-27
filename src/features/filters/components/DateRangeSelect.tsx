import { CalendarDays } from 'lucide-react'
import { FilterSelect } from '@/components/shared/FilterSelect'
import { DATE_RANGE_PRESETS, isDateRangePreset } from '@/config/dateRanges'
import { useFilters } from '../hooks/useFilters'

export function DateRangeSelect({ className }: { className?: string }) {
  const { range, setRange } = useFilters()

  return (
    <FilterSelect
      aria-label="Select date range"
      icon={CalendarDays}
      className={className}
      value={range}
      options={DATE_RANGE_PRESETS}
      onChange={(value) => isDateRangePreset(value) && setRange(value)}
    />
  )
}
