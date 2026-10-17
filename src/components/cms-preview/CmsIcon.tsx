import { Star } from '@phosphor-icons/react/dist/ssr/Star'
import { PencilSimple } from '@phosphor-icons/react/dist/ssr/PencilSimple'
import { ClipboardText } from '@phosphor-icons/react/dist/ssr/ClipboardText'
import { Trash } from '@phosphor-icons/react/dist/ssr/Trash'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr/ArrowLeft'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr/ArrowRight'
import { CalendarBlank } from '@phosphor-icons/react/dist/ssr/CalendarBlank'
import { CaretRight } from '@phosphor-icons/react/dist/ssr/CaretRight'
import { Check } from '@phosphor-icons/react/dist/ssr/Check'
import { Clock } from '@phosphor-icons/react/dist/ssr/Clock'
import { FileText } from '@phosphor-icons/react/dist/ssr/FileText'
import { VideoCamera } from '@phosphor-icons/react/dist/ssr/VideoCamera'
import { FolderOpen } from '@phosphor-icons/react/dist/ssr/FolderOpen'
import { Flask } from '@phosphor-icons/react/dist/ssr/Flask'
import { Globe } from '@phosphor-icons/react/dist/ssr/Globe'
import { Images } from '@phosphor-icons/react/dist/ssr/Images'
import { Link } from '@phosphor-icons/react/dist/ssr/Link'
import { List } from '@phosphor-icons/react/dist/ssr/List'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass'
import { Plus } from '@phosphor-icons/react/dist/ssr/Plus'
import { ShieldCheck } from '@phosphor-icons/react/dist/ssr/ShieldCheck'
import { SlidersHorizontal } from '@phosphor-icons/react/dist/ssr/SlidersHorizontal'
import { SquaresFour } from '@phosphor-icons/react/dist/ssr/SquaresFour'
import { TreeStructure } from '@phosphor-icons/react/dist/ssr/TreeStructure'
import { UploadSimple } from '@phosphor-icons/react/dist/ssr/UploadSimple'
import { Users } from '@phosphor-icons/react/dist/ssr/Users'
import { X } from '@phosphor-icons/react/dist/ssr/X'
import { SiteIcon } from '@/components/ui/SiteIcon'
const icons = {
  star: Star,
  edit: PencilSimple,
  review: ClipboardText,
  trash: Trash,
  dashboard: SquaresFour,
  document: FileText,
  folder: FolderOpen,
  video: VideoCamera,
  calendar: CalendarBlank,
  media: Images,
  research: Flask,
  network: TreeStructure,
  users: Users,
  settings: SlidersHorizontal,
  search: MagnifyingGlass,
  plus: Plus,
  arrow: ArrowRight,
  back: ArrowLeft,
  close: X,
  check: Check,
  globe: Globe,
  menu: List,
  chevron: CaretRight,
  upload: UploadSimple,
  clock: Clock,
  shield: ShieldCheck,
  link: Link,
} as const
export type IconName = keyof typeof icons
export function CmsIcon({ name, filled = false }: { name: keyof typeof icons; filled?: boolean }) {
  if (name === 'star' && filled)
    return (
      <Star
        size={20}
        weight="fill"
        color="currentColor"
        className="site-icon"
        aria-hidden="true"
        focusable="false"
        data-icon-set="phosphor"
        data-icon-weight="fill"
      />
    )
  return <SiteIcon icon={icons[name]} size={20} />
}
