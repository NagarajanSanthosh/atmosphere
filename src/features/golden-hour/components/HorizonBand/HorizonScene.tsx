import { Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { LightPhaseId } from '@/engines/daylight'
import type { MoonSky } from '@/engines/solar'
import { getAtmospherePalette } from '@/features/golden-hour/utils/atmospherePalette'

type HorizonSceneProps = {
  phase: LightPhaseId
  altitudeDegrees: number
  moon: MoonSky | null
  isNight: boolean
  reducedMotion: boolean
}

function sunPos(altitudeDegrees: number): THREE.Vector3 {
  const t = Math.max(0, Math.min(1, (altitudeDegrees + 6) / 60))
  return new THREE.Vector3(1.6 - t * 0.8, -0.15 + t * 1.55, -3.2)
}

function moonPos(moon: MoonSky | null): THREE.Vector3 {
  if (!moon) return new THREE.Vector3(-1.8, 1.1, -3)
  const t = Math.max(0, Math.min(1, (moon.altitudeDegrees + 5) / 50))
  return new THREE.Vector3(-1.9 + t * 0.3, 0.2 + t * 1.3, -3.1)
}

/** Compact sky scene for the fixed-height HorizonBand. */
export function HorizonScene({
  phase,
  altitudeDegrees,
  moon,
  isNight,
  reducedMotion,
}: HorizonSceneProps) {
  const palette = useMemo(() => getAtmospherePalette(phase), [phase])

  const skyUniforms = useRef({
    uTop: { value: new THREE.Color(palette.top) },
    uMid: { value: new THREE.Color(palette.mid) },
    uHorizon: { value: new THREE.Color(palette.horizon) },
  }).current

  const target = useMemo(
    () => ({
      top: new THREE.Color(palette.top),
      mid: new THREE.Color(palette.mid),
      horizon: new THREE.Color(palette.horizon),
      sun: new THREE.Color(palette.sun),
      intensity: palette.sunIntensity,
    }),
    [palette],
  )

  const current = useRef({
    top: new THREE.Color(palette.top),
    mid: new THREE.Color(palette.mid),
    horizon: new THREE.Color(palette.horizon),
    sun: new THREE.Color(palette.sun),
    intensity: palette.sunIntensity,
  })

  const sunGroup = useRef<THREE.Group>(null)
  const moonGroup = useRef<THREE.Group>(null)
  const sunMat = useRef<THREE.MeshBasicMaterial>(null)
  const glowMat = useRef<THREE.MeshBasicMaterial>(null)
  const starsRef = useRef<THREE.Points>(null)

  const sunTarget = useMemo(() => sunPos(altitudeDegrees), [altitudeDegrees])
  const moonTarget = useMemo(() => moonPos(moon), [moon])

  useFrame((_, delta) => {
    const speed = reducedMotion ? 1 : Math.min(1, delta * 2)
    const c = current.current
    c.top.lerp(target.top, speed)
    c.mid.lerp(target.mid, speed)
    c.horizon.lerp(target.horizon, speed)
    c.sun.lerp(target.sun, speed)
    c.intensity += (target.intensity - c.intensity) * speed

    skyUniforms.uTop.value.copy(c.top)
    skyUniforms.uMid.value.copy(c.mid)
    skyUniforms.uHorizon.value.copy(c.horizon)

    if (sunMat.current) sunMat.current.color.copy(c.sun)
    if (glowMat.current) {
      glowMat.current.color.copy(c.sun)
      glowMat.current.opacity = 0.2 + c.intensity * 0.35
    }
    if (sunGroup.current) {
      sunGroup.current.position.lerp(sunTarget, reducedMotion ? 1 : Math.min(1, delta * 1.4))
      sunGroup.current.visible = altitudeDegrees > -10
      sunGroup.current.scale.setScalar(0.85 + c.intensity * 0.3)
    }
    if (moonGroup.current) {
      moonGroup.current.position.lerp(moonTarget, reducedMotion ? 1 : Math.min(1, delta * 1.4))
      moonGroup.current.visible = isNight
      moonGroup.current.scale.setScalar(moon?.aboveHorizon ? 1 : 0.5)
    }
    if (starsRef.current) {
      const mat = starsRef.current.material as THREE.PointsMaterial
      mat.opacity = isNight ? 1 : altitudeDegrees < 6 ? 0.25 : 0
      if (!reducedMotion && isNight) starsRef.current.rotation.y += delta * 0.01
    }
  })

  return (
    <>
      <color attach="background" args={[palette.mid]} />
      <ambientLight intensity={isNight ? 0.25 : 0.5} />

      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[10, 48, 32]} />
        <shaderMaterial
          side={THREE.BackSide}
          depthWrite={false}
          uniforms={skyUniforms}
          vertexShader={VERT}
          fragmentShader={FRAG}
        />
      </mesh>

      <Stars
        ref={starsRef}
        radius={18}
        depth={30}
        count={1600}
        factor={isNight ? 4.5 : 2.5}
        saturation={0.35}
        fade
        speed={reducedMotion ? 0 : 0.25}
      />

      <group ref={sunGroup} position={sunTarget.toArray()}>
        <mesh>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshBasicMaterial ref={sunMat} color={palette.sun} toneMapped={false} />
        </mesh>
        <mesh scale={2.4}>
          <sphereGeometry args={[0.32, 16, 16]} />
          <meshBasicMaterial
            ref={glowMat}
            color={palette.sun}
            transparent
            opacity={0.3}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      <group ref={moonGroup} position={moonTarget.toArray()}>
        <mesh>
          <sphereGeometry args={[0.26, 20, 20]} />
          <meshBasicMaterial color="#ebe3d6" toneMapped={false} />
        </mesh>
        <mesh scale={2}>
          <sphereGeometry args={[0.26, 16, 16]} />
          <meshBasicMaterial
            color="#dfe6ff"
            transparent
            opacity={0.2}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Soft horizon shelf */}
      <mesh rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -1.1, -1.5]}>
        <planeGeometry args={[16, 5]} />
        <meshBasicMaterial
          color={isNight ? '#c45a32' : palette.haze}
          transparent
          opacity={isNight ? 0.35 : 0.22}
          depthWrite={false}
        />
      </mesh>
    </>
  )
}

const VERT = /* glsl */ `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAG = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  varying vec3 vWorldPosition;
  void main() {
    float h = normalize(vWorldPosition).y;
    float t = clamp(h * 0.5 + 0.5, 0.0, 1.0);
    vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.45, t));
    col = mix(col, uTop, smoothstep(0.35, 1.0, t));
    gl_FragColor = vec4(col, 1.0);
  }
`
