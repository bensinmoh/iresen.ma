import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr/ArrowUpRight'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr/ArrowRight'
import { CaretDown } from '@phosphor-icons/react/dist/ssr/CaretDown'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass'
import { SiteIcon } from '@/components/ui/SiteIcon'
const icons = {
  search: MagnifyingGlass,
  chevron: CaretDown,
  arrow: ArrowRight,
  'arrow-up-right': ArrowUpRight,
} as const
export function NavigationIcon({ name }: { name: keyof typeof icons }) {
  return (
    <SiteIcon icon={icons[name]} size={20} className={`navigation-icon navigation-icon-${name}`} />
  )
}
