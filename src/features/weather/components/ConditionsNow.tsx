import { AnimatePresence, motion } from 'framer-motion'
import { Panel } from '@/components/ui/Panel'
import type { WeatherSnapshot } from '@/services/weather/types'
import { getWeatherSkyStory } from '@/features/weather/utils/weatherCode'
import { formatUv, getUvCategory } from '@/features/weather/utils/uvScale'

type ConditionsNowProps = {
  weather: WeatherSnapshot
  locationName: string
}

export function ConditionsNow({ weather, locationName }: ConditionsNowProps) {
  const { current, uvIndexMaxToday } = weather
  const category = getUvCategory(current.uvIndex)
  const sky = getWeatherSkyStory(current.weatherCode)
  const uvValue = formatUv(current.uvIndex)
  const tempValue = `${Math.round(current.temperatureC)}`
  const cloudValue = `${Math.round(current.cloudCoverPct)}`

  return (
    <Panel className="relative overflow-hidden p-5 sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-sun-500/12 blur-3xl"
      />
      <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
        Right now · {locationName}
      </p>

      <div className="mt-3 rounded-xl border border-white/[0.06] bg-night-950/40 px-3 py-2.5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={sky.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
          >
            <p className="text-sm font-semibold text-twilight-300">{sky.label}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-mist-400">{sky.story}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-mist-500">UV index</p>
          <MorphValue
            value={uvValue}
            className={`mt-1 font-display text-4xl leading-none ${category.className}`}
          />
          <p className={`mt-1.5 text-sm font-medium ${category.className}`}>
            {category.label}
          </p>
        </div>

        <div>
          <p className="text-xs text-mist-500">Temperature</p>
          <div className="mt-1 flex items-start">
            <MorphValue
              value={tempValue}
              className="font-display text-4xl leading-none text-mist-50"
            />
            <span className="text-2xl text-mist-400">°C</span>
          </div>
          {uvIndexMaxToday != null && (
            <p className="mt-1.5 text-xs text-mist-500">
              Today&apos;s UV max {formatUv(uvIndexMaxToday)}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-mist-500">Cloud cover</p>
          <div className="mt-1 flex items-start">
            <MorphValue
              value={cloudValue}
              className="font-display text-4xl leading-none text-twilight-300"
            />
            <span className="text-2xl text-mist-400">%</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-night-950/70">
            <motion.div
              className="h-full rounded-full bg-twilight-400"
              initial={false}
              animate={{
                width: `${Math.min(100, Math.max(0, current.cloudCoverPct))}%`,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 28 }}
            />
          </div>
        </div>
      </div>
    </Panel>
  )
}

function MorphValue({ value, className }: { value: string; className: string }) {
  return (
    <span className={`relative inline-block min-h-[1em] overflow-hidden ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
