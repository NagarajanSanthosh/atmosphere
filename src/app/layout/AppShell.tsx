import { motion } from 'framer-motion'
import { AppHeader } from '@/app/layout/AppHeader'
import { PageTransition } from '@/components/motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

export function AppShell() {
  const reduced = usePrefersReducedMotion()

  return (
    <div className="relative flex min-h-svh flex-col overflow-x-hidden pb-[env(safe-area-inset-bottom)]">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[32vh] bg-[radial-gradient(ellipse_at_top,rgba(255,196,90,0.09),transparent_65%)] sm:h-[42vh]"
        animate={reduced ? undefined : { opacity: [0.75, 1, 0.82] }}
        transition={
          reduced ? undefined : { duration: 10, repeat: Infinity, ease: 'easeInOut' }
        }
      />
      <AppHeader />
      <main className="relative mx-auto w-full max-w-7xl flex-1 px-3 py-3 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
        <PageTransition />
      </main>
      <footer className="relative border-t border-white/[0.05] px-3 py-3 text-center text-[0.65rem] leading-relaxed tracking-wide text-mist-500 sm:px-6 sm:py-5 sm:text-xs lg:px-8">
        <span className="text-sun-500/80">◆</span>
        <span className="mx-1.5 sm:mx-2">
          Frontend-only · No accounts · Solar math in your browser
        </span>
        <span className="text-sun-500/80">◆</span>
      </footer>
    </div>
  )
}
