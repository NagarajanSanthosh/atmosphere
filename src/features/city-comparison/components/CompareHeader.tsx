import { motion } from 'framer-motion'

type CompareHeaderProps = {
  reducedMotion?: boolean
}

export function CompareHeader({ reducedMotion = false }: CompareHeaderProps) {
  return (
    <motion.div
      className="max-w-2xl"
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 28 }
      }
    >
      <p className="eyebrow mb-1.5">Daylight comparison</p>
      <h1 className="font-display text-3xl leading-tight text-mist-50 sm:text-4xl">
        Two cities, one daylight story
      </h1>
      <p className="mt-2 text-sm text-mist-400">
        Compare sunrise, sunset, day length, and golden hours — same day, each local clock.
      </p>
    </motion.div>
  )
}
