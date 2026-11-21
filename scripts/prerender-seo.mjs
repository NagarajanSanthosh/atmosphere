/**
 * Post-build: emit /studio/index.html (etc.) with route-specific meta
 * so hosts that serve static files before SPA rewrites can index each path.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(rootDir, '../dist')
const siteUrl = (process.env.VITE_SITE_URL ?? 'https://daymark.app').replace(
  /\/$/,
  '',
)

const routes = [
  {
    path: '/',
    file: 'index.html',
    title: 'Sun Explorer — live sun position & day length · Daymark',
    description:
      'See where the sun is right now, scrub the day, and read sunrise, sunset, and day length for any place on Earth.',
  },
  {
    path: '/studio',
    file: 'studio/index.html',
    title: 'Golden Hour Studio — plan shoots with light · Daymark',
    description:
      'Plan photography with golden hour, blue hour, and twilight windows. Countdown, shoot brief, and horizon preview.',
  },
  {
    path: '/weather',
    file: 'weather/index.html',
    title: 'UV & Weather — sky conditions for golden hour · Daymark',
    description:
      'Live UV index, temperature, and cloud cover from Open-Meteo, paired with today’s light windows for shooting.',
  },
  {
    path: '/compare',
    file: 'compare/index.html',
    title: 'Compare cities — daylight trip mode · Daymark',
    description:
      'Compare sunrise, sunset, day length, and golden evenings across up to four cities on the same calendar day.',
  },
  {
    path: '/year',
    file: 'year/index.html',
    title: 'Year of daylight — day length heatmap · Daymark',
    description:
      'A full-year calendar of daylight and golden evening length. Spot solstices and plan the season at a glance.',
  },
]

function replaceMeta(html, { path: routePath, title, description }) {
  const canonical = `${siteUrl}${routePath === '/' ? '' : routePath}`
  const ogImage = `${siteUrl}/og.svg`

  let next = html
  next = next.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(title)}</title>`,
  )
  next = next.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeAttr(description)}" />`,
  )
  next = next.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${escapeAttr(canonical)}" />`,
  )
  next = next.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
  )
  next = next.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
  )
  next = next.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
  )
  next = next.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${escapeAttr(ogImage)}" />`,
  )
  next = next.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
  )
  next = next.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeAttr(description)}" />`,
  )
  next = next.replace(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${escapeAttr(ogImage)}" />`,
  )

  // Ensure boot cover is off for static shells (crawlers reading file as-is).
  if (!next.includes('id="boot-cover" class="is-done"')) {
    next = next.replace(
      'id="boot-cover"',
      'id="boot-cover" class="is-done"',
    )
  }

  return next
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeAttr(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
}

const templatePath = path.join(distDir, 'index.html')
if (!fs.existsSync(templatePath)) {
  console.error('prerender-seo: dist/index.html missing — run vite build first')
  process.exit(1)
}

const template = fs.readFileSync(templatePath, 'utf8')

for (const route of routes) {
  const html = replaceMeta(template, route)
  const outPath = path.join(distDir, route.file)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, html, 'utf8')
  console.log(`prerender-seo: wrote ${route.file}`)
}

// Keep sitemap/robots origin aligned when VITE_SITE_URL is set.
const sitemapPath = path.join(distDir, 'sitemap.xml')
if (fs.existsSync(sitemapPath) && siteUrl !== 'https://daymark.app') {
  const sitemap = fs
    .readFileSync(sitemapPath, 'utf8')
    .replaceAll('https://daymark.app', siteUrl)
  fs.writeFileSync(sitemapPath, sitemap, 'utf8')
  console.log(`prerender-seo: rewrote sitemap origin → ${siteUrl}`)
}

const robotsPath = path.join(distDir, 'robots.txt')
if (fs.existsSync(robotsPath) && siteUrl !== 'https://daymark.app') {
  const robots = fs
    .readFileSync(robotsPath, 'utf8')
    .replaceAll('https://daymark.app', siteUrl)
  fs.writeFileSync(robotsPath, robots, 'utf8')
  console.log(`prerender-seo: rewrote robots origin → ${siteUrl}`)
}
