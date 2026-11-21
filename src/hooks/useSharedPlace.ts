import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SAMPLE_LOCATIONS } from '@/data/sample-locations'
import type { Location } from '@/types/location'
import {
  applyDateToParams,
  applyLocationToParams,
  dateFromSearchParams,
  locationEquals,
  locationFromSearchParams,
  noonToday,
  toDateInputValue,
  fromDateInputValue,
} from '@/utils/placeParams'

/**
 * App-wide place + calendar day synced to the URL search string.
 * Survives route changes when nav preserves `location.search`.
 */
export function useSharedPlace() {
  const [params, setParams] = useSearchParams()

  const location = useMemo(
    () => locationFromSearchParams(params, SAMPLE_LOCATIONS[0]),
    [params],
  )

  const date = useMemo(() => dateFromSearchParams(params, noonToday()), [params])

  const setLocation = useCallback(
    (next: Location) => {
      setParams(
        (current) => {
          if (locationEquals(locationFromSearchParams(current), next)) {
            return current
          }
          const copy = new URLSearchParams(current)
          applyLocationToParams(copy, next)
          return copy
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const setDate = useCallback(
    (next: Date) => {
      setParams(
        (current) => {
          const copy = new URLSearchParams(current)
          applyDateToParams(copy, next)
          return copy
        },
        { replace: true },
      )
    },
    [setParams],
  )

  const setDateFromInput = useCallback(
    (value: string) => {
      if (!value) return
      setDate(fromDateInputValue(value))
    },
    [setDate],
  )

  const jumpToToday = useCallback(() => {
    setDate(noonToday())
  }, [setDate])

  return {
    location,
    setLocation,
    date,
    setDate,
    dateInputValue: toDateInputValue(date),
    setDateFromInput,
    jumpToToday,
  }
}
