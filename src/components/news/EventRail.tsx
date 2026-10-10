'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { Locale } from '@/i18n/locales'
import styles from './EventRail.module.css'

export function EventRail({
  children,
  className,
  locale,
  label,
  navigationLabel,
  itemLabels,
}: {
  children: ReactNode
  className: string
  locale: Locale
  label: string
  navigationLabel: string
  itemLabels: string[]
}) {
  const rail = useRef<HTMLDivElement>(null)
  const id = useId()
  const requested = useRef<number | null>(null)
  const [position, setPosition] = useState({
    stops: [] as number[],
    current: 0,
    ready: false,
    overflow: false,
  })
  useEffect(() => {
    const element = rail.current
    if (!element) return
    let frame = 0
    const measure = () => {
      const maximum = Math.max(0, element.scrollWidth - element.clientWidth)
      const cards = Array.from(element.children)
      const first = cards[0]?.getBoundingClientRect()
      const stops = cards.map((card) => {
        const rect = card.getBoundingClientRect()
        const offset = first
          ? locale === 'ar'
            ? first.right - rect.right
            : rect.left - first.left
          : 0
        return Math.min(maximum, Math.max(0, offset))
      })
      const offset = Math.min(maximum, Math.max(0, element.scrollLeft * (locale === 'ar' ? -1 : 1)))
      const selected = requested.current
      const current =
        selected !== null && Math.abs(stops[selected] - offset) < 1
          ? selected
          : maximum > 1 && maximum - offset < 1
            ? stops.length - 1
            : stops.reduce(
                (nearest, stop, index) =>
                  Math.abs(stop - offset) < Math.abs(stops[nearest] - offset) ? index : nearest,
                0,
              )
      setPosition((previous) =>
        previous.ready &&
        previous.current === current &&
        previous.overflow === maximum > 1 &&
        previous.stops.length === stops.length &&
        previous.stops.every((stop, index) => Math.abs(stop - stops[index]) < 0.5)
          ? previous
          : { stops, current, ready: true, overflow: maximum > 1 },
      )
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    const clearRequest = () => {
      requested.current = null
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(element)
    for (const card of element.children) observer.observe(card)
    element.addEventListener('scroll', schedule, { passive: true })
    for (const event of ['wheel', 'pointerdown', 'keydown'])
      element.addEventListener(event, clearRequest, { passive: true })
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      element.removeEventListener('scroll', schedule)
      for (const event of ['wheel', 'pointerdown', 'keydown'])
        element.removeEventListener(event, clearRequest)
    }
  }, [locale, itemLabels.length])
  const goTo = (index: number) => {
    requested.current = index
    setPosition((previous) => ({ ...previous, current: index }))
    rail.current?.scrollTo({
      left: position.stops[index] * (locale === 'ar' ? -1 : 1),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }
  return (
    <>
      <div
        ref={rail}
        id={id}
        className={`${className} ${position.ready ? styles.enhanced : ''}`}
        role="region"
        aria-label={label}
        tabIndex={0}
        data-event-rail
      >
        {children}
      </div>
      {position.overflow && itemLabels.length > 1 && (
        <div
          className={styles.controls}
          role="group"
          aria-label={navigationLabel}
          data-event-navigation
        >
          {itemLabels.map((itemLabel, index) => (
            <button
              key={itemLabel}
              type="button"
              className={styles.pill}
              aria-label={itemLabel}
              aria-controls={id}
              aria-current={index === position.current ? 'true' : undefined}
              onClick={() => goTo(index)}
            />
          ))}
        </div>
      )}
    </>
  )
}
