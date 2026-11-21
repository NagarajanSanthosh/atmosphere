import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { springFor } from '@/components/motion/tokens'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type FadeInProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
} & Omit<HTMLMotionProps<'div'>, 'children'>

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 12,
  ...rest
}: FadeInProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springFor(reduced), delay: reduced ? 0 : delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
