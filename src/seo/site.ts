/** Canonical site origin — override with VITE_SITE_URL at build/deploy time. */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? 'https://daymark.app'
).replace(/\/$/, '')

export const SITE_NAME = 'Daymark'
export const SITE_TAGLINE = 'Understand your world through sunlight'
export const DEFAULT_DESCRIPTION =
  'Explore sunrise, sunset, golden hour, UV, and city daylight — free solar observatory in your browser. No accounts.'

export const DEFAULT_OG_IMAGE = `${SITE_URL}/og.svg`
