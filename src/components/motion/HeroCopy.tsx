import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { springFor } from '@/components/motion/tokens'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type HeroCopyProps = {
  eyebrow: string
  title: ReactNode
  subtitle?: ReactNode
  className?: string
  titleClassName?: string
}

/** Staggered hero text for route enter. */
export function HeroCopy({
  eyebrow,
  title,
  subtitle,
  className = '',
  titleClassName = 'font-display text-2xl leading-tight text-mist-50 sm:text-3xl',
}: HeroCopyProps) {
  const reduced = usePrefersReducedMotion()
  const transition = springFor(reduced)

  return (
    <motion.div
      className={`min-w-0 max-w-xl ${className}`}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: reduced ? 0 : 0.08 },
        },
      }}
    >
      <motion.p
        className="eyebrow mb-1.5"
        variants={{
          hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 8 },
          show: { opacity: 1, y: 0, transition },
        }}
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        className={titleClassName}
        variants={{
          hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
          show: { opacity: 1, y: 0, transition },
        }}
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.div
          className="mt-2 max-w-md text-sm text-mist-400"
          variants={{
            hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0, transition },
          }}
        >
          {subtitle}
        </motion.div>
      )}
    </motion.div>
  )
}
