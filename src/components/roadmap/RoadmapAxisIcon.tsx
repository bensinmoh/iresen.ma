import type { RoadmapDomain } from '@/lib/roadmap'
import { ArrowsClockwise } from '@phosphor-icons/react/dist/ssr/ArrowsClockwise'
import { Atom } from '@phosphor-icons/react/dist/ssr/Atom'
import { BatteryCharging } from '@phosphor-icons/react/dist/ssr/BatteryCharging'
import { BatteryFull } from '@phosphor-icons/react/dist/ssr/BatteryFull'
import { Buildings } from '@phosphor-icons/react/dist/ssr/Buildings'
import { Bus } from '@phosphor-icons/react/dist/ssr/Bus'
import { ChargingStation } from '@phosphor-icons/react/dist/ssr/ChargingStation'
import { ChartLine } from '@phosphor-icons/react/dist/ssr/ChartLine'
import { Circuitry } from '@phosphor-icons/react/dist/ssr/Circuitry'
import { Drop } from '@phosphor-icons/react/dist/ssr/Drop'
import { Factory } from '@phosphor-icons/react/dist/ssr/Factory'
import { Fan } from '@phosphor-icons/react/dist/ssr/Fan'
import { Flame } from '@phosphor-icons/react/dist/ssr/Flame'
import { Globe } from '@phosphor-icons/react/dist/ssr/Globe'
import { House } from '@phosphor-icons/react/dist/ssr/House'
import { Leaf } from '@phosphor-icons/react/dist/ssr/Leaf'
import { Lightning } from '@phosphor-icons/react/dist/ssr/Lightning'
import { Path } from '@phosphor-icons/react/dist/ssr/Path'
import { Plant } from '@phosphor-icons/react/dist/ssr/Plant'
import { Plug } from '@phosphor-icons/react/dist/ssr/Plug'
import { PottedPlant } from '@phosphor-icons/react/dist/ssr/PottedPlant'
import { Recycle } from '@phosphor-icons/react/dist/ssr/Recycle'
import { SolarPanel } from '@phosphor-icons/react/dist/ssr/SolarPanel'
import { Sun } from '@phosphor-icons/react/dist/ssr/Sun'
import { Thermometer } from '@phosphor-icons/react/dist/ssr/Thermometer'
import { Truck } from '@phosphor-icons/react/dist/ssr/Truck'
import { SiteIcon } from '@/components/ui/SiteIcon'
const icons = {
  'solar-panel': SolarPanel,
  'battery-charging': BatteryCharging,
  network: Globe,
  plug: Plug,
  bolt: Lightning,
  droplet: Drop,
  truck: Truck,
  'building-factory-2': Factory,
  temperature: Thermometer,
  'circuit-switch-open': Circuitry,
  'atom-2': Atom,
  'chart-line': ChartLine,
  plant: Plant,
  refresh: ArrowsClockwise,
  leaf: Leaf,
  'plant-2': PottedPlant,
  flame: Flame,
  recycle: Recycle,
  home: House,
  'air-conditioning': Fan,
  'building-community': Buildings,
  'sun-high': Sun,
  bus: Bus,
  'charging-pile': ChargingStation,
  battery: BatteryFull,
  route: Path,
} as const
const axes: Record<RoadmapDomain, readonly (keyof typeof icons)[]> = {
  renewables: ['solar-panel', 'battery-charging', 'network', 'plug'],
  hydrogen: ['bolt', 'droplet', 'truck', 'building-factory-2'],
  industry: ['temperature', 'circuit-switch-open', 'atom-2', 'chart-line'],
  water: ['droplet', 'plant', 'refresh', 'solar-panel'],
  circular: ['leaf', 'plant-2', 'flame', 'recycle'],
  buildings: ['home', 'air-conditioning', 'building-community', 'sun-high'],
  mobility: ['bus', 'charging-pile', 'battery', 'route'],
}

export function RoadmapAxisIcon({
  theme,
  axis,
  className,
}: {
  theme: RoadmapDomain
  axis: number
  className?: string
}) {
  return <SiteIcon icon={icons[axes[theme][axis]]} className={className} />
}
