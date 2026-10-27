import { useFilters } from '../hooks/useFilters'
import { DateRangeSelect } from './DateRangeSelect'

/** Date-range select plus the site time zone the range is evaluated in. */
export function DateFilter() {
  const { timeZone } = useFilters()

  return (
    <>
      {timeZone && <span className="text-xs text-muted-foreground">{timeZone}</span>}
      <DateRangeSelect />
    </>
  )
}
