import { useState } from 'react'
import { ReferenceDot } from 'recharts'
import { useLiveChartPoint } from '../hooks/useLiveChartPoint'

const COLOR = '#b91c1c'
const TAG_WIDTH = 34
const TAG_HEIGHT = 18
const TIP_WIDTH = 74
const TIP_HEIGHT = 24

interface LiveDotProps {
  cx?: number
  cy?: number
  value: number
}

/**
 * Live marker pinned to the last hourly point: a pulsing dot with a "LIVE" tag above it.
 * Hovering shows the current count beside it. Anchored to data, so it never drifts.
 */
function LiveDot({ cx = 0, cy = 0, value }: LiveDotProps) {
  const [hovered, setHovered] = useState(false)
  const tagTop = cy - TAG_HEIGHT - 14

  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'default' }}
    >
      <circle cx={cx} cy={cy} r={12} fill="transparent" />
      <circle cx={cx} cy={cy} r={9} fill={COLOR} fillOpacity={0.2} />
      <circle cx={cx} cy={cy} r={5} fill={COLOR} stroke="#fff" strokeWidth={2} />

      <rect x={cx - TAG_WIDTH / 2} y={tagTop} width={TAG_WIDTH} height={TAG_HEIGHT} rx={4} fill={COLOR} />
      <path
        d={`M${cx - 4} ${tagTop + TAG_HEIGHT} L${cx} ${tagTop + TAG_HEIGHT + 5} L${cx + 4} ${tagTop + TAG_HEIGHT}Z`}
        fill={COLOR}
      />
      <text
        x={cx}
        y={tagTop + TAG_HEIGHT / 2}
        fill="#fff"
        fontSize={9}
        fontWeight={700}
        textAnchor="middle"
        dominantBaseline="central"
      >
        LIVE
      </text>

      {hovered && (
        <g pointerEvents="none">
          <rect
            x={cx - TIP_WIDTH - 14}
            y={cy - TIP_HEIGHT / 2}
            width={TIP_WIDTH}
            height={TIP_HEIGHT}
            rx={6}
            fill="#fff"
            stroke="#e5e7eb"
          />
          <text
            x={cx - TIP_WIDTH / 2 - 14}
            y={cy}
            fontSize={12}
            fontWeight={600}
            fill="#111827"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {`Live ${value}`}
          </text>
        </g>
      )}
    </g>
  )
}

interface LiveOccupancyPointProps {
  /** Last hourly point: the live marker sits on the end of the line. */
  from?: { time: number; value: number }
}

/** In-chart live layer; the only part of the chart that re-renders on socket updates. */
export function LiveOccupancyPoint({ from }: LiveOccupancyPointProps) {
  const point = useLiveChartPoint()
  if (!point || !from) return null

  return (
    <ReferenceDot
      x={from.time}
      y={from.value}
      ifOverflow="extendDomain"
      shape={(props: { cx?: number; cy?: number }) => <LiveDot {...props} value={point.value} />}
    />
  )
}
