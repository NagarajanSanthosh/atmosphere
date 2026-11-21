import { useEffect, useMemo, useRef } from 'react'
import { LocationSearch } from '@/components/shared/LocationSearch'
import { PlaceControls } from '@/components/shared/PlaceControls'
import { Panel } from '@/components/ui/Panel'
import { getLightWindows } from '@/engines/daylight'
import { WeatherCharts } from '@/features/weather/components/WeatherCharts'
import { WeatherHours } from '@/features/weather/components/WeatherHours'
import { WeatherNow } from '@/features/weather/components/WeatherNow'
import { WeatherWeek } from '@/features/weather/components/WeatherWeek'
import { useWeatherForecast } from '@/features/weather/hooks/useWeatherForecast'
import { getShootabilityNote } from '@/features/weather/utils/shootability'
import { filterHoursForLocalDay } from '@/features/weather/utils/todayHours'
import { formatLocalDate } from '@/features/sun-explorer/utils/formatLocalDate'
import { useSharedPlace } from '@/hooks/useSharedPlace'

/**
 * Weather — rebuilt mobile-first.
 * Single column: place → now → hours → charts → week.
 */
export function WeatherPage() {
  const {
    location,
    setLocation,
    date,
    dateInputValue,
    setDateFromInput,
    jumpToToday,
  } = useSharedPlace()
  const forecast = useWeatherForecast({ location })
  const wallNow = useMemo(() => new Date(), [forecast.dataUpdatedAt])
  const didAutoToday = useRef(false)

  const isToday =
    formatLocalDate(date, location.timezone) ===
    formatLocalDate(wallNow, location.timezone)

  const dayHours = useMemo(() => {
    if (!forecast.data) return []
    return filterHoursForLocalDay(
      forecast.data.hourly,
      date,
      location.timezone,
    )
  }, [forecast.data, location.timezone, date])

  const upcomingHours = useMemo(() => {
    if (!forecast.data) return []
    if (isToday) {
      return forecast.data.hourly
        .filter((hour) => hour.time.getTime() >= wallNow.getTime() - 45 * 60_000)
        .slice(0, 12)
    }
    return dayHours.slice(0, 12)
  }, [forecast.data, isToday, wallNow, dayHours])

  const windows = useMemo(
    () =>
      getLightWindows({
        latitude: location.latitude,
        longitude: location.longitude,
        date,
      }),
    [location.latitude, location.longitude, date],
  )

  const shootability = useMemo(() => {
    if (!forecast.data || !isToday) return null
    return getShootabilityNote(windows, forecast.data.hourly, wallNow)
  }, [forecast.data, isToday, windows, wallNow])

  // Past/out-of-range dates have no hourly series — snap Weather to today once.
  useEffect(() => {
    if (!forecast.data || didAutoToday.current) return
    if (!isToday && dayHours.length === 0) {
      didAutoToday.current = true
      jumpToToday()
    }
  }, [forecast.data, isToday, dayHours.length, jumpToToday])

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
      <header className="flex flex-col gap-3">
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.16em] text-sun-500 uppercase">
            Weather
          </p>
          <h1 className="mt-1 font-display text-2xl text-mist-50 sm:text-3xl">
            Sky conditions
          </h1>
        </div>

        <LocationSearch value={location} onChange={setLocation} />
        <PlaceControls
          dateInputValue={dateInputValue}
          onDateChange={setDateFromInput}
          onJumpToday={jumpToToday}
          onLocation={setLocation}
        />

        <p className="text-xs text-mist-500">
          {location.name} · {formatLocalDate(date, location.timezone)}
        </p>
      </header>

      {forecast.isLoading && (
        <Panel className="p-6 text-center text-sm text-mist-400">
          Fetching conditions…
        </Panel>
      )}

      {forecast.isError && (
        <Panel className="p-5 text-center">
          <p className="text-sm text-mist-200">Couldn&apos;t reach Open-Meteo.</p>
          <button
            type="button"
            onClick={() => void forecast.refetch()}
            className="mt-3 rounded-full border border-sun-500/35 bg-sun-500/15 px-4 py-2 text-xs font-semibold tracking-wide text-sun-300 uppercase"
          >
            Retry
          </button>
        </Panel>
      )}

      {forecast.data && (
        <div className="flex flex-col gap-4">
          <WeatherNow weather={forecast.data} locationName={location.name} />

          {shootability && (
            <Panel className="p-3">
              <p className="text-[0.65rem] font-bold tracking-[0.14em] text-mist-400 uppercase">
                Shoot tip
              </p>
              <p className="mt-1 font-display text-lg text-mist-50">
                {shootability.headline}
              </p>
              <p className="mt-0.5 text-xs text-mist-400">{shootability.detail}</p>
            </Panel>
          )}

          <WeatherHours
            hours={upcomingHours}
            now={wallNow}
            timeZone={location.timezone}
          />

          {dayHours.length > 0 ? (
            <WeatherCharts
              hours={dayHours}
              windows={windows}
              now={wallNow}
              timeZone={location.timezone}
            />
          ) : (
            !isToday && (
              <Panel className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-mist-400">
                  No hourly data for this date.
                </p>
                <button
                  type="button"
                  onClick={jumpToToday}
                  className="rounded-full border border-sun-500/30 bg-sun-500/10 px-3 py-2 text-[0.7rem] font-semibold tracking-wide text-sun-300 uppercase"
                >
                  Go to today
                </button>
              </Panel>
            )
          )}

          <WeatherWeek days={forecast.data.daily} timeZone={location.timezone} />
        </div>
      )}
    </div>
  )
}
