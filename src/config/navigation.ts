import { Home, Users, type LucideIcon } from 'lucide-react'
import { ROUTES, type AppRoute } from './routes'

export interface NavItem {
  label: string
  to: AppRoute
  icon: LucideIcon
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Overview', to: ROUTES.overview, icon: Home },
  { label: 'Crowd Entries', to: ROUTES.entries, icon: Users },
]
