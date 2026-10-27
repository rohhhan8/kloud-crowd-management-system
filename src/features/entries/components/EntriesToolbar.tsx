import { memo } from 'react'
import { ListOrdered } from 'lucide-react'
import { FilterSelect } from '@/components/shared/FilterSelect'
import { ExportButton } from '@/components/shared/ExportButton'
import { RefreshButton } from '@/components/shared/RefreshButton'
import { PAGE_SIZE_OPTIONS } from '../hooks/useEntriesPagination'

const SIZE_OPTIONS = PAGE_SIZE_OPTIONS.map((size) => ({ value: String(size), label: String(size) }))

interface EntriesToolbarProps {
  summary: string
  size: number
  onSizeChange: (size: number) => void
  isFetching: boolean
  onRefresh: () => unknown
  onExport: () => void
  canExport: boolean
}

/** Summary text, rows-per-page select and refresh button. */
function EntriesToolbarBase({
  summary,
  size,
  onSizeChange,
  isFetching,
  onRefresh,
  onExport,
  canExport,
}: EntriesToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
      <p className="text-sm text-muted-foreground">{summary}</p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Rows per page</span>
        <FilterSelect
          aria-label="Rows per page"
          icon={ListOrdered}
          className="min-w-24"
          value={String(size)}
          options={SIZE_OPTIONS}
          onChange={(value) => onSizeChange(Number(value))}
        />
        <RefreshButton label="Refresh entries" isFetching={isFetching} onRefresh={onRefresh} />
        <ExportButton label="Export this page as CSV" onClick={onExport} disabled={!canExport} />
      </div>
    </div>
  )
}

export const EntriesToolbar = memo(EntriesToolbarBase)
