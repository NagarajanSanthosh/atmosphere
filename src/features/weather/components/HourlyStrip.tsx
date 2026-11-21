import { Panel } from '@/components/ui/Panel'
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

  return (
    <Panel className="p-4 sm:p-5">
      <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
        Next hours
      </p>
      <p className="mt-1 text-xs text-mist-500">Temp · UV · cloud</p>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {hours.map((hour) => {
          const isNow = Math.abs(hour.time.getTime() - nowMs) < 30 * 60_000
          const uv = getUvCategory(hour.uvIndex)
          return (
            <div
              key={hour.time.toISOString()}
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
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
