'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import styles from './InnovationSection.module.css'

export function InnovationRail({ children, label }: { children: ReactNode; label: string }) {
  const rail = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const element = rail.current!
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let direction = 1
    let hovered = false
    let touching = false
    let timer: number
    const restart = () => {
      window.clearInterval(timer)
      timer = window.setInterval(() => {
        if (
          document.hidden ||
          motion.matches ||
          hovered ||
          touching ||
          element === document.activeElement
        )
          return
        const position = Math.abs(element.scrollLeft)
        const maximum = element.scrollWidth - element.clientWidth
        if (maximum <= 2) return
        if (position >= maximum - 2) direction = -1
        else if (position < 2) direction = 1
        const style = getComputedStyle(element)
        const step =
          element.firstElementChild!.getBoundingClientRect().width + parseFloat(style.columnGap)
        element.scrollBy({
          left: step * direction * (style.direction === 'rtl' ? -1 : 1),
          behavior: 'smooth',
        })
      }, 6000)
    }
    const enter = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') hovered = true
    }
    const leave = () => {
      hovered = false
      touching = false
      restart()
    }
    const down = () => {
      touching = true
    }
    const up = () => {
      touching = false
      restart()
    }
    const motionChanged = () => {
      if (motion.matches) element.scrollTo({ left: element.scrollLeft, behavior: 'instant' })
      restart()
    }
    restart()
    element.addEventListener('pointerenter', enter)
    element.addEventListener('pointerleave', leave)
    element.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    element.addEventListener('wheel', restart, { passive: true })
    element.addEventListener('blur', restart)
    motion.addEventListener('change', motionChanged)
    return () => {
      window.clearInterval(timer)
      element.removeEventListener('pointerenter', enter)
      element.removeEventListener('pointerleave', leave)
      element.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      element.removeEventListener('wheel', restart)
      element.removeEventListener('blur', restart)
      motion.removeEventListener('change', motionChanged)
    }
  }, [])
  return (
    <ol ref={rail} className={`${styles.steps} horizontal-scroll`} aria-label={label} tabIndex={0}>
      {children}
    </ol>
  )
}
