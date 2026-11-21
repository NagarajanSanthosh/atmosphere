import { LocationSearch } from '@/components/shared/LocationSearch'
import type { Location } from '@/types/location'

type CityPickersProps = {
  locationA: Location
  locationB: Location
  onChangeA: (location: Location) => void
  onChangeB: (location: Location) => void
  onSwap: () => void
}

export function CityPickers({
  locationA,
  locationB,
  onChangeA,
  onChangeB,
  onSwap,
}: CityPickersProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
      <div className="min-w-0">
        <p className="mb-2 text-[0.65rem] font-bold tracking-[0.14em] text-sun-300 uppercase">
          City A
        </p>
        <LocationSearch value={locationA} onChange={onChangeA} />
      </div>

      <div className="flex items-center justify-center lg:pt-10">
        <button
          type="button"
          onClick={onSwap}
          className="rounded-full border border-white/[0.1] bg-night-900/60 px-4 py-2 text-xs font-semibold tracking-wide text-mist-200 uppercase transition-colors hover:border-sun-500/35 hover:text-sun-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-400"
          aria-label="Swap cities"
        >
          Swap
        </button>
      </div>

      <div className="min-w-0">
        <p className="mb-2 text-[0.65rem] font-bold tracking-[0.14em] text-twilight-300 uppercase">
          City B
        </p>
        <LocationSearch value={locationB} onChange={onChangeB} />
      </div>
    </div>
  )
}
