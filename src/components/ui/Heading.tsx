import type { ComponentPropsWithoutRef } from 'react'
import styles from './Heading.module.css'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
type HeadingSize = 'section' | 'display' | 'card' | 'compact' | 'label' | 'mission'

/** Heading rank follows the document; size follows the editorial role. */
export function Heading({
  as: Tag = 'h2',
  size = Tag === 'h2' ? 'section' : 'card',
  className,
  ...props
}: ComponentPropsWithoutRef<'h2'> & { as?: HeadingTag; size?: HeadingSize }) {
  return (
    <Tag
      {...props}
      className={[styles.heading, className].filter(Boolean).join(' ')}
      data-ui-heading={size}
    />
  )
}
