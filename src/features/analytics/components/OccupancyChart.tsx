import { memo, useCallback, useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartFrame } from '@/components/shared/ChartFrame'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatInTimeZone } from '@/lib/utils/date'
import { LiveOccupancyPoint } from './LiveOccupancyPoint'
import { LiveOccupancyRow } from './LiveOccupancyRow'
import type { OccupancyPoint } from '../types'
import { buildTicks, getPeak, getTimeAxisPattern } from '../utils/chartHelpers'

const chartConfig = {
  value: { label: 'Occupancy', color: '#5fb0ab' },
} satisfies ChartConfig

const MARGIN = { top: 24, right: 12, bottom: 16, left: 0 }
const X_LABEL = { value: 'Time', position: 'insideBottom', offset: -12 } as const
const Y_LABEL = { value: 'Count', angle: -90, position: 'insideLeft' } as const
const avgFormatter = (value: unknown) => (
  <span className="font-medium">Avg {Math.round(Number(value))}</span>
)
const TOOLTIP_PATTERN = 'EEE d MMM, H:mm'
const TABLE_COLUMNS = ['Time', 'Average occupancy'] as const

interface OccupancyChartProps {
  points: OccupancyPoint[]
  timeZone: string
  /** Epoch ms the x-axis extends to (today: end of day) while the data stops at now. */
  axisEnd?: number
}

function OccupancyChart({ points, timeZone, axisEnd }: OccupancyChartProps) {
  const reducedMotion = useReducedMotion()
  const pattern = useMemo(() => getTimeAxisPattern(points), [points])
  const ticks = useMemo(() => buildTicks(points, axisEnd), [points, axisEnd])
  const tickFormatter = useCallback(
    (time: number) => formatInTimeZone(time, timeZone, pattern),
    [timeZone, pattern],
  )
  const labelFormatter = useCallback(
    (_: unknown, payload: readonly { payload?: OccupancyPoint }[]) => {
      const time = payload[0]?.payload?.time
      return time === undefined ? '' : formatInTimeZone(time, timeZone, TOOLTIP_PATTERN)
    },
    [timeZone],
  )

  const lastPoint = useMemo(() => points.at(-1), [points])

  const summary = useMemo(() => {
    const peak = getPeak(points, (p) => p.value)
    const label = peak
      ? `Occupancy per hour, peak ${Math.round(peak.value)} at ${formatInTimeZone(peak.time, timeZone, 'H:mm')}`
      : 'Occupancy per hour'
    const table = {
      caption: 'Average occupancy per hour',
      columns: TABLE_COLUMNS,
      rows: points.map((p) => [
        formatInTimeZone(p.time, timeZone, TOOLTIP_PATTERN),
        Math.round(p.value),
      ]),
    }
    return { label, table }
  }, [points, timeZone])

  return (
    <ChartFrame label={summary.label} table={summary.table} tableRows={<LiveOccupancyRow />}>
      <ChartContainer config={chartConfig} className="h-72 w-full">
        <AreaChart data={points} margin={MARGIN}>
          <defs>
            <linearGradient id="occupancyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis
            dataKey="time"
            type="number"
            domain={['dataMin', axisEnd ?? 'dataMax']}
            ticks={ticks}
            tickFormatter={tickFormatter}
            minTickGap={24}
            label={X_LABEL}
            tickLine={false}
            axisLine={{ strokeOpacity: 0.6 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={{ strokeOpacity: 0.6 }}
            domain={[0, 'auto']}
            label={Y_LABEL}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={labelFormatter}
                formatter={avgFormatter}
                hideIndicator
              />
            }
          />
          <LiveOccupancyPoint from={lastPoint} />
          <Area
            dataKey="value"
            type="monotone"
            stroke="var(--color-value)"
            strokeWidth={1.5}
            fill="url(#occupancyFill)"
            isAnimationActive={!reducedMotion}
          />
        </AreaChart>
      </ChartContainer>
    </ChartFrame>
  )
}

export default memo(OccupancyChart)
