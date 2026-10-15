import { Graph } from '@phosphor-icons/react/dist/ssr/Graph'
import { PaperPlaneTilt } from '@phosphor-icons/react/dist/ssr/PaperPlaneTilt'
import { Target } from '@phosphor-icons/react/dist/ssr/Target'
import { UploadSimple } from '@phosphor-icons/react/dist/ssr/UploadSimple'
import { Waveform } from '@phosphor-icons/react/dist/ssr/Waveform'
import { SiteIcon } from '@/components/ui/SiteIcon'
const icons = {
  impact: Target,
  equipment: Waveform,
  ecosystem: Graph,
  internship: PaperPlaneTilt,
  upload: UploadSimple,
} as const
export function CareersIcon({ name }: { name: keyof typeof icons }) {
  return <SiteIcon icon={icons[name]} size={28} />
}
