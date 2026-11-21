import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { LocationSearch } from '@/components/shared/LocationSearch'
import { SAMPLE_LOCATIONS } from '@/data/sample-locations'
import type { LightWindowId } from '@/engines/daylight'
import { getMoonSky, getSunPosition } from '@/engines/solar'
import { DayRibbon } from '@/features/golden-hour/components/DayRibbon'
import { HorizonBand } from '@/features/golden-hour/components/HorizonBand'
import { ShootNowCard } from '@/features/golden-hour/components/ShootNowCard'
import { StudioHeader } from '@/features/golden-hour/components/StudioHeader'
import { WindowsRail } from '@/features/golden-hour/components/WindowsRail'
import { useLightStudio } from '@/features/golden-hour/hooks/useLightStudio'
import { usePrefersReducedMotion } from '@/features/golden-hour/hooks/usePrefersReducedMotion'
import { isNightSkyPhase } from '@/features/golden-hour/utils/atmospherePalette'
import { formatLocalDate } from '@/features/sun-explorer/utils/formatLocalDate'
import type { Location } from '@/types/location'

/**
 * Shoot desk: header → fixed horizon band → now/next → ribbon + windows.
 * Normal document flow — no full-viewport overlay theater.
 */
export function GoldenHourPage() {
  const [location, setLocation] = useState<Location>(SAMPLE_LOCATIONS[0])
  const [focusedId, setFocusedId] = useState<LightWindowId | null>(null)
  const { instant, windows, active } = useLightStudio({ location })
  const reducedMotion = usePrefersReducedMotion()

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
    <div className="flex flex-col gap-5 sm:gap-6">
      <StudioHeader
        reducedMotion={reducedMotion}
        meta={meta}
        search={<LocationSearch value={location} onChange={setLocation} />}
      />

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { type: 'spring', stiffness: 240, damping: 28 }
        }
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

      <div className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <motion.div
          className="flex flex-col gap-3 sm:gap-4"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { delay: 0.05, type: 'spring', stiffness: 240, damping: 28 }
          }
        >
          <ShootNowCard
            active={active}
            instant={instant}
            timeZone={location.timezone}
            isNight={isNight}
            reducedMotion={reducedMotion}
          />
          <DayRibbon
            windows={windows}
            instant={instant}
            timeZone={location.timezone}
            focusedId={focusedId}
            onSelectWindow={selectWindow}
            reducedMotion={reducedMotion}
          />
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { delay: 0.08, type: 'spring', stiffness: 240, damping: 28 }
          }
        >
          <WindowsRail
            windows={windows}
            activeId={active.current?.id ?? null}
            focusedId={focusedId}
            onSelectWindow={selectWindow}
            timeZone={location.timezone}
            reducedMotion={reducedMotion}
          />
        </motion.div>
      </div>
    </div>
  )
}
