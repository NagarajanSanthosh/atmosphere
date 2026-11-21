import { LayoutGroup } from 'framer-motion'
import { DepthCard, Stagger, StaggerItem } from '@/components/motion'
import { PlaceControls } from '@/components/shared/PlaceControls'
import { CityDayCard } from '@/features/city-comparison/components/CityDayCard'
import { CityPickers } from '@/features/city-comparison/components/CityPickers'
import { CompareHeader } from '@/features/city-comparison/components/CompareHeader'
import { CompareRibbon } from '@/features/city-comparison/components/CompareRibbon'
import { DeltaStrip } from '@/features/city-comparison/components/DeltaStrip'
import { useCityCompare } from '@/features/city-comparison/hooks/useCityCompare'
import { useCompactViewport } from '@/hooks/useCompactViewport'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useSharedPlace } from '@/hooks/useSharedPlace'
import { formatLocalDate } from '@/features/sun-explorer/utils/formatLocalDate'
import type { Location } from '@/types/location'

const ACCENTS = ['sun', 'twilight', 'dusk', 'mist'] as const

export function ComparePage() {
  const {
    location,
    setLocation,
    date,
    dateInputValue,
    setDateFromInput,
    jumpToToday,
  } = useSharedPlace()
  const compare = useCityCompare({
    primaryLocation: location,
    dayAnchor: date,
  })
  const reducedMotion = usePrefersReducedMotion()
  const compact = useCompactViewport()

  function onChangeAt(index: number, next: Location) {
    compare.setLocationAt(index, next)
    if (index === 0) setLocation(next)
  }

  function onSwap() {
    const nextA = compare.locations[1]
    compare.swapFirstTwo()
    if (nextA) setLocation(nextA)
  }

  return (
    <Stagger className="flex flex-col gap-5 sm:gap-6" stagger={0.06}>
      <StaggerItem>
        <CompareHeader reducedMotion={reducedMotion} />
      </StaggerItem>

      <StaggerItem>
        <PlaceControls
          dateInputValue={dateInputValue}
          onDateChange={setDateFromInput}
          onJumpToday={jumpToToday}
          onLocation={setLocation}
        />
      </StaggerItem>

      <StaggerItem>
        <p className="text-xs text-mist-500">
          Shared calendar day ·{' '}
          {formatLocalDate(compare.dayAnchor, compare.locations[0]?.timezone ?? 'UTC')} ·
          times in each city&apos;s timezone · up to {compare.maxCities} cities · City A
          syncs across the app via the URL
        </p>
      </StaggerItem>

      <StaggerItem>
        <CityPickers
          locations={compare.locations}
          onChangeAt={onChangeAt}
          onSwapFirstTwo={onSwap}
          onAddCity={compare.addCity}
          onRemoveCity={compare.removeCity}
          maxCities={compare.maxCities}
        />
      </StaggerItem>

      <StaggerItem>
        <DeltaStrip
          delta={compare.delta}
          goldenDelta={compare.goldenDelta}
          earlierEvening={compare.earlierEvening}
          nameA={compare.locations[0]?.name ?? 'A'}
          nameB={compare.locations[1]?.name ?? 'B'}
          reducedMotion={reducedMotion}
        />
      </StaggerItem>

      <StaggerItem>
        <LayoutGroup>
          <div
            className={`grid gap-3 sm:gap-4 ${
              compare.cities.length > 2 ? 'lg:grid-cols-2 xl:grid-cols-2' : 'lg:grid-cols-2'
            }`}
          >
            {compare.cities.map((city, index) => (
              <DepthCard key={`${city.location.id}-${index}`} disableTilt={compact}>
                <CityDayCard
                  snapshot={city}
                  accent={ACCENTS[index % ACCENTS.length]}
                  layoutId={
                    reducedMotion ? undefined : `compare-card-${city.location.id}`
                  }
                  reducedMotion={reducedMotion}
                />
              </DepthCard>
            ))}
          </div>
        </LayoutGroup>
      </StaggerItem>

      <StaggerItem>
        <CompareRibbon cities={compare.cities} reducedMotion={reducedMotion} />
      </StaggerItem>
    </Stagger>
  )
}
