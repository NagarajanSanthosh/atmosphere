import { motion } from 'framer-motion'
import { Panel } from '@/components/ui/Panel'
import type { DayLengthDelta } from '@/features/city-comparison/utils/dayLengthDelta'

type DeltaStripProps = {
  delta: DayLengthDelta
  nameA: string
  nameB: string
  reducedMotion?: boolean
}

export function DeltaStrip({
  delta,
  nameA,
  nameB,
  reducedMotion = false,
}: DeltaStripProps) {
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
          Day length delta · {nameA} vs {nameB}
        </p>
        <p className="mt-2 font-display text-2xl text-mist-50 sm:text-3xl">
          {delta.headline}
        </p>
        {!delta.tie && delta.winnerName && (
          <p className="mt-1 text-sm text-mist-400">
            Difference{' '}
            <span className="font-mono text-sun-300">{delta.absLabel}</span>
          </p>
        )}
      </Panel>
    </motion.div>
  )
}
