import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { projectSunToSky } from '@/engines/geometry'
import {
  getMoonSky,
  getSunPosition,
  type SolarDayEvents,
  type SunPosition,
} from '@/engines/solar'
import { getSkyPalette } from '@/features/sun-explorer/utils/skyPalette'
import {
  sampleMoonPath,
  sampleSunPath,
  solsticeAnchors,
} from '@/features/sun-explorer/utils/sampleSkyPaths'
import { getDayProgress } from '@/features/sun-explorer/utils/zonedTime'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { Location } from '@/types/location'

type SunSkyProps = {
  location: Location
  dayAnchor: Date
  instant: Date
  position: SunPosition
  events: SolarDayEvents
  showOverlays?: boolean
}

export function SunSky({
  location,
  dayAnchor,
  instant,
  position,
  events,
  showOverlays = true,
}: SunSkyProps) {
  const reduced = usePrefersReducedMotion()
  const palette = getSkyPalette(position.altitudeDegrees)
  const pathKey = `${location.id}-${dayAnchor.toDateString()}`

  const { path } = useMemo(
    () => sampleSunPath(location, dayAnchor),
    [location.latitude, location.longitude, location.timezone, dayAnchor],
  )

  const moonPath = useMemo(
    () => (showOverlays ? sampleMoonPath(location, dayAnchor).path : ''),
    [showOverlays, location.latitude, location.longitude, location.timezone, dayAnchor],
  )

  const solsticePaths = useMemo(() => {
    if (!showOverlays) return { summer: '', winter: '' }
    const { summer, winter } = solsticeAnchors(dayAnchor)
    return {
      summer: sampleSunPath(location, summer).path,
      winter: sampleSunPath(location, winter).path,
    }
  }, [showOverlays, location.latitude, location.longitude, location.timezone, dayAnchor])

  const sun = projectSunToSky({
    altitudeDegrees: position.altitudeDegrees,
    dayProgress: getDayProgress(instant, location.timezone),
  })

  const moon = useMemo(() => {
    const sky = getMoonSky({
      latitude: location.latitude,
      longitude: location.longitude,
      date: instant,
    })
    return {
      sky,
      point: projectSunToSky({
        altitudeDegrees: sky.altitudeDegrees,
        dayProgress: getDayProgress(instant, location.timezone),
      }),
    }
  }, [location.latitude, location.longitude, location.timezone, instant])

  const sunrise = projectMarker(location, events.sunrise)
  const noon = projectMarker(location, events.solarNoon)
  const sunset = projectMarker(location, events.sunset)
  const hasDayArc = Boolean(events.sunrise && events.sunset)

  return (
    <svg
      viewBox="0 0 600 280"
      role="img"
      aria-label="Sun and moon paths across the sky for the selected location and time"
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

      {showOverlays && solsticePaths.summer && (
        <motion.path
          key={`summer-${pathKey}`}
          d={solsticePaths.summer}
          fill="none"
          stroke="rgba(255,196,90,0.22)"
          strokeWidth="1.25"
          strokeDasharray="2 6"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0 : 0.45, duration: reduced ? 0 : 0.5 }}
        />
      )}
      {showOverlays && solsticePaths.winter && (
        <motion.path
          key={`winter-${pathKey}`}
          d={solsticePaths.winter}
          fill="none"
          stroke="rgba(143,160,217,0.28)"
          strokeWidth="1.25"
          strokeDasharray="2 6"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0 : 0.55, duration: reduced ? 0 : 0.5 }}
        />
      )}

      {showOverlays && moonPath && (
        <motion.path
          key={`moon-${pathKey}`}
          d={moonPath}
          fill="none"
          stroke="rgba(183,196,239,0.45)"
          strokeWidth="1.5"
          strokeDasharray="3 5"
          initial={reduced ? false : { pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: reduced ? 0 : 0.25, duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      {path && (
        <motion.path
          key={`sun-${pathKey}`}
          d={path}
          fill="none"
          stroke="rgba(247,241,232,0.35)"
          strokeWidth="1.75"
          strokeDasharray="4 8"
          initial={reduced ? false : { pathLength: 0, opacity: 0.4 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: reduced ? 0 : 1.05, ease: [0.22, 1, 0.36, 1] }}
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

      {showOverlays && (
        <g fontSize="9" fontFamily="Figtree, sans-serif" fill="#8a7b6c">
          <text x="40" y="268">
            Solid dash · today
          </text>
          <text x="160" y="268" fill="rgba(255,196,90,0.7)">
            Jun solstice
          </text>
          <text x="260" y="268" fill="rgba(143,160,217,0.85)">
            Dec solstice
          </text>
          <text x="370" y="268" fill="rgba(183,196,239,0.9)">
            Moon path
          </text>
        </g>
      )}

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

      {showOverlays && moon.sky.aboveHorizon && !moon.point.belowHorizon && (
        <motion.g
          initial={reduced ? false : { opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduced ? 0 : 0.35, duration: reduced ? 0 : 0.4 }}
          style={{ originX: `${moon.point.x}px`, originY: `${moon.point.y}px` }}
        >
          <circle
            cx={moon.point.x}
            cy={moon.point.y}
            r="9"
            fill="#ebe3d6"
            opacity="0.9"
          />
          <circle
            cx={moon.point.x + 3}
            cy={moon.point.y - 1}
            r="8"
            fill={palette.mid}
            opacity="0.85"
          />
        </motion.g>
      )}

      {!sun.belowHorizon ? (
        <motion.g
          animate={
            reduced
              ? undefined
              : {
                  y: [0, -2.5, 0],
                  scale: [1, 1.03, 1],
                }
          }
          transition={
            reduced
              ? undefined
              : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
          }
          style={{ originX: `${sun.x}px`, originY: `${sun.y}px` }}
        >
          <circle cx={sun.x} cy={sun.y} r="36" fill="url(#sun-glow)" />
          <circle cx={sun.x} cy={sun.y} r="12" fill="#ffc45a" />
          <circle cx={sun.x} cy={sun.y} r="6.5" fill="#fff1c9" />
        </motion.g>
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
