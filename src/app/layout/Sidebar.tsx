import { Menu, Power } from 'lucide-react'
import { BrandLogo } from '@/components/shared/BrandLogo'
import { NAV_ITEMS } from '@/config/navigation'
import { useLogout } from '@/features/auth'
import { cn } from '@/lib/utils'
import { SidebarNavItem, sidebarItemClass } from './SidebarNavItem'

export const SIDEBAR_ID = 'app-sidebar'

interface SidebarProps {
  collapsed?: boolean
  /** Shows the hamburger toggle (desktop only). */
  onToggle?: () => void
  /** Called after a navigation/logout action, e.g. to close the mobile sheet. */
  onNavigate?: () => void
}

/** Sidebar body, shared by the desktop aside and the mobile sheet. */
export function Sidebar({ collapsed = false, onToggle, onNavigate }: SidebarProps) {
  const logout = useLogout()

  return (
    <div className="flex h-full flex-col bg-linear-to-b from-sidebar-from to-sidebar-to p-3 text-white">
      <div
        className={cn(
          'mb-6 flex h-12 items-center',
          collapsed ? 'justify-center' : 'justify-between px-2',
        )}
      >
        {!collapsed && <BrandLogo />}
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            aria-controls={SIDEBAR_ID}
            className="flex size-9 items-center justify-center rounded-lg outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/70"
          >
            <Menu className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <nav aria-label="Main" className="flex-1">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <SidebarNavItem item={item} collapsed={collapsed} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        onClick={() => {
          onNavigate?.()
          logout()
        }}
        title={collapsed ? 'Logout' : undefined}
        className={cn(sidebarItemClass, collapsed && 'justify-center px-0')}
      >
        <Power className="size-5 shrink-0" aria-hidden="true" />
        <span className={cn(collapsed && 'sr-only')}>Logout</span>
      </button>
    </div>
  )
}
