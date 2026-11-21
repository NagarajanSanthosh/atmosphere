import { useEffect, useMemo, useState } from 'react'
import { getActiveLightPhase, getLightWindows } from '@/engines/daylight'
import type { Location } from '@/types/location'
import { nowOnLocalDay } from '@/features/sun-explorer/utils/zonedTime'

type UseLightStudioOptions = {
  location: Location
}

/**
 * Studio state: location day + live "now" in that timezone,
 * with light windows and active phase from the daylight engine.
 */
export function useLightStudio({ location }: UseLightStudioOptions) {
  const [dayAnchor] = useState(() => new Date())
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const instant = useMemo(
    () => nowOnLocalDay(dayAnchor, location.timezone, now),
    [dayAnchor, location.timezone, now],
  )

  return useMemo(() => {
    const coords = {
      latitude: location.latitude,
      longitude: location.longitude,
      date: dayAnchor,
    }

    const windows = getLightWindows(coords)
    const active = getActiveLightPhase({ ...coords, at: instant })

    return {
      dayAnchor,
      instant,
      windows,
      active,
    }
  }, [location.latitude, location.longitude, dayAnchor, instant])
}
