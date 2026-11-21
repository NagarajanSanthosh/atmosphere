import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Panel } from '@/components/ui/Panel'
import type { LightWindow, LightWindowId } from '@/engines/daylight'
import { getWindowAccent } from '@/features/golden-hour/utils/windowColors'
import { formatSolarTime } from '@/features/sun-explorer/utils/formatSolarTime'

type WindowsRailProps = {
  windows: LightWindow[]
  activeId: string | null
  focusedId?: LightWindowId | null
  onSelectWindow?: (id: LightWindowId) => void
  timeZone: string
  reducedMotion?: boolean
}

/** Photography-first order: goldens & blues, then twilight edges. */
const DISPLAY_ORDER: LightWindowId[] = [
  'golden-morning',
  'blue-morning',
  'golden-evening',
  'blue-evening',
  'civil-dawn',
  'civil-dusk',
  'nautical-dawn',
  'nautical-dusk',
  'astro-dawn',
  'astro-dusk',
]

export function WindowsRail({
  windows,
  activeId,
  focusedId = null,
  onSelectWindow,
  timeZone,
  reducedMotion = false,
}: WindowsRailProps) {
  const byId = new Map(windows.map((window) => [window.id, window]))
  const items = DISPLAY_ORDER.map((id) => byId.get(id)).filter(Boolean) as LightWindow[]
  const rowRefs = useRef<Map<string, HTMLLIElement>>(new Map())

  useEffect(() => {
    if (!focusedId) return
    rowRefs.current
      .get(focusedId)
      ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' })
  }, [focusedId, reducedMotion])

  if (items.length === 0) {
    return (
      <Panel className="p-5 text-sm text-mist-400">
        Light windows unavailable for this location/day (polar day or night).
      </Panel>
    )
  }

  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-white/[0.06] px-4 py-3 sm:px-5">
        <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
          Today&apos;s windows
        </p>
      </div>
      <ul className="max-h-[28rem] divide-y divide-white/[0.05] overflow-y-auto">
        {items.map((window, index) => {
          const active = window.id === activeId
          const focused = window.id === focusedId
          const highlighted = focusedId ? focused : active

          return (
            <motion.li
              key={window.id}
              ref={(node) => {
                if (node) rowRefs.current.set(window.id, node)
                else rowRefs.current.delete(window.id)
              }}
              initial={reducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      delay: index * 0.025,
                      type: 'spring',
                      stiffness: 320,
                      damping: 28,
                    }
              }
              className={`relative flex items-center justify-between gap-3 px-4 py-3 transition-colors sm:px-5 ${
                active || focused ? 'bg-sun-500/10' : 'hover:bg-white/[0.03]'
              }`}
            >
              {highlighted && (
                <motion.span
                  layoutId={reducedMotion ? undefined : 'studio-window-accent'}
                  className="absolute inset-y-1 left-1 w-0.5 rounded-full bg-sun-400"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
                onClick={() => onSelectWindow?.(window.id)}
              >
                <div className="min-w-0">
                  <p className={`truncate text-sm font-semibold ${getWindowAccent(window.id)}`}>
                    {window.label}
                    {active && (
                      <span className="ml-2 rounded-full bg-sun-500/20 px-1.5 py-0.5 text-[0.6rem] font-bold tracking-wide text-sun-300 uppercase">
                        Now
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs capitalize text-mist-500">{window.period}</p>
                </div>
                <p className="shrink-0 font-mono text-xs text-mist-200 sm:text-sm">
                  {formatSolarTime(window.interval.start, timeZone)}
                  <span className="text-mist-500"> – </span>
                  {formatSolarTime(window.interval.end, timeZone)}
                </p>
              </button>
            </motion.li>
          )
        })}
      </ul>
    </Panel>
  )
}
