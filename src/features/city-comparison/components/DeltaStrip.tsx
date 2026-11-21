import { AnimatePresence, motion } from 'framer-motion'
import { snappySpring } from '@/components/motion/tokens'
import { Panel } from '@/components/ui/Panel'
import type { DayLengthDelta } from '@/features/city-comparison/utils/dayLengthDelta'
import type {
  EarlierEvening,
  GoldenDurationDelta,
} from '@/features/city-comparison/utils/goldenDelta'

type DeltaStripProps = {
  delta: DayLengthDelta | null
  goldenDelta: GoldenDurationDelta | null
  earlierEvening: EarlierEvening | null
  nameA: string
  nameB: string
  cityCount?: number
  reducedMotion?: boolean
}

export function DeltaStrip({
  delta,
  goldenDelta,
  earlierEvening,
  nameA,
  nameB,
  cityCount = 2,
  reducedMotion = false,
}: DeltaStripProps) {
  if (!delta) return null

  const punchKey = `${nameA}-${nameB}-${delta.headline}-${goldenDelta?.headline ?? ''}`
  const focusLabel =
    cityCount > 2
      ? `A vs B focus · ${nameA} vs ${nameB}`
      : `A vs B · ${nameA} vs ${nameB}`

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 28 }
      }
    >
      <Panel className="relative overflow-hidden px-5 py-4 sm:px-6 sm:py-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -top-12 size-40 rounded-full bg-sun-500/12 blur-3xl"
        />
        <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
          {focusLabel}
        </p>
        {cityCount > 2 && (
          <p className="mt-1 text-[0.7rem] text-mist-500">
            Headline compares A and B — C/D stay on the cards and ribbon.
          </p>
        )}

        <div className="relative mt-2 min-h-[2.25rem] overflow-hidden sm:min-h-[2.75rem]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.p
              key={punchKey}
              initial={
                reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.96 }
              }
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={
                reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.98 }
              }
              transition={reducedMotion ? { duration: 0.12 } : snappySpring}
              className="font-display text-2xl text-mist-50 sm:text-3xl"
            >
              {delta.headline}
            </motion.p>
          </AnimatePresence>
        </div>

        {!delta.tie && delta.winnerName && (
          <p className="mt-1 text-sm text-mist-400">
            Day length difference{' '}
            <span className="font-mono text-sun-300">{delta.absLabel}</span>
          </p>
        )}

        {goldenDelta && (
          <p className="mt-3 text-sm text-mist-200">
            {goldenDelta.headline}
            {!goldenDelta.tie && (
              <>
                {' '}
                <span className="font-mono text-sun-300">({goldenDelta.absLabel})</span>
              </>
            )}
          </p>
        )}

        {earlierEvening && (
          <p className="mt-1 text-sm text-twilight-300">{earlierEvening.headline}</p>
        )}
      </Panel>
    </motion.div>
  )
}
