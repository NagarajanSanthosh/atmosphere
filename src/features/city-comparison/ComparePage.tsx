import { useState } from 'react'
import { SAMPLE_LOCATIONS } from '@/data/sample-locations'
import { CityDayCard } from '@/features/city-comparison/components/CityDayCard'
import { CityPickers } from '@/features/city-comparison/components/CityPickers'
import { CompareHeader } from '@/features/city-comparison/components/CompareHeader'
import { CompareRibbon } from '@/features/city-comparison/components/CompareRibbon'
import { DeltaStrip } from '@/features/city-comparison/components/DeltaStrip'
import { useCityCompare } from '@/features/city-comparison/hooks/useCityCompare'
import { usePrefersReducedMotion } from '@/features/golden-hour/hooks/usePrefersReducedMotion'
import { formatLocalDate } from '@/features/sun-explorer/utils/formatLocalDate'
import type { Location } from '@/types/location'

export function ComparePage() {
  const [locationA, setLocationA] = useState<Location>(SAMPLE_LOCATIONS[0])
  const [locationB, setLocationB] = useState<Location>(SAMPLE_LOCATIONS[1])
  const { dayAnchor, cityA, cityB, delta } = useCityCompare({
    locationA,
    locationB,
  })
  const reducedMotion = usePrefersReducedMotion()

  const swap = () => {
    setLocationA(locationB)
    setLocationB(locationA)
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      <CompareHeader reducedMotion={reducedMotion} />

      <p className="text-xs text-mist-500">
        Shared calendar day · {formatLocalDate(dayAnchor, locationA.timezone)} (anchor) ·
        times shown in each city&apos;s timezone
      </p>

      <CityPickers
        locationA={locationA}
        locationB={locationB}
        onChangeA={setLocationA}
        onChangeB={setLocationB}
        onSwap={swap}
      />

      <DeltaStrip
        delta={delta}
        nameA={locationA.name}
        nameB={locationB.name}
        reducedMotion={reducedMotion}
      />

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
        <CityDayCard
          snapshot={cityA}
          accent="sun"
          reducedMotion={reducedMotion}
        />
        <CityDayCard
          snapshot={cityB}
          accent="twilight"
          reducedMotion={reducedMotion}
        />
      </div>

      <CompareRibbon
        cityA={cityA}
        cityB={cityB}
        reducedMotion={reducedMotion}
      />
    </div>
  )
}
