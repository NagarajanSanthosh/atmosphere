import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Explorer', short: 'Explore', end: true, soon: false },
  { to: '/studio', label: 'Golden Hour', short: 'Golden', soon: false },
  { to: '/weather', label: 'Weather', short: 'Weather', soon: false },
  { to: '/compare', label: 'Compare', short: 'Compare', soon: false },
] as const

export function AppHeader() {
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
            {NAV_ITEMS.map((item) => (
              <li key={item.to} className="shrink-0">
                <NavLink
                  to={item.to}
                  end={'end' in item ? item.end : false}
                  className={({ isActive }) =>
                    [
                      'nav-chip',
                      isActive ? 'nav-chip-active' : '',
                      item.soon && !isActive ? 'nav-chip-soon' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')
                  }
                >
                  <span className="sm:hidden">{item.short}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                  {item.soon && (
                    <span className="ml-1.5 hidden rounded-full bg-night-950/25 px-1.5 py-0.5 text-[0.55rem] font-bold tracking-wide uppercase opacity-80 sm:inline">
                      Soon
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
