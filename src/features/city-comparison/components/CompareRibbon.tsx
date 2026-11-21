import { motion } from 'framer-motion'
import { Panel } from '@/components/ui/Panel'
import type { CityDaySnapshot } from '@/features/city-comparison/hooks/useCityCompare'
import { getDayProgress } from '@/features/sun-explorer/utils/zonedTime'

type CompareRibbonProps = {
  cityA: CityDaySnapshot
  cityB: CityDaySnapshot
  reducedMotion?: boolean
}

function daylightSpan(
  snapshot: CityDaySnapshot,
): { left: number; width: number } | null {
  const daylight = snapshot.windows.find((window) => window.id === 'daylight')
  const start = daylight?.interval.start ?? snapshot.events.sunrise
  const end = daylight?.interval.end ?? snapshot.events.sunset
  if (!start || !end) return null

  const left = getDayProgress(start, snapshot.location.timezone) * 100
  const right = getDayProgress(end, snapshot.location.timezone) * 100
  return { left, width: Math.max(0.8, right - left) }
}

export function CompareRibbon({
  cityA,
  cityB,
  reducedMotion = false,
}: CompareRibbonProps) {
  const spanA = daylightSpan(cityA)
  const spanB = daylightSpan(cityB)

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reducedMotion ? { duration: 0 } : { delay: 0.06, type: 'spring', stiffness: 260, damping: 28 }
      }
    >
      <Panel className="p-4 sm:p-5">
        <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
          Shared day ribbon
        </p>
        <p className="mt-1 text-xs text-mist-500">
          Daylight span on a 24-hour axis · each city&apos;s local clock
        </p>

        <div className="mt-4 space-y-3">
          <RibbonRow
            name={cityA.location.name}
            color="#f0a43a"
            span={spanA}
            reducedMotion={reducedMotion}
          />
          <RibbonRow
            name={cityB.location.name}
            color="#8fa0d9"
            span={spanB}
            reducedMotion={reducedMotion}
          />
        </div>

        <div className="mt-2 flex justify-between text-[0.65rem] tracking-wide text-mist-500">
          <span>00:00</span>
          <span>12:00</span>
          <span>24:00</span>
        </div>
      </Panel>
    </motion.div>
  )
}

function RibbonRow({
  name,
  color,
  span,
  reducedMotion,
}: {
  name: string
  color: string
  span: { left: number; width: number } | null
  reducedMotion: boolean
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-mist-300">{name}</p>
      <div className="relative h-8 overflow-hidden rounded-xl border border-white/[0.08] bg-night-950/70">
        {span ? (
          <motion.div
            className="absolute inset-y-1 rounded-lg"
            style={{
              left: `${span.left}%`,
              width: `${span.width}%`,
              background: color,
              opacity: 0.85,
            }}
            initial={reducedMotion ? false : { scaleX: 0.6, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.85 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 220, damping: 24 }
            }
          />
        ) : (
          <p className="absolute inset-0 grid place-items-center text-[0.65rem] text-mist-500">
            No daylight span
          </p>
        )}
      </div>
    </div>
  )
}
