import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

export default function Planet({ name, distance, size, rotationSpeed, texture, scaleFactor, sizeMultiplier, isSelected, onClick }) {
  const ref = useRef()
  const planetTexture = useTexture(texture)

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * rotationSpeed
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

