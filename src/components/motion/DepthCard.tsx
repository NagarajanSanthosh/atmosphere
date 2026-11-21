import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type DepthCardProps = {
  children: ReactNode
  className?: string
  /** Disable tilt on mobile / dense lists */
  disableTilt?: boolean
}

/**
 * Panel wrapper with light Framer 3D tilt on hover/press.
 * Falls back to flat motion when reduced-motion or disableTilt.
 */
export function DepthCard({
  children,
  className = '',
  disableTilt = false,
}: DepthCardProps) {
  const reduced = usePrefersReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(rawY, { stiffness: 220, damping: 22 })
  const rotateY = useSpring(rawX, { stiffness: 220, damping: 22 })
  const transform = useMotionTemplate`perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`

  const tiltOff = reduced || disableTilt

  return (
    <motion.div
      className={`will-change-transform ${className}`}
      style={tiltOff ? undefined : { transform, transformStyle: 'preserve-3d' }}
      onMouseMove={
        tiltOff
          ? undefined
          : (event) => {
              const rect = event.currentTarget.getBoundingClientRect()
              const px = (event.clientX - rect.left) / rect.width
              const py = (event.clientY - rect.top) / rect.height
              rawX.set((px - 0.5) * 8)
              rawY.set((0.5 - py) * 6)
            }
      }
      onMouseLeave={
        tiltOff
          ? undefined
          : () => {
              rawX.set(0)
              rawY.set(0)
            }
      }
      whileTap={tiltOff ? undefined : { scale: 0.985 }}
    >
      {children}
    </motion.div>
  )
}
