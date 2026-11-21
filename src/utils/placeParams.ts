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

/** Compare trip slots for cities B–D (City A uses unprefixed keys). */
export type TripSlot = 2 | 3 | 4

const TRIP_SLOTS: TripSlot[] = [2, 3, 4]

const SLOT_KEYS = [
  'loc',
  'lat',
  'lon',
  'tz',
  'name',
  'id',
  'country',
  'admin',
] as const

function slotKey(base: (typeof SLOT_KEYS)[number], slot: TripSlot): string {
  return `${base}${slot}`
}

function clearSlotParams(params: URLSearchParams, slot: TripSlot): void {
  for (const base of SLOT_KEYS) {
    params.delete(slotKey(base, slot))
  }
}

/** Read one trip city (B=2, C=3, D=4) from the URL, or null if missing/invalid. */
export function locationFromSlotParams(
  params: URLSearchParams,
  slot: TripSlot,
): Location | null {
  const id = params.get(slotKey('loc', slot))
  if (id) {
    const sample = SAMPLE_LOCATIONS.find((item) => item.id === id)
    if (sample) return sample
  }

  const lat = Number(params.get(slotKey('lat', slot)))
  const lon = Number(params.get(slotKey('lon', slot)))
  const tz = params.get(slotKey('tz', slot))
  const name = params.get(slotKey('name', slot))

  if (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    tz &&
    Math.abs(lat) <= 90 &&
    Math.abs(lon) <= 180
  ) {
    return {
      id:
        params.get(slotKey('id', slot)) ||
        `coord-${lat.toFixed(3)}-${lon.toFixed(3)}`,
      name: name?.trim() || 'Pinned place',
      country: params.get(slotKey('country', slot)) || '',
      admin: params.get(slotKey('admin', slot)) || undefined,
      latitude: lat,
      longitude: lon,
      timezone: tz,
    }
  }

  return null
}

/** Write or clear one trip city slot (mutates params). */
export function applyLocationToSlotParams(
  params: URLSearchParams,
  slot: TripSlot,
  location: Location | null,
): void {
  if (!location) {
    clearSlotParams(params, slot)
    return
  }

  const sample = SAMPLE_LOCATIONS.find((item) => item.id === location.id)
  if (sample) {
    clearSlotParams(params, slot)
    params.set(slotKey('loc', slot), sample.id)
    return
  }

  params.delete(slotKey('loc', slot))
  params.set(slotKey('lat', slot), location.latitude.toFixed(5))
  params.set(slotKey('lon', slot), location.longitude.toFixed(5))
  params.set(slotKey('tz', slot), location.timezone)
  params.set(slotKey('name', slot), location.name)
  params.set(slotKey('id', slot), location.id)
  if (location.country) params.set(slotKey('country', slot), location.country)
  else params.delete(slotKey('country', slot))
  if (location.admin) params.set(slotKey('admin', slot), location.admin)
  else params.delete(slotKey('admin', slot))
}

/** Cities B–D from URL (empty if none set). */
export function tripExtrasFromSearchParams(params: URLSearchParams): Location[] {
  const extras: Location[] = []
  for (const slot of TRIP_SLOTS) {
    const location = locationFromSlotParams(params, slot)
    if (location) extras.push(location)
  }
  return extras
}

/** Persist B–D into loc2… / lat2… keys; clears unused slots. */
export function applyTripExtrasToParams(
  params: URLSearchParams,
  extras: Location[],
): void {
  for (let i = 0; i < TRIP_SLOTS.length; i += 1) {
    applyLocationToSlotParams(params, TRIP_SLOTS[i], extras[i] ?? null)
  }
}

/**
 * Full trip list: City A (primary) + URL extras, always at least A+B.
 * Dedupes extras that match primary.
 */
export function tripLocationsFromSearchParams(
  params: URLSearchParams,
  primary: Location,
  maxCities = 4,
): Location[] {
  const extras = tripExtrasFromSearchParams(params).filter(
    (item) => !locationEquals(item, primary),
  )
  const fallbackB =
    SAMPLE_LOCATIONS.find((item) => item.id !== primary.id) ?? SAMPLE_LOCATIONS[1]

  if (extras.length === 0) return [primary, fallbackB].slice(0, maxCities)
  return [primary, ...extras].slice(0, maxCities)
}
