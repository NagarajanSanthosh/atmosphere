import { HeroCopy } from '@/components/motion'

type CompareHeaderProps = {
  reducedMotion?: boolean
}

export function CompareHeader(_props: CompareHeaderProps) {
  return (
    <HeroCopy
      eyebrow="Daylight comparison"
      className="max-w-2xl"
      titleClassName="font-display text-xl leading-tight text-mist-50 sm:text-4xl"
      title="Two cities, one daylight story"
      subtitle="Compare sunrise, sunset, day length, and golden hours — same day, each local clock."
    />
  )
}
