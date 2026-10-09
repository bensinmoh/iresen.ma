import Image from 'next/image'
import { heroImages, type HeroPhotoId } from '@/lib/hero-images'

export function HeroPhoto({ photo, split }: { photo: HeroPhotoId; split: boolean }) {
  const image = heroImages[photo]
  // Cover scales by both dimensions. Width-only sizes undersample tall heroes.
  const heightWidth = `${((image.width / image.height) * 100).toFixed(2)}dvh`
  const desktopSizes = split
    ? `(min-width: 70rem) max(58vw, ${heightWidth}, 75rem), max(100vw, ${heightWidth}, 75rem)`
    : `max(100vw, ${heightWidth}, 75rem)`

  return (
    <picture>
      {/* Keep every available pixel when narrow heroes grow for content. */}
      <source media="(max-width: 40rem)" srcSet={image.mobile.src} />
      <Image
        src={image.src}
        alt=""
        fill
        sizes={desktopSizes}
        quality={90}
        loading="eager"
        fetchPriority="high"
        className="hero-photo"
      />
    </picture>
  )
}
