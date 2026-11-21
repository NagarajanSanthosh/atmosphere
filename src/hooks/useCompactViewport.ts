import { useEffect, useState } from 'react'

/** True below the `md` breakpoint (768px) — tilt/hover 3D should stay off. */
export function useCompactViewport(): boolean {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)')
    const sync = () => setCompact(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return compact
}
