import type { Icon, IconProps } from '@phosphor-icons/react'

/** Decorative regular-weight SVG. The enclosing control owns its accessible name. */
export function SiteIcon({
  icon: Artwork,
  size = 24,
  ...props
}: Omit<IconProps, 'weight' | 'alt'> & { icon: Icon }) {
  return (
    <Artwork
      {...props}
      size={size}
      className={['site-icon', props.className].filter(Boolean).join(' ')}
      weight="regular"
      color="currentColor"
      aria-hidden="true"
      focusable="false"
      data-icon-set="phosphor"
    />
  )
}
