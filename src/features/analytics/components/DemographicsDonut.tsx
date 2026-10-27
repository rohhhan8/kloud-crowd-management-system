import { memo, useMemo } from 'react'
import { Cell, Pie, PieChart } from 'recharts'
import { ChartFrame } from '@/components/shared/ChartFrame'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { GENDER_SERIES } from '../config/genders'
import type { DemographicsPoint } from '../types'
import { GenderIcon } from './GenderIcon'
import { getGenderShare } from '../utils/demographics'

const chartConfig = {
  male: { label: 'Males', color: GENDER_SERIES[0].color },
  female: { label: 'Females', color: GENDER_SERIES[1].color },
} satisfies ChartConfig

const percentFormatter = (value: unknown, name: unknown) => (
  <span className="font-medium">
    {String(name)}: {String(value)}%
  </span>
)

const EMPTY_RING = [{ key: 'none', value: 1, color: 'var(--muted)' }]
const TABLE_COLUMNS = ['Group', 'Share'] as const

interface DemographicsDonutProps {
  points: DemographicsPoint[]
}

function DemographicsDonut({ points }: DemographicsDonutProps) {
  const reducedMotion = useReducedMotion()
  const share = useMemo(() => getGenderShare(points), [points])
  const hasData = share.total > 0

  const slices = useMemo(
    () =>
      GENDER_SERIES.map((s) => ({
        ...s,
        value: s.key === 'male' ? share.malePct : share.femalePct,
      })),
    [share],
  )
  const table = useMemo(
    () => ({
      caption: 'Share of male and female crowd',
      columns: TABLE_COLUMNS,
      rows: slices.map((s) => [s.label, hasData ? `${s.value}%` : '—']),
    }),
    [slices, hasData],
  )
  const label = hasData
    ? `Crowd split: ${share.malePct}% males, ${share.femalePct}% females`
    : 'Crowd split: no data'
  const ring = hasData ? slices : EMPTY_RING

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative size-48">
        <ChartFrame label={label} table={table}>
          <ChartContainer config={chartConfig} className="size-48">
            <PieChart>
              {hasData && (
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel formatter={percentFormatter} />}
                />
              )}
              <Pie
                data={ring}
                dataKey="value"
                innerRadius={58}
                outerRadius={84}
                nameKey="label"
                stroke="#fff"
                strokeWidth={2}
                isAnimationActive={!reducedMotion}
              >
                {ring.map((slice) => (
                  <Cell key={slice.key} fill={slice.color} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </ChartFrame>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs text-muted-foreground">Total Crowd</span>
          <span className="text-2xl font-semibold">{hasData ? '100%' : '—'}</span>
        </div>
      </div>
      <ul className="space-y-3 self-start text-sm">
        {slices.map((s) => (
          <li key={s.key} className="flex items-center gap-3">
            <GenderIcon gender={s.key} color={s.color} />
            {hasData ? `${s.value}%` : '—'} {s.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default memo(DemographicsDonut)
