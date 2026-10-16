'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './GovernancePage.module.css'

export function AdaptiveOrganisationText({ paragraphs }: { paragraphs: string[] }) {
  const root = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(1)

  useEffect(() => {
    const element = root.current
    const reference = element?.previousElementSibling
    if (!element || !reference || !('ResizeObserver' in window)) return

    const measure = () => {
      const available = reference.getBoundingClientRect()
      const bounds = element.getBoundingClientRect()
      // A stacked introduction needs only the concise version.
      if (Math.abs(bounds.top - available.top) > 2) {
        setCount(1)
        return
      }
      const probe = document.createElement('div')
      probe.className = styles.organisationTextProbe
      probe.setAttribute('aria-hidden', 'true')
      element.append(probe)
      let fitting = 1
      for (const [index, text] of paragraphs.entries()) {
        const paragraph = document.createElement('p')
        paragraph.textContent = text
        probe.append(paragraph)
        if (probe.getBoundingClientRect().height > available.height) break
        fitting = index + 1
      }
      probe.remove()
      setCount(fitting)
    }
    const observer = new ResizeObserver(measure)
    observer.observe(reference)
    observer.observe(element)
    measure()
    return () => observer.disconnect()
  }, [paragraphs])

  return (
    <div ref={root} className={`${styles.reading} ${styles.organisationReading}`}>
      {paragraphs.slice(0, count).map((text) => (
        <p key={text}>{text}</p>
      ))}
    </div>
  )
}
