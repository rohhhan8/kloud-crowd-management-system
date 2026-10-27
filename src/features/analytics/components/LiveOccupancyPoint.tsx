import { ReferenceLine, useXAxisScale, useYAxisScale } from 'recharts'
import { useLiveChartPoint } from '../hooks/useLiveChartPoint'

const COLOR = '#b91c1c'
const TAG_WIDTH = 34
const TAG_HEIGHT = 18

interface LiveTagProps {
  x: number
  y: number
  value: number
}

/** Red "LIVE" pill with a small pointer, sitting on top of the dotted line. */
function LiveTag({ x, y, value }: LiveTagProps) {
  const top = y - TAG_HEIGHT - 6
  return (
    <g>
      <title>{`Live ${value}`}</title>
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

const LINE_COLOR = '#5fb0ab'

interface LiveOccupancyPointProps {
  
  from?: { time: number; value: number }
}

/** In-chart live layer; the only part of the chart that re-renders on socket updates. */
export function LiveOccupancyPoint({ from }: LiveOccupancyPointProps) {
  const point = useLiveChartPoint()
  const xScale = useXAxisScale()
  const yScale = useYAxisScale()
  if (!point) return null

  const x1 = from && xScale?.(from.time)
  const y1 = from && yScale?.(from.value)
  const x2 = xScale?.(point.at)
  const y2 = yScale?.(point.value)
  const base = yScale?.(0)
  const connect =
    typeof x1 === 'number' &&
    typeof y1 === 'number' &&
    typeof x2 === 'number' &&
    typeof y2 === 'number' &&
    typeof base === 'number' &&
    x2 > x1

  return (
    <>
      {connect && (
        <g aria-hidden="true">
          <path
            d={`M${x1} ${y1} L${x2} ${y2} L${x2} ${base} L${x1} ${base}Z`}
            fill={LINE_COLOR}
            fillOpacity={0.12}
          />
          <path d={`M${x1} ${y1} L${x2} ${y2}`} stroke={LINE_COLOR} strokeWidth={1.5} fill="none" />
        </g>
      )}
      <ReferenceLine
        x={point.at}
        stroke={COLOR}
        strokeWidth={2}
        strokeDasharray="2 3"
        label={({ viewBox }: { viewBox?: { x?: number; y?: number } }) => (
          <LiveTag x={viewBox?.x ?? 0} y={viewBox?.y ?? 0} value={point.value} />
        )}
      />
    </>
  )
}
