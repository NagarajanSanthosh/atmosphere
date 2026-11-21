import { useMemo, useState } from 'react'
import type { Location } from '@/types/location'
import {
  dateOnLocalDay,
  getLocalMinutes,
  nowOnLocalDay,
} from '@/features/sun-explorer/utils/zonedTime'

type UseExplorerTimeOptions = {
  location: Location
}

/**
 * Owns the Explorer calendar day + scrubbed local time of day.
 * `instant` is a real UTC Date for the selected local wall clock.
 */
export function useExplorerTime({ location }: UseExplorerTimeOptions) {
  const [dayAnchor] = useState(() => new Date())
  const [localMinutes, setLocalMinutes] = useState(() =>
    getLocalMinutes(new Date(), location.timezone),
  )

  const instant = useMemo(
    () => dateOnLocalDay(dayAnchor, location.timezone, localMinutes),
    [dayAnchor, location.timezone, localMinutes],
  )

  function setProgress(progressPercent: number) {
    const clamped = Math.min(100, Math.max(0, progressPercent))
    setLocalMinutes((clamped / 100) * 24 * 60)
  }

  function jumpToNow() {
    setLocalMinutes(getLocalMinutes(new Date(), location.timezone))
  }

  function syncToLocationNow() {
    const next = nowOnLocalDay(dayAnchor, location.timezone)
    setLocalMinutes(getLocalMinutes(next, location.timezone))
  }

  return {
    dayAnchor,
    instant,
    localMinutes,
    progressPercent: (localMinutes / (24 * 60)) * 100,
    setProgress,
    jumpToNow,
    syncToLocationNow,
  }
}
