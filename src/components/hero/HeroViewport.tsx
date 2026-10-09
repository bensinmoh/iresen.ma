'use client'

import { useEffect, useRef, type ReactNode } from 'react'

export function HeroViewport({ children, className }: { children: ReactNode; className: string }) {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const hero = heroRef.current
    const header = document.querySelector<HTMLElement>('.site-header')
    if (!hero) return
    let frame = 0

    function measure() {
      if (!hero) return
      const viewport = window.visualViewport
      // Pinch zoom must magnify the content without shrinking its layout box.
      const height = viewport && viewport.scale === 1 ? viewport.height : window.innerHeight
      hero.style.setProperty('--hero-viewport-height', `${Math.round(height)}px`)
      // A full-screen navigation sheet must not resize the page underneath it.
      const menuOverlay =
        window.matchMedia('(max-width: 40rem)').matches && header?.querySelector('.site-menu[open]')
      if (!menuOverlay) {
        hero.style.setProperty(
          '--hero-header-height',
          `${header?.getBoundingClientRect().height ?? 0}px`,
        )
      }
    }

    function scheduleMeasure() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    measure()
    const observer = new ResizeObserver(scheduleMeasure)
    if (header) observer.observe(header)
    window.addEventListener('resize', scheduleMeasure)
    window.addEventListener('orientationchange', scheduleMeasure)
    window.visualViewport?.addEventListener('resize', scheduleMeasure)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', scheduleMeasure)
      window.removeEventListener('orientationchange', scheduleMeasure)
      window.visualViewport?.removeEventListener('resize', scheduleMeasure)
    }
  }, [])

  return (
    <section ref={heroRef} className={className} aria-labelledby="hero-title">
      {children}
    </section>
  )
}
