import { Skeleton } from '@/components/ui/skeleton'

/** Avatar circle + name bar, mirroring the real name cell. */
export const NameSkeleton = () => (
  <span className="flex items-center gap-3">
    <Skeleton className="size-8 shrink-0 rounded-full" />
    <Skeleton className="h-4 w-32" />
  </span>
)

/** Zone text + severity pill. */
export const ZoneSkeleton = () => (
  <span className="flex items-center gap-2">
    <Skeleton className="h-4 w-32" />
    <Skeleton className="h-5 w-14 rounded-full" />
  </span>
)
