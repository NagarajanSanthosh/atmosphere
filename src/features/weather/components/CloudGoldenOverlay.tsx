import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { Panel } from '@/components/ui/Panel'
import type { LightWindow } from '@/engines/daylight'
import type { WeatherHour } from '@/services/weather/types'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { getDayProgress } from '@/features/sun-explorer/utils/zonedTime'
import { formatSolarTime } from '@/features/sun-explorer/utils/formatSolarTime'

type CloudGoldenOverlayProps = {
  hours: WeatherHour[]
  windows: LightWindow[]
  timeZone: string
}

const WIDTH = 640
const HEIGHT = 160
const PAD = { top: 16, right: 12, bottom: 28, left: 28 }

export function CloudGoldenOverlay({
  hours,
  windows,
  timeZone,
}: CloudGoldenOverlayProps) {
  const reduced = usePrefersReducedMotion()
  const points = hours.filter((hour) => hour.cloudCoverPct != null)
  const golden = windows.filter(
    (window) => window.id === 'golden-morning' || window.id === 'golden-evening',
  )

  const chart = useMemo(() => {
    const innerW = WIDTH - PAD.left - PAD.right
    const innerH = HEIGHT - PAD.top - PAD.bottom
    const xAt = (progress: number) => PAD.left + progress * innerW
    const yAt = (cloud: number) => PAD.top + innerH - (cloud / 100) * innerH

    const path =
      points.length > 0
        ? points
            .map((hour, index) => {
              const x = xAt(getDayProgress(hour.time, timeZone))
              const y = yAt(hour.cloudCoverPct ?? 0)
              return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
            })
            .join(' ')
        : ''

    const bands = golden
      .map((window) => {
        const start = window.interval.start
        const end = window.interval.end
        if (!start || !end) return null
        const left = xAt(getDayProgress(start, timeZone))
        const right = xAt(getDayProgress(end, timeZone))
        return {
          id: window.id,
          label: window.label,
          x: left,
          width: Math.max(4, right - left),
        }
      })
      .filter(Boolean) as Array<{ id: string; label: string; x: number; width: number }>

    return { path, bands, innerH }
  }, [points, golden, timeZone])

  return (
    <Panel className="p-4 sm:p-5">
      <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
        Cloud vs golden
      </p>
      <p className="mt-1 text-xs text-mist-500">
        Hourly cloud cover with golden windows highlighted
      </p>

      {points.length === 0 ? (
        <p className="py-8 text-center text-sm text-mist-400">Cloud series unavailable.</p>
      ) : (
        <div className="mt-3 w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            className="h-auto w-full"
            role="img"
            aria-label="Cloud cover with golden hour windows"
          >
            {chart.bands.map((band) => (
              <motion.rect
                key={band.id}
                x={band.x}
                y={PAD.top}
                width={band.width}
                height={chart.innerH}
                fill="rgba(240,164,58,0.18)"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : 0.15 }}
              />
            ))}

            {[0.25, 0.5, 0.75, 1].map((fraction) => {
              const y = PAD.top + chart.innerH * (1 - fraction)
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

            <motion.path
              d={chart.path}
              fill="none"
              stroke="#8fa0d9"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduced ? false : { pathLength: 0, opacity: 0.4 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: reduced ? 0 : 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
            />

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
            <text x={4} y={PAD.top + 4} className="fill-mist-500" style={{ fontSize: 10 }}>
              100%
            </text>
          </svg>
        </div>
      )}
    </Panel>
  )
}
