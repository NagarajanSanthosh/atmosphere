import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Reveal, Stagger, StaggerItem } from '@/components/motion'
import { LocationSearch } from '@/components/shared/LocationSearch'
import { PlaceControls } from '@/components/shared/PlaceControls'
import { Panel } from '@/components/ui/Panel'
import { formatDayLength } from '@/features/sun-explorer/utils/formatDayLength'
import { formatLocalDate } from '@/features/sun-explorer/utils/formatLocalDate'
import { YearGrid } from '@/features/year-heatmap/components/YearGrid'
import { YearHero } from '@/features/year-heatmap/components/YearHero'
import { YearLegend } from '@/features/year-heatmap/components/YearLegend'
import {
  buildYearSeries,
  extremes,
  type YearMetric,
} from '@/features/year-heatmap/utils/buildYearSeries'
import { buildHeatColorScale } from '@/features/year-heatmap/utils/colorScale'
import { useSharedPlace } from '@/hooks/useSharedPlace'
import { noonToday, toDateInputValue } from '@/utils/placeParams'

export function YearHeatmapPage() {
  const {
    location,
    setLocation,
    date,
    setDate,
    dateInputValue,
    setDateFromInput,
    jumpToToday,
  } = useSharedPlace()
  const [searchParams] = useSearchParams()
  const [metric, setMetric] = useState<YearMetric>('day-length')

  const year = date.getFullYear()
  const selectedKey = toDateInputValue(date)
  const todayKey = toDateInputValue(noonToday())
  const query = searchParams.toString()
  const studioHref = query ? `/studio?${query}` : '/studio'

  const series = useMemo(
    () => buildYearSeries(location, year),
    [location, year],
  )
  const colorScale = useMemo(
    () => buildHeatColorScale(series.days, metric),
    [series.days, metric],
  )
  const { shortest, longest } = useMemo(
    () => extremes(series.days, metric),
    [series.days, metric],
  )

  const selected = useMemo(
    () => series.days.find((day) => toDateInputValue(day.date) === selectedKey) ?? null,
    [series.days, selectedKey],
  )

  function handleYearChange(nextYear: number) {
    const next = new Date(date)
    next.setFullYear(nextYear)
    // Clamp if month/day invalid (e.g. Feb 29 → Mar 1 in non-leap)
    if (next.getFullYear() !== nextYear) {
      next.setFullYear(nextYear, 11, 31)
    }
    next.setHours(12, 0, 0, 0)
    setDate(next)
  }

  return (
    <Stagger className="flex flex-col gap-2 sm:gap-4" stagger={0.06}>
      <StaggerItem>
        <YearHero
          year={year}
          metric={metric}
          onYearChange={handleYearChange}
          onMetricChange={setMetric}
          search={
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <LocationSearch value={location} onChange={setLocation} />
              <PlaceControls
                dateInputValue={dateInputValue}
                onDateChange={setDateFromInput}
                onJumpToday={jumpToToday}
                onLocation={setLocation}
              />
            </div>
          }
        />
      </StaggerItem>

      <StaggerItem>
        <p className="truncate text-[0.65rem] text-mist-500 sm:text-xs">
          {location.name} · {year} · {location.timezone.replace(/_/g, ' ')}
        </p>
      </StaggerItem>

      <StaggerItem>
        <Panel className="flex flex-col gap-2.5 p-2.5 sm:gap-4 sm:p-4">
          <YearLegend
            metric={metric}
            shortest={shortest}
            longest={longest}
            timeZone={location.timezone}
          />
          <YearGrid
            months={series.months}
            metric={metric}
            colorScale={colorScale}
            selectedKey={selectedKey}
            todayKey={todayKey}
            timeZone={location.timezone}
            onSelect={setDate}
          />
        </Panel>
      </StaggerItem>

      {selected && (
        <StaggerItem>
          <Reveal>
            <Panel className="flex flex-row items-center justify-between gap-2 p-2.5 sm:gap-3 sm:p-4">
              <div className="min-w-0">
                <p className="text-[0.55rem] font-bold tracking-[0.14em] text-mist-400 uppercase sm:text-[0.6rem]">
                  Selected
                </p>
                <p className="truncate font-display text-sm text-mist-50 sm:text-base">
                  {formatLocalDate(selected.date, location.timezone)}
                </p>
                <p className="truncate text-[0.65rem] text-mist-400 sm:text-xs">
                  <span className="font-mono text-mist-100">
                    {formatDayLength(selected.dayLengthMs)}
                  </span>
                  {' · '}
                  <span className="font-mono text-sun-300">
                    {formatDayLength(selected.goldenEveningMs)}
                  </span>
                </p>
              </div>
              <Link
                to={studioHref}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-sun-500 to-dusk-500 px-3 py-1.5 text-xs font-semibold text-night-950 shadow-[0_0_24px_rgba(240,164,58,0.25)] sm:px-4 sm:py-2 sm:text-sm"
              >
                Studio
              </Link>
            </Panel>
          </Reveal>
        </StaggerItem>
      )}
    </Stagger>
  )
}
