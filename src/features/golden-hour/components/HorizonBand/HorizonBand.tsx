import { lazy, Suspense, useCallback, useState } from 'react'
import type { LightPhaseId } from '@/engines/daylight'
import type { MoonSky } from '@/engines/solar'
import { getAtmospherePalette } from '@/features/golden-hour/utils/atmospherePalette'

const HorizonCanvas = lazy(() =>
  import('@/features/golden-hour/components/HorizonBand/HorizonCanvas').then((module) => ({
    default: module.HorizonCanvas,
  })),
)

type HorizonBandProps = {
  phase: LightPhaseId
  altitudeDegrees: number
  moon: MoonSky | null
  isNight: boolean
  reducedMotion: boolean
  locationName: string
}

/**
 * Fixed-height mood strip. CSS phase gradient is always visible;
 * Three.js enhances when available — never owns page layout.
 */
export function HorizonBand({
  phase,
  altitudeDegrees,
  moon,
  isNight,
  reducedMotion,
  locationName,
}: HorizonBandProps) {
  const palette = getAtmospherePalette(phase)
  const [webglReady, setWebglReady] = useState(false)
  const onReady = useCallback(() => setWebglReady(true), [])

  // Fade CSS stars once WebGL is up so the handoff isn’t a hard cut
  const cssStarsOpacity = !reducedMotion && webglReady ? 0 : 1

  return (
    <section
      aria-label={`Light mood for ${locationName}`}
      className="relative h-[17.5rem] overflow-hidden rounded-2xl border border-white/[0.1] sm:h-[19rem] sm:rounded-3xl"
      style={{ background: palette.cssGradient }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 transition-[background] duration-700 ease-out"
        style={{ background: palette.cssGradient }}
      />

      {isNight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: cssStarsOpacity }}
        >
          {CSS_STARS.map((star) => (
            <span
              key={star.id}
              className={reducedMotion ? undefined : 'night-star-twinkle'}
              style={{
                position: 'absolute',
                left: `${star.left}%`,
                top: `${star.top}%`,
                width: star.size,
                height: star.size,
                borderRadius: 999,
                background: '#f7f1e8',
                opacity: star.opacity,
                boxShadow: '0 0 4px rgba(247,241,232,0.6)',
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
          <div
            className="absolute inset-x-0 bottom-0 h-24"
            style={{
              background:
                'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(224,120,72,0.45), transparent 70%)',
            }}
          />
        </div>
      )}

      {!reducedMotion && (
        <Suspense fallback={null}>
          <HorizonCanvas
            phase={phase}
            altitudeDegrees={altitudeDegrees}
            moon={moon}
            isNight={isNight}
            reducedMotion={reducedMotion}
            onReady={onReady}
          />
        </Suspense>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-night-950/40 to-transparent" />

      <p className="absolute bottom-3 left-4 z-10 text-[0.65rem] font-bold tracking-[0.14em] text-mist-200/80 uppercase sm:left-5">
        Horizon · {phase}
        {isNight && moon?.aboveHorizon ? ' · moon up' : ''}
      </p>
    </section>
  )
}

const CSS_STARS = Array.from({ length: 48 }, (_, index) => {
  const a = (index * 137.508) % 100
  const b = (index * 89.317) % 55
  return {
    id: index,
    left: a,
    top: b,
    size: index % 7 === 0 ? 2.5 : 1.4,
    delay: (index % 10) * 0.2,
    opacity: 0.4 + (index % 6) * 0.08,
  }
})
