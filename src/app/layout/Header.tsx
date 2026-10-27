import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useFilters } from '@/features/filters'
import { AlertBell, ConnectionStatus } from '@/features/live'
import { SiteSelect } from '@/features/sites'
import { UserMenu } from './UserMenu'

interface HeaderProps {
  /** Opens the mobile navigation sheet (shown below `lg`). */
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { siteId, setSite } = useFilters()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-white px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu aria-hidden="true" />
        </Button>
        <span className="hidden font-semibold sm:inline">Crowd Solutions</span>
        <Separator orientation="vertical" className="hidden h-6 sm:block" />
        <SiteSelect value={siteId} onChange={setSite} />
      </div>

      <div className="flex items-center gap-3">
        <ConnectionStatus />
        <AlertBell />
        <UserMenu />
      </div>
    </header>
  )
}
