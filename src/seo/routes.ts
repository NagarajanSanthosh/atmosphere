export type SeoRoute = {
  path: string
  title: string
  description: string
}

/** Indexable app routes (used by SeoHead + sitemap/prerender). */
export const SEO_ROUTES: SeoRoute[] = [
  {
    path: '/',
    title: 'Sun Explorer — live sun position & day length',
    description:
      'See where the sun is right now, scrub the day, and read sunrise, sunset, and day length for any place on Earth.',
  },
  {
    path: '/studio',
    title: 'Golden Hour Studio — plan shoots with light',
    description:
      'Plan photography with golden hour, blue hour, and twilight windows. Countdown, shoot brief, and horizon preview.',
  },
  {
    path: '/weather',
    title: 'UV & Weather — sky conditions for golden hour',
    description:
      'Live UV index, temperature, and cloud cover from Open-Meteo, paired with today’s light windows for shooting.',
  },
  {
    path: '/compare',
    title: 'Compare cities — daylight trip mode',
    description:
      'Compare sunrise, sunset, day length, and golden evenings across up to four cities on the same calendar day.',
  },
  {
    path: '/year',
    title: 'Year of daylight — day length heatmap',
    description:
      'A full-year calendar of daylight and golden evening length. Spot solstices and plan the season at a glance.',
  },
]

export function seoForPath(pathname: string): SeoRoute {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname
  return (
    SEO_ROUTES.find((route) => route.path === normalized) ?? SEO_ROUTES[0]
  )
}
