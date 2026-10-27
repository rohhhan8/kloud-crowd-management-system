import type { ReactNode } from 'react'
import { ChartDataTable, type ChartTable } from './ChartDataTable'

interface ChartFrameProps {
  /** Summary read by assistive tech, e.g. "Occupancy per hour, peak 118 at 15:00". */
  label: string
  table: ChartTable
  /** Extra `<tr>` rows for the sr-only table (e.g. a live value) without re-rendering the chart. */
  tableRows?: ReactNode
  children: ReactNode
}

/** Accessible wrapper: the graphic is an image with a summary; the data lives in a table. */
export function ChartFrame({ label, table, tableRows, children }: ChartFrameProps) {
  return (
    <>
      <div role="img" aria-label={label} className="h-full w-full">
        {children}
      </div>
      <ChartDataTable {...table}>{tableRows}</ChartDataTable>
    </>
  )
}
