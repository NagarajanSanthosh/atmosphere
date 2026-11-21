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
    <div className="flex flex-wrap items-end gap-2">
      <label className="block">
        <span className="text-[0.65rem] font-bold tracking-[0.14em] text-mist-400 uppercase">
          Day
        </span>
        <input
          type="date"
          value={dateInputValue}
          onChange={(event) => onDateChange(event.target.value)}
          className="mt-1 block rounded-xl border border-white/[0.08] bg-night-900/60 px-3 py-2 text-sm text-mist-50 outline-none focus:border-sun-500/35 focus:ring-2 focus:ring-sun-500/20"
        />
      </label>

      <button
        type="button"
        onClick={onJumpToday}
        className="rounded-full border border-white/[0.1] bg-night-900/60 px-3 py-2 text-xs font-semibold tracking-wide text-mist-300 uppercase hover:border-sun-500/35 hover:text-sun-300"
      >
        Today
      </button>

      <button
        type="button"
        onClick={() => void useMyLocation()}
        disabled={geoState === 'loading'}
        className="rounded-full border border-sun-500/30 bg-sun-500/10 px-3 py-2 text-xs font-semibold tracking-wide text-sun-300 uppercase disabled:opacity-60"
      >
        {geoState === 'loading' ? 'Locating…' : 'Use my location'}
      </button>

      {geoError && (
        <p className="w-full text-xs text-dusk-500" role="status">
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
