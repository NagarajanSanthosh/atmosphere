import { projectSunToSky, skyPointsToPath, type SkyPoint } from '@/engines/geometry'
import { getSunPosition } from '@/engines/solar'
import type { Location } from '@/types/location'
import { dateOnLocalDay, getDayProgress } from '@/features/sun-explorer/utils/zonedTime'

const SAMPLE_COUNT = 48

/** Samples the local day and returns projected sky points + SVG path. */
export function sampleSunPath(location: Location, dayAnchor: Date): {
  points: SkyPoint[]
  path: string
} {
  const points: SkyPoint[] = []

  for (let index = 0; index <= SAMPLE_COUNT; index += 1) {
    const localMinutes = (index / SAMPLE_COUNT) * 24 * 60
    const instant = dateOnLocalDay(dayAnchor, location.timezone, localMinutes)
    const position = getSunPosition({
      latitude: location.latitude,
      longitude: location.longitude,
      date: instant,
    })

    points.push(
      projectSunToSky({
        altitudeDegrees: position.altitudeDegrees,
        dayProgress: getDayProgress(instant, location.timezone),
      }),
    )
  }

  return {
    points,
    path: skyPointsToPath(points),
  }
}
