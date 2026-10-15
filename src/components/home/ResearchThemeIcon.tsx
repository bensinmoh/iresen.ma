import { Buildings } from '@phosphor-icons/react/dist/ssr/Buildings'
import { Car } from '@phosphor-icons/react/dist/ssr/Car'
import { Drop } from '@phosphor-icons/react/dist/ssr/Drop'
import { Factory } from '@phosphor-icons/react/dist/ssr/Factory'
import { Flask } from '@phosphor-icons/react/dist/ssr/Flask'
import { Recycle } from '@phosphor-icons/react/dist/ssr/Recycle'
import { SolarPanel } from '@phosphor-icons/react/dist/ssr/SolarPanel'
import { SiteIcon } from '@/components/ui/SiteIcon'
const icons = {
  renewables: SolarPanel,
  hydrogen: Flask,
  industry: Factory,
  water: Drop,
  circular: Recycle,
  buildings: Buildings,
  mobility: Car,
} as const
export function ResearchThemeIcon({ theme }: { theme: keyof typeof icons }) {
  return <SiteIcon icon={icons[theme]} size={24} />
}
