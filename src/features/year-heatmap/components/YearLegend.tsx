import { formatDayLength } from '@/features/sun-explorer/utils/formatDayLength'
import { formatLocalDate } from '@/features/sun-explorer/utils/formatLocalDate'
import type { DayCell, YearMetric } from '@/features/year-heatmap/utils/buildYearSeries'
import { metricValue } from '@/features/year-heatmap/utils/buildYearSeries'
import { legendStops } from '@/features/year-heatmap/utils/colorScale'

type YearLegendProps = {
  metric: YearMetric
  shortest: DayCell | null
  longest: DayCell | null
  timeZone: string
}

export function YearLegend({
  metric,
  shortest,
  longest,
  timeZone,
}: YearLegendProps) {
  const stops = legendStops(metric)
  const isDayLength = metric === 'day-length'
  const label = isDayLength ? 'vs 12h' : 'rank'

  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <p className="shrink-0 text-[0.55rem] font-bold tracking-[0.12em] text-mist-400 uppercase sm:text-[0.6rem]">
          {label}
        </p>
        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full border border-white/[0.08] sm:max-w-[12rem] sm:flex-none sm:w-44">
          <div className="flex h-full w-full">
            {stops.map((color, index) => (
              <span
                key={`${color}-${index}`}
                className="h-full flex-1"
                style={{ background: color }}
              />
            ))}
          </div>
        </div>
        <div className="hidden text-[0.55rem] text-mist-500 sm:flex sm:w-20 sm:justify-between">
          {isDayLength ? (
            <>
              <span>&lt;12h</span>
              <span>&gt;12h</span>
            </>
          ) : (
            <>
              <span>Short</span>
              <span>Long</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[0.65rem] text-mist-300 sm:text-xs">
        {shortest && (
          <p>
            Short{' '}
            <span className="text-mist-100">
              {formatLocalDate(shortest.date, timeZone)}
            </span>{' '}
            <span className="font-mono text-twilight-300">
              {formatDayLength(metricValue(shortest, metric))}
            </span>
          </p>
        )}
        {longest && (
          <p>
            Long{' '}
            <span className="text-mist-100">
              {formatLocalDate(longest.date, timeZone)}
            </span>{' '}
            <span className="font-mono text-sun-300">
              {formatDayLength(metricValue(longest, metric))}
            </span>
          </p>
        )}
      </div>
    </div>
  )
}
