import { useEffect, useState } from 'react'
import { LocationSearch } from '@/components/shared/LocationSearch'
import { Panel } from '@/components/ui/Panel'
import { SAMPLE_LOCATIONS } from '@/data/sample-locations'
import { DayTimeline } from '@/features/sun-explorer/components/DayTimeline'
import { ExplorerHero } from '@/features/sun-explorer/components/ExplorerHero'
import { ObservatoryPanel } from '@/features/sun-explorer/components/ObservatoryPanel'
import { SunSky } from '@/features/sun-explorer/components/SunSky'
import { useExplorerTime } from '@/features/sun-explorer/hooks/useExplorerTime'
import { useSolarDay } from '@/features/sun-explorer/hooks/useSolarDay'
import type { Location } from '@/types/location'

export function SunExplorerPage() {
  const [location, setLocation] = useState<Location>(SAMPLE_LOCATIONS[0])
  const {
    dayAnchor,
    instant,
    progressPercent,
    setProgress,
    jumpToNow,
    syncToLocationNow,
  } = useExplorerTime({ location })
  const { events, position } = useSolarDay({
    location,
    at: instant,
    day: dayAnchor,
  })

  useEffect(() => {
    syncToLocationNow()
  }, [location.id]) // eslint-disable-line react-hooks/exhaustive-deps -- re-anchor local clock when city changes

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <ExplorerHero
        search={<LocationSearch value={location} onChange={setLocation} />}
      />

      <div className="grid gap-3 sm:gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.9fr)]">
        <Panel className="overflow-hidden p-2.5 sm:p-3 xl:p-4">
          <SunSky
            location={location}
            dayAnchor={dayAnchor}
            instant={instant}
            position={position}
            events={events}
          />
          <DayTimeline
            progressPercent={progressPercent}
            instant={instant}
            timeZone={location.timezone}
            events={events}
            onProgressChange={setProgress}
            onJumpToNow={jumpToNow}
          />
        </Panel>

        <ObservatoryPanel
          location={location}
          position={position}
          events={events}
          instant={instant}
        />
      </div>
    </div>
  )
}
