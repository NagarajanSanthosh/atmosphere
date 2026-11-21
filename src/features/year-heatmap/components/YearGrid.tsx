import { motion } from 'framer-motion'
import { softSpring } from '@/components/motion/tokens'
import { formatDayLength } from '@/features/sun-explorer/utils/formatDayLength'
import { formatLocalDate } from '@/features/sun-explorer/utils/formatLocalDate'
import type { DayCell, YearMetric } from '@/features/year-heatmap/utils/buildYearSeries'
import { metricValue } from '@/features/year-heatmap/utils/buildYearSeries'
import {
  colorForValue,
  type HeatColorScale,
} from '@/features/year-heatmap/utils/colorScale'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { toDateInputValue } from '@/utils/placeParams'

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** Fixed tracks — avoid Tailwind `grid-cols-7` (1fr) stretching cells on mobile. */
const DAY_GRID =
  'inline-grid grid-cols-[repeat(7,0.65rem)] gap-[2px] sm:grid-cols-[repeat(7,1.15rem)] sm:gap-1 lg:grid-cols-[repeat(7,1.5rem)]'

const DAY_CELL =
  'size-[0.65rem] shrink-0 rounded-[0.12rem] border sm:size-[1.15rem] sm:rounded-[0.25rem] lg:size-6'

type YearGridProps = {
  months: DayCell[][]
  metric: YearMetric
  colorScale: HeatColorScale | null
  selectedKey: string
  todayKey: string | null
  timeZone: string
  onSelect: (date: Date) => void
}

export function YearGrid({
  months,
  metric,
  colorScale,
  selectedKey,
  todayKey,
  timeZone,
  onSelect,
}: YearGridProps) {
  const reduced = usePrefersReducedMotion()

  return (
    <div className="grid grid-cols-3 justify-items-start gap-x-2 gap-y-3 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-4 md:grid-cols-4">
      {months.map((days, monthIndex) => {
        const firstWeekday = days[0] ? ((days[0].date.getDay() + 6) % 7) : 0

        return (
          <motion.div
            key={MONTH_LABELS[monthIndex]}
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { ...softSpring, delay: monthIndex * 0.015 }
            }
            className="min-w-0"
          >
            <p className="mb-1 text-[0.55rem] font-bold tracking-[0.12em] text-mist-400 uppercase sm:mb-1.5 sm:text-[0.6rem]">
              {MONTH_LABELS[monthIndex]}
            </p>
            <div className={DAY_GRID}>
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <span key={`pad-${monthIndex}-${i}`} className={DAY_CELL} aria-hidden />
              ))}
              {days.map((day) => {
                const key = toDateInputValue(day.date)
                const value = metricValue(day, metric)
                const selected = key === selectedKey
                const isToday = todayKey != null && key === todayKey
                const label = `${formatLocalDate(day.date, timeZone)} · ${formatDayLength(value)}`

                return (
                  <button
                    key={key}
                    type="button"
                    title={label}
                    aria-label={label}
                    aria-pressed={selected}
                    onClick={() => onSelect(day.date)}
                    className={`${DAY_CELL} transition-[transform,box-shadow] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sun-400 ${
                      selected
                        ? 'scale-110 border-sun-300 shadow-[0_0_0_1px_rgba(240,164,58,0.65)]'
                        : isToday
                          ? 'border-mist-100/55'
                          : 'border-transparent'
                    }`}
                    style={{ background: colorForValue(value, colorScale) }}
                  />
                )
              })}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
