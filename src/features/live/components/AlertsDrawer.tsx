import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useFilters } from '@/features/filters'
import {
  clear,
  clearHighlights,
  markAllRead,
  selectAlerts,
  selectUnreadCount,
  selectUnreadIds,
} from '../store/alerts.slice'
import { AlertListItem } from './AlertListItem'
import { AlertsEmptyState } from './AlertsEmptyState'

interface AlertsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called after close so focus can go back to the element that opened the drawer. */
  onCloseFocus?: () => void
}

export default function AlertsDrawer({ open, onOpenChange, onCloseFocus }: AlertsDrawerProps) {
  const dispatch = useAppDispatch()
  const alerts = useAppSelector(selectAlerts)
  const unreadIds = useAppSelector(selectUnreadIds)
  const unreadCount = useAppSelector(selectUnreadCount)
  const { timeZone } = useFilters()

  // While open, everything is considered read (bell count stays 0); highlights remain
  // visible until the drawer closes.
  useEffect(() => {
    if (open && unreadCount > 0) dispatch(markAllRead())
  }, [open, unreadCount, dispatch])

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) dispatch(clearHighlights())
      onOpenChange(next)
    },
    [dispatch, onOpenChange],
  )
  const handleClear = useCallback(() => dispatch(clear()), [dispatch])

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          onCloseFocus?.()
        }}
        className="flex w-full flex-col gap-0 p-0 sm:max-w-sm"
      >
        <SheetHeader className="border-b">
          <SheetTitle>Alerts</SheetTitle>
          <SheetDescription className="sr-only">
            Recent entries and exits for this site
          </SheetDescription>
        </SheetHeader>

        {alerts.length === 0 ? (
          <AlertsEmptyState />
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto">
              {alerts.map((alert) => (
                <AlertListItem
                  key={alert.id}
                  alert={alert}
                  timeZone={timeZone ?? 'UTC'}
                  unread={unreadIds.includes(alert.id)}
                />
              ))}
            </ul>
            <div className="border-t p-3">
              <Button variant="outline" className="w-full" onClick={handleClear}>
                Clear all
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
