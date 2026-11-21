import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { springFor } from '@/components/motion/tokens'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type StaggerProps = {
  children: ReactNode
  className?: string
  stagger?: number
}

export function Stagger({ children, className, stagger = 0.06 }: StaggerProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduced ? 0 : stagger,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

type StaggerItemProps = {
  children: ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.div
      className={className}
      variants={{
        hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: springFor(reduced),
        },
      }}
    >
      {children}
    </motion.div>
  )
}
