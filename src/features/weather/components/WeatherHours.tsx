import { Panel } from '@/components/ui/Panel'
import { formatSolarTime } from '@/features/sun-explorer/utils/formatSolarTime'
import { formatUv, getUvCategory } from '@/features/weather/utils/uvScale'
import type { WeatherHour } from '@/services/weather/types'

type WeatherHoursProps = {
  hours: WeatherHour[]
  now: Date
  timeZone: string
}

export function WeatherHours({ hours, now, timeZone }: WeatherHoursProps) {
  if (hours.length === 0) return null

  const nowMs = now.getTime()

  return (
    <section>
      <p className="mb-2 text-[0.65rem] font-bold tracking-[0.14em] text-mist-400 uppercase">
        Next hours
      </p>
      <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
        {hours.map((hour) => {
          const isNow = Math.abs(hour.time.getTime() - nowMs) < 30 * 60_000
          const uv = getUvCategory(hour.uvIndex)
          return (
            <Panel
              key={hour.time.toISOString()}
              className={`w-[4.5rem] shrink-0 !rounded-xl p-2.5 text-center ${
                isNow ? '!border-sun-500/35 !bg-sun-500/10' : ''
              }`}
            >
              <p className="text-[0.65rem] text-mist-400">
                {isNow ? 'Now' : formatSolarTime(hour.time, timeZone)}
              </p>
              <p className="mt-1 font-display text-lg text-mist-50">
                {hour.temperatureC == null ? '—' : `${Math.round(hour.temperatureC)}°`}
              </p>
              <p className={`mt-0.5 text-[0.65rem] font-semibold ${uv.className}`}>
                UV {formatUv(hour.uvIndex)}
              </p>
              <p className="mt-0.5 text-[0.65rem] text-mist-500">
                {hour.cloudCoverPct == null ? '—' : `${Math.round(hour.cloudCoverPct)}%`}
              </p>
            </Panel>
          )
        })}
      </div>
    </section>
  )
}
