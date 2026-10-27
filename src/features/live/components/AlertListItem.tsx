import { memo } from 'react'
import { MapPin } from 'lucide-react'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { cn } from '@/lib/utils'
import { formatInTimeZone } from '@/lib/utils/date'
import { ALERT_ACTION_LABELS } from '../config/alertActions'
import type { AlertItem } from '../types'

interface AlertListItemProps {
  alert: AlertItem
  timeZone: string
  unread: boolean
}

const TIME_PATTERN = 'MMMM dd yyyy HH:mm'

function AlertListItemBase({ alert, timeZone, unread }: AlertListItemProps) {
  const verb = ALERT_ACTION_LABELS[alert.action]

  return (
    <li
      className={cn(
        'flex items-start justify-between gap-3 border-b px-4 py-3',
        unread && 'bg-brand/10',
      )}
    >
      <div className="min-w-0 space-y-0.5">
        <p className="text-xs text-muted-foreground">
          {formatInTimeZone(alert.time, timeZone, TIME_PATTERN)}
        </p>
        <p className="truncate text-sm font-semibold">
          {alert.personName ?? 'Someone'} {verb}
        </p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{alert.zoneName}</span>
        </p>
      </div>
      <SeverityBadge severity={alert.severity} />
    </li>
  )
}

export const AlertListItem = memo(AlertListItemBase)
