import { useState } from 'react'
import { Outlet } from 'react-router'
import { LiveFeeds, SocketProvider } from '@/features/live'
import { OfflineBanner } from '@/components/shared/OfflineBanner'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { useLockDocumentScroll } from '@/hooks/useLockDocumentScroll'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { Header } from './Header'
import { HotkeysHost } from './HotkeysHost'
import { Sidebar, SIDEBAR_ID } from './Sidebar'

export function AppLayout() {
  useLockDocumentScroll()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <SocketProvider>
      <LiveFeeds />
      <HotkeysHost />
      <div className="fixed inset-0 flex overflow-hidden bg-shell">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-md bg-background px-3 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:text-foreground"
        >
          Skip to main content
        </a>

        {isDesktop && (
          <aside
            id={SIDEBAR_ID}
            className={cn('shrink-0 transition-[width]', collapsed ? 'w-[72px]' : 'w-64')}
          >
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
          </aside>
        )}

        {!isDesktop && (
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent side="left" className="w-64 border-0 p-0" showCloseButton={false}>
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <SheetDescription className="sr-only">Main site navigation</SheetDescription>
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <OfflineBanner />
          <Header onMenuClick={() => setMobileOpen(true)} />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 overflow-y-auto p-4 outline-none lg:p-6"
          >
            <Outlet />
          </main>
        </div>
      </div>
    </SocketProvider>
  )
}
