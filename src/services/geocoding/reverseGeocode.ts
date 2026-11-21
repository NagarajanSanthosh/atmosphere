import type { Location } from '@/types/location'

type BigDataCloudReverse = {
  city?: string
  locality?: string
  principalSubdivision?: string
  countryName?: string
  latitude?: number
  longitude?: number
}

type OpenMeteoForecastMeta = {
  timezone?: string
}

/**
 * Reverse-geocode coordinates for "Use my location".
 * Open-Meteo has no reverse endpoint — use BigDataCloud’s client API for the
 * place name, then Open-Meteo forecast for the IANA timezone.
 */
export async function reverseGeocodeLocation(
  latitude: number,
  longitude: number,
  options?: { signal?: AbortSignal },
): Promise<Location> {
  const nameParts = await lookupPlaceName(latitude, longitude, options?.signal)
  const timezone = await lookupTimezone(latitude, longitude, options?.signal)

  return {
    id: `geo-${latitude.toFixed(4)}-${longitude.toFixed(4)}`,
    name: nameParts.name,
    admin: nameParts.admin,
    country: nameParts.country,
    latitude,
    longitude,
    timezone,
  }
}

async function lookupPlaceName(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<{ name: string; admin?: string; country: string }> {
  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      localityLanguage: 'en',
    })
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?${params}`,
      { signal, headers: { Accept: 'application/json' } },
    )
    if (!response.ok) {
      return fallbackPlace()
    }
    const data = (await response.json()) as BigDataCloudReverse
    const name =
      data.city?.trim() ||
      data.locality?.trim() ||
      data.principalSubdivision?.trim() ||
      'Current location'
    return {
      name,
      admin: data.principalSubdivision?.trim() || undefined,
      country: data.countryName?.trim() || '',
    }
  } catch {
    return fallbackPlace()
  }
}

function fallbackPlace() {
  return { name: 'Current location', country: '' }
}

async function lookupTimezone(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<string> {
  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      current: 'temperature_2m',
    })
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
      signal,
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) return browserTz
    const data = (await response.json()) as OpenMeteoForecastMeta
    return data.timezone || browserTz
  } catch {
    return browserTz
  }
}
