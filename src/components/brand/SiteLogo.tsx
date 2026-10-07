import Image from 'next/image'

export function SiteLogo({
  variant = 'color',
  eager = false,
}: {
  variant?: 'color' | 'dark'
  eager?: boolean
}) {
  return (
    <Image
      src={`/brand/logo-${variant}.svg`}
      alt="IRESEN"
      width={696}
      height={195}
      className="site-logo"
      unoptimized
      loading={eager ? 'eager' : 'lazy'}
    />
  )
}
