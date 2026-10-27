import { MapPin } from 'lucide-react'
import { FilterSelect } from '@/components/shared/FilterSelect'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSites } from '../hooks/useSites'

const WIDTH = 'w-56'

interface SiteSelectProps {
  value: string | null
  onChange: (siteId: string) => void
}

export function SiteSelect({ value, onChange }: SiteSelectProps) {
  const { data: sites, isPending, isError, refetch } = useSites()

  if (isPending) {
    return <Skeleton className={`h-8 ${WIDTH}`} role="status" aria-label="Loading sites" />
  }

  if (isError) {
    return (
      <div className={`flex h-8 items-center gap-2 text-sm ${WIDTH}`} role="alert">
        <span className="truncate text-destructive">Couldn&apos;t load sites</span>
        <Button variant="outline" size="xs" onClick={() => void refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  if (sites.length === 0) {
    return <span className={`text-sm text-muted-foreground ${WIDTH}`}>No sites available</span>
  }

  return (
    <FilterSelect
      aria-label="Select site"
      icon={MapPin}
      className={WIDTH}
      value={value ?? undefined}
      onChange={onChange}
      options={sites.map((site) => ({ value: site.id, label: site.name, description: site.city }))}
      placeholder="Select site"
    />
  )
}
