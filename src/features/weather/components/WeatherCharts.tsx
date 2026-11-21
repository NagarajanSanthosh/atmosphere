import { motion } from 'framer-motion'
import { Panel } from '@/components/ui/Panel'
import type { LightWindow } from '@/engines/daylight'
import { formatSolarTime } from '@/features/sun-explorer/utils/formatSolarTime'
import { getDayProgress } from '@/features/sun-explorer/utils/zonedTime'
import { formatUv } from '@/features/weather/utils/uvScale'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { WeatherHour } from '@/services/weather/types'

type WeatherChartsProps = {
  hours: WeatherHour[]
  windows: LightWindow[]
  now: Date
  timeZone: string
}

const W = 320
const H = 120
const PAD = { t: 12, r: 8, b: 22, l: 24 }

/** Compact UV + cloud charts for the selected local day. */
export function WeatherCharts({ hours, windows, now, timeZone }: WeatherChartsProps) {
  const reduced = usePrefersReducedMotion()
  const uvPoints = hours.filter((h) => h.uvIndex != null)
  const cloudPoints = hours.filter((h) => h.cloudCoverPct != null)

  if (uvPoints.length === 0 && cloudPoints.length === 0) return null

  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b
  const maxUv = Math.max(3, ...uvPoints.map((h) => h.uvIndex ?? 0), 1)

  const uvPath = uvPoints
    .map((hour, i) => {
      const x = PAD.l + (uvPoints.length <= 1 ? innerW / 2 : (i / (uvPoints.length - 1)) * innerW)
      const y = PAD.t + innerH - ((hour.uvIndex ?? 0) / maxUv) * innerH
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  const cloudPath = cloudPoints
    .map((hour, i) => {
      const x = PAD.l + getDayProgress(hour.time, timeZone) * innerW
      const y = PAD.t + innerH - ((hour.cloudCoverPct ?? 0) / 100) * innerH
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  const golden = windows.filter(
    (w) => w.id === 'golden-morning' || w.id === 'golden-evening',
  )

  const peak = uvPoints.reduce<(typeof uvPoints)[number] | null>((best, hour) => {
    if (!best || (hour.uvIndex ?? 0) > (best.uvIndex ?? 0)) return hour
    return best
  }, null)

  let nowX: number | null = null
  if (uvPoints.length > 1) {
    const start = uvPoints[0].time.getTime()
    const end = uvPoints[uvPoints.length - 1].time.getTime()
    if (now.getTime() >= start && now.getTime() <= end && end > start) {
      nowX = PAD.l + ((now.getTime() - start) / (end - start)) * innerW
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {uvPoints.length > 0 && (
        <Panel className="p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[0.65rem] font-bold tracking-[0.14em] text-mist-400 uppercase">
              UV today
            </p>
            {peak && (
              <p className="text-[0.65rem] text-sun-300">
                Peak {formatUv(peak.uvIndex)} · {formatSolarTime(peak.time, timeZone)}
              </p>
            )}
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-label="Hourly UV">
            {[0.25, 0.5, 0.75, 1].map((f) => (
              <line
                key={f}
                x1={PAD.l}
                x2={W - PAD.r}
                y1={PAD.t + innerH * (1 - f)}
                y2={PAD.t + innerH * (1 - f)}
                stroke="rgba(255,255,255,0.06)"
              />
            ))}
            <motion.path
              d={uvPath}
              fill="none"
              stroke="#f0a43a"
              strokeWidth={2}
              strokeLinecap="round"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: reduced ? 0 : 0.7 }}
            />
            {nowX != null && (
              <line
                x1={nowX}
                x2={nowX}
                y1={PAD.t}
                y2={PAD.t + innerH}
                stroke="rgba(247,241,232,0.7)"
                strokeDasharray="3 3"
              />
            )}
            <text x={PAD.l} y={H - 6} className="fill-mist-500" style={{ fontSize: 9 }}>
              {formatSolarTime(uvPoints[0].time, timeZone)}
            </text>
            <text
              x={W - PAD.r}
              y={H - 6}
              textAnchor="end"
              className="fill-mist-500"
              style={{ fontSize: 9 }}
            >
              {formatSolarTime(uvPoints[uvPoints.length - 1].time, timeZone)}
            </text>
          </svg>
        </Panel>
      )}

      {cloudPoints.length > 0 && (
        <Panel className="p-3">
          <p className="mb-2 text-[0.65rem] font-bold tracking-[0.14em] text-mist-400 uppercase">
            Cloud vs golden
          </p>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            aria-label="Cloud cover with golden windows"
          >
            {golden.map((window) => {
              const start = window.interval.start
              const end = window.interval.end
              if (!start || !end) return null
              const x = PAD.l + getDayProgress(start, timeZone) * innerW
              const x2 = PAD.l + getDayProgress(end, timeZone) * innerW
              return (
                <rect
                  key={window.id}
                  x={x}
                  y={PAD.t}
                  width={Math.max(3, x2 - x)}
                  height={innerH}
                  fill="rgba(240,164,58,0.18)"
                />
              )
            })}
            <motion.path
              d={cloudPath}
              fill="none"
              stroke="#8fa0d9"
              strokeWidth={2}
              strokeLinecap="round"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: reduced ? 0 : 0.7 }}
            />
          </svg>
        </Panel>
      )}
    </div>
  )
}
