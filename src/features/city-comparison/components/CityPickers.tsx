import { motion } from 'framer-motion'
import { snappySpring } from '@/components/motion/tokens'
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
  const canAdd = locations.length < maxCities
  const addCandidates = SAMPLE_LOCATIONS.filter(
    (sample) => !locations.some((location) => location.id === sample.id),
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <motion.button
          type="button"
          onClick={onSwapFirstTwo}
          whileTap={reduced ? undefined : { scale: 0.92, rotate: 180 }}
          transition={reduced ? { duration: 0 } : snappySpring}
          className="rounded-full border border-white/[0.1] bg-night-900/60 px-4 py-2 text-xs font-semibold tracking-wide text-mist-200 uppercase transition-colors hover:border-sun-500/35 hover:text-sun-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-400"
          aria-label="Swap first two cities"
        >
          Swap A/B
        </motion.button>
        {canAdd && addCandidates[0] && (
          <button
            type="button"
            onClick={() => onAddCity(addCandidates[0])}
            className="rounded-full border border-sun-500/30 bg-sun-500/10 px-4 py-2 text-xs font-semibold tracking-wide text-sun-300 uppercase"
          >
            Add city
          </button>
        )}
      </div>

      <div
        className={`grid gap-3 ${
          locations.length >= 3
            ? 'lg:grid-cols-2 xl:grid-cols-2'
            : 'lg:grid-cols-2'
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
