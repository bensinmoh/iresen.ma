'use client'

import { useEffect, useRef } from 'react'
import styles from './HeroScrollCue.module.css'

const firstIdle = 5000
const repeatIdle = 15000
const displayTime = 6500

export function HeroScrollCue({
  label,
  tone = 'white',
}: {
  label: string
  tone?: 'white' | 'blue'
}) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cue = root.current
    if (!cue) return
    cue.dataset.ready = 'true'
    const scene = cue.closest('.hero-scene')
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer = 0
    let exitTimer = 0
    let shown = false

    function schedule() {
      window.clearTimeout(timer)
      if (document.hidden || motion.matches) return
      timer = window.setTimeout(reveal, shown ? repeatIdle : firstIdle)
    }
    function hide() {
      if (!cue) return
      window.clearTimeout(exitTimer)
      delete cue.dataset.revealed
      delete cue.dataset.exiting
    }
    function fadeOut() {
      if (!cue?.dataset.revealed || cue.dataset.exiting) return
      cue.dataset.exiting = 'true'
      exitTimer = window.setTimeout(hide, 350)
    }
    function reveal() {
      const bounds = scene?.getBoundingClientRect()
      // Reveal only when the hero's lower edge is actually on screen.
      if (
        !bounds ||
        bounds.bottom <= 48 ||
        bounds.bottom > window.innerHeight + 1 ||
        bounds.top >= window.innerHeight ||
        document.hidden ||
        motion.matches
      )
        return
      if (!cue || getComputedStyle(cue).display === 'none') return
      shown = true
      cue.dataset.revealed = 'true'
      timer = window.setTimeout(() => {
        hide()
        schedule()
      }, displayTime)
    }
    function reset() {
      fadeOut()
      schedule()
    }
    schedule()
    window.addEventListener('scroll', reset, { passive: true })
    window.addEventListener('resize', reset, { passive: true })
    document.addEventListener('visibilitychange', reset)
    motion.addEventListener('change', reset)
    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(exitTimer)
      window.removeEventListener('scroll', reset)
      window.removeEventListener('resize', reset)
      document.removeEventListener('visibilitychange', reset)
      motion.removeEventListener('change', reset)
    }
  }, [])

  return (
    <div
      ref={root}
      className={`hero-scroll ${styles.viewport}`}
      data-idle-scroll-cue
      data-tone={tone}
    >
      <a href="#page-sections" className={styles.link} aria-label={label}>
        <span className={styles.mouse} aria-hidden="true">
          <span className={styles.wheel} data-scroll-wheel />
        </span>
        <span className={styles.label} aria-hidden="true">
          {label}
        </span>
      </a>
    </div>
  )
}
