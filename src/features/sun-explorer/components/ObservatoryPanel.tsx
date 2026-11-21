import { Panel } from '@/components/ui/Panel'
import type { SolarDayEvents, SunPosition } from '@/engines/solar'
import { PinIcon } from '@/features/sun-explorer/components/PinIcon'
import {
  formatDayLength,
  formatRelativeTo,
} from '@/features/sun-explorer/utils/formatDayLength'
import { formatSolarTime } from '@/features/sun-explorer/utils/formatSolarTime'
import { getSolarPhaseLabel } from '@/features/sun-explorer/utils/skyPalette'
import type { Location } from '@/types/location'

type ObservatoryPanelProps = {
  location: Location
  position: SunPosition
  events: SolarDayEvents
  instant: Date
}

export function ObservatoryPanel({
  location,
  position,
  events,
  instant,
}: ObservatoryPanelProps) {
  const untilSunset = formatRelativeTo(events.sunset, instant)
  const phase = getSolarPhaseLabel(position.altitudeDegrees)

  return (
    <Panel
      key={location.id}
      className="animate-panel-in flex flex-col gap-4 p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
            Observatory
          </p>
          <h2 className="mt-1.5 font-display text-xl leading-tight text-mist-50 sm:text-2xl">
            {location.name}
          </h2>
          <p className="mt-1 truncate text-sm text-mist-300">
            {[location.admin, location.country].filter(Boolean).join(' · ')}
          </p>
        </div>
        <div
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-sun-500/30 bg-gradient-to-br from-sun-500/20 to-dusk-500/10 text-sun-400 sm:size-10 sm:rounded-2xl"
        >
          <PinIcon />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/[0.06] bg-night-950/45 p-3">
        <Metric label="Altitude" value={`${position.altitudeDegrees.toFixed(1)}°`} accent="text-sun-300" />
        <Metric label="Azimuth" value={`${position.azimuthDegrees.toFixed(0)}°`} accent="text-mist-100" />
        <Metric label="Phase" value={phase} accent="text-twilight-300" />
      </div>

      <div className="grid grid-cols-3 gap-1">
        <EventCell
          label="Sunrise"
          value={formatSolarTime(events.sunrise, location.timezone)}
          accent="text-twilight-300"
        />
        <EventCell
          label="Noon"
          value={formatSolarTime(events.solarNoon, location.timezone)}
          accent="text-sun-300"
        />
        <EventCell
          label="Sunset"
          value={formatSolarTime(events.sunset, location.timezone)}
          accent="text-dusk-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.06] pt-3 text-xs text-mist-400">
        <p>
          Day length{' '}
          <span className="font-medium text-mist-100">
            {formatDayLength(events.dayLengthMs)}
          </span>
        </p>
        {untilSunset && position.altitudeDegrees > -1 && (
          <p>
            Sunset{' '}
            <span className="font-medium text-dusk-500">{untilSunset}</span>
          </p>
        )}
        <p className="ml-auto font-mono text-[0.65rem] text-mist-500">
          {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
        </p>
      </div>
    </Panel>
  )
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="min-w-0 text-center">
      <p className="text-[0.55rem] font-bold tracking-[0.12em] text-mist-500 uppercase">
        {label}
      </p>
      <p className={`mt-1 truncate font-display text-sm sm:text-base ${accent}`}>{value}</p>
    </div>
  )
}

function EventCell({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="rounded-xl bg-night-950/35 px-1 py-2.5 text-center sm:px-2">
      <p className="text-[0.55rem] font-bold tracking-[0.1em] text-mist-500 uppercase">{label}</p>
      <p className={`mt-1 font-display text-lg sm:text-xl ${accent}`}>{value}</p>
    </div>
  )
}
