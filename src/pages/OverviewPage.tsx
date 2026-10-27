import { PageHeader } from '@/components/shared/PageHeader'
import { DemographicsSection, OccupancyChartCard, StatCardsSection } from '@/features/analytics'
import { DateFilter } from '@/features/filters'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function OverviewPage() {
  useDocumentTitle('Overview')

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" actions={<DateFilter />} />
      <StatCardsSection />
      <OccupancyChartCard />
      <DemographicsSection />
    </div>
  )
}
