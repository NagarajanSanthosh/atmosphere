import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { snappySpring } from '@/components/motion/tokens'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const NAV_ITEMS = [
  { to: '/', label: 'Explorer', short: 'Explore', end: true },
  { to: '/studio', label: 'Golden Hour', short: 'Golden', end: false },
  { to: '/weather', label: 'Weather', short: 'Weather', end: false },
  { to: '/compare', label: 'Compare', short: 'Compare', end: false },
] as const

function prefetchHorizonCanvas() {
  void import('@/features/golden-hour/components/HorizonBand/HorizonCanvas')
}

export function AppHeader() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const reduced = usePrefersReducedMotion()
  const query = searchParams.toString()
  const withQuery = (path: string) => (query ? `${path}?${query}` : path)

  useEffect(() => {
    const run = () => prefetchHorizonCanvas()
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    if (typeof w.requestIdleCallback === 'function') {
      const id = w.requestIdleCallback(run, { timeout: 2500 })
      return () => w.cancelIdleCallback?.(id)
    }
    const id = window.setTimeout(run, 1800)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-night-950/80 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sun-500/40 to-transparent"
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-sun-400 via-sun-500 to-dusk-600 shadow-[0_0_28px_rgba(240,164,58,0.35)] sm:size-11 sm:rounded-2xl"
          >
            <span className="absolute inset-[3px] rounded-[0.65rem] border border-night-950/25 sm:rounded-[0.8rem]" />
            <span className="size-2 rounded-full bg-night-950/85 shadow-[0_0_10px_rgba(255,225,160,0.8)] sm:size-2.5" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-lg font-bold tracking-tight text-mist-50 sm:text-xl">
              Daymark
            </p>
            <p className="hidden text-[0.65rem] font-medium tracking-[0.14em] text-mist-400 uppercase sm:block sm:text-[0.7rem]">
              Solar observatory
            </p>
          </div>
        </div>

        <nav
          aria-label="Primary"
          className="nav-scroll -mx-4 overflow-x-auto px-4 sm:-mx-0 sm:px-0"
        >
          <ul className="flex w-max min-w-full gap-0.5 rounded-full border border-white/[0.06] bg-night-900/55 p-1 backdrop-blur-md sm:min-w-0 md:w-auto">
            {NAV_ITEMS.map((item) => {
              const active =
                item.end
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to)

              return (
                <li key={item.to} className="relative shrink-0">
                  {active && (
                    <motion.span
                      layoutId={reduced ? undefined : 'nav-active-pill'}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-sun-500/90 to-dusk-500/90 shadow-[0_0_20px_rgba(240,164,58,0.25)]"
                      transition={reduced ? { duration: 0 } : snappySpring}
                    />
                  )}
                  <NavLink
                    to={withQuery(item.to)}
                    end={item.end}
                    onMouseEnter={
                      item.to === '/studio' ? prefetchHorizonCanvas : undefined
                    }
                    onFocus={item.to === '/studio' ? prefetchHorizonCanvas : undefined}
                    className={({ isActive }) =>
                      [
                        'nav-chip relative z-10',
                        isActive ? 'text-night-950' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')
                    }
                  >
                    <span className="sm:hidden">{item.short}</span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
