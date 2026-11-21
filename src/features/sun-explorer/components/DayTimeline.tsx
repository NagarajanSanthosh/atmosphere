import type { SolarDayEvents } from '@/engines/solar'
import { formatLocalDate } from '@/features/sun-explorer/utils/formatLocalDate'
import { formatSolarTime } from '@/features/sun-explorer/utils/formatSolarTime'
import { getDayProgress } from '@/features/sun-explorer/utils/zonedTime'

type DayTimelineProps = {
  progressPercent: number
  instant: Date
  timeZone: string
  events: SolarDayEvents
  onProgressChange: (progressPercent: number) => void
  onJumpToNow: () => void
}

export function DayTimeline({
  progressPercent,
  instant,
  timeZone,
  events,
  onProgressChange,
  onJumpToNow,
}: DayTimelineProps) {
  const ticks = [
    { key: 'sunrise', label: 'Rise', percent: tickPercent(events.sunrise, timeZone), color: 'bg-twilight-400' },
    { key: 'noon', label: 'Noon', percent: tickPercent(events.solarNoon, timeZone), color: 'bg-sun-400' },
    { key: 'sunset', label: 'Set', percent: tickPercent(events.sunset, timeZone), color: 'bg-dusk-500' },
  ].filter((tick) => tick.percent !== null) as Array<{
    key: string
    label: string
    percent: number
    color: string
  }>

  return (
    <div className="mt-4 space-y-3 px-1 pb-0.5 sm:mt-5 sm:px-1.5 sm:pb-1">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
            Local timeline
          </p>
          <p className="mt-1 text-xs text-mist-500">
            {formatLocalDate(instant, timeZone)} · {timeZone.replace(/_/g, ' ')}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onJumpToNow}
            className="rounded-full border border-sun-500/25 bg-sun-500/10 px-3 py-1.5 text-xs font-semibold text-sun-300 transition-colors hover:bg-sun-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-400"
          >
            Now
          </button>
          <p className="font-display text-xl tracking-tight text-sun-300 sm:text-2xl">
            {formatSolarTime(instant, timeZone)}
          </p>
        </div>
      </div>

      <div className="relative pt-3">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-3">
          {ticks.map((tick) => (
            <div
              key={tick.key}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${tick.percent}%` }}
            >
              <span className={`mb-0.5 size-1.5 rounded-full ${tick.color}`} />
              <span className="hidden text-[0.6rem] text-mist-500 sm:inline">{tick.label}</span>
            </div>
          ))}
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={0.05}
          value={progressPercent}
          onChange={(event) => onProgressChange(Number(event.target.value))}
          aria-label="Time of day in selected location"
          className="timeline-range"
        />
      </div>

      <div className="flex justify-between text-[0.65rem] tracking-wide text-mist-500 sm:text-[0.7rem]">
        <span>00:00</span>
        <span>12:00</span>
        <span>24:00</span>
      </div>
    </div>
  )
}

function tickPercent(date: Date | null, timeZone: string): number | null {
  if (!date) return null
  return getDayProgress(date, timeZone) * 100
}
