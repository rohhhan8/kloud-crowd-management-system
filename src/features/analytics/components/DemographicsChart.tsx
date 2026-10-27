import { memo, useCallback, useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartFrame } from '@/components/shared/ChartFrame'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatInTimeZone } from '@/lib/utils/date'
import { GENDER_SERIES } from '../config/genders'
import type { DemographicsPoint } from '../types'
import { buildTicks, getTimeAxisPattern } from '../utils/chartHelpers'

const chartConfig = {
  male: { label: 'Male', color: GENDER_SERIES[0].color },
  female: { label: 'Female', color: GENDER_SERIES[1].color },
} satisfies ChartConfig

const MARGIN = { top: 8, right: 12, bottom: 16, left: 0 }
const X_LABEL = { value: 'Time', position: 'insideBottom', offset: -12 } as const
const Y_LABEL = { value: 'Count', angle: -90, position: 'insideLeft' } as const
const TOOLTIP_PATTERN = 'EEE d MMM, H:mm'
const TABLE_COLUMNS = ['Time', 'Male (avg)', 'Female (avg)'] as const
const LEGEND = <ChartLegendContent />

interface DemographicsChartProps {
  points: DemographicsPoint[]
  timeZone: string
  /** Epoch ms the x-axis extends to (today: end of day) while the data stops at now. */
  axisEnd?: number
}

function DemographicsChart({ points, timeZone, axisEnd }: DemographicsChartProps) {
  const reducedMotion = useReducedMotion()
  const pattern = useMemo(() => getTimeAxisPattern(points), [points])
  const ticks = useMemo(() => buildTicks(points, axisEnd), [points, axisEnd])
  const tickFormatter = useCallback(
    (time: number) => formatInTimeZone(time, timeZone, pattern),
    [timeZone, pattern],
  )
  const labelFormatter = useCallback(
    (_: unknown, payload: readonly { payload?: DemographicsPoint }[]) => {
      const time = payload[0]?.payload?.time
      return time === undefined ? '' : formatInTimeZone(time, timeZone, TOOLTIP_PATTERN)
    },
    [timeZone],
  )
  const table = useMemo(
    () => ({
      caption: 'Average male and female crowd per hour',
      columns: TABLE_COLUMNS,
      rows: points.map((p) => [
        formatInTimeZone(p.time, timeZone, TOOLTIP_PATTERN),
        Math.round(p.male),
        Math.round(p.female),
      ]),
    }),
    [points, timeZone],
  )

  return (
    <ChartFrame label="Male and female crowd per hour" table={table}>
      <ChartContainer config={chartConfig} className="h-72 w-full">
        <AreaChart data={points} margin={MARGIN}>
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
          <ChartTooltip content={<ChartTooltipContent labelFormatter={labelFormatter} />} />
          <ChartLegend verticalAlign="top" align="right" content={LEGEND} />
          {GENDER_SERIES.map(({ key, color, dash }) => (
            <Area
              key={key}
              dataKey={key}
              type="monotone"
              stroke={color}
              strokeDasharray={dash}
              strokeWidth={2}
              fill={color}
              fillOpacity={0.12}
              isAnimationActive={!reducedMotion}
            />
          ))}
        </AreaChart>
      </ChartContainer>
    </ChartFrame>
  )
}

export default memo(DemographicsChart)
