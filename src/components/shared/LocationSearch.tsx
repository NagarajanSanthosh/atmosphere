import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { softSpring } from '@/components/motion/tokens'
import { SAMPLE_LOCATIONS } from '@/data/sample-locations'
import { useLocationSearch } from '@/hooks/useLocationSearch'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { formatLocationLabel, type Location } from '@/types/location'

type LocationSearchProps = {
  value: Location
  onChange: (location: Location) => void
}

export function LocationSearch({ value, onChange }: LocationSearchProps) {
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const { results, searching, error, isLive } = useLocationSearch(query)
  const reduced = usePrefersReducedMotion()

  function selectLocation(location: Location) {
    onChange(location)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setOpen(true)
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault()
      selectLocation(results[activeIndex])
    } else if (event.key === 'Escape') {
      setOpen(false)
      setQuery('')
    }
  }

  return (
    <div className="relative w-full">
      <label className="sr-only" htmlFor="location-search">
        Search location
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-night-900/60 px-2.5 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md focus-within:border-sun-500/35 focus-within:ring-2 focus-within:ring-sun-500/20 sm:gap-2.5 sm:rounded-2xl sm:px-3.5 sm:py-2.5 sm:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_30px_rgba(0,0,0,0.25)]">
        <SearchIcon />
        <input
          ref={inputRef}
          id="location-search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && results[activeIndex] ? `${listId}-${results[activeIndex].id}` : undefined
          }
          type="search"
          autoComplete="off"
          enterKeyHint="search"
          placeholder="Search any city…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
            setActiveIndex(0)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120)
          }}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 bg-transparent text-sm text-mist-50 outline-none placeholder:text-mist-400"
        />
        {searching && (
          <span className="shrink-0 text-[0.65rem] tracking-wide text-mist-500 uppercase">
            …
          </span>
        )}
      </div>

      <LayoutGroup id={`chips-${listId}`}>
        <div className="mt-1.5 flex gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-2 sm:gap-1.5">
          {SAMPLE_LOCATIONS.map((location) => {
            const selected = location.id === value.id
            return (
              <button
                key={location.id}
                type="button"
                onClick={() => selectLocation(location)}
                className={`relative shrink-0 rounded-full border px-2 py-0.5 text-[0.7rem] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-400 sm:px-2.5 sm:py-1 sm:text-xs ${
                  selected
                    ? 'border-transparent text-sun-300'
                    : 'border-white/[0.08] bg-night-900/40 text-mist-300 hover:border-white/15 hover:text-mist-50'
                }`}
              >
                {selected && (
                  <motion.span
                    layoutId={reduced ? undefined : `location-chip-pill-${listId}`}
                    className="absolute inset-0 rounded-full border border-sun-500/40 bg-sun-500/15"
                    transition={reduced ? { duration: 0 } : softSpring}
                  />
                )}
                <span className="relative z-10">{location.name}</span>
              </button>
            )
          })}
        </div>
      </LayoutGroup>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={reduced ? { duration: 0.12 } : softSpring}
            className="absolute z-30 mt-2 max-h-[min(16rem,50vh)] w-full origin-top overflow-auto rounded-2xl border border-white/[0.08] bg-night-850/95 py-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            {searching && results.length === 0 ? (
              <li className="px-3 py-3 text-sm text-mist-400">Searching…</li>
            ) : results.length === 0 ? (
              <li className="px-3 py-3 text-sm text-mist-400">
                {isLive ? 'No cities found' : 'Type at least 2 letters'}
              </li>
            ) : (
              results.map((location, index) => {
                const selected = location.id === value.id
                const active = index === activeIndex
                return (
                  <li
                    key={location.id}
                    role="option"
                    aria-selected={selected}
                    id={`${listId}-${location.id}`}
                  >
                    <button
                      type="button"
                      className={`flex min-h-11 w-full flex-col items-start justify-center gap-0.5 px-3.5 py-2.5 text-left text-sm transition-colors ${
                        active
                          ? 'bg-gradient-to-r from-sun-500/20 to-transparent text-mist-50'
                          : 'text-mist-100 hover:bg-white/[0.03]'
                      }`}
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => selectLocation(location)}
                    >
                      <span className="font-semibold">{location.name}</span>
                      <span className="text-xs text-mist-400">
                        {[location.admin, location.country].filter(Boolean).join(' · ') ||
                          formatLocationLabel(location)}
                      </span>
                    </button>
                  </li>
                )
              })
            )}
            {error && isLive && (
              <li className="border-t border-white/[0.06] px-3 py-2 text-[0.7rem] text-mist-500">
                Live search failed — showing sample matches when available.
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4 shrink-0 text-sun-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16.5 16.5 20 20" strokeLinecap="round" />
    </svg>
  )
}
