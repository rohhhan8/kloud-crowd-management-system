import { ASSETS } from '@/config/assets'
import { cn } from '@/lib/utils'

/** Kloudspot logo (white artwork); place it on a dark or teal background. */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <img
      src={ASSETS.logo}
      alt="Kloudspot"
      width={127}
      height={40}
      className={cn('h-8 w-auto', className)}
    />
  )
}
