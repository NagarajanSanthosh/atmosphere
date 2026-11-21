import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { springFor } from '@/components/motion/tokens'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  /** Once in view, stay visible (default true). */
  once?: boolean
} & Omit<HTMLMotionProps<'div'>, 'children'>

/**
 * Scroll / mount reveal for between-section choreography.
 * Uses whileInView so lower panels animate as they enter.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  once = true,
  ...rest
}: RevealProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2, margin: '0px 0px -8% 0px' }}
      transition={{ ...springFor(reduced), delay: reduced ? 0 : delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
