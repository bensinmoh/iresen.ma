import { CaretLeft } from '@phosphor-icons/react/dist/ssr/CaretLeft'
import { CaretRight } from '@phosphor-icons/react/dist/ssr/CaretRight'
import { DownloadSimple } from '@phosphor-icons/react/dist/ssr/DownloadSimple'
import { X } from '@phosphor-icons/react/dist/ssr/X'
import { SiteIcon } from '@/components/ui/SiteIcon'
const icons = {
  close: X,
  previous: CaretLeft,
  next: CaretRight,
  download: DownloadSimple,
} as const
export function ViewerIcon({ name }: { name: keyof typeof icons }) {
  return <SiteIcon icon={icons[name]} size={24} />
}
