import { formatAzimuthBearing } from '@/utils/compassBearing'

type AzimuthCompassProps = {
  azimuthDegrees: number
  label?: string
  className?: string
}

/** Simple face-this-way compass for shoot planning. */
export function AzimuthCompass({
  azimuthDegrees,
  label = 'Face',
  className = '',
}: AzimuthCompassProps) {
  const bearing = formatAzimuthBearing(azimuthDegrees)

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        aria-hidden="true"
        className="relative grid size-14 place-items-center rounded-full border border-white/[0.1] bg-night-950/60"
      >
        <span className="absolute top-1 text-[0.55rem] font-bold tracking-wide text-mist-500">
          N
        </span>
        <span
          className="block size-0 border-x-[5px] border-b-[14px] border-x-transparent border-b-sun-400 origin-center"
          style={{ transform: `rotate(${azimuthDegrees}deg)` }}
        />
      </div>
      <div className="min-w-0">
        <p className="text-[0.65rem] font-bold tracking-[0.14em] text-mist-500 uppercase">
          {label}
        </p>
        <p className="mt-0.5 font-display text-lg text-sun-300">{bearing}</p>
      </div>
    </div>
  )
}
