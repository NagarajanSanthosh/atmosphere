import { useMemo, useState } from 'react'
import { getActiveLightPhase, getLightWindows, type LightWindow } from '@/engines/daylight'
import { getSolarDayEvents, type SolarDayEvents } from '@/engines/solar'
import { getDayLengthDelta, type DayLengthDelta } from '@/features/city-comparison/utils/dayLengthDelta'
import type { Location } from '@/types/location'

export type CityDaySnapshot = {
  location: Location
  events: SolarDayEvents
  windows: LightWindow[]
  phaseLabel: string
  goldenMorning: LightWindow | null
  goldenEvening: LightWindow | null
  blueMorning: LightWindow | null
  blueEvening: LightWindow | null
}

type UseCityCompareOptions = {
  locationA: Location
  locationB: Location
}

function snapshotFor(location: Location, dayAnchor: Date, at: Date): CityDaySnapshot {
  const coords = {
    latitude: location.latitude,
    longitude: location.longitude,
    date: dayAnchor,
  }
  const windows = getLightWindows(coords)
  const byId = new Map(windows.map((window) => [window.id, window]))
  const active = getActiveLightPhase({ ...coords, at })

  return {
    location,
    events: getSolarDayEvents(coords),
    windows,
    phaseLabel: active.label,
    goldenMorning: byId.get('golden-morning') ?? null,
    goldenEvening: byId.get('golden-evening') ?? null,
    blueMorning: byId.get('blue-morning') ?? null,
    blueEvening: byId.get('blue-evening') ?? null,
  }
}

/**
 * Side-by-side solar + daylight stats for two cities on the same calendar anchor day.
 */
export function useCityCompare({ locationA, locationB }: UseCityCompareOptions) {
  const [dayAnchor] = useState(() => new Date())
  const at = dayAnchor

  return useMemo(() => {
    const cityA = snapshotFor(locationA, dayAnchor, at)
    const cityB = snapshotFor(locationB, dayAnchor, at)
    const delta: DayLengthDelta = getDayLengthDelta(
      cityA.events.dayLengthMs,
      cityB.events.dayLengthMs,
      locationA.name,
      locationB.name,
    )

    return {
      dayAnchor,
      cityA,
      cityB,
      delta,
    }
  }, [locationA, locationB, dayAnchor, at])
}
