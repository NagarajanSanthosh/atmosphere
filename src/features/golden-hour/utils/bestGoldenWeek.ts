import { getLightWindows } from '@/engines/daylight'
import { formatDayLength } from '@/features/sun-explorer/utils/formatDayLength'
import type { Location } from '@/types/location'

export type GoldenEveningDay = {
  date: Date
  start: Date | null
  end: Date | null
  durationMs: number | null
  durationLabel: string
}

/** Next 7 local calendar days' golden-evening windows for a location. */
export function getBestGoldenWeek(
  location: Location,
  from: Date = new Date(),
): GoldenEveningDay[] {
  const days: GoldenEveningDay[] = []

  for (let offset = 0; offset < 7; offset += 1) {
    const date = new Date(from)
    date.setHours(12, 0, 0, 0)
    date.setDate(date.getDate() + offset)

    const windows = getLightWindows({
      latitude: location.latitude,
      longitude: location.longitude,
      date,
    })
    const golden = windows.find((window) => window.id === 'golden-evening')
    const start = golden?.interval.start ?? null
    const end = golden?.interval.end ?? null
    const durationMs =
      start && end ? Math.max(0, end.getTime() - start.getTime()) : null

    days.push({
      date,
      start,
      end,
      durationMs,
      durationLabel: formatDayLength(durationMs),
    })
  }

  return days
}

export function longestGoldenEvening(
  days: GoldenEveningDay[],
): GoldenEveningDay | null {
  let best: GoldenEveningDay | null = null
  for (const day of days) {
    if (day.durationMs == null) continue
    if (!best || best.durationMs == null || day.durationMs > best.durationMs) {
      best = day
    }
  }
  return best
}
