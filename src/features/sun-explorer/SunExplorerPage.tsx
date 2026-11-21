import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { DepthCard, FadeIn, Stagger, StaggerItem } from '@/components/motion'
import { LocationSearch } from '@/components/shared/LocationSearch'
import { PlaceControls } from '@/components/shared/PlaceControls'
import { AzimuthCompass } from '@/components/shared/AzimuthCompass'
import { Panel } from '@/components/ui/Panel'
import { DayTimeline } from '@/features/sun-explorer/components/DayTimeline'
import { ExplorerHero } from '@/features/sun-explorer/components/ExplorerHero'
import { ObservatoryPanel } from '@/features/sun-explorer/components/ObservatoryPanel'
import { ShadowEstimator } from '@/features/sun-explorer/components/ShadowEstimator'
import { SunSky } from '@/features/sun-explorer/components/SunSky'
import { useExplorerTime } from '@/features/sun-explorer/hooks/useExplorerTime'
import { useSolarDay } from '@/features/sun-explorer/hooks/useSolarDay'
import { useCompactViewport } from '@/hooks/useCompactViewport'
import { useSharedPlace } from '@/hooks/useSharedPlace'

export function SunExplorerPage() {
  const {
    location,
    setLocation,
    date,
    dateInputValue,
    setDateFromInput,
    jumpToToday,
  } = useSharedPlace()
  const compact = useCompactViewport()
  const {
    dayAnchor,
    instant,
    progressPercent,
    setProgress,
    jumpToNow,
    syncToLocationNow,
  } = useExplorerTime({ location, dayAnchor: date })
  const { events, position } = useSolarDay({
    location,
    at: instant,
    day: dayAnchor,
  })

  useEffect(() => {
    syncToLocationNow()
  }, [location.id]) // eslint-disable-line react-hooks/exhaustive-deps -- re-anchor local clock when city changes

  return (
    <Stagger className="flex flex-col gap-4 sm:gap-5" stagger={0.07}>
      <StaggerItem>
        <ExplorerHero
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

      <div className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]">
        <StaggerItem>
          <DepthCard disableTilt>
            <Panel className="overflow-hidden p-2.5 sm:p-3 xl:p-4">
              <motion.div
                key={location.id}
                initial={{ opacity: 0.6, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              >
                <SunSky
                  location={location}
                  dayAnchor={dayAnchor}
                  instant={instant}
                  position={position}
                  events={events}
                />
              </motion.div>
              <DayTimeline
                progressPercent={progressPercent}
                instant={instant}
                timeZone={location.timezone}
                events={events}
                onProgressChange={setProgress}
                onJumpToNow={jumpToNow}
              />
            </Panel>
          </DepthCard>
        </StaggerItem>

        <StaggerItem>
          <FadeIn delay={0.05} className="flex flex-col gap-3 sm:gap-4">
            <DepthCard disableTilt={compact}>
              <ObservatoryPanel
                location={location}
                position={position}
                events={events}
                instant={instant}
              />
            </DepthCard>
            <DepthCard disableTilt={compact}>
              <Panel className="p-4 sm:p-5">
                <AzimuthCompass
                  azimuthDegrees={position.azimuthDegrees}
                  label="Sun azimuth now"
                />
              </Panel>
            </DepthCard>
            <DepthCard disableTilt={compact}>
              <ShadowEstimator altitudeDegrees={position.altitudeDegrees} />
            </DepthCard>
          </FadeIn>
        </StaggerItem>
      </div>
    </Stagger>
  )
}
