'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/** Native scrolling owns position; only artwork and reading units transform. */
export function RoadmapMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || !window.IntersectionObserver) return
    const panels = [...root.querySelectorAll<HTMLElement>('[data-roadmap-domain]')]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = window.matchMedia('(min-width: 64rem)')
    const complete = new WeakSet<HTMLElement>()
    let frame = 0

    const update = () => {
      frame = 0
      const height = window.innerHeight
      for (const panel of panels) {
        const rect = panel.getBoundingClientRect()
        // Each entrance completes once per visit. Focus also settles it.
        if (!reduce.matches && desktop.matches && !complete.has(panel)) {
          const arrival = Math.min(1, Math.max(0, (height - rect.top) / (height * 0.85)))
          panel.style.setProperty('--arrival', arrival.toFixed(4))
          if (arrival === 1) complete.add(panel)
        }
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const measure = () => {
      // Scroll remains native at every content length; enhancement only changes
      // illustration/heading transforms, never section heights or disclosure flow.
      root.toggleAttribute('data-immersive', desktop.matches && !reduce.matches)
      if (reduce.matches || !desktop.matches) {
        panels.forEach((panel) => panel.style.removeProperty('--arrival'))
      }
      schedule()
    }
    const settleFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      const panel = event.target.closest<HTMLElement>('[data-roadmap-domain]')
      if (panel) {
        complete.add(panel)
        panel.style.setProperty('--arrival', '1')
      }
    }
    const observer = new IntersectionObserver(schedule)
    panels.forEach((panel) => observer.observe(panel))
    const resize = new ResizeObserver(measure)
    panels.forEach((panel) => {
      const content = panel.querySelector('[data-scene-content]')
      if (content) resize.observe(content)
    })
    measure()
    document.fonts.ready.then(measure).catch(() => {})
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', measure)
    reduce.addEventListener('change', measure)
    desktop.addEventListener('change', measure)
    root.addEventListener('focusin', settleFocus)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resize.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', measure)
      reduce.removeEventListener('change', measure)
      desktop.removeEventListener('change', measure)
      root.removeEventListener('focusin', settleFocus)
    }
  }, [])

  return (
    <div ref={rootRef} data-motion-owned>
      {children}
    </div>
  )
}
