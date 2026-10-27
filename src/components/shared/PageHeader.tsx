import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router'

interface PageHeaderProps {
  title: string
  /** Right-side slot, e.g. filters. */
  actions?: ReactNode
}

export function PageHeader({ title, actions }: PageHeaderProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const { pathname } = useLocation()

  // Move focus to the h1 on route change so screen readers announce the new page.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold outline-none">
        {title}
      </h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
