import { Panel } from '@/components/ui/Panel'
import { getWeatherSkyStory } from '@/features/weather/utils/weatherCode'
import { formatUv, getUvCategory } from '@/features/weather/utils/uvScale'
import type { WeatherSnapshot } from '@/services/weather/types'

type WeatherNowProps = {
  weather: WeatherSnapshot
  locationName: string
}

/** Current conditions — mobile-first, no overflow gimmicks. */
export function WeatherNow({ weather, locationName }: WeatherNowProps) {
  const { current, uvIndexMaxToday } = weather
  const sky = getWeatherSkyStory(current.weatherCode)
  const uv = getUvCategory(current.uvIndex)

  return (
    <Panel className="p-4">
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-bold tracking-[0.14em] text-mist-400 uppercase">
            {locationName}
          </p>
          <p className="mt-1 font-display text-2xl text-mist-50">{sky.label}</p>
          <p className="mt-1 text-xs leading-snug text-mist-400">{sky.story}</p>
        </div>
        <p className="shrink-0 font-display text-4xl leading-none text-mist-50">
          {Math.round(current.temperatureC)}
          <span className="text-xl text-mist-400">°</span>
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4">
        <div>
          <p className="text-[0.65rem] text-mist-500">UV now</p>
          <p className={`mt-1 font-display text-2xl leading-none ${uv.className}`}>
            {formatUv(current.uvIndex)}
          </p>
          <p className={`mt-1 text-xs ${uv.className}`}>
            {uv.label}
            {uvIndexMaxToday != null ? ` · max ${formatUv(uvIndexMaxToday)}` : ''}
          </p>
        </div>
        <div>
          <p className="text-[0.65rem] text-mist-500">Cloud cover</p>
          <p className="mt-1 font-display text-2xl leading-none text-twilight-300">
            {Math.round(current.cloudCoverPct)}
            <span className="text-lg text-mist-400">%</span>
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-night-950/70">
            <div
              className="h-full rounded-full bg-twilight-400"
              style={{
                width: `${Math.min(100, Math.max(0, current.cloudCoverPct))}%`,
              }}
            />
          </div>
        </div>
      </div>
    </Panel>
  )
}
