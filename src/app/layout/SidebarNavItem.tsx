import { prefetchRoute } from '../routeModules'
import type { NavItem } from '@/config/navigation'
import { cn } from '@/lib/utils'
import { PreservedSearchNavLink } from './PreservedSearchNavLink'

interface SidebarNavItemProps {
  item: NavItem
  collapsed?: boolean
  onNavigate?: () => void
}

export const sidebarItemClass =
  'relative flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-white/80 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70'

export function SidebarNavItem({ item, collapsed, onNavigate }: SidebarNavItemProps) {
  const Icon = item.icon
  return (
    <PreservedSearchNavLink
      to={item.to}
      onClick={onNavigate}
      onMouseEnter={() => prefetchRoute(item.to)}
      onFocus={() => prefetchRoute(item.to)}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        cn(
          sidebarItemClass,
          collapsed && 'justify-center px-0',
          isActive &&
            'bg-white/15 text-white before:absolute before:inset-y-2 before:left-0 before:w-1 before:rounded-r before:bg-white',
        )
      }
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <span className={cn(collapsed && 'sr-only')}>{item.label}</span>
    </PreservedSearchNavLink>
  )
}
