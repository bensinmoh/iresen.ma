import type { ReactNode } from 'react'
import styles from './SectionEyebrow.module.css'

export function SectionEyebrow({
  children,
  id,
  tone = 'blue',
  centered = false,
}: {
  children: ReactNode
  id?: string
  tone?: 'blue' | 'white' | 'cyan' | 'navy'
  centered?: boolean
}) {
  return (
    <p
      id={id}
      className={styles.eyebrow}
      data-section-eyebrow
      data-tone={tone}
      data-centered={centered || undefined}
    >
      <span className={styles.leaf} aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}
