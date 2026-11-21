import { Panel } from '@/components/ui/Panel'
import { formatLocalDate } from '@/features/sun-explorer/utils/formatLocalDate'
import { formatUv, getUvCategory } from '@/features/weather/utils/uvScale'

type WeatherWeekProps = {
  days: Array<{ date: Date; uvIndexMax: number | null }>
  timeZone: string
}

export function WeatherWeek({ days, timeZone }: WeatherWeekProps) {
  if (days.length === 0) return null

  return (
    <section>
      <p className="mb-2 text-[0.65rem] font-bold tracking-[0.14em] text-mist-400 uppercase">
        UV this week
      </p>
      <div className="-mx-3 flex gap-2 overflow-x-auto px-3 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
        {days.map((day) => {
          const uv = getUvCategory(day.uvIndexMax)
          const label =
            formatLocalDate(day.date, timeZone).split(',')[0] ??
            formatLocalDate(day.date, timeZone)
          return (
            <Panel
              key={day.date.toISOString()}
              className="w-[4.5rem] shrink-0 !rounded-xl p-2.5 text-center"
            >
              <p className="truncate text-[0.65rem] text-mist-400">{label}</p>
              <p className={`mt-1 font-display text-xl ${uv.className}`}>
                {formatUv(day.uvIndexMax)}
              </p>
              <p className={`mt-0.5 text-[0.65rem] ${uv.className}`}>{uv.label}</p>
            </Panel>
          )
        })}
      </div>
    </section>
  )
}
