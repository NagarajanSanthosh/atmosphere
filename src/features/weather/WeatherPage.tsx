import { useMemo, useState } from 'react'
import { LocationSearch } from '@/components/shared/LocationSearch'
import { Panel } from '@/components/ui/Panel'
import { SAMPLE_LOCATIONS } from '@/data/sample-locations'
import { getLightWindows } from '@/engines/daylight'
import { ConditionsNow } from '@/features/weather/components/ConditionsNow'
import { HourlyStrip } from '@/features/weather/components/HourlyStrip'
import { ShootabilityNote } from '@/features/weather/components/ShootabilityNote'
import { UvDayChart } from '@/features/weather/components/UvDayChart'
import { WeatherHero } from '@/features/weather/components/WeatherHero'
import { useWeatherForecast } from '@/features/weather/hooks/useWeatherForecast'
import { getShootabilityNote } from '@/features/weather/utils/shootability'
import { filterHoursForLocalDay } from '@/features/weather/utils/todayHours'
import { formatLocalDate } from '@/features/sun-explorer/utils/formatLocalDate'
import type { Location } from '@/types/location'

export function WeatherPage() {
  const [location, setLocation] = useState<Location>(SAMPLE_LOCATIONS[0])
  const forecast = useWeatherForecast({ location })
  const now = useMemo(() => new Date(), [forecast.dataUpdatedAt])

  const todayHours = useMemo(() => {
    if (!forecast.data) return []
    return filterHoursForLocalDay(
      forecast.data.hourly,
      now,
      location.timezone,
    )
  }, [forecast.data, location.timezone, now])

  const upcomingHours = useMemo(() => {
    if (!forecast.data) return []
    return forecast.data.hourly
      .filter((hour) => hour.time.getTime() >= now.getTime() - 45 * 60_000)
      .slice(0, 12)
  }, [forecast.data, now])

  const shootability = useMemo(() => {
    if (!forecast.data) return null
    const windows = getLightWindows({
      latitude: location.latitude,
      longitude: location.longitude,
      date: now,
    })
    return getShootabilityNote(windows, forecast.data.hourly, now)
  }, [forecast.data, location.latitude, location.longitude, now])

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <WeatherHero
        search={<LocationSearch value={location} onChange={setLocation} />}
      />

      <p className="text-xs text-mist-500">
        {location.name} · {formatLocalDate(now, location.timezone)} ·{' '}
        {location.timezone.replace(/_/g, ' ')}
      </p>

      {forecast.isLoading && (
        <Panel className="p-8 text-center text-sm text-mist-400">
          Fetching UV and sky conditions…
        </Panel>
      )}

      {forecast.isError && (
        <Panel className="p-6 text-center">
          <p className="text-sm text-mist-200">Couldn&apos;t reach Open-Meteo.</p>
          <p className="mt-1 text-xs text-mist-500">
            Check your connection, then try again.
          </p>
          <button
            type="button"
            onClick={() => void forecast.refetch()}
            className="mt-4 rounded-full border border-sun-500/35 bg-sun-500/15 px-4 py-2 text-xs font-semibold tracking-wide text-sun-300 uppercase"
          >
            Retry
          </button>
        </Panel>
      )}

      {forecast.data && (
        <div className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-3 sm:gap-4">
            <ConditionsNow weather={forecast.data} locationName={location.name} />
            <UvDayChart hours={todayHours} now={now} timeZone={location.timezone} />
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            <HourlyStrip
              hours={upcomingHours}
              now={now}
              timeZone={location.timezone}
            />
            {shootability && <ShootabilityNote note={shootability} />}
          </div>
        </div>
      )}
    </div>
  )
}
