import type { ReactNode } from 'react'

export interface ChartTable {
  caption: string
  columns: readonly string[]
  rows: readonly (readonly (string | number)[])[]
}

/** Screen-reader-only data table that mirrors a chart. */
export function ChartDataTable({
  caption,
  columns,
  rows,
  children,
}: ChartTable & { /** Extra `<tr>` rows appended to the body. */ children?: ReactNode }) {
  return (
    <table className="sr-only">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={String(row[0])}>
            {row.map((cell, index) => (
              <td key={columns[index]}>{cell}</td>
            ))}
          </tr>
        ))}
        {children}
      </tbody>
    </table>
  )
}
