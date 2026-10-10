'use client'

import { useEffect, useRef, type ReactNode } from 'react'

// Measure real localized copy so the title can move to the bottom without
// changing card geometry or imposing a fixed height on translations.
export function PlatformCard({
  id,
  className,
  children,
}: {
  id: string
  className: string
  children: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const card = ref.current
    const details = card?.querySelector<HTMLElement>('[data-platform-details]')
    if (!card || !details) return
    const title = card.querySelector('h3')
    const measure = () => {
      card.style.setProperty('--platform-title-travel', `${details.offsetHeight}px`)
      card.style.setProperty('--platform-title-height', `${title?.offsetHeight ?? 0}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(details)
    if (title) observer.observe(title)
    return () => observer.disconnect()
  }, [])
  return (
    <article ref={ref} id={id} aria-labelledby={`${id}-heading`} className={className}>
      {children}
    </article>
  )
}
