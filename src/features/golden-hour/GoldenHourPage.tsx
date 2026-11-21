import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { DepthCard } from '@/components/motion'
import { softSpring } from '@/components/motion/tokens'
import { LocationSearch } from '@/components/shared/LocationSearch'
import { PlaceControls } from '@/components/shared/PlaceControls'
import type { LightWindowId } from '@/engines/daylight'
import { getMoonSky, getSunPosition } from '@/engines/solar'
import { BestOfWeek } from '@/features/golden-hour/components/BestOfWeek'
import { DayRibbon } from '@/features/golden-hour/components/DayRibbon'
import { HorizonBand } from '@/features/golden-hour/components/HorizonBand'
import { ShootBrief } from '@/features/golden-hour/components/ShootBrief'
import { ShootNowCard } from '@/features/golden-hour/components/ShootNowCard'
import { StudioHeader } from '@/features/golden-hour/components/StudioHeader'
import { WindowCountdownBar } from '@/features/golden-hour/components/WindowCountdownBar'
import { WindowsRail } from '@/features/golden-hour/components/WindowsRail'
import { useLightStudio } from '@/features/golden-hour/hooks/useLightStudio'
import { useWindowNotifications } from '@/features/golden-hour/hooks/useWindowNotifications'
import { useWeatherForecast } from '@/features/weather/hooks/useWeatherForecast'
import { useCompactViewport } from '@/hooks/useCompactViewport'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useSharedPlace } from '@/hooks/useSharedPlace'
import { isNightSkyPhase } from '@/features/golden-hour/utils/atmospherePalette'
import { formatLocalDate } from '@/features/sun-explorer/utils/formatLocalDate'

/**
 * Shoot desk: header → fixed horizon band → now/next → ribbon + windows.
 * Normal document flow — no full-viewport overlay theater.
 */
export function GoldenHourPage() {
  const {
    location,
    setLocation,
    date,
    dateInputValue,
    setDateFromInput,
    jumpToToday,
  } = useSharedPlace()
  const [focusedId, setFocusedId] = useState<LightWindowId | null>(null)
  const [alertsEnabled, setAlertsEnabled] = useState(false)
  const { dayAnchor, instant, windows, active } = useLightStudio({
    location,
    dayAnchor: date,
  })
  const forecast = useWeatherForecast({ location })
  const reducedMotion = usePrefersReducedMotion()
  const compactViewport = useCompactViewport()
  const notificationsSupported =
    typeof window !== 'undefined' && typeof Notification !== 'undefined'

  useWindowNotifications({
    active,
    enabled: alertsEnabled,
    locationName: location.name,
  })

  const altitudeDegrees = useMemo(
    () =>
      getSunPosition({
        latitude: location.latitude,
        longitude: location.longitude,
        date: instant,
      }).altitudeDegrees,
    [location.latitude, location.longitude, instant],
  )

  const moon = useMemo(
    () =>
      getMoonSky({
        latitude: location.latitude,
        longitude: location.longitude,
        date: instant,
      }),
    [location.latitude, location.longitude, instant],
  )

  const isNight = isNightSkyPhase(active.phase, altitudeDegrees)

  useEffect(() => {
    setFocusedId(null)
  }, [location.id])

  const selectWindow = (id: LightWindowId) => {
    setFocusedId((current) => (current === id ? null : id))
  }

  const meta = `${location.name} · ${formatLocalDate(instant, location.timezone)} · ${location.timezone.replace(/_/g, ' ')}`

  return (
    <div className="flex flex-col gap-2.5 sm:gap-6">
      <StudioHeader
        reducedMotion={reducedMotion}
        meta={meta}
        search={
          <div className="flex flex-col gap-2">
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

      <WindowCountdownBar
        active={active}
        instant={instant}
        timeZone={location.timezone}
        alertsEnabled={alertsEnabled}
        onToggleAlerts={() => setAlertsEnabled((value) => !value)}
        notificationsSupported={notificationsSupported}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={`horizon-${location.id}`}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={reducedMotion ? { duration: 0.12 } : softSpring}
        >
          <HorizonBand
            phase={active.phase}
            altitudeDegrees={altitudeDegrees}
            moon={moon}
            isNight={isNight}
            reducedMotion={reducedMotion}
            locationName={location.name}
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={`desk-${location.id}-${dayAnchor.toDateString()}`}
          className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
          transition={reducedMotion ? { duration: 0.12 } : softSpring}
        >
          <div className="flex flex-col gap-3 sm:gap-4">
            <DepthCard disableTilt={compactViewport}>
              <ShootNowCard
                active={active}
                instant={instant}
                timeZone={location.timezone}
                isNight={isNight}
                reducedMotion={reducedMotion}
              />
            </DepthCard>
            <DepthCard disableTilt={compactViewport}>
              <ShootBrief
                location={location}
                active={active}
                windows={windows}
                instant={instant}
                hourly={forecast.data?.hourly}
              />
            </DepthCard>
            <DayRibbon
              windows={windows}
              instant={instant}
              timeZone={location.timezone}
              focusedId={focusedId}
              onSelectWindow={selectWindow}
              reducedMotion={reducedMotion}
            />
            <BestOfWeek location={location} from={dayAnchor} />
          </div>

          <DepthCard disableTilt={compactViewport}>
            <WindowsRail
              windows={windows}
              activeId={active.current?.id ?? null}
              focusedId={focusedId}
              onSelectWindow={selectWindow}
              timeZone={location.timezone}
              reducedMotion={reducedMotion}
            />
          </DepthCard>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
