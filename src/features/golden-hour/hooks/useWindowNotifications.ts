import { useEffect, useRef, useState } from 'react'
import type { ActiveLightPhase } from '@/engines/daylight'

type UseWindowNotificationsOptions = {
  active: ActiveLightPhase
  enabled: boolean
  locationName: string
}

/**
 * Optional browser Notification when a shoot window becomes current.
 * Permission is requested only when the user enables alerts.
 */
export function useWindowNotifications({
  active,
  enabled,
  locationName,
}: UseWindowNotificationsOptions) {
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    typeof Notification === 'undefined' ? 'denied' : Notification.permission,
  )
  const prevId = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled) return
    if (typeof Notification === 'undefined') return
    if (Notification.permission === 'granted') {
      setPermission('granted')
      return
    }
    if (Notification.permission === 'denied') {
      setPermission('denied')
      return
    }
    void Notification.requestPermission().then(setPermission)
  }, [enabled])

  useEffect(() => {
    if (!enabled || permission !== 'granted') return

    const currentId = active.current?.id ?? null
    const previous = prevId.current
    prevId.current = currentId

    if (!currentId || currentId === previous) return
    if (previous === null) return // skip initial mount

    try {
      new Notification(`Daymark · ${locationName}`, {
        body: `${active.label} is open now`,
        tag: `daymark-window-${currentId}`,
      })
    } catch {
      // Ignore environments that block Notification construction
    }
  }, [active.current?.id, active.label, enabled, locationName, permission])

  return { permission }
}
