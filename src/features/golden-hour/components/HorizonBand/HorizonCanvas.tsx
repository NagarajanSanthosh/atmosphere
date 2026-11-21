import { Canvas } from '@react-three/fiber'
import { motion } from 'framer-motion'
import { Suspense, useEffect, useState } from 'react'
import type { LightPhaseId } from '@/engines/daylight'
import type { MoonSky } from '@/engines/solar'
import { HorizonScene } from '@/features/golden-hour/components/HorizonBand/HorizonScene'

type HorizonCanvasProps = {
  phase: LightPhaseId
  altitudeDegrees: number
  moon: MoonSky | null
  isNight: boolean
  reducedMotion: boolean
  onReady?: () => void
}

function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl'),
    )
  } catch {
    return false
  }
}

export function HorizonCanvas({
  phase,
  altitudeDegrees,
  moon,
  isNight,
  reducedMotion,
  onReady,
}: HorizonCanvasProps) {
  const [ok, setOk] = useState(true)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  )

  useEffect(() => {
    setOk(canUseWebGL())
    const onVis = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  useEffect(() => {
    if (ready) onReady?.()
  }, [ready, onReady])

  if (!ok || !visible) return null

  return (
    <motion.div
      className="absolute inset-0"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Canvas
        className="absolute inset-0 !h-full !w-full"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.35, 3.6], fov: 42, near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%' }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x000000, 0)
          camera.lookAt(0, 0.6, -2)
          // Defer ready so first frame can paint before fade-in
          requestAnimationFrame(() => setReady(true))
        }}
      >
        <Suspense fallback={null}>
          <HorizonScene
            phase={phase}
            altitudeDegrees={altitudeDegrees}
            moon={moon}
            isNight={isNight}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </motion.div>
  )
}
