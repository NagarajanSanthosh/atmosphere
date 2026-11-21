import { motion } from 'framer-motion'
import type { ActiveLightPhase } from '@/engines/daylight'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { formatRelativeTo } from '@/features/sun-explorer/utils/formatDayLength'
import { formatSolarTime } from '@/features/sun-explorer/utils/formatSolarTime'

type WindowCountdownBarProps = {
  active: ActiveLightPhase
  instant: Date
  timeZone: string
  alertsEnabled: boolean
  onToggleAlerts: () => void
  notificationsSupported: boolean
}

const URGENCY_MS = 15 * 60_000

export function WindowCountdownBar({
  active,
  instant,
  timeZone,
  alertsEnabled,
  onToggleAlerts,
  notificationsSupported,
}: WindowCountdownBarProps) {
  const reduced = usePrefersReducedMotion()
  const current = active.current
  const endsIn = current?.interval.end
    ? formatRelativeTo(current.interval.end, instant)
    : null
  const nextIn = active.next
    ? formatRelativeTo(active.next.startsAt, instant)
    : null

  const remainingMs = current?.interval.end
    ? current.interval.end.getTime() - instant.getTime()
    : null
  const urgent =
    Boolean(current) &&
    remainingMs != null &&
    remainingMs > 0 &&
    remainingMs <= URGENCY_MS

  const headline = current
    ? `${current.label} · ends ${endsIn ?? 'soon'}`
    : active.next
      ? `Next · ${active.next.window.label} ${nextIn ?? ''}`
      : active.label

  const detail = current?.interval.end
    ? `Until ${formatSolarTime(current.interval.end, timeZone)}`
    : active.next
      ? `Starts ${formatSolarTime(active.next.startsAt, timeZone)}`
      : null

  return (
    <motion.div
      layout
      animate={
        urgent && !reduced
          ? {
              boxShadow: [
                '0 0 0 0 rgba(240,164,58,0)',
                '0 0 24px 0 rgba(240,164,58,0.28)',
                '0 0 0 0 rgba(240,164,58,0)',
              ],
            }
          : { boxShadow: '0 0 0 0 rgba(240,164,58,0)' }
      }
      transition={
        urgent && !reduced
          ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.3 }
      }
      className={`sticky top-[4.5rem] z-30 -mx-4 border-y bg-night-950/90 px-4 py-2.5 backdrop-blur-xl sm:top-[5.25rem] sm:mx-0 sm:rounded-2xl sm:border sm:px-4 ${
        urgent ? 'border-sun-500/45' : 'border-sun-500/20'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <motion.p
            className={`truncate text-sm font-semibold ${
              urgent ? 'text-sun-300' : 'text-mist-50'
            }`}
            animate={
              urgent && !reduced
                ? { opacity: [1, 0.72, 1], scale: [1, 1.015, 1] }
                : { opacity: 1, scale: 1 }
            }
            transition={
              urgent && !reduced
                ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.2 }
            }
          >
            {headline}
          </motion.p>
          {detail && <p className="text-xs text-mist-400">{detail}</p>}
        </div>
        {notificationsSupported && (
          <button
            type="button"
            onClick={onToggleAlerts}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[0.65rem] font-semibold tracking-wide uppercase transition-colors ${
              alertsEnabled
                ? 'border-sun-500/40 bg-sun-500/15 text-sun-300'
                : 'border-white/[0.1] bg-night-900/60 text-mist-300 hover:text-mist-50'
            }`}
          >
            {alertsEnabled ? 'Alerts on' : 'Alert me'}
          </button>
        )}
      </div>
    </motion.div>
  )
}
