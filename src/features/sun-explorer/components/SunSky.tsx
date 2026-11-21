import { useMemo } from 'react'
import { projectSunToSky } from '@/engines/geometry'
import { getSunPosition, type SolarDayEvents, type SunPosition } from '@/engines/solar'
import { getSkyPalette } from '@/features/sun-explorer/utils/skyPalette'
import { sampleSunPath } from '@/features/sun-explorer/utils/sampleSunPath'
import { getDayProgress } from '@/features/sun-explorer/utils/zonedTime'
import type { Location } from '@/types/location'

type SunSkyProps = {
  location: Location
  dayAnchor: Date
  instant: Date
  position: SunPosition
  events: SolarDayEvents
}

export function SunSky({ location, dayAnchor, instant, position, events }: SunSkyProps) {
  const palette = getSkyPalette(position.altitudeDegrees)
  const { path } = useMemo(
    () => sampleSunPath(location, dayAnchor),
    [location.latitude, location.longitude, location.timezone, dayAnchor],
  )

  const sun = projectSunToSky({
    altitudeDegrees: position.altitudeDegrees,
    dayProgress: getDayProgress(instant, location.timezone),
  })

  const sunrise = projectMarker(location, events.sunrise)
  const noon = projectMarker(location, events.solarNoon)
  const sunset = projectMarker(location, events.sunset)
  const hasDayArc = Boolean(events.sunrise && events.sunset)

  return (
    <svg
      viewBox="0 0 600 280"
      role="img"
      aria-label="Sun path across the sky for the selected location and time"
      className="h-auto w-full overflow-hidden rounded-[1rem]"
    >
      <defs>
        <linearGradient id="sky-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.top} />
          <stop offset="52%" stopColor={palette.mid} />
          <stop offset="100%" stopColor={palette.low} />
        </linearGradient>
        <linearGradient id="ground-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#12101a" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#07060a" />
        </linearGradient>
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe0a3" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#f0a43a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f0a43a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="horizon-bloom" cx="50%" cy="100%" r="70%">
          <stop offset="0%" stopColor="#e07848" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#e07848" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="600" height="280" fill="url(#sky-fill)" />
      <rect width="600" height="280" fill="url(#horizon-bloom)" />

      {[
        [70, 36],
        [120, 58],
        [190, 28],
        [260, 48],
        [340, 22],
        [410, 55],
        [480, 30],
        [530, 62],
        [90, 90],
        [500, 95],
      ].map(([x, y], index) => (
        <circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r={index % 3 === 0 ? 1.2 : 0.8}
          fill="#f7f1e8"
          opacity={position.altitudeDegrees < 0 ? 0.22 + (index % 4) * 0.05 : 0.08}
        />
      ))}

      {path && (
        <path
          d={path}
          fill="none"
          stroke="rgba(247,241,232,0.28)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
        />
      )}

      <rect y="210" width="600" height="70" fill="url(#ground-fill)" />
      <line
        x1="24"
        y1="210"
        x2="576"
        y2="210"
        stroke="rgba(247,241,232,0.28)"
        strokeWidth="1"
      />

      <text x="40" y="238" fill="#a89988" fontSize="11" fontFamily="Figtree, sans-serif">
        Midnight
      </text>
      <text
        x="300"
        y="238"
        textAnchor="middle"
        fill="#a89988"
        fontSize="11"
        fontFamily="Figtree, sans-serif"
      >
        Noon
      </text>
      <text
        x="560"
        y="238"
        textAnchor="end"
        fill="#a89988"
        fontSize="11"
        fontFamily="Figtree, sans-serif"
      >
        Midnight
      </text>

      {hasDayArc && sunrise && (
        <>
          <circle cx={sunrise.x} cy={sunrise.y} r="4" fill="#8fa0d9" />
          <text
            x={Math.min(520, sunrise.x + 8)}
            y={Math.min(204, sunrise.y - 8)}
            fill="#cfc4b4"
            fontSize="10"
            fontFamily="Figtree, sans-serif"
          >
            Sunrise
          </text>
        </>
      )}

      {noon && !noon.belowHorizon && (
        <>
          <circle cx={noon.x} cy={noon.y} r="4" fill="#ffc45a" />
          <text
            x={noon.x}
            y={Math.max(28, noon.y - 12)}
            textAnchor="middle"
            fill="#ffc45a"
            fontSize="10"
            fontFamily="Figtree, sans-serif"
          >
            Solar noon
          </text>
        </>
      )}

      {hasDayArc && sunset && (
        <>
          <circle cx={sunset.x} cy={sunset.y} r="4" fill="#e07848" />
          <text
            x={Math.max(80, sunset.x - 8)}
            y={Math.min(204, sunset.y - 8)}
            textAnchor="end"
            fill="#cfc4b4"
            fontSize="10"
            fontFamily="Figtree, sans-serif"
          >
            Sunset
          </text>
        </>
      )}

      {!hasDayArc && (
        <text
          x="300"
          y="120"
          textAnchor="middle"
          fill="#a89988"
          fontSize="12"
          fontFamily="Figtree, sans-serif"
        >
          Polar day/night — rise/set unavailable
        </text>
      )}

      {!sun.belowHorizon ? (
        <g>
          <circle cx={sun.x} cy={sun.y} r="36" fill="url(#sun-glow)" />
          <circle cx={sun.x} cy={sun.y} r="12" fill="#ffc45a" />
          <circle cx={sun.x} cy={sun.y} r="6.5" fill="#fff1c9" />
        </g>
      ) : (
        <circle cx={sun.x} cy={sun.y} r="5" fill="#8a7b6c" opacity="0.7" />
      )}
    </svg>
  )
}

function projectMarker(location: Location, date: Date | null) {
  if (!date) return null

  const position = getSunPosition({
    latitude: location.latitude,
    longitude: location.longitude,
    date,
  })

  return projectSunToSky({
    altitudeDegrees: position.altitudeDegrees,
    dayProgress: getDayProgress(date, location.timezone),
  })
}
