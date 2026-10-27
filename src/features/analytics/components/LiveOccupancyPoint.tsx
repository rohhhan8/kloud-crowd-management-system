import { useState } from 'react'
import { ReferenceDot, ReferenceLine } from 'recharts'
import { useLiveChartPoint } from '../hooks/useLiveChartPoint'

const COLOR = '#b91c1c'
const TAG_WIDTH = 34
const TAG_HEIGHT = 18

interface LiveTagProps {
  x: number
  y: number
}

/** Red "LIVE" pill with a small pointer, sitting on top of the dotted line. */
function LiveTag({ x, y }: LiveTagProps) {
  const top = y - TAG_HEIGHT - 6
  return (
    <g>
      <rect
        x={x - TAG_WIDTH / 2}
        y={top}
        width={TAG_WIDTH}
        height={TAG_HEIGHT}
        rx={4}
        fill={COLOR}
      />
      <path
        d={`M${x - 4} ${top + TAG_HEIGHT} L${x} ${top + TAG_HEIGHT + 5} L${x + 4} ${top + TAG_HEIGHT}Z`}
        fill={COLOR}
      />
      <text
        x={x}
        y={top + TAG_HEIGHT / 2}
        fill="#fff"
        fontSize={9}
        fontWeight={700}
        textAnchor="middle"
        dominantBaseline="central"
      >
        LIVE
      </text>
    </g>
  )
}

const TIP_WIDTH = 74
const TIP_HEIGHT = 24

interface DotShapeProps {
  cx?: number
  cy?: number
}

/** Dot on the last hourly point; hovering it shows a "Live <count>" tooltip. */
function LiveDot({ cx = 0, cy = 0, value }: DotShapeProps & { value: number }) {
  const [hovered, setHovered] = useState(false)
  return (
    <g
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'default' }}
    >
      <circle cx={cx} cy={cy} r={10} fill="transparent" />
      <circle cx={cx} cy={cy} r={9} fill={COLOR} fillOpacity={0.2} />
      <circle cx={cx} cy={cy} r={5} fill={COLOR} stroke="#fff" strokeWidth={2} />
      {hovered && (
        <g pointerEvents="none">
          <rect
            x={cx - TIP_WIDTH / 2}
            y={cy - TIP_HEIGHT - 12}
            width={TIP_WIDTH}
            height={TIP_HEIGHT}
            rx={6}
            fill="#fff"
            stroke="#e5e7eb"
          />
          <text
            x={cx}
            y={cy - TIP_HEIGHT / 2 - 12}
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
  /** Last hourly point: the live dot sits on the end of the line. */
  from?: { time: number; value: number }
}

/** In-chart live layer; the only part of the chart that re-renders on socket updates. */
export function LiveOccupancyPoint({ from }: LiveOccupancyPointProps) {
  const point = useLiveChartPoint()
  if (!point) return null

  return (
    <>
      {from && (
        <ReferenceDot
          x={from.time}
          y={from.value}
          ifOverflow="extendDomain"
          shape={(props: DotShapeProps) => <LiveDot {...props} value={point.value} />}
        />
      )}
      <ReferenceLine
        x={point.at}
        stroke={COLOR}
        strokeWidth={2}
        strokeDasharray="2 3"
        label={({ viewBox }: { viewBox?: { x?: number; y?: number } }) => (
          <LiveTag x={viewBox?.x ?? 0} y={viewBox?.y ?? 0} />
        )}
      />
    </>
  )
}
