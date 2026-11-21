import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useOutlet } from 'react-router-dom'
import { pageFade, pageFadeReduced, springFor } from '@/components/motion/tokens'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/** Animated route outlet + brief sun wipe between pages. */
export function PageTransition() {
  const location = useLocation()
  const outlet = useOutlet()
  const reduced = usePrefersReducedMotion()
  const variants = reduced ? pageFadeReduced : pageFade

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={springFor(reduced)}
        className="relative"
      >
        {!reduced && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 origin-left rounded-full bg-gradient-to-r from-transparent via-sun-400 to-dusk-500"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0.4, 0] }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        {outlet}
      </motion.div>
    </AnimatePresence>
  )
}
