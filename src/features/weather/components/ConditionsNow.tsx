import { Panel } from '@/components/ui/Panel'
import type { WeatherSnapshot } from '@/services/weather/types'
import { formatUv, getUvCategory } from '@/features/weather/utils/uvScale'

type ConditionsNowProps = {
  weather: WeatherSnapshot
  locationName: string
}

export function ConditionsNow({ weather, locationName }: ConditionsNowProps) {
  const { current, uvIndexMaxToday } = weather
  const category = getUvCategory(current.uvIndex)

  return (
    <Panel className="relative overflow-hidden p-5 sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-sun-500/12 blur-3xl"
      />
      <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
        Right now · {locationName}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-mist-500">UV index</p>
          <p className={`mt-1 font-display text-4xl leading-none ${category.className}`}>
            {formatUv(current.uvIndex)}
          </p>
          <p className={`mt-1.5 text-sm font-medium ${category.className}`}>
            {category.label}
          </p>
        </div>

        <div>
          <p className="text-xs text-mist-500">Temperature</p>
          <p className="mt-1 font-display text-4xl leading-none text-mist-50">
            {Math.round(current.temperatureC)}
            <span className="text-2xl text-mist-400">°C</span>
          </p>
          {uvIndexMaxToday != null && (
            <p className="mt-1.5 text-xs text-mist-500">
              Today&apos;s UV max {formatUv(uvIndexMaxToday)}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs text-mist-500">Cloud cover</p>
          <p className="mt-1 font-display text-4xl leading-none text-twilight-300">
            {Math.round(current.cloudCoverPct)}
            <span className="text-2xl text-mist-400">%</span>
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-night-950/70">
            <div
              className="h-full rounded-full bg-twilight-400"
              style={{ width: `${Math.min(100, Math.max(0, current.cloudCoverPct))}%` }}
            />
          </div>
        </div>
      </div>
    </Panel>
  )
}
