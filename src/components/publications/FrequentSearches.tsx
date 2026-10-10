'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './PublicationsPage.module.css'

/** Keep the highest-frequency prefix that fits two actual text lines. */
export function FrequentSearches({
  label,
  links,
}: {
  label: string
  links: { label: string; href: string }[]
}) {
  const probe = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(links.length)
  useEffect(() => {
    const element = probe.current
    if (!element) return
    let frame = 0
    const measure = () => {
      if (!window.matchMedia('(max-width: 64rem)').matches) {
        setCount(links.length)
        return
      }
      const lineTops: number[] = []
      let visible = 0
      for (const [index, child] of Array.from(element.children).entries()) {
        const range = document.createRange()
        range.selectNodeContents(child)
        for (const rect of range.getClientRects()) {
          if (!lineTops.some((top) => Math.abs(top - rect.top) < 2)) lineTops.push(rect.top)
        }
        if (lineTops.length > 2) break
        if (index > 0) visible++
      }
      setCount(visible)
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(element)
    for (const child of element.children) observer.observe(child)
    const media = window.matchMedia('(max-width: 64rem)')
    media.addEventListener('change', schedule)
    void document.fonts.ready.then(schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      media.removeEventListener('change', schedule)
    }
  }, [links.length, label])
  return (
    <div className={styles.frequentWrap}>
      <div className={styles.frequent} data-frequent-searches>
        <span>{label} :</span>
        {links.slice(0, count).map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
      <div ref={probe} className={`${styles.frequent} ${styles.frequentProbe}`} aria-hidden="true">
        <span>{label} :</span>
        {links.map((link) => (
          <span className={styles.frequentTopic} key={link.href}>
            {link.label}
          </span>
        ))}
      </div>
    </div>
  )
}
