import { HeroCopy } from '@/components/motion'

type CompareHeaderProps = {
  reducedMotion?: boolean
  cityCount?: number
}

export function CompareHeader({ cityCount = 2 }: CompareHeaderProps) {
  const trip = cityCount > 2

  return (
    <HeroCopy
      eyebrow="Daylight comparison"
      className="max-w-2xl"
      titleClassName="font-display text-xl leading-tight text-mist-50 sm:text-4xl"
      title={trip ? 'Cities on one daylight day' : 'Two cities, one daylight story'}
      subtitle={
        trip
          ? `Compare sunrise, sunset, day length, and golden hours across up to ${cityCount} places — same calendar day, each local clock.`
          : 'Compare sunrise, sunset, day length, and golden hours — same day, each local clock. Add cities for trip mode (up to 4).'
      }
    />
  )
}
