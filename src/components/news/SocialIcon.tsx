import Image from 'next/image'
import { FooterIcon } from '@/components/layout/FooterIcon'

export function SocialIcon({ name }: { name: string }) {
  if (name === 'linkedin' || name === 'youtube') return <FooterIcon name={name} />
  return (
    <Image
      src={`/brand/social/${name}.svg`}
      alt=""
      width={28}
      height={28}
      unoptimized
      aria-hidden="true"
    />
  )
}
