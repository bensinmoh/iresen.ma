'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/** Native scroll, one background entrance per technical sheet; focus settles it. */
export function RoadmapMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root || !window.IntersectionObserver) return
    const panels = [...root.querySelectorAll<HTMLElement>('[data-roadmap-domain]')]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = window.matchMedia('(min-width: 64rem)')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting) continue
          target.setAttribute('data-plate-entered', '')
          observer.unobserve(target)
        }
      },
      { threshold: 0.2 },
    )
    panels.forEach((panel) => observer.observe(panel))
    const measure = () => {
      root.toggleAttribute('data-immersive', desktop.matches && !reduce.matches)
      if (reduce.matches) panels.forEach((panel) => panel.setAttribute('data-plate-settled', ''))
    }
    const settleFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      event.target.closest('[data-roadmap-domain]')?.setAttribute('data-plate-settled', '')
    }
    measure()
    reduce.addEventListener('change', measure)
    desktop.addEventListener('change', measure)
    root.addEventListener('focusin', settleFocus)
    return () => {
      observer.disconnect()
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
