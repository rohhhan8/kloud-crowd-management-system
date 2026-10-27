import { useCallback } from 'react'
import { toCsv } from '@/lib/utils/csv'

type Cell = string | number | null | undefined

/** Client-side CSV download from rows that are already loaded (no extra requests). */
export function useCsvExport() {
  return useCallback(
    (filename: string, header: readonly string[], rows: readonly (readonly Cell[])[]) => {
      // BOM so Excel reads UTF-8 names correctly.
      const blob = new Blob(['﻿', toCsv(header, rows)], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
    },
    [],
  )
}
