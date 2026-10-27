import { useLiveChartPoint } from '../hooks/useLiveChartPoint'

/** Extra row of the chart's sr-only data table; rendered outside the memoised chart. */
export function LiveOccupancyRow() {
  const point = useLiveChartPoint()
  if (!point) return null
  return (
    <tr>
      <td>Live (now)</td>
      <td>{point.value}</td>
    </tr>
  )
}
