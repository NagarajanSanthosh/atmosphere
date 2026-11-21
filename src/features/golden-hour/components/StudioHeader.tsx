import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type StudioHeaderProps = {
  search: ReactNode
  meta: string
  reducedMotion?: boolean
}

export function StudioHeader({ search, meta, reducedMotion = false }: StudioHeaderProps) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
      <motion.div
        className="min-w-0 max-w-xl"
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 28 }
        }
      >
        <p className="eyebrow mb-1.5">Golden Hour Studio</p>
        <h1 className="font-display text-3xl leading-tight text-mist-50 sm:text-4xl">
          Daymark
        </h1>
        <p className="mt-2 text-sm text-mist-400">
          Plan shoots with light, not guesswork.
        </p>
        <p className="mt-1.5 text-xs text-mist-500">{meta}</p>
      </motion.div>

      <motion.div
        className="w-full lg:max-w-md"
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { delay: 0.05, type: 'spring', stiffness: 280, damping: 28 }
        }
      >
        {search}
      </motion.div>
    </header>
  )
}
