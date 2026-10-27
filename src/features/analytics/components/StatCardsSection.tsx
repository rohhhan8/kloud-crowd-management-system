import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { STAT_CARD_GROUPS } from '../config/statCards'
import { StatCardContainer } from './StatCardContainer'

export function StatCardsSection() {
  return (
    <section aria-labelledby="occupancy-heading" className="space-y-3">
      <h2 id="occupancy-heading" className="text-base font-semibold">
        Occupancy
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {STAT_CARD_GROUPS.map((group) => (
          <Card
            key={group.map((card) => card.id).join('-')}
            className={cn(group.length > 1 && 'md:col-span-2')}
          >
            <CardContent
              className={cn(
                'grid gap-6',
                group.length > 1 && 'sm:grid-cols-2 sm:divide-x sm:*:not-first:pl-6',
              )}
            >
              {group.map(({ id, useStat }) => (
                <StatCardContainer key={id} useStat={useStat} />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
