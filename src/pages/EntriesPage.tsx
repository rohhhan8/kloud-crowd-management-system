import { PageHeader } from '@/components/shared/PageHeader'
import { EntriesTable } from '@/features/entries'
import { DateFilter } from '@/features/filters'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function EntriesPage() {
  useDocumentTitle('Crowd Entries')

  return (
    <div className="space-y-6">
      <PageHeader title="Crowd Entries" actions={<DateFilter />} />
      <EntriesTable />
    </div>
  )
}
