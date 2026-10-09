'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import styles from './NewsSection.module.css'

export function NewsRail({
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
  const [edges, setEdges] = useState({ start: true, end: false })

  useEffect(() => {
    const element = rail.current!
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
    const style = getComputedStyle(element)
    const rtl = style.direction === 'rtl'
    const step =
      element.firstElementChild!.getBoundingClientRect().width + parseFloat(style.columnGap)
    element.scrollBy({
      left: step * direction * (rtl ? -1 : 1),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }

  return (
    <>
      <ul ref={rail} id="home-news-posts" className={styles.rail} aria-label={label}>
        {children}
      </ul>
      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={edges.start}
          aria-label={previous}
          aria-controls="home-news-posts"
          className={styles.previous}
        >
          <NavigationIcon name="arrow" />
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={edges.end}
          aria-label={next}
          aria-controls="home-news-posts"
        >
          <NavigationIcon name="arrow" />
        </button>
      </div>
    </>
  )
}
