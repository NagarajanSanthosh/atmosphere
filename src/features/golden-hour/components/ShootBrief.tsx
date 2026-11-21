import { useMemo } from 'react'
import { Panel } from '@/components/ui/Panel'
import { AzimuthCompass } from '@/components/shared/AzimuthCompass'
import type { ActiveLightPhase, LightWindow } from '@/engines/daylight'
import { getSunPosition } from '@/engines/solar'
import type { WeatherHour } from '@/services/weather/types'
import { formatRelativeTo } from '@/features/sun-explorer/utils/formatDayLength'
import { formatSolarTime } from '@/features/sun-explorer/utils/formatSolarTime'
import type { Location } from '@/types/location'
import { formatAzimuthBearing } from '@/utils/compassBearing'

type ShootBriefProps = {
  location: Location
  active: ActiveLightPhase
  windows: LightWindow[]
  instant: Date
  hourly?: WeatherHour[]
}

function avgCloudInWindow(
  hourly: WeatherHour[] | undefined,
  window: LightWindow | null,
): number | null {
  if (!hourly || !window?.interval.start || !window.interval.end) return null
  const start = window.interval.start.getTime()
  const end = window.interval.end.getTime()
  const samples = hourly.filter((hour) => {
    const t = hour.time.getTime()
    return t >= start && t <= end && hour.cloudCoverPct != null
  })
  if (samples.length === 0) return null
  const sum = samples.reduce((acc, hour) => acc + (hour.cloudCoverPct ?? 0), 0)
  return sum / samples.length
}

export function ShootBrief({
  location,
  active,
  windows,
  instant,
  hourly,
}: ShootBriefProps) {
  const focus =
    active.current ??
    active.next?.window ??
    windows.find((window) => window.id === 'golden-evening') ??
    windows.find((window) => window.id === 'golden-morning') ??
    null

  const at = focus?.interval.start ?? instant
  const sun = useMemo(
    () =>
      getSunPosition({
        latitude: location.latitude,
        longitude: location.longitude,
        date: at,
      }),
    [location.latitude, location.longitude, at],
  )

  const cloud = avgCloudInWindow(hourly, focus)
  const endsIn = focus?.interval.end
    ? formatRelativeTo(focus.interval.end, instant)
    : null
  const startsIn =
    !active.current && focus?.interval.start
      ? formatRelativeTo(focus.interval.start, instant)
      : null

  const risk =
    cloud == null
      ? 'Cloud risk unknown — open Weather for the forecast.'
      : cloud < 35
        ? `Clear-ish skies (~${Math.round(cloud)}% cloud) — strong golden color likely.`
        : cloud < 70
          ? `Mixed cloud (~${Math.round(cloud)}%) — watch for breaks.`
          : `Heavy cloud (~${Math.round(cloud)}%) — light may stay soft/muted.`

  const briefLines = [
    focus
      ? `${focus.label}: ${formatSolarTime(focus.interval.start, location.timezone)} – ${formatSolarTime(focus.interval.end, location.timezone)}`
      : 'No shoot window available for this day.',
    active.current
      ? `Live now · ends ${endsIn ?? 'soon'}`
      : startsIn
        ? `Next window ${startsIn}`
        : null,
    `Face ${formatAzimuthBearing(sun.azimuthDegrees)} at window start`,
    risk,
    `${location.name} · ${location.timezone.replace(/_/g, ' ')}`,
  ]
    .filter(Boolean)
    .join('\n')

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(`Daymark shoot brief\n${briefLines}`)
    } catch {
      // ignore
    }
  }

  return (
    <Panel className="relative overflow-hidden p-4 sm:p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-sun-500/10 blur-3xl"
      />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
            Shoot brief
          </p>
          <p className="mt-1 text-xs text-mist-500">
            Window · heading · cloud risk · copy for the field
          </p>
        </div>
        <button
          type="button"
          onClick={() => void copyBrief()}
          className="rounded-full border border-white/[0.1] bg-night-900/60 px-3 py-1.5 text-[0.65rem] font-semibold tracking-wide text-mist-300 uppercase hover:border-sun-500/35 hover:text-sun-300"
        >
          Copy
        </button>
      </div>

      <p className="mt-3 font-display text-xl text-mist-50">
        {focus?.label ?? 'No window'}
      </p>
      {focus && (
        <p className="mt-1 font-mono text-sm text-mist-300">
          {formatSolarTime(focus.interval.start, location.timezone)}
          <span className="text-mist-500"> – </span>
          {formatSolarTime(focus.interval.end, location.timezone)}
          {active.current && endsIn ? (
            <span className="text-sun-300"> · ends {endsIn}</span>
          ) : startsIn ? (
            <span className="text-twilight-300"> · {startsIn}</span>
          ) : null}
        </p>
      )}

      <div className="mt-4">
        <AzimuthCompass
          azimuthDegrees={sun.azimuthDegrees}
          label="Sun heading at window"
        />
      </div>

      <p className="mt-4 text-sm leading-relaxed text-mist-400">{risk}</p>
    </Panel>
  )
}
