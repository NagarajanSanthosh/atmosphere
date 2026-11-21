import { Panel } from '@/components/ui/Panel'
import { formatUv, getUvCategory } from '@/features/weather/utils/uvScale'
import { formatLocalDate } from '@/features/sun-explorer/utils/formatLocalDate'

type UvWeekStripProps = {
  days: Array<{ date: Date; uvIndexMax: number | null }>
  timeZone: string
}

export function UvWeekStrip({ days, timeZone }: UvWeekStripProps) {
  return (
    <Panel className="p-4 sm:p-5">
      <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
        UV next days
      </p>
      <p className="mt-1 text-xs text-mist-500">Daily UV index max</p>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {days.map((day) => {
          const category = getUvCategory(day.uvIndexMax)
          return (
            <div
              key={day.date.toISOString()}
              className="min-w-[4.75rem] shrink-0 rounded-xl border border-white/[0.06] bg-night-950/40 px-2.5 py-2.5 text-center"
            >
              <p className="text-[0.65rem] font-medium text-mist-400">
                {formatLocalDate(day.date, timeZone).split(',')[0] ??
                  formatLocalDate(day.date, timeZone)}
              </p>
              <p className={`mt-1 font-display text-xl ${category.className}`}>
                {formatUv(day.uvIndexMax)}
              </p>
              <p className={`mt-0.5 text-[0.65rem] ${category.className}`}>
                {category.label}
              </p>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
