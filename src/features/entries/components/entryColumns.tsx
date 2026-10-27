import type { ReactNode } from 'react'
import { InitialsAvatar } from '@/components/shared/InitialsAvatar'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import type { DataTableColumn } from '@/components/shared/DataTable'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDuration } from '@/lib/utils/format'
import type { EntryRow } from '../types'
import { NameSkeleton, ZoneSkeleton } from './EntrySkeletons'
import { StillInside } from './StillInside'
import { formatEntryTime } from '../utils/formatEntryTime'

interface ColumnOptions {
  timeZone: string
  /** Include the date in time cells (any range other than "today"). */
  showDate: boolean
}

const orStillInside = (value: ReactNode | null) => value ?? <StillInside />

export function createEntryColumns({
  timeZone,
  showDate,
}: ColumnOptions): readonly DataTableColumn<EntryRow>[] {
  return [
    {
      id: 'name',
      header: 'Name',
      skeleton: <NameSkeleton />,
      cell: (row) => (
        <span className="flex items-center gap-3">
          <InitialsAvatar name={row.name} />
          <span className="font-medium">{row.name}</span>
        </span>
      ),
    },
    {
      id: 'sex',
      header: 'Sex',
      skeleton: <Skeleton className="h-4 w-14" />,
      cell: (row) => row.genderLabel,
    },
    {
      id: 'entry',
      header: 'Entry',
      skeleton: <Skeleton className="h-4 w-16" />,
      cell: (row) => formatEntryTime(row.entryUtc, timeZone, showDate),
    },
    {
      id: 'exit',
      header: 'Exit',
      skeleton: <Skeleton className="h-4 w-12" />,
      cell: (row) =>
        orStillInside(
          row.exitUtc === null ? null : formatEntryTime(row.exitUtc, timeZone, showDate),
        ),
    },
    {
      id: 'dwell',
      header: 'Dwell Time',
      skeleton: <Skeleton className="h-4 w-14" />,
      cell: (row) =>
        orStillInside(row.dwellMinutes === null ? null : formatDuration(row.dwellMinutes)),
    },
    {
      id: 'zone',
      header: 'Zone',
      skeleton: <ZoneSkeleton />,
      hideBelow: 'lg',
      cell: (row) => (
        <span className="flex items-center gap-2">
          {row.zoneName}
          <SeverityBadge severity={row.severity} />
        </span>
      ),
    },
  ]
}
