import { lazy, Suspense, useCallback, useRef, useState } from 'react'
import { Bell } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Button } from '@/components/ui/button'
import { selectDrawerOpen, selectUnreadCount, setDrawerOpen } from '../store/alerts.slice'
import { AlertsAnnouncer } from './AlertsAnnouncer'

// The drawer (Sheet + list) is only fetched the first time the bell is used.
const AlertsDrawer = lazy(() => import('./AlertsDrawer'))

/** Bell button with unread badge; owns the drawer's open state. Focus returns to the bell on close. */
export function AlertBell() {
  const unread = useAppSelector(selectUnreadCount)
  const dispatch = useAppDispatch()
  const open = useAppSelector(selectDrawerOpen)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // Mount the (lazy) drawer the first time it is opened, from the bell or a shortcut.
  const [everOpened, setEverOpened] = useState(false)
  if (open && !everOpened) setEverOpened(true)
  const handleOpenChange = useCallback(
    (next: boolean) => {
      dispatch(setDrawerOpen(next))
    },
    [dispatch],
  )
  const focusBell = useCallback(() => buttonRef.current?.focus(), [])

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        className="relative"
        aria-label={`Notifications, ${unread} unread`}
        aria-haspopup="dialog"
        onClick={() => {
          dispatch(setDrawerOpen(true))
        }}
      >
        <Bell aria-hidden="true" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] leading-none font-medium text-white"
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Button>
      <AlertsAnnouncer />
      {everOpened && (
        <Suspense fallback={null}>
          <AlertsDrawer open={open} onOpenChange={handleOpenChange} onCloseFocus={focusBell} />
        </Suspense>
      )}
    </>
  )
}
