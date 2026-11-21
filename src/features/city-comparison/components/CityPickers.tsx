import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { snappySpring, softSpring } from '@/components/motion/tokens'
import { LocationSearch } from '@/components/shared/LocationSearch'
import { SAMPLE_LOCATIONS } from '@/data/sample-locations'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import type { Location } from '@/types/location'

const SLOT_LABELS = ['City A', 'City B', 'City C', 'City D'] as const
const SLOT_ACCENTS = [
  'text-sun-300',
  'text-twilight-300',
  'text-dusk-500',
  'text-mist-200',
] as const

type CityPickersProps = {
  locations: Location[]
  onChangeAt: (index: number, location: Location) => void
  onSwapFirstTwo: () => void
  onAddCity: (location: Location) => void
  onRemoveCity: (index: number) => void
  maxCities: number
}

export function CityPickers({
  locations,
  onChangeAt,
  onSwapFirstTwo,
  onAddCity,
  onRemoveCity,
  maxCities,
}: CityPickersProps) {
  const reduced = usePrefersReducedMotion()
  const [adding, setAdding] = useState(false)
  const canAdd = locations.length < maxCities

  const addCandidates = useMemo(
    () =>
      SAMPLE_LOCATIONS.filter(
        (sample) => !locations.some((location) => location.id === sample.id),
      ),
    [locations],
  )

  const draftValue = addCandidates[0] ?? SAMPLE_LOCATIONS[0]

  function commitAdd(location: Location) {
    onAddCity(location)
    setAdding(false)
  }

  return (
    <div className="flex flex-col gap-2.5 sm:gap-4">
      <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
        <motion.button
          type="button"
          onClick={onSwapFirstTwo}
          whileTap={reduced ? undefined : { scale: 0.92, rotate: 180 }}
          transition={reduced ? { duration: 0 } : snappySpring}
          className="rounded-full border border-white/[0.1] bg-night-900/60 px-3 py-1.5 text-[0.65rem] font-semibold tracking-wide text-mist-200 uppercase transition-colors hover:border-sun-500/35 hover:text-sun-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-400 sm:px-4 sm:py-2 sm:text-xs"
          aria-label="Swap first two cities"
        >
          Swap A/B
        </motion.button>
        {canAdd && (
          <button
            type="button"
            onClick={() => setAdding((open) => !open)}
            aria-expanded={adding}
            className="rounded-full border border-sun-500/30 bg-sun-500/10 px-3 py-1.5 text-[0.65rem] font-semibold tracking-wide text-sun-300 uppercase sm:px-4 sm:py-2 sm:text-xs"
          >
            {adding ? 'Cancel' : 'Add city'}
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {adding && canAdd && (
          <motion.div
            key="add-city"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={reduced ? { duration: 0.12 } : softSpring}
            className="rounded-2xl border border-white/[0.08] bg-night-900/40 p-3"
          >
            <p className="mb-2 text-[0.65rem] font-bold tracking-[0.14em] text-mist-400 uppercase">
              New city · {SLOT_LABELS[locations.length] ?? 'City'}
            </p>
            <LocationSearch value={draftValue} onChange={commitAdd} />
            {addCandidates.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {addCandidates.slice(0, 6).map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => commitAdd(sample)}
                    className="rounded-full border border-white/[0.08] bg-night-950/40 px-2.5 py-1 text-[0.7rem] font-medium text-mist-300 hover:border-sun-500/35 hover:text-sun-300"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`grid gap-2.5 sm:gap-3 ${
          locations.length >= 3 ? 'lg:grid-cols-2 xl:grid-cols-2' : 'lg:grid-cols-2'
        }`}
      >
        {locations.map((location, index) => (
          <div key={`${location.id}-${index}`} className="min-w-0">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p
                className={`text-[0.65rem] font-bold tracking-[0.14em] uppercase ${
                  SLOT_ACCENTS[index] ?? 'text-mist-300'
                }`}
              >
                {SLOT_LABELS[index] ?? `City ${index + 1}`}
              </p>
              {locations.length > 2 && index > 0 && (
                <button
                  type="button"
                  onClick={() => onRemoveCity(index)}
                  className="text-[0.65rem] font-semibold tracking-wide text-mist-500 uppercase hover:text-mist-200"
                >
                  Remove
                </button>
              )}
            </div>
            <LocationSearch
              value={location}
              onChange={(next) => onChangeAt(index, next)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
