'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import styles from './InstitutePage.module.css'

export function TimelineRail({
  children,
  label,
  previous,
  next,
}: {
  children: ReactNode
  label: string
  previous: string
  next: string
}) {
  const rail = useRef<HTMLOListElement>(null)
  const controls = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })
  useEffect(() => {
    const element = rail.current!
    controls.current!.hidden = false
    const update = () => {
      const position = Math.abs(element.scrollLeft)
      setEdges({
        start: position < 2,
        end: position + element.clientWidth >= element.scrollWidth - 2,
      })
    }
    update()
    element.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => {
      element.removeEventListener('scroll', update)
      observer.disconnect()
    }
  }, [])
  function move(direction: number) {
    const element = rail.current!
    const step =
      element.firstElementChild!.getBoundingClientRect().width +
      parseFloat(getComputedStyle(element).columnGap)
    element.scrollBy({
      left: step * direction * (getComputedStyle(element).direction === 'rtl' ? -1 : 1),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }
  return (
    <>
      <ol
        ref={rail}
        id="institute-history-rail"
        className={`${styles.timeline} horizontal-scroll`}
        reversed
        tabIndex={0}
        aria-label={label}
      >
        {children}
      </ol>
      <div ref={controls} className={styles.timelineControls} hidden>
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={edges.start}
          aria-label={previous}
          aria-controls="institute-history-rail"
          className={styles.previous}
        >
          <NavigationIcon name="arrow" />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={edges.end}
          aria-label={next}
          aria-controls="institute-history-rail"
        >
          <NavigationIcon name="arrow" />
        </button>
      </div>
    </>
  )
}
