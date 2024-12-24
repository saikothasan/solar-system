'use client'

import { useState, useRef, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, OrbitControls as OrbitControlsImpl, Stars, useTexture } from '@react-three/drei'
import { Vector3 } from 'three'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Planet from './Planet'

// Type definitions for planet properties
interface PlanetData {
  name: string
  distance: number
  size: number
  rotationSpeed: number
  texture: string
}

// Array of planets with properties
const planets: PlanetData[] = [
  { name: 'Mercury', distance: 57.9, size: 0.383, rotationSpeed: 0.01, texture: '/2k_mercury.jpg' },
  { name: 'Venus', distance: 108.2, size: 0.949, rotationSpeed: 0.0067, texture: '/2k_venus_surface.jpg' },
  { name: 'Earth', distance: 149.6, size: 1, rotationSpeed: 0.1, texture: '/2k_earth_daymap.jpg' },
  { name: 'Mars', distance: 227.9, size: 0.532, rotationSpeed: 0.097, texture: '/2k_mars.jpg' },
  { name: 'Jupiter', distance: 778.5, size: 11.21, rotationSpeed: 0.24, texture: '/2k_jupiter.jpg' },
  { name: 'Saturn', distance: 1434.0, size: 9.45, rotationSpeed: 0.22, texture: '/2k_saturn.jpg' },
  { name: 'Uranus', distance: 2871.0, size: 4.01, rotationSpeed: 0.14, texture: '/2k_uranus.jpg' },
  { name: 'Neptune', distance: 4495.0, size: 3.88, rotationSpeed: 0.15, texture: '/2k_neptune.jpg' },
]

const SCALE_FACTOR = 0.00001
const SIZE_MULTIPLIER = 1000

function Sun() {
  const sunTexture = useTexture('/2k_sun.jpg')
  return (
    <mesh>
      <sphereGeometry args={[6.96 * SIZE_MULTIPLIER * SCALE_FACTOR, 32, 32]} />
      <meshBasicMaterial map={sunTexture} />
    </mesh>
  )
}

// Props for CameraController
interface CameraControllerProps {
  target: Vector3
}

function CameraController({ target }: CameraControllerProps) {
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsImpl | null>(null) // Correctly typed as OrbitControlsImpl

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.target.lerp(target, 0.05)
      controlsRef.current.update()
    }
  })

  return <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
}

// SolarSystem component
export default function SolarSystem() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null)
  const [cameraTarget, setCameraTarget] = useState<Vector3>(new Vector3(0, 0, 0))

  const handlePlanetClick = (planet: PlanetData) => {
    setSelectedPlanet(planet)
    const targetPosition = new Vector3(planet.distance * SCALE_FACTOR, 0, 0)
    setCameraTarget(targetPosition)
  }

  const resetView = () => {
    setSelectedPlanet(null)
    setCameraTarget(new Vector3(0, 0, 0))
  }

  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ position: [0, 200 * SCALE_FACTOR, 500 * SCALE_FACTOR], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 0, 0]} intensity={1} />
          <Stars radius={1000 * SCALE_FACTOR} depth={50} count={5000} factor={4} saturation={0} fade />
          <Sun />
          {planets.map((planet) => (
            <Planet
              key={planet.name}
              {...planet}
              scaleFactor={SCALE_FACTOR}
              sizeMultiplier={SIZE_MULTIPLIER}
              isSelected={selectedPlanet?.name === planet.name}
              onClick={() => handlePlanetClick(planet)}
            />
          ))}
          <CameraController target={cameraTarget} />
        </Suspense>
      </Canvas>
      <div className="absolute top-5 left-5 space-y-2">
        <Button onClick={resetView}>View Full Solar System</Button>
        {planets.map((planet) => (
          <Button key={planet.name} onClick={() => handlePlanetClick(planet)}>
            {planet.name}
          </Button>
        ))}
      </div>
      {selectedPlanet && (
        <Card className="absolute bottom-5 right-5 w-80">
          <CardHeader>
            <CardTitle>{selectedPlanet.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Distance from Sun: {selectedPlanet.distance} million km</p>
            <p>Diameter: {(selectedPlanet.size * 12742).toFixed(0)} km</p>
          </CardContent>
        </Card>
      )}
      <div className="absolute bottom-5 left-5 text-white">
        <p>Use mouse to rotate, scroll to zoom, and right-click to pan</p>
      </div>
    </div>
  )
}
