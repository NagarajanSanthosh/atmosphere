import { useMemo } from 'react'
import { Panel } from '@/components/ui/Panel'
import {
  getBestGoldenWeek,
  longestGoldenEvening,
} from '@/features/golden-hour/utils/bestGoldenWeek'
import { formatLocalDate } from '@/features/sun-explorer/utils/formatLocalDate'
import { formatSolarTime } from '@/features/sun-explorer/utils/formatSolarTime'
import type { Location } from '@/types/location'

type BestOfWeekProps = {
  location: Location
  /** Calendar day to start the 7-day scan (stable preferred). */
  from: Date
}

export function BestOfWeek({ location, from }: BestOfWeekProps) {
  const dayKey = `${from.getFullYear()}-${from.getMonth()}-${from.getDate()}`
  const days = useMemo(
    () => getBestGoldenWeek(location, from),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recompute on calendar day / place only
    [location.latitude, location.longitude, location.id, dayKey],
  )
  const best = useMemo(() => longestGoldenEvening(days), [days])

  return (
    <Panel className="p-4 sm:p-5">
      <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
        Best of week
      </p>
      <p className="mt-1 text-xs text-mist-500">
        Golden evening length · next 7 days · {location.name}
      </p>

      {best && best.durationMs != null && (
        <p className="mt-3 text-sm text-sun-300">
          Longest · {formatLocalDate(best.date, location.timezone)} ·{' '}
          <span className="font-mono">{best.durationLabel}</span>
        </p>
      )}

      <ul className="mt-3 divide-y divide-white/[0.05]">
        {days.map((day) => {
          const isBest =
            best != null &&
            best.durationMs != null &&
            day.durationMs === best.durationMs
          return (
            <li
              key={day.date.toISOString()}
              className="flex items-center justify-between gap-3 py-2 text-sm"
            >
              <span className={isBest ? 'font-medium text-sun-300' : 'text-mist-200'}>
                {formatLocalDate(day.date, location.timezone)}
              </span>
              <span className="shrink-0 font-mono text-xs text-mist-400 sm:text-sm">
                {day.start && day.end ? (
                  <>
                    {formatSolarTime(day.start, location.timezone)}
                    <span className="text-mist-500"> – </span>
                    {formatSolarTime(day.end, location.timezone)}
                    <span className="ml-2 text-mist-300">{day.durationLabel}</span>
                  </>
                ) : (
                  '—'
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
