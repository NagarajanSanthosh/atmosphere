import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import {
  dismissBootCover,
  markIntroSeen,
  shouldShowIntro,
} from '@/components/intro/introStorage'

type Phase = 'sun' | 'moon' | 'brand' | 'out'

/**
 * First-visit full-viewport intro: sun rises → becomes moon → Daymark → exit.
 * Visibility is decided synchronously so the app never flashes underneath.
 */
export function IntroSplash() {
  const reduced = usePrefersReducedMotion()
  const [visible, setVisible] = useState(shouldShowIntro)
  const [phase, setPhase] = useState<Phase>('sun')

  const finish = useCallback(() => {
    markIntroSeen()
    setPhase('out')
    window.setTimeout(() => setVisible(false), reduced ? 200 : 550)
  }, [reduced])

  // Hand off from HTML boot cover → React intro (or app) without a content flash
  useEffect(() => {
    dismissBootCover()
  }, [])

  useEffect(() => {
    if (!visible) {
      document.body.style.overflow = ''
      return
    }
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [visible])

  useEffect(() => {
    if (!visible) return

    if (reduced) {
      setPhase('brand')
      const done = window.setTimeout(() => finish(), 900)
      return () => window.clearTimeout(done)
    }

    const timers = [
      window.setTimeout(() => setPhase('moon'), 1600),
      window.setTimeout(() => setPhase('brand'), 3000),
      window.setTimeout(() => finish(), 4200),
    ]
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [visible, reduced, finish])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          role="dialog"
          aria-label="Daymark introduction"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-night-950"
          initial={false}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.2 : 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            animate={{
              background:
                phase === 'moon' || phase === 'brand' || phase === 'out'
                  ? 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(109,126,184,0.22), transparent 55%), #07060a'
                  : 'radial-gradient(ellipse 80% 55% at 50% 75%, rgba(240,164,58,0.28), transparent 60%), #07060a',
            }}
            transition={{ duration: 1.1 }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-[28%] h-px bg-gradient-to-r from-transparent via-mist-100/25 to-transparent"
          />

          {!reduced && (
            <div className="relative z-10 grid h-40 w-full max-w-md place-items-center sm:h-48">
              <AnimatePresence mode="wait">
                {phase === 'sun' && (
                  <motion.div
                    key="sun"
                    className="relative"
                    initial={{ y: 140, opacity: 0, scale: 0.7 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  >
                    <span className="absolute inset-[-1.6rem] rounded-full bg-sun-400/35 blur-2xl" />
                    <span className="absolute inset-[-0.6rem] rounded-full bg-sun-300/40 blur-md" />
                    <span className="relative block size-20 rounded-full bg-gradient-to-br from-sun-300 via-sun-500 to-dusk-500 shadow-[0_0_48px_rgba(240,164,58,0.55)] sm:size-24" />
                  </motion.div>
                )}

                {(phase === 'moon' || phase === 'brand' || phase === 'out') && (
                  <motion.div
                    key="moon"
                    className="relative"
                    initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                    animate={{
                      opacity: phase === 'out' ? 0 : 1,
                      scale: 1,
                      rotate: 0,
                      y: phase === 'brand' || phase === 'out' ? -28 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 160, damping: 20 }}
                  >
                    <span className="absolute inset-[-1.2rem] rounded-full bg-twilight-400/25 blur-2xl" />
                    <span className="relative block size-16 overflow-hidden rounded-full bg-gradient-to-br from-mist-100 to-mist-300 shadow-[0_0_36px_rgba(183,196,239,0.35)] sm:size-20">
                      <span className="absolute top-1 right-2 size-12 rounded-full bg-night-950/85 sm:size-14" />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <motion.div
            className="relative z-10 mt-6 text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: phase === 'brand' || phase === 'out' || reduced ? 1 : 0,
              y: phase === 'brand' || phase === 'out' || reduced ? 0 : 12,
            }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-display text-4xl font-bold tracking-tight text-mist-50 sm:text-5xl">
              Daymark
            </p>
            <p className="mt-2 text-sm tracking-[0.12em] text-mist-400 uppercase">
              Solar observatory
            </p>
          </motion.div>

          <button
            type="button"
            onClick={finish}
            className="absolute right-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-20 rounded-full border border-white/10 bg-night-900/70 px-4 py-2 text-xs font-semibold tracking-wide text-mist-300 uppercase backdrop-blur-md hover:border-sun-500/35 hover:text-sun-300 sm:right-6 sm:bottom-8"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
