import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const planetInfo = {
  Mercury: "Mercury is the smallest planet in the Solar System and the closest to the Sun.",
  Venus: "Venus is the second planet from the Sun and is Earth's closest planetary neighbor.",
  Earth: "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
  Mars: "Mars is the fourth planet from the Sun and is often described as the 'Red Planet'.",
  Jupiter: "Jupiter is the fifth planet from the Sun and the largest in the Solar System.",
  Saturn: "Saturn is the sixth planet from the Sun and the second-largest in the Solar System.",
  Uranus: "Uranus is the seventh planet from the Sun and is the third-largest planetary radius and fourth-largest planetary mass in the Solar System.",
  Neptune: "Neptune is the eighth and farthest-known Solar planet from the Sun."
}

interface InfoPanelProps {
  planetName: keyof typeof planetInfo; // Ensures planetName matches the keys of planetInfo
}

export default function InfoPanel({ planetName }: InfoPanelProps) {
  return (
    <Card className="absolute bottom-5 right-5 w-80">
      <CardHeader>
        <CardTitle>{planetName}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{planetInfo[planetName]}</p>
      </CardContent>
    </Card>
  )
}
