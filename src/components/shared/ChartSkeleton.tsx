import { Skeleton } from '@/components/ui/skeleton'

// Smooth wave paths in a 100x40 box (stretched to the available width).
const WAVES = [
  'M0 22 C8 14 14 26 22 20 S36 10 46 18 S60 28 70 16 S88 12 100 20',
  'M0 30 C10 24 16 34 26 28 S40 20 50 27 S66 34 76 25 S90 24 100 29',
] as const

interface ChartSkeletonProps {
  /** Number of line series to suggest (1 = occupancy, 2 = male/female). */
  lines?: 1 | 2
}

/** Line-chart placeholder: y-axis ticks, grid, wave line(s) and x-axis ticks. */
export function ChartSkeleton({ lines = 1 }: ChartSkeletonProps) {
  return (
    <div role="status" aria-busy="true" className="flex h-full min-h-64 w-full gap-3">
      <span className="sr-only">Loading chart…</span>
      <div className="flex flex-col justify-between pb-6" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-3 w-6" />
        ))}
      </div>
      <div className="flex flex-1 flex-col gap-2" aria-hidden="true">
        <div className="relative min-h-52 flex-1 border-b border-l border-neutral-200">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute inset-x-0 border-t border-dashed border-neutral-200"
              style={{ top: `${i * 20}%` }}
            />
          ))}
          <svg
            viewBox="0 0 100 40"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full animate-pulse"
          >
            {WAVES.slice(0, lines).map((d, i) => (
              <path
                key={d}
                d={d}
                fill="none"
                strokeWidth={3}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                className={i === 0 ? 'stroke-slate-300' : 'stroke-slate-200'}
              />
            ))}
          </svg>
        </div>
        <div className="flex justify-between px-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
      </div>
    </div>
  )
}

/** Donut placeholder: ring, centre label and two legend rows. */
export function DonutSkeleton() {
  return (
    <div role="status" aria-busy="true" className="flex flex-col items-center gap-4">
      <span className="sr-only">Loading chart…</span>
      <div className="relative size-48" aria-hidden="true">
        <div className="size-full animate-pulse rounded-full border-[26px] border-slate-300/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-14" />
        </div>
      </div>
      <div className="space-y-3 self-start" aria-hidden="true">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  )
}
