# Daymark

**Understand your world through sunlight.**

A public, frontend-only interactive app for exploring sunrise/sunset, sun position, golden hour, UV, and city daylight comparison.

No accounts. No backend. Browser + public APIs.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- React Router
- TanStack Query (Open-Meteo fetch/cache)
- Framer Motion (Studio UI choreography)
- Three.js + React Three Fiber (Studio horizon band)

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
├── features/      # sun-explorer, golden-hour, weather, city-comparison
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
| **8** | Polish + deploy *(current)* |
