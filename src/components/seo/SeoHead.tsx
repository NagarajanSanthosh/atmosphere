import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { seoForPath } from '@/seo/routes'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from '@/seo/site'

/** Per-route document head for crawlers and social previews. */
export function SeoHead() {
  const { pathname } = useLocation()
  const route = seoForPath(pathname)
  const title = `${route.title} · ${SITE_NAME}`
  const description = route.description || DEFAULT_DESCRIPTION
  const canonical = `${SITE_URL}${route.path === '/' ? '' : route.path}`

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />

      <meta name="application-name" content={SITE_NAME} />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <meta
        name="keywords"
        content="golden hour, sunrise, sunset, day length, UV index, sun position, photography planner, daylight"
      />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#07060a" />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: SITE_NAME,
          alternateName: 'Daymark Solar Observatory',
          url: SITE_URL,
          description: DEFAULT_DESCRIPTION,
          applicationCategory: 'LifestyleApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          featureList: [
            'Live sun explorer',
            'Golden hour studio',
            'UV and weather',
            'City daylight comparison',
            'Year daylight heatmap',
          ],
          slogan: SITE_TAGLINE,
        })}
      </script>
    </Helmet>
  )
}
