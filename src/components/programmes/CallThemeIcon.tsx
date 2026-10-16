import type { Icon } from '@phosphor-icons/react'
import { SunHorizon } from '@phosphor-icons/react/dist/ssr/SunHorizon'
import { Thermometer } from '@phosphor-icons/react/dist/ssr/Thermometer'
import { Sun } from '@phosphor-icons/react/dist/ssr/Sun'
import { Wind } from '@phosphor-icons/react/dist/ssr/Wind'
import { Plant } from '@phosphor-icons/react/dist/ssr/Plant'
import { Leaf } from '@phosphor-icons/react/dist/ssr/Leaf'
import { Gauge } from '@phosphor-icons/react/dist/ssr/Gauge'
import { Lightbulb } from '@phosphor-icons/react/dist/ssr/Lightbulb'
import { ArrowsLeftRight } from '@phosphor-icons/react/dist/ssr/ArrowsLeftRight'
import { BatteryCharging } from '@phosphor-icons/react/dist/ssr/BatteryCharging'
import { Cpu } from '@phosphor-icons/react/dist/ssr/Cpu'
import { Network } from '@phosphor-icons/react/dist/ssr/Network'
import { Lightning } from '@phosphor-icons/react/dist/ssr/Lightning'
import { Buildings } from '@phosphor-icons/react/dist/ssr/Buildings'
import { BuildingOffice } from '@phosphor-icons/react/dist/ssr/BuildingOffice'
import { Atom } from '@phosphor-icons/react/dist/ssr/Atom'
import { SiteIcon } from '@/components/ui/SiteIcon'

const themeIcons: Record<string, readonly [Icon, Icon]> = {
  thermal: [SunHorizon, Thermometer],
  pvwind: [Sun, Wind],
  thermalbio: [SunHorizon, Plant],
  maghrenov: [Leaf, Gauge],
  innoprojets: [Sun, Wind],
  project: [Leaf, Plant],
  boost: [Lightbulb, ArrowsLeftRight],
  espamaroc: [Sun, BatteryCharging],
  micall: [Cpu, Network],
  leapre: [Sun, Lightning],
  omrane: [Buildings, BuildingOffice],
  h2: [Atom, ArrowsLeftRight],
  leapse: [Network, Atom],
}

/** Decorative SVGs supplement the original localized topic labels. */
export function CallThemeIcon({ profile, index }: { profile: string; index: number }) {
  const pair = themeIcons[profile] || themeIcons.project!
  return <SiteIcon icon={pair[index === 0 ? 0 : 1]} size={48} />
}
