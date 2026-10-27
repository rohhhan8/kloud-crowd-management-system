import { memo } from 'react'
import { ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { getPageWindow } from '@/lib/utils/pagination'
import { GoToPageForm } from './GoToPageForm'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  disabled?: boolean
  siblingCount?: number
}

const BASE =
  'flex h-8 min-w-8 items-center justify-center rounded px-1 text-sm text-foreground outline-none transition-colors hover:text-brand-dark focus-visible:ring-2 focus-visible:ring-ring aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:text-foreground'

interface StepButtonProps {
  label: string
  icon: LucideIcon
  target: number
  disabled: boolean
  onPageChange: (page: number) => void
}

/** Previous/next. `aria-disabled` (not `disabled`) so keyboard focus is never lost at the ends. */
function StepButton({ label, icon: Icon, target, disabled, onPageChange }: StepButtonProps) {
  return (
    <button
      type="button"
      className={BASE}
      aria-label={label}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (!disabled) onPageChange(target)
      }}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  )
}

function EllipsisJump({ totalPages, onGo }: { totalPages: number; onGo: (page: number) => void }) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(BASE, 'h-6 min-w-7 border border-foreground/70 text-xs')}
          aria-label="Go to page…"
        >
          …
        </button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-auto">
        <GoToPageForm
          totalPages={totalPages}
          onGo={(page) => {
            setOpen(false)
            onGo(page)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

/** Simple numbered pager shown below the table: `‹ 1 2 3 … 5 ›`, active page underlined in teal. */
function PaginationBase({
  page,
  totalPages,
  onPageChange,
  disabled = false,
  siblingCount = 1,
}: PaginationProps) {
  const items = useMemo(
    () => getPageWindow(page, totalPages, siblingCount),
    [page, totalPages, siblingCount],
  )
  if (totalPages < 1) return null

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 py-4">
      <StepButton
        label="Previous page"
        icon={ChevronLeft}
        target={page - 1}
        disabled={disabled || page <= 1}
        onPageChange={onPageChange}
      />
      <ul className="flex items-center gap-2">
        {items.map((item, index) => (
          <li key={item === 'ellipsis' ? `e${index}` : item}>
            {item === 'ellipsis' ? (
              <EllipsisJump totalPages={totalPages} onGo={onPageChange} />
            ) : (
              <button
                type="button"
                className={cn(
                  BASE,
                  item === page &&
                    'font-medium text-brand-dark underline decoration-2 underline-offset-8',
                )}
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                aria-disabled={disabled || undefined}
                onClick={() => {
                  if (!disabled) onPageChange(item)
                }}
              >
                {item}
              </button>
            )}
          </li>
        ))}
      </ul>
      <StepButton
        label="Next page"
        icon={ChevronRight}
        target={page + 1}
        disabled={disabled || page >= totalPages}
        onPageChange={onPageChange}
      />
      <span className="sr-only" aria-live="polite">{`Page ${page} of ${totalPages}`}</span>
    </nav>
  )
}

export const Pagination = memo(PaginationBase)
