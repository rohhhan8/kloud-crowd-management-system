import { cn } from '@/lib/utils'
import { getInitials } from '@/lib/utils/initials'

// Dark backgrounds so white initials meet AA contrast.
const PALETTE = [
  'bg-teal-700',
  'bg-sky-700',
  'bg-indigo-700',
  'bg-purple-700',
  'bg-rose-700',
  'bg-orange-700',
  'bg-emerald-700',
  'bg-slate-700',
] as const

function hash(value: string): number {
  let h = 0
  for (const char of value) h = (h * 31 + char.charCodeAt(0)) >>> 0
  return h
}

/** Initials in a circle; the colour is derived deterministically from the name. */
export function InitialsAvatar({ name, className }: { name: string; className?: string }) {
  const color = PALETTE[hash(name) % PALETTE.length]
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white',
        color,
        className,
      )}
    >
      {getInitials(name)}
    </span>
  )
}
