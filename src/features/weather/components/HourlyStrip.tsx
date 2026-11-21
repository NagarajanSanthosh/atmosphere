import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Panel } from '@/components/ui/Panel'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { WeatherHour } from '@/services/weather/types'
import { formatUv, getUvCategory } from '@/features/weather/utils/uvScale'
import { formatSolarTime } from '@/features/sun-explorer/utils/formatSolarTime'

type HourlyStripProps = {
  hours: WeatherHour[]
  now: Date
  timeZone: string
}

export function HourlyStrip({ hours, now, timeZone }: HourlyStripProps) {
  const nowMs = now.getTime()
  const reduced = usePrefersReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [constraints, setConstraints] = useState({ left: 0, right: 0 })

  useEffect(() => {
    const update = () => {
      const container = containerRef.current
      const track = trackRef.current
      if (!container || !track) return
      const overflow = track.scrollWidth - container.clientWidth
      setConstraints({ left: -Math.max(0, overflow), right: 0 })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [hours])

  return (
    <Panel className="p-4 sm:p-5">
      <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
        Next hours
      </p>
      <p className="mt-1 text-xs text-mist-500">Temp · UV · cloud · drag to browse</p>

      <div ref={containerRef} className="mt-3 overflow-hidden">
        <motion.div
          ref={trackRef}
          className="flex cursor-grab gap-2 active:cursor-grabbing"
          drag={reduced ? false : 'x'}
          dragConstraints={constraints}
          dragElastic={0.06}
          dragMomentum={!reduced}
          dragTransition={
            reduced
              ? undefined
              : { power: 0.22, timeConstant: 200, bounceStiffness: 340, bounceDamping: 30 }
          }
          style={{ touchAction: 'pan-y' }}
        >
          {hours.map((hour) => {
            const isNow = Math.abs(hour.time.getTime() - nowMs) < 30 * 60_000
            const uv = getUvCategory(hour.uvIndex)
            return (
              <motion.div
                key={hour.time.toISOString()}
                whileTap={reduced ? undefined : { scale: 0.96 }}
                className={`min-w-[4.5rem] shrink-0 rounded-xl border px-2.5 py-2.5 text-center ${
                  isNow
                    ? 'border-sun-500/35 bg-sun-500/10'
                    : 'border-white/[0.06] bg-night-950/40'
                }`}
              >
                <p className="text-[0.65rem] font-medium text-mist-400">
                  {isNow ? 'Now' : formatSolarTime(hour.time, timeZone)}
                </p>
                <p className="mt-1 font-display text-lg text-mist-50">
                  {hour.temperatureC == null ? '—' : `${Math.round(hour.temperatureC)}°`}
                </p>
                <p className={`mt-0.5 text-xs font-semibold ${uv.className}`}>
                  UV {formatUv(hour.uvIndex)}
                </p>
                <p className="mt-0.5 text-[0.65rem] text-mist-500">
                  {hour.cloudCoverPct == null ? '—' : `${Math.round(hour.cloudCoverPct)}%`}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </Panel>
  )
}
