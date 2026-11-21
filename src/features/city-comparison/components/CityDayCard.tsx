import { motion } from 'framer-motion'
import { softSpring } from '@/components/motion/tokens'
import { Panel } from '@/components/ui/Panel'
import type { CityDaySnapshot } from '@/features/city-comparison/hooks/useCityCompare'
import { windowDurationMs } from '@/features/city-comparison/utils/goldenDelta'
import { formatDayLength } from '@/features/sun-explorer/utils/formatDayLength'
import { formatSolarTime } from '@/features/sun-explorer/utils/formatSolarTime'
import type { LightWindow } from '@/engines/daylight'

type CityDayCardProps = {
  snapshot: CityDaySnapshot
  accent: 'sun' | 'twilight' | 'dusk' | 'mist'
  layoutId?: string
  reducedMotion?: boolean
}

const ACCENT_CLASS: Record<CityDayCardProps['accent'], string> = {
  sun: 'text-sun-300 border-sun-500/25',
  twilight: 'text-twilight-300 border-twilight-500/25',
  dusk: 'text-dusk-500 border-dusk-500/25',
  mist: 'text-mist-200 border-white/15',
}

export function CityDayCard({
  snapshot,
  accent,
  layoutId,
  reducedMotion = false,
}: CityDayCardProps) {
  const { location, events, phaseLabel } = snapshot
  const tz = location.timezone
  const accentClass = ACCENT_CLASS[accent]
  const goldenEveningLen = formatDayLength(snapshot.goldenEveningDurationMs)

  return (
    <motion.div
      layout={!reducedMotion}
      layoutId={layoutId}
      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reducedMotion ? { duration: 0 } : softSpring}
    >
      <Panel className="overflow-hidden">
        <div className={`border-b border-white/[0.06] px-4 py-3 sm:px-5 ${accentClass}`}>
          <p className="text-[0.65rem] font-bold tracking-[0.14em] uppercase opacity-80">
            {location.timezone.replace(/_/g, ' ')}
          </p>
          <h2 className="mt-1 font-display text-2xl text-mist-50">{location.name}</h2>
          <p className="mt-0.5 text-xs text-mist-400">
            Phase · <span className="text-mist-200">{phaseLabel}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 px-4 py-4 sm:grid-cols-4 sm:px-5">
          <Metric label="Sunrise" value={formatSolarTime(events.sunrise, tz)} />
          <Metric label="Sunset" value={formatSolarTime(events.sunset, tz)} />
          <Metric label="Solar noon" value={formatSolarTime(events.solarNoon, tz)} />
          <Metric label="Day length" value={formatDayLength(events.dayLengthMs)} accent />
        </div>

        <div className="border-t border-white/[0.06] px-4 py-3 sm:px-5">
          <p className="mb-2 text-[0.65rem] font-bold tracking-[0.14em] text-mist-500 uppercase">
            Shoot windows
          </p>
          <ul className="space-y-2">
            <WindowRow label="Golden morning" window={snapshot.goldenMorning} timeZone={tz} tone="sun" />
            <WindowRow label="Blue morning" window={snapshot.blueMorning} timeZone={tz} tone="blue" />
            <WindowRow
              label="Golden evening"
              window={snapshot.goldenEvening}
              timeZone={tz}
              tone="sun"
              duration={goldenEveningLen}
            />
            <WindowRow label="Blue evening" window={snapshot.blueEvening} timeZone={tz} tone="blue" />
          </ul>
        </div>
      </Panel>
    </motion.div>
  )
}

function Metric({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div>
      <p className="text-[0.65rem] tracking-wide text-mist-500 uppercase">{label}</p>
      <p
        className={`mt-1 font-mono text-sm sm:text-base ${
          accent ? 'font-semibold text-sun-300' : 'text-mist-100'
        }`}
      >
        {value}
      </p>
    </div>
  )
}

function WindowRow({
  label,
  window,
  timeZone,
  tone,
  duration,
}: {
  label: string
  window: LightWindow | null
  timeZone: string
  tone: 'sun' | 'blue'
  duration?: string
}) {
  const toneClass = tone === 'sun' ? 'text-sun-300' : 'text-twilight-300'
  const length =
    duration ??
    formatDayLength(windowDurationMs(window))

  return (
    <li className="flex items-center justify-between gap-3 text-sm">
      <span className={`font-medium ${toneClass}`}>{label}</span>
      <span className="shrink-0 text-right font-mono text-xs text-mist-200 sm:text-sm">
        {formatSolarTime(window?.interval.start, timeZone)}
        <span className="text-mist-500"> – </span>
        {formatSolarTime(window?.interval.end, timeZone)}
        {window && (
          <span className="mt-0.5 block text-[0.65rem] text-mist-500">{length}</span>
        )}
      </span>
    </li>
  )
}
