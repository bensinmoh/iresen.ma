'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import styles from './AchievementsSection.module.css'

const automaticInterval = 6000

function subscribeToMotionPreference(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}

function moveCard(element: HTMLUListElement, direction: number) {
  const style = getComputedStyle(element)
  const step =
    element.firstElementChild!.getBoundingClientRect().width + parseFloat(style.columnGap)
  element.scrollBy({
    left: step * direction * (style.direction === 'rtl' ? -1 : 1),
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })
}

export function AchievementsRail({
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
  const rail = useRef<HTMLUListElement>(null)
  const controls = useRef<HTMLDivElement>(null)
  const automaticDirection = useRef(1)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [manualStep, setManualStep] = useState(0)
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )
  const [edges, setEdges] = useState({ start: true, end: false, progress: 0 })

  useEffect(() => {
    controls.current!.hidden = false
    const element = rail.current!
    const update = () => {
      const position = Math.abs(element.scrollLeft)
      setEdges({
        start: position < 2,
        progress:
          element.scrollWidth > element.clientWidth
            ? position / (element.scrollWidth - element.clientWidth)
            : 0,
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

  useEffect(() => {
    if (hovered || focused || reducedMotion) return
    const timer = window.setInterval(() => {
      if (document.hidden) return
      const element = rail.current!
      const position = Math.abs(element.scrollLeft)
      const maximum = element.scrollWidth - element.clientWidth
      if (maximum <= 2) return
      if (position >= maximum - 2) automaticDirection.current = -1
      else if (position < 2) automaticDirection.current = 1
      moveCard(element, automaticDirection.current)
    }, automaticInterval)
    return () => window.clearInterval(timer)
  }, [hovered, focused, reducedMotion, manualStep])

  function move(direction: number) {
    automaticDirection.current = direction
    moveCard(rail.current!, direction)
    setManualStep((step) => step + 1)
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
      }}
    >
      <ul ref={rail} id="home-achievements" className={styles.rail} aria-label={label} tabIndex={0}>
        {children}
      </ul>
      <div ref={controls} className={styles.controls} hidden>
        <div className={styles.progress} aria-hidden="true">
          <span style={{ width: `${12.5 + edges.progress * 87.5}%` }} />
        </div>
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={edges.start}
          aria-label={previous}
          aria-controls="home-achievements"
          className={styles.previous}
        >
          <NavigationIcon name="arrow" />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={edges.end}
          aria-label={next}
          aria-controls="home-achievements"
        >
          <NavigationIcon name="arrow" />
        </button>
      </div>
    </div>
  )
}
