import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'
import { DepthCard, Reveal, Stagger, StaggerItem } from '@/components/motion'
import { softSpring } from '@/components/motion/tokens'
import { LocationSearch } from '@/components/shared/LocationSearch'
import { PlaceControls } from '@/components/shared/PlaceControls'
import { Panel } from '@/components/ui/Panel'
import { getLightWindows } from '@/engines/daylight'
import { CloudGoldenOverlay } from '@/features/weather/components/CloudGoldenOverlay'
import { ConditionsNow } from '@/features/weather/components/ConditionsNow'
import { HourlyStrip } from '@/features/weather/components/HourlyStrip'
import { ShootabilityNote } from '@/features/weather/components/ShootabilityNote'
import { UvDayChart } from '@/features/weather/components/UvDayChart'
import { UvWeekStrip } from '@/features/weather/components/UvWeekStrip'
import { WeatherHero } from '@/features/weather/components/WeatherHero'
import { useWeatherForecast } from '@/features/weather/hooks/useWeatherForecast'
import { getShootabilityNote } from '@/features/weather/utils/shootability'
import { filterHoursForLocalDay } from '@/features/weather/utils/todayHours'
import { useCompactViewport } from '@/hooks/useCompactViewport'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useSharedPlace } from '@/hooks/useSharedPlace'
import { formatLocalDate } from '@/features/sun-explorer/utils/formatLocalDate'

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
  const reduced = usePrefersReducedMotion()
  const compact = useCompactViewport()
  const wallNow = useMemo(() => new Date(), [forecast.dataUpdatedAt])

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
    // On "today", show upcoming from wall clock; on other days, show that day's hours.
    const sameDay =
      formatLocalDate(date, location.timezone) ===
      formatLocalDate(wallNow, location.timezone)
    if (sameDay) {
      return forecast.data.hourly
        .filter((hour) => hour.time.getTime() >= wallNow.getTime() - 45 * 60_000)
        .slice(0, 12)
    }
    return dayHours.slice(0, 12)
  }, [forecast.data, wallNow, date, location.timezone, dayHours])

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
    if (!forecast.data) return null
    return getShootabilityNote(windows, forecast.data.hourly, wallNow)
  }, [forecast.data, windows, wallNow])

  const statusKey = forecast.isLoading
    ? 'loading'
    : forecast.isError
      ? 'error'
      : forecast.data
        ? 'data'
        : 'idle'

  return (
    <Stagger className="flex flex-col gap-4 sm:gap-5" stagger={0.07}>
      <StaggerItem>
        <WeatherHero
          search={
            <div className="flex flex-col gap-3">
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
        <p className="text-xs text-mist-500">
          {location.name} · {formatLocalDate(date, location.timezone)} ·{' '}
          {location.timezone.replace(/_/g, ' ')}
        </p>
      </StaggerItem>

      <AnimatePresence mode="wait">
        {statusKey === 'loading' && (
          <motion.div
            key="loading"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0.12 } : softSpring}
          >
            <Panel className="p-8 text-center text-sm text-mist-400">
              Fetching UV and sky conditions…
            </Panel>
          </motion.div>
        )}

        {statusKey === 'error' && (
          <motion.div
            key="error"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0.12 } : softSpring}
          >
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
          </motion.div>
        )}

        {statusKey === 'data' && forecast.data && (
          <motion.div
            key={`data-${location.id}-${dateInputValue}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0.12 } : softSpring}
            className="flex flex-col gap-3 sm:gap-4"
          >
            <div className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div className="flex flex-col gap-3 sm:gap-4">
                <Reveal>
                  <DepthCard disableTilt={compact}>
                    <ConditionsNow weather={forecast.data} locationName={location.name} />
                  </DepthCard>
                </Reveal>
                <Reveal delay={0.05}>
                  <DepthCard disableTilt={compact}>
                    <UvDayChart
                      key={`${location.id}-${dateInputValue}`}
                      hours={dayHours}
                      now={wallNow}
                      timeZone={location.timezone}
                    />
                  </DepthCard>
                </Reveal>
                <Reveal delay={0.08}>
                  <DepthCard disableTilt={compact}>
                    <CloudGoldenOverlay
                      hours={dayHours}
                      windows={windows}
                      timeZone={location.timezone}
                    />
                  </DepthCard>
                </Reveal>
              </div>
              <div className="flex flex-col gap-3 sm:gap-4">
                <Reveal delay={0.04}>
                  <DepthCard disableTilt>
                    <HourlyStrip
                      hours={upcomingHours}
                      now={wallNow}
                      timeZone={location.timezone}
                    />
                  </DepthCard>
                </Reveal>
                {shootability && (
                  <Reveal delay={0.06}>
                    <DepthCard disableTilt={compact}>
                      <ShootabilityNote note={shootability} />
                    </DepthCard>
                  </Reveal>
                )}
                <Reveal delay={0.1}>
                  <DepthCard disableTilt={compact}>
                    <UvWeekStrip
                      days={forecast.data.daily}
                      timeZone={location.timezone}
                    />
                  </DepthCard>
                </Reveal>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Stagger>
  )
}
