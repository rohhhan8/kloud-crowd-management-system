import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAppDispatch } from '@/app/hooks'
import { HOTKEYS } from '@/config/hotkeys'
import { ROUTES } from '@/config/routes'
import { setDrawerOpen } from '@/features/live'
import { useHotkeys } from '@/hooks/useHotkeys'
import { carriedSearch } from './carriedSearch'
import { ShortcutsDialog } from './ShortcutsDialog'

/** Wires the global shortcuts and owns the "?" help dialog. Renders nothing otherwise. */
export function HotkeysHost() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const dispatch = useAppDispatch()
  const [helpOpen, setHelpOpen] = useState(false)

  const go = (pathname: string) => () => navigate({ pathname, search: carriedSearch(search) })

  useHotkeys([
    { keys: HOTKEYS.overview.keys, action: go(ROUTES.overview) },
    { keys: HOTKEYS.entries.keys, action: go(ROUTES.entries) },
    { keys: HOTKEYS.alerts.keys, action: () => dispatch(setDrawerOpen(true)) },
    { keys: HOTKEYS.help.keys, action: () => setHelpOpen(true) },
  ])

  return <ShortcutsDialog open={helpOpen} onOpenChange={setHelpOpen} />
}
