# Daymark

**Understand your world through sunlight.**

A public, frontend-only interactive app for exploring sunrise/sunset, sun position, golden hour, UV, and city daylight comparison.

No accounts. No backend. Browser + public APIs.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- TanStack Query (Open-Meteo fetch/cache)
- Framer Motion (route transitions, shared motion kit, drag scrubbers)
- Three.js + React Three Fiber (Studio horizon band only)

Current extras: SunCalc (via `engines/solar` wrapper), Open-Meteo weather + geocoding (via `services/`).

Later milestones add Zustand, Recharts (if needed), and testing tools.

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Project layout

```
src/
├── app/           # shell, routes, providers, layout
├── features/      # sun-explorer, golden-hour, weather, city-comparison, year-heatmap
├── components/    # shared UI, charts, visualizations
├── engines/       # pure solar / daylight / geometry math (no React)
├── services/      # Open-Meteo weather + geocoding
├── stores/        # Zustand
├── hooks/
├── utils/
├── types/
└── tests/
```

## Milestones

| Phase | Focus |
|-------|--------|
| 0 | Scaffold + folder structure |
| 1 | App shell + design system |
| 2 | Solar calculation engine |
| 3 | Live Sun Explorer |
| 4 | Golden Hour Studio (shoot desk + horizon band) |
| 5 | UV & weather |
| 6 | City comparison |
| 8 | Cross-app motion & UI polish — shared motion tokens, route enter/exit, nav layoutId pill, Explorer day drag scrub, Weather hourly drag + UV draw-in, Studio DepthCard / city crossfade, Compare swap layout + delta punch; `prefers-reduced-motion` respected. Deploy can follow as 8b. |
| 9 | Tier B deepen — Explorer solstice/moon overlays + shadow estimator; Studio sticky countdown + optional window alerts + best-of-week golden evenings; Weather sky story, cloud-vs-golden overlay, 7-day UV; Compare date picker, trip mode (≤4 cities), golden duration / earlier evening. |
| 10 | Tier A — URL-synced place (`lat/lon/tz` or `loc`) + `date`; Use my location (reverse geocode); date controls on Explorer/Studio/Weather/Compare; Shoot brief + azimuth compass; HorizonCanvas idle/hover preload; `vercel.json` / `netlify.toml` SPA rewrites. |
| 11 | First-visit intro — Framer sun-rise → moon → Daymark splash (once via `localStorage`; `?intro=1` to replay; Skip + reduced-motion). |
| 12 | Year daylight heatmap — `/year` calendar grid; day length vs 12h / golden percentile; shared place/date URL. |
| 13 | Weather rebuild — mobile-first single column: now → hours → UV/cloud charts → week; auto-snap to today when date has no forecast. |
| 14 | Compare trip polish — persist B–D in URL (`loc2`…); intentional Add city; N-city copy + A-vs-B focus deltas; trip grid layout. |
| **15** | SEO foundation *(current)* — meta/OG/JSON-LD, per-route `SeoHead`, `robots.txt` + `sitemap.xml`, bot skip on intro cover, post-build HTML shells for `/studio` `/weather` `/compare` `/year`. Set `VITE_SITE_URL` to your production origin. |
