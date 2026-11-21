export type UvCategory = {
  label: string
  range: string
  className: string
  barClass: string
}

/** WHO-style UV index bands for display. */
export function getUvCategory(uvIndex: number | null | undefined): UvCategory {
  if (uvIndex == null || Number.isNaN(uvIndex)) {
    return {
      label: 'Unavailable',
      range: '—',
      className: 'text-mist-300',
      barClass: 'bg-mist-500',
    }
  }
  if (uvIndex < 3) {
    return {
      label: 'Low',
      range: '0–2',
      className: 'text-twilight-300',
      barClass: 'bg-twilight-400',
    }
  }
  if (uvIndex < 6) {
    return {
      label: 'Moderate',
      range: '3–5',
      className: 'text-sun-300',
      barClass: 'bg-sun-400',
    }
  }
  if (uvIndex < 8) {
    return {
      label: 'High',
      range: '6–7',
      className: 'text-sun-500',
      barClass: 'bg-sun-500',
    }
  }
  if (uvIndex < 11) {
    return {
      label: 'Very high',
      range: '8–10',
      className: 'text-dusk-500',
      barClass: 'bg-dusk-500',
    }
  }
  return {
    label: 'Extreme',
    range: '11+',
    className: 'text-dusk-600',
    barClass: 'bg-dusk-600',
  }
}

export function formatUv(uvIndex: number | null | undefined): string {
  if (uvIndex == null || Number.isNaN(uvIndex)) return '—'
  return uvIndex < 10 ? uvIndex.toFixed(1) : String(Math.round(uvIndex))
}
