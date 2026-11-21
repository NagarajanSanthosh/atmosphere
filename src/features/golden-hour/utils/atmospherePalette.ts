import type { LightPhaseId } from '@/engines/daylight'

export type AtmospherePalette = {
  top: string
  mid: string
  horizon: string
  sun: string
  haze: string
  sunIntensity: number
  /** CSS backdrop for reduced-motion / loading fallback */
  cssGradient: string
}

/** True when Studio should use the night observatory UI (not a black void). */
export function isNightSkyPhase(phase: LightPhaseId, altitudeDegrees: number): boolean {
  return phase === 'night' || phase === 'astro' || altitudeDegrees < -8
}

/** Phase-driven sky mood for the Studio Atmosphere Stage. */
export function getAtmospherePalette(phase: LightPhaseId): AtmospherePalette {
  switch (phase) {
    case 'night':
      return {
        top: '#0b1020',
        mid: '#1a2240',
        horizon: '#3a2a28',
        sun: '#ebe3d6',
        haze: '#c45a32',
        sunIntensity: 0.2,
        cssGradient:
          'radial-gradient(ellipse 90% 55% at 50% 100%, rgba(224,120,72,0.35) 0%, transparent 45%), radial-gradient(ellipse 80% 70% at 50% 30%, #1a2240 0%, #0b1020 70%)',
      }
    case 'astro':
      return {
        top: '#0c1224',
        mid: '#182038',
        horizon: '#2e2438',
        sun: '#cfc4b4',
        haze: '#4a5580',
        sunIntensity: 0.28,
        cssGradient:
          'radial-gradient(ellipse 85% 50% at 50% 100%, rgba(109,126,184,0.28) 0%, transparent 48%), radial-gradient(ellipse 80% 65% at 55% 35%, #182038 0%, #0c1224 72%)',
      }
    case 'nautical':
      return {
        top: '#0c1020',
        mid: '#1a2744',
        horizon: '#2e2a48',
        sun: '#8fa0d9',
        haze: '#4a5580',
        sunIntensity: 0.4,
        cssGradient:
          'radial-gradient(ellipse 80% 55% at 60% 78%, #2e2a48 0%, #1a2744 48%, #0c1020 100%)',
      }
    case 'civil':
      return {
        top: '#121832',
        mid: '#2a3a68',
        horizon: '#4a5580',
        sun: '#b7c4ef',
        haze: '#6d7eb8',
        sunIntensity: 0.55,
        cssGradient:
          'radial-gradient(ellipse 85% 55% at 65% 80%, #4a5580 0%, #2a3a68 45%, #121832 100%)',
      }
    case 'blue':
      return {
        top: '#141a38',
        mid: '#2e3f72',
        horizon: '#5a6aa8',
        sun: '#b7c4ef',
        haze: '#6b7fd7',
        sunIntensity: 0.65,
        cssGradient:
          'radial-gradient(ellipse 85% 55% at 70% 82%, #5a6aa8 0%, #2e3f72 45%, #141a38 100%)',
      }
    case 'golden':
      return {
        top: '#1a2744',
        mid: '#35507a',
        horizon: '#e07848',
        sun: '#ffc45a',
        haze: '#f0a43a',
        sunIntensity: 1.15,
        cssGradient:
          'radial-gradient(ellipse 90% 55% at 75% 85%, #e07848 0%, #35507a 42%, #1a2744 100%)',
      }
    case 'day':
      return {
        top: '#1e3a5f',
        mid: '#3d6ea8',
        horizon: '#7eb3d9',
        sun: '#ffe0a3',
        haze: '#ffc45a',
        sunIntensity: 1.35,
        cssGradient:
          'radial-gradient(ellipse 90% 50% at 50% 90%, #7eb3d9 0%, #3d6ea8 40%, #1e3a5f 100%)',
      }
    default:
      return getAtmospherePalette('night')
  }
}
