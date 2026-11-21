import { motion } from 'framer-motion'
import { Panel } from '@/components/ui/Panel'
import type { LightWindow, LightWindowId } from '@/engines/daylight'
import { getWindowBandColor } from '@/features/golden-hour/utils/windowColors'
import { getDayProgress } from '@/features/sun-explorer/utils/zonedTime'

type DayRibbonProps = {
  windows: LightWindow[]
  instant: Date
  timeZone: string
  focusedId?: LightWindowId | null
  onSelectWindow?: (id: LightWindowId) => void
  reducedMotion?: boolean
}

const RIBBON_IDS = [
  'astro-dawn',
  'nautical-dawn',
  'blue-morning',
  'golden-morning',
  'daylight',
  'golden-evening',
  'blue-evening',
  'nautical-dusk',
  'astro-dusk',
] as const

export function DayRibbon({
  windows,
  instant,
  timeZone,
  focusedId = null,
  onSelectWindow,
  reducedMotion = false,
}: DayRibbonProps) {
  const bands = RIBBON_IDS.map((id) => windows.find((window) => window.id === id)).filter(
    Boolean,
  ) as LightWindow[]

  const nowPercent = getDayProgress(instant, timeZone) * 100

  return (
    <Panel className="p-4 sm:p-5">
      <div className="mb-3">
        <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
          Day ribbon
        </p>
        <p className="mt-1 text-xs text-mist-500">
          Local day · tap a band to focus its window
        </p>
      </div>

      <div className="relative h-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-night-950/70 sm:h-14">
        {bands.map((window) => {
          const start = window.interval.start
          const end = window.interval.end
          if (!start || !end) return null

          const left = getDayProgress(start, timeZone) * 100
          const right = getDayProgress(end, timeZone) * 100
          const width = Math.max(0.6, right - left)
          const focused = focusedId === window.id

          return (
            <motion.button
              key={window.id}
              type="button"
              title={window.label}
              aria-label={window.label}
              aria-pressed={focused}
              onClick={() => onSelectWindow?.(window.id)}
              className="absolute inset-y-0 z-[1] cursor-pointer border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-sun-400/70 focus-visible:ring-inset"
              style={{
                left: `${left}%`,
                width: `${width}%`,
                background: getWindowBandColor(window.id),
              }}
              initial={false}
              animate={{
                opacity: focused || !focusedId ? 0.95 : 0.4,
                scaleY: focused ? 1.08 : 1,
              }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 320, damping: 26 }
              }
              whileHover={reducedMotion ? undefined : { opacity: 1, scaleY: 1.05 }}
            />
          )
        })}

        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 bg-mist-50 shadow-[0_0_12px_rgba(247,241,232,0.8)]"
          initial={false}
          animate={{ left: `${nowPercent}%` }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 120, damping: 22 }
          }
        />
      </div>

      <div className="mt-2 flex justify-between text-[0.65rem] tracking-wide text-mist-500">
        <span>00:00</span>
        <span>Now</span>
        <span>24:00</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-[0.65rem] text-mist-400">
        <Legend color="#f0a43a" label="Golden" />
        <Legend color="#6b7fd7" label="Blue" />
        <Legend color="#4a5580" label="Nautical" />
        <Legend color="#2a3148" label="Astro" />
        <Legend color="#ffc45a" label="Day" />
      </div>
    </Panel>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="size-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  )
}
