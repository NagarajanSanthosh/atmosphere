import { SAMPLE_LOCATIONS } from '@/data/sample-locations'
import type { Location } from '@/types/location'

export type PlaceQuery = {
  location: Location
  /** Calendar day at local noon (host TZ); pages interpret via location timezone. */
  date: Date
}

/** Build YYYY-MM-DD for `<input type="date">`. */
export function toDateInputValue(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function fromDateInputValue(value: string): Date {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0)
}

export function noonToday(): Date {
  const now = new Date()
  now.setHours(12, 0, 0, 0)
  return now
}

export function locationFromSearchParams(
  params: URLSearchParams,
  fallback: Location = SAMPLE_LOCATIONS[0],
): Location {
  const lat = Number(params.get('lat'))
  const lon = Number(params.get('lon'))
  const tz = params.get('tz')
  const name = params.get('name')
  const id = params.get('loc')

  if (id) {
    const sample = SAMPLE_LOCATIONS.find((item) => item.id === id)
    if (sample) return sample
  }

  if (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    tz &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180
  ) {
    return {
      id: params.get('id') || `coord-${lat.toFixed(3)}-${lon.toFixed(3)}`,
      name: name?.trim() || 'Pinned place',
      country: params.get('country') || '',
      admin: params.get('admin') || undefined,
      latitude: lat,
      longitude: lon,
      timezone: tz,
    }
  }

  return fallback
}

export function dateFromSearchParams(
  params: URLSearchParams,
  fallback: Date = noonToday(),
): Date {
  const raw = params.get('date')
  if (!raw || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return fallback
  return fromDateInputValue(raw)
}

/** Write location into a params object (mutates). */
export function applyLocationToParams(
  params: URLSearchParams,
  location: Location,
): void {
  const sample = SAMPLE_LOCATIONS.find((item) => item.id === location.id)
  if (sample) {
    params.set('loc', sample.id)
    params.delete('lat')
    params.delete('lon')
    params.delete('tz')
    params.delete('name')
    params.delete('id')
    params.delete('country')
    params.delete('admin')
    return
  }

  params.delete('loc')
  params.set('lat', location.latitude.toFixed(5))
  params.set('lon', location.longitude.toFixed(5))
  params.set('tz', location.timezone)
  params.set('name', location.name)
  params.set('id', location.id)
  if (location.country) params.set('country', location.country)
  else params.delete('country')
  if (location.admin) params.set('admin', location.admin)
  else params.delete('admin')
}

export function applyDateToParams(params: URLSearchParams, date: Date): void {
  params.set('date', toDateInputValue(date))
}

export function locationEquals(a: Location, b: Location): boolean {
  return (
    a.id === b.id &&
    a.latitude === b.latitude &&
    a.longitude === b.longitude &&
    a.timezone === b.timezone
  )
}
