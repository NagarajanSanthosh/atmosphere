import type { Transition } from 'framer-motion'

export const softSpring: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
}

export const snappySpring: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 32,
}

export const softSpringReduced: Transition = { duration: 0 }

export function springFor(reducedMotion: boolean, kind: 'soft' | 'snappy' = 'soft'): Transition {
  if (reducedMotion) return softSpringReduced
  return kind === 'snappy' ? snappySpring : softSpring
}

export const pageFade = {
  initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -10, filter: 'blur(3px)' },
}

export const pageFadeReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}
