import { useState } from 'react'
import { reverseGeocodeLocation } from '@/services/geocoding/reverseGeocode'
import type { Location } from '@/types/location'

type PlaceControlsProps = {
  dateInputValue: string
  onDateChange: (value: string) => void
  onJumpToday: () => void
  onLocation: (location: Location) => void
}

export function PlaceControls({
  dateInputValue,
  onDateChange,
  onJumpToday,
  onLocation,
}: PlaceControlsProps) {
  const [geoState, setGeoState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [geoError, setGeoError] = useState<string | null>(null)

  async function useMyLocation() {
    if (!navigator.geolocation) {
      setGeoState('error')
      setGeoError('Geolocation not supported in this browser')
      return
    }

    setGeoState('loading')
    setGeoError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 12_000,
          maximumAge: 60_000,
        })
      })

      const location = await reverseGeocodeLocation(
        position.coords.latitude,
        position.coords.longitude,
      )
      onLocation(location)
      setGeoState('idle')
    } catch (error) {
      setGeoState('error')
      if (isGeolocationError(error)) {
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError('Location permission denied — allow access and try again')
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setGeoError('Position unavailable — try again outdoors or check GPS')
        } else {
          setGeoError('Location request timed out — try again')
        }
      } else {
        setGeoError('Couldn’t resolve your place — try again')
      }
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {/* Mobile: date alone, then actions. Desktop: one row. */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
        <label className="block w-full sm:min-w-0 sm:flex-1">
          <span className="sr-only">Day</span>
          <input
            type="date"
            value={dateInputValue}
            onChange={(event) => onDateChange(event.target.value)}
            className="block w-full max-w-full rounded-xl border border-white/[0.08] bg-night-900/60 px-2.5 py-2 text-sm text-mist-50 outline-none focus:border-sun-500/35 focus:ring-2 focus:ring-sun-500/20 sm:py-2"
          />
        </label>

        <div className="grid grid-cols-2 gap-1.5 sm:flex sm:shrink-0">
          <button
            type="button"
            onClick={onJumpToday}
            className="rounded-full border border-white/[0.1] bg-night-900/60 px-3 py-2 text-[0.65rem] font-semibold tracking-wide text-mist-300 uppercase hover:border-sun-500/35 hover:text-sun-300 sm:text-xs"
          >
            Today
          </button>

          <button
            type="button"
            onClick={() => void useMyLocation()}
            disabled={geoState === 'loading'}
            className="rounded-full border border-sun-500/30 bg-sun-500/10 px-3 py-2 text-[0.65rem] font-semibold tracking-wide text-sun-300 uppercase disabled:opacity-60 sm:text-xs"
          >
            <span className="sm:hidden">
              {geoState === 'loading' ? '…' : 'Locate'}
            </span>
            <span className="hidden sm:inline">
              {geoState === 'loading' ? 'Locating…' : 'Use my location'}
            </span>
          </button>
        </div>
      </div>

      {geoError && (
        <p className="text-xs text-dusk-500" role="status">
          {geoError}
        </p>
      )}
    </div>
  )
}

function isGeolocationError(error: unknown): error is GeolocationPositionError {
  return (
    typeof error === 'object' &&
    error != null &&
    'code' in error &&
    typeof (error as GeolocationPositionError).code === 'number'
  )
}
