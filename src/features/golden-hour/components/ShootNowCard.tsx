import { AnimatePresence, motion } from 'framer-motion'
import { Panel } from '@/components/ui/Panel'
import type { ActiveLightPhase } from '@/engines/daylight'
import { getWindowAccent } from '@/features/golden-hour/utils/windowColors'
import { formatRelativeTo } from '@/features/sun-explorer/utils/formatDayLength'
import { formatSolarTime } from '@/features/sun-explorer/utils/formatSolarTime'

type ShootNowCardProps = {
  active: ActiveLightPhase
  instant: Date
  timeZone: string
  isNight: boolean
  reducedMotion?: boolean
}

export function ShootNowCard({
  active,
  instant,
  timeZone,
  isNight,
  reducedMotion = false,
}: ShootNowCardProps) {
  const current = active.current
  const endsIn = current?.interval.end
    ? formatRelativeTo(current.interval.end, instant)
    : null
  const nextIn = active.next
    ? formatRelativeTo(active.next.startsAt, instant)
    : null
  const accent = current
    ? getWindowAccent(current.id)
    : isNight
      ? 'text-twilight-300'
      : 'text-mist-100'

  return (
    <Panel className="relative overflow-hidden p-5 sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-sun-500/12 blur-3xl"
      />

      <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
        {isNight ? 'Night · next shoot' : 'Shoot now'}
      </p>

      <AnimatePresence mode="wait">
        <motion.h2
          key={active.label}
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 300, damping: 28 }
          }
          className={`mt-2 font-display text-3xl leading-tight sm:text-4xl ${accent}`}
        >
          {active.label}
        </motion.h2>
      </AnimatePresence>

      {current?.interval.start && current.interval.end ? (
        <p className="mt-2 text-sm text-mist-300">
          {formatSolarTime(current.interval.start, timeZone)}
          {' – '}
          {formatSolarTime(current.interval.end, timeZone)}
          {endsIn ? <span className="text-mist-400"> · ends {endsIn}</span> : null}
        </p>
      ) : (
        <p className="mt-2 text-sm text-mist-400">
          Outside named light windows — waiting on the next twilight.
        </p>
      )}

      {active.next && nextIn && (
        <motion.div
          layout={!reducedMotion}
          className="mt-4 rounded-xl border border-sun-500/20 bg-sun-500/10 px-3.5 py-3"
        >
          <p className="text-[0.65rem] font-bold tracking-[0.14em] text-sun-300 uppercase">
            Next light
          </p>
          <p className="mt-1 text-sm text-mist-100">
            <span className="font-semibold text-sun-300">{active.next.window.label}</span>
            <span className="text-mist-400"> · {nextIn}</span>
          </p>
          <p className="mt-0.5 font-mono text-xs text-mist-500">
            {formatSolarTime(active.next.startsAt, timeZone)}
          </p>
        </motion.div>
      )}
    </Panel>
  )
}
