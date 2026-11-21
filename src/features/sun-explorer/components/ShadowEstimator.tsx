import { useState } from 'react'
import { Panel } from '@/components/ui/Panel'
import {
  formatShadowLength,
  shadowLengthMeters,
} from '@/features/sun-explorer/utils/shadowLength'

type ShadowEstimatorProps = {
  altitudeDegrees: number
}

const PRESETS = [
  { label: 'Person', meters: 1.7 },
  { label: 'Pole 2m', meters: 2 },
  { label: 'Tree 8m', meters: 8 },
] as const

export function ShadowEstimator({ altitudeDegrees }: ShadowEstimatorProps) {
  const [heightM, setHeightM] = useState(1.7)
  const length = shadowLengthMeters(heightM, altitudeDegrees)

  return (
    <Panel className="p-4 sm:p-5">
      <p className="text-[0.65rem] font-bold tracking-[0.16em] text-mist-400 uppercase">
        Shadow length
      </p>
      <p className="mt-1 text-xs text-mist-500">
        Upright object at current sun altitude ({altitudeDegrees.toFixed(1)}°)
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setHeightM(preset.meters)}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
              Math.abs(heightM - preset.meters) < 0.01
                ? 'border-sun-500/40 bg-sun-500/15 text-sun-300'
                : 'border-white/[0.08] bg-night-900/40 text-mist-300 hover:text-mist-50'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <label className="mt-3 block">
        <span className="text-[0.65rem] tracking-wide text-mist-500 uppercase">
          Height (m)
        </span>
        <input
          type="number"
          min={0.1}
          max={100}
          step={0.1}
          value={heightM}
          onChange={(event) => setHeightM(Number(event.target.value) || 0)}
          className="mt-1 w-full rounded-xl border border-white/[0.08] bg-night-950/60 px-3 py-2 text-sm text-mist-50 outline-none focus:border-sun-500/35 focus:ring-2 focus:ring-sun-500/20"
        />
      </label>

      <p className="mt-3 font-display text-2xl text-mist-50">
        {formatShadowLength(length)}
      </p>
      {length == null && altitudeDegrees < 0.5 && (
        <p className="mt-1 text-xs text-mist-500">Sun too low (or below horizon).</p>
      )}
    </Panel>
  )
}
