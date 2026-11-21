import type { ReactNode } from 'react'
import { HeroCopy } from '@/components/motion'
import type { YearMetric } from '@/features/year-heatmap/utils/buildYearSeries'

type YearHeroProps = {
  year: number
  metric: YearMetric
  onYearChange: (year: number) => void
  onMetricChange: (metric: YearMetric) => void
  search: ReactNode
}

export function YearHero({
  year,
  metric,
  onYearChange,
  onMetricChange,
  search,
}: YearHeroProps) {
  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
      <HeroCopy
        eyebrow="Year of light"
        titleClassName="font-display text-lg leading-tight text-mist-50 sm:text-3xl"
        title={
          <>
            <span className="sm:hidden">Year of daylight</span>
            <span className="hidden sm:inline">A year of daylight at a glance</span>
          </>
        }
        subtitle="Each cell is one day. Tap to sync Daymark."
      />

      <div className="flex w-full flex-col gap-1.5 sm:gap-2 lg:max-w-md">
        {search}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center rounded-full border border-white/[0.08] bg-night-900/55 p-0.5">
            <button
              type="button"
              onClick={() => onYearChange(year - 1)}
              className="rounded-full px-2 py-0.5 text-xs font-semibold text-mist-300 hover:text-mist-50 sm:px-3 sm:py-1.5"
              aria-label="Previous year"
            >
              −
            </button>
            <span className="min-w-[2.75rem] text-center font-mono text-sm text-mist-50">
              {year}
            </span>
            <button
              type="button"
              onClick={() => onYearChange(year + 1)}
              className="rounded-full px-2 py-0.5 text-xs font-semibold text-mist-300 hover:text-mist-50 sm:px-3 sm:py-1.5"
              aria-label="Next year"
            >
              +
            </button>
          </div>

          <div className="flex rounded-full border border-white/[0.08] bg-night-900/55 p-0.5">
            <MetricChip
              active={metric === 'day-length'}
              onClick={() => onMetricChange('day-length')}
              label="Day length"
              shortLabel="Day"
            />
            <MetricChip
              active={metric === 'golden-evening'}
              onClick={() => onMetricChange('golden-evening')}
              label="Golden eve"
              shortLabel="Golden"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricChip({
  active,
  onClick,
  label,
  shortLabel,
}: {
  active: boolean
  onClick: () => void
  label: string
  shortLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide transition-colors sm:px-3 sm:py-1.5 sm:text-xs ${
        active
          ? 'bg-sun-500/20 text-sun-300'
          : 'text-mist-400 hover:text-mist-100'
      }`}
    >
      <span className="sm:hidden">{shortLabel}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  )
}
