import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { HeroCopy } from '@/components/motion'
import { springFor } from '@/components/motion/tokens'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type ExplorerHeroProps = {
  search: ReactNode
}

export function ExplorerHero({ search }: ExplorerHeroProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <HeroCopy
        eyebrow="Sun Explorer"
        title={
          <>
            See where the sun is{' '}
            <span className="bg-gradient-to-r from-sun-300 via-sun-500 to-dusk-500 bg-clip-text text-transparent">
              right now
            </span>
          </>
        }
      />
      <motion.div
        className="w-full sm:max-w-md sm:shrink-0"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springFor(reduced), delay: reduced ? 0 : 0.12 }}
      >
        {search}
      </motion.div>
    </div>
  )
}
