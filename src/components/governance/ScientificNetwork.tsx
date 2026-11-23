'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import styles from './GovernancePage.module.css'

// Editorial positions connect expertise, not verified residences or affiliations.
const links = [
  'M500 167Q250 250 167 500T167 833',
  'M500 167V833',
  'M500 167Q750 250 833 500T833 833',
  'M167 500Q500 360 833 500',
  'M167 833Q500 710 833 833',
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
        data-structural-diagram="scientific-network"
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
