import { Panel } from '@/components/ui/Panel'
import type { WeatherHour } from '@/services/weather/types'
import { formatUv, getUvCategory } from '@/features/weather/utils/uvScale'
import { formatSolarTime } from '@/features/sun-explorer/utils/formatSolarTime'

type UvDayChartProps = {
  hours: WeatherHour[]
  now: Date
  timeZone: string
}

const WIDTH = 640
const HEIGHT = 180
const PAD = { top: 16, right: 12, bottom: 28, left: 28 }

export function UvDayChart({ hours, now, timeZone }: UvDayChartProps) {
  const points = hours.filter((hour) => hour.uvIndex != null)
  const maxUv = Math.max(3, ...points.map((hour) => hour.uvIndex ?? 0), 1)
  const peak = points.reduce<(typeof points)[number] | null>((best, hour) => {
    if (!best || (hour.uvIndex ?? 0) > (best.uvIndex ?? 0)) return hour
    return best
  }, null)

  const innerW = WIDTH - PAD.left - PAD.right
  const innerH = HEIGHT - PAD.top - PAD.bottom

  const xAt = (index: number) =>
    PAD.left + (points.length <= 1 ? innerW / 2 : (index / (points.length - 1)) * innerW)
  const yAt = (uv: number) => PAD.top + innerH - (uv / maxUv) * innerH

  const path =
    points.length > 0
      ? points
          .map((hour, index) => {
            const x = xAt(index)
            const y = yAt(hour.uvIndex ?? 0)
            return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
          })
          .join(' ')
      : ''

  const area =
    points.length > 0
      ? `${path} L${xAt(points.length - 1).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L${xAt(0).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`
      : ''

  let nowX: number | null = null
  if (points.length > 1) {
    const start = points[0].time.getTime()
    const end = points[points.length - 1].time.getTime()
    if (now.getTime() >= start && now.getTime() <= end && end > start) {
      const t = (now.getTime() - start) / (end - start)
      nowX = PAD.left + t * innerW
    }
  }

  const peakCategory = getUvCategory(peak?.uvIndex ?? null)

  return (
    <Panel className="p-4 sm:p-5">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
            UV today
          </p>
          <p className="mt-1 text-xs text-mist-500">Hourly index · local day</p>
        </div>
        {peak && (
          <p className={`text-xs font-medium ${peakCategory.className}`}>
            Peak {formatUv(peak.uvIndex)} · {formatSolarTime(peak.time, timeZone)}
          </p>
        )}
      </div>

      {points.length === 0 ? (
        <p className="py-8 text-center text-sm text-mist-400">UV series unavailable for this day.</p>
      ) : (
        <div className="w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-auto w-full"
            role="img"
            aria-label="Hourly UV index chart"
          >
            {[0.25, 0.5, 0.75, 1].map((fraction) => {
              const y = PAD.top + innerH * (1 - fraction)
              return (
                <line
                  key={fraction}
                  x1={PAD.left}
                  x2={WIDTH - PAD.right}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={1}
                />
              )
            })}

            <path d={area} fill="rgba(240,164,58,0.16)" />
            <path
              d={path}
              fill="none"
              stroke="#f0a43a"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {nowX != null && (
              <line
                x1={nowX}
                x2={nowX}
                y1={PAD.top}
                y2={PAD.top + innerH}
                stroke="rgba(247,241,232,0.75)"
                strokeWidth={1.5}
                strokeDasharray="3 4"
              />
            )}

            <text
              x={PAD.left}
              y={HEIGHT - 8}
              className="fill-mist-500"
              style={{ fontSize: 10 }}
            >
              {formatSolarTime(points[0].time, timeZone)}
            </text>
            <text
              x={WIDTH - PAD.right}
              y={HEIGHT - 8}
              textAnchor="end"
              className="fill-mist-500"
              style={{ fontSize: 10 }}
            >
              {formatSolarTime(points[points.length - 1].time, timeZone)}
            </text>
            <text
              x={4}
              y={PAD.top + 4}
              className="fill-mist-500"
              style={{ fontSize: 10 }}
            >
              {maxUv.toFixed(0)}
            </text>
          </svg>
        </div>
      )}
    </Panel>
  )
}
