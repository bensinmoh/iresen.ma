'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import styles from './InstitutePage.module.css'
import railStyles from './TimelineRail.module.css'

export function TimelineRail({
  children,
  label,
  previous,
  next,
  progressLabel,
  direction,
}: {
  children: ReactNode
  label: string
  previous: string
  next: string
  progressLabel: string
  direction: 'ltr' | 'rtl'
}) {
  const rail = useRef<HTMLOListElement>(null)
  const controls = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })
  const [pagination, setPagination] = useState({ current: 1, total: 1 })
  const pageStep = useRef(0)
  useEffect(() => {
    const element = rail.current!
    controls.current!.hidden = false
    const update = () => {
      const position = Math.abs(element.scrollLeft)
      const step =
        element.firstElementChild!.getBoundingClientRect().width +
        parseFloat(getComputedStyle(element).columnGap)
      pageStep.current = step
      const total = element.children.length
      const atEnd = position + element.clientWidth >= element.scrollWidth - 2
      setPagination({
        current: atEnd
          ? total
          : Math.min(total, Math.floor((position + step / 2) / pageStep.current) + 1),
        total,
      })
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
  }, [direction])
  function move(direction: number) {
    const element = rail.current!
    element.scrollTo({
      left:
        Math.max(
          0,
          Math.min(
            element.scrollWidth - element.clientWidth,
            Math.abs(element.scrollLeft) + pageStep.current * direction,
          ),
        ) * (getComputedStyle(element).direction === 'rtl' ? -1 : 1),
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
        dir={direction}
        tabIndex={0}
        aria-label={label}
      >
        {children}
      </ol>
      <div
        ref={controls}
        className={`${styles.timelineControls} ${railStyles.controls}`}
        dir={direction}
        hidden
      >
        <div
          className={styles.timelineProgress}
          role="progressbar"
          aria-label={progressLabel}
          aria-valuemin={1}
          aria-valuemax={pagination.total}
          aria-valuenow={pagination.current}
          aria-valuetext={`${pagination.current}/${pagination.total}`}
        >
          <span style={{ width: `${(pagination.current / pagination.total) * 100}%` }} />
        </div>
        <span className={styles.timelineCounter} aria-hidden="true">
          {pagination.current}/{pagination.total}
        </span>
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
