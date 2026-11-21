import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { HeroCopy } from '@/components/motion'
import { springFor } from '@/components/motion/tokens'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type StudioHeaderProps = {
  search: ReactNode
  meta: string
  reducedMotion?: boolean
}

export function StudioHeader({ search, meta, reducedMotion = false }: StudioHeaderProps) {
  const reduced = usePrefersReducedMotion() || reducedMotion

  return (
    <header className="flex flex-col gap-2.5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
      <div>
        <HeroCopy
          eyebrow="Golden Hour Studio"
          titleClassName="font-display text-xl leading-tight text-mist-50 sm:text-4xl"
          title="Daymark"
          subtitle={
            <>
              <span className="block">Plan shoots with light, not guesswork.</span>
              <span className="mt-1.5 block text-xs text-mist-500">{meta}</span>
            </>
          }
        />
        <p className="mt-1 truncate text-[0.7rem] text-mist-500 sm:hidden">{meta}</p>
      </div>

      <motion.div
        className="w-full lg:max-w-md"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...springFor(reduced), delay: reduced ? 0 : 0.12 }}
      >
        {search}
      </motion.div>
    </header>
  )
}
