import { ArrowsLeftRight } from '@phosphor-icons/react/dist/ssr/ArrowsLeftRight'
import { Certificate } from '@phosphor-icons/react/dist/ssr/Certificate'
import { ChartLine } from '@phosphor-icons/react/dist/ssr/ChartLine'
import { Factory } from '@phosphor-icons/react/dist/ssr/Factory'
import { Flask } from '@phosphor-icons/react/dist/ssr/Flask'
import { Lightbulb } from '@phosphor-icons/react/dist/ssr/Lightbulb'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass'
import { RocketLaunch } from '@phosphor-icons/react/dist/ssr/RocketLaunch'
import { ShieldCheck } from '@phosphor-icons/react/dist/ssr/ShieldCheck'
import { SiteIcon } from '@/components/ui/SiteIcon'
const icons = {
  search: MagnifyingGlass,
  'chart-line': ChartLine,
  'shield-lock': ShieldCheck,
  flask: Flask,
  'arrows-exchange': ArrowsLeftRight,
  rocket: RocketLaunch,
  'file-certificate': Certificate,
  'building-factory-2': Factory,
  bulb: Lightbulb,
} as const
export type ValorisationIconName = keyof typeof icons
export function ValorisationIcon({
  name,
  className,
}: {
  name: keyof typeof icons
  className?: string
}) {
  return <SiteIcon icon={icons[name]} size={24} className={className} />
}
