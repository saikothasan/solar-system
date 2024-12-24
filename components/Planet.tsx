import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three' // Import THREE

interface PlanetProps {
  name: string
  distance: number
  size: number
  rotationSpeed: number
  texture: string
  scaleFactor: number
  sizeMultiplier: number
  isSelected: boolean
  onClick: () => void
}

export default function Planet({
  name,
  distance,
  size,
  rotationSpeed,
  texture,
  scaleFactor,
  sizeMultiplier,
  isSelected,
  onClick,
}: PlanetProps) {
  const ref = useRef<THREE.Mesh>(null) // Use THREE.Mesh explicitly

  const planetTexture = useTexture(texture)

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * rotationSpeed
    }
  })

  return (
    <mesh
      ref={ref}
      position={[distance * scaleFactor, 0, 0]}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      <sphereGeometry args={[size * sizeMultiplier * scaleFactor, 32, 32]} />
      <meshStandardMaterial
        map={planetTexture}
        emissive={isSelected ? 'white' : 'black'}
        emissiveIntensity={isSelected ? 0.5 : 0}
      />
    </mesh>
  )
}
