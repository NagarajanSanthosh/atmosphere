import { motion } from 'framer-motion'
import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

type DragScrubProps = {
  /** Normalized progress 0–1 */
  value: number
  onChange: (value: number) => void
  className?: string
  trackClassName?: string
  'aria-label'?: string
}

/**
 * Horizontal scrubber driven by a single pointer-capture path.
 * Thumb position is CSS-only from `value` — no Framer drag (avoids fight with controlled state).
 */
export function DragScrub({
  value,
  onChange,
  className = '',
  trackClassName = '',
  'aria-label': ariaLabel = 'Scrub',
}: DragScrubProps) {
  const reduced = usePrefersReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [dragging, setDragging] = useState(false)

  const progressFromClientX = useCallback((clientX: number) => {
    const el = trackRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    if (rect.width <= 0) return null
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
  }, [])

  const commit = useCallback(
    (clientX: number) => {
      const next = progressFromClientX(clientX)
      if (next == null) return
      onChange(next)
    },
    [onChange, progressFromClientX],
  )

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    event.preventDefault()
    draggingRef.current = true
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
    commit(event.clientX)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    commit(event.clientX)
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    draggingRef.current = false
    setDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 0.05 : 0.01
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      onChange(Math.min(1, value + step))
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      onChange(Math.max(0, value - step))
    } else if (event.key === 'Home') {
      event.preventDefault()
      onChange(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      onChange(1)
    }
  }

  const percent = `${value * 100}%`

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      aria-orientation="horizontal"
      tabIndex={0}
      className={`relative h-11 cursor-grab touch-none select-none active:cursor-grabbing ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
    >
      {/* Track */}
      <div
        className={`absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full border border-white/[0.08] bg-night-950/70 ${trackClassName}`}
      />
      {/* Filled portion */}
      <div
        className="pointer-events-none absolute top-1/2 left-0 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-sun-500/70 to-sun-400/90"
        style={{ width: percent }}
      />
      {/* Thumb — position from value only */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 z-10 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-night-950 bg-sun-300 shadow-[0_0_0_4px_rgba(240,164,58,0.22)]"
        style={{ left: percent }}
        animate={
          reduced
            ? undefined
            : {
                scale: dragging ? 1.15 : 1,
                boxShadow: dragging
                  ? '0 0 0 6px rgba(240,164,58,0.32)'
                  : '0 0 0 4px rgba(240,164,58,0.22)',
              }
        }
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      />
    </div>
  )
}
