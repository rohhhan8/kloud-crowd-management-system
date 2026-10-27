import { useMemo } from 'react'
import { DataTable } from '@/components/shared/DataTable'
import { ErrorState } from '@/components/shared/ErrorState'
import { Pagination } from '@/components/shared/Pagination'
import { Card } from '@/components/ui/card'
import { useFilters } from '@/features/filters'
import { normalizeError } from '@/lib/http/errors'
import { useEntries } from '../hooks/useEntries'
import { useEntriesExport } from '../hooks/useEntriesExport'
import { useClampPage, useEntriesPagination } from '../hooks/useEntriesPagination'
import type { EntryRow } from '../types'
import { getRangeSummary } from '../utils/summary'
import { createEntryColumns } from './entryColumns'
import { EntriesToolbar } from './EntriesToolbar'

const getRowKey = (row: EntryRow) => row.key

export function EntriesTable() {
  const { timeZone, range } = useFilters()
  const { page, size, setPage, setSize } = useEntriesPagination()
  const entries = useEntries({ pageNumber: page, pageSize: size })
  useClampPage(page, entries.isPlaceholderData ? null : entries.totalPages, setPage)

  const exportPage = useEntriesExport(entries.rows, page)

  const columns = useMemo(
    () => createEntryColumns({ timeZone: timeZone ?? 'UTC', showDate: range !== 'today' }),
    [timeZone, range],
  )

  return (
    <>
      <Card className="gap-0 overflow-hidden p-0">
        <EntriesToolbar
          summary={getRangeSummary(page, size, entries.totalRecords)}
          size={size}
          onSizeChange={setSize}
          isFetching={entries.isFetching}
          onRefresh={entries.refetch}
          onExport={exportPage}
          canExport={entries.rows.length > 0 && !entries.isPlaceholderData}
        />
        {entries.isError ? (
          <ErrorState
            message={normalizeError(entries.error).message}
            onRetry={() => void entries.refetch()}
          />
        ) : (
          <DataTable
            caption="Crowd entries and exits"
            columns={columns}
            rows={entries.rows}
            getRowKey={getRowKey}
            isLoading={entries.isFetching}
            skeletonRows={size}
            emptyMessage="No entries for this period. Try another date range."
          />
        )}
      </Card>
      <Pagination page={page} totalPages={entries.totalPages} onPageChange={setPage} />
    </>
  )
}
