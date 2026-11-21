/**
 * Approximate shadow length for an upright object.
 * `shadow = height / tan(altitude)` when the sun is above ~0.5°.
 */
export function shadowLengthMeters(
  objectHeightM: number,
  altitudeDegrees: number,
): number | null {
  if (!Number.isFinite(objectHeightM) || objectHeightM <= 0) return null
  if (altitudeDegrees < 0.5) return null

  const radians = (altitudeDegrees * Math.PI) / 180
  const length = objectHeightM / Math.tan(radians)
  if (!Number.isFinite(length) || length < 0) return null
  return length
}

export function formatShadowLength(meters: number | null): string {
  if (meters == null) return 'No cast shadow'
  if (meters >= 100) return `${(meters / 1000).toFixed(2)} km`
  if (meters >= 10) return `${meters.toFixed(1)} m`
  return `${meters.toFixed(2)} m`
}
