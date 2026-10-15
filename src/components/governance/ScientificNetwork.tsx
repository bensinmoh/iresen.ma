'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import styles from './GovernancePage.module.css'

// Editorial positions connect expertise, not verified residences or affiliations.
const links = [
  'M125 167Q292 100 458 167T792 167',
  'M125 167Q160 380 292 500T458 833',
  'M458 167Q410 360 292 500T125 833',
  'M458 167Q735 260 792 500T792 833',
  'M792 167Q545 260 292 500Q510 750 792 833',
  'M125 833Q292 760 458 833T792 833',
  'M292 500Q542 425 792 500',
]

export function ScientificNetwork({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const element = root.current
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    if (!element || !('IntersectionObserver' in window)) return
    let visible = false
    const update = () => {
      if (visible && !reduced.matches) element.dataset.networkActive = 'true'
      else delete element.dataset.networkActive
    }
    reduced.addEventListener('change', update)
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((entry) => entry.isIntersecting)
        update()
      },
      { threshold: 0.05 },
    )
    observer.observe(element)
    return () => {
      observer.disconnect()
      reduced.removeEventListener('change', update)
    }
  }, [])

  return (
    <div ref={root} className={styles.scientists} data-motion-owned data-illustrative-network>
      <svg
        className={styles.scienceConnections}
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <g className={styles.networkLines}>
          {links.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g className={styles.networkPulse}>
          {links.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </svg>
      {children}
    </div>
  )
}
