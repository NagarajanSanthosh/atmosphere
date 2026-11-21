const POINTS = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
] as const

/** North-based clockwise degrees → 16-wind compass label. */
export function azimuthToCompass(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360
  const index = Math.round(normalized / 22.5) % 16
  return POINTS[index]
}

export function formatAzimuthBearing(degrees: number): string {
  return `${azimuthToCompass(degrees)} · ${Math.round(((degrees % 360) + 360) % 360)}°`
}
