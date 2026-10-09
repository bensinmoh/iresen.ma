'use client'

import { useEffect, useRef, useState } from 'react'

export function HomeSectionNavigation({
  label,
  items,
}: {
  label: string
  items: readonly { id: string; label: string }[]
}) {
  const navRef = useRef<HTMLElement>(null)
  const [activeId, setActiveId] = useState<string>()

  useEffect(() => {
    const nav = navRef.current
    const main = nav?.closest('main')
    if (!nav || !main) return
    const desktop = window.matchMedia('(min-width: 64rem)')
    const sections = items.map(({ id }) => document.getElementById(id)).filter(Boolean)
    const previousHeight = main.style.getPropertyValue('--home-section-nav-height')
    let frame = 0

    function update() {
      if (!nav || !main) return
      const height = desktop.matches ? nav.getBoundingClientRect().height : 0
      main.style.setProperty('--home-section-nav-height', `${height}px`)
      if (!desktop.matches) return
      const scrollPadding =
        parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
      const readingLine = height + scrollPadding
      let current = items[0]?.id
      for (const section of sections) {
        if (section && section.getBoundingClientRect().top <= readingLine + 1) current = section.id
      }
      setActiveId(current)
    }

    function scheduleUpdate() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    const observer = new ResizeObserver(scheduleUpdate)
    observer.observe(nav)
    // Also account for images, CMS content and font loading moving the section boundaries.
    observer.observe(main)
    scheduleUpdate()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('hashchange', scheduleUpdate)
    desktop.addEventListener('change', scheduleUpdate)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('hashchange', scheduleUpdate)
      desktop.removeEventListener('change', scheduleUpdate)
      if (previousHeight) main.style.setProperty('--home-section-nav-height', previousHeight)
      else main.style.removeProperty('--home-section-nav-height')
    }
  }, [items])

  return (
    <nav ref={navRef} aria-label={label} className="home-section-navigation">
      <noscript>
        <style>{`
          @media (min-width: 64rem) {
            .home-section-navigation-list {
              flex-wrap: nowrap;
              justify-content: safe center;
              overflow-x: auto;
            }
            .home-section-navigation-list li { flex: 0 0 auto; }
            .home-section-navigation a { white-space: nowrap; }
          }
        `}</style>
      </noscript>
      <ul className="container home-section-navigation-list horizontal-scroll">
        {items.map(({ id, label: itemLabel }) => (
          <li key={id}>
            <a href={`#${id}`} aria-current={activeId === id ? 'location' : undefined}>
              {itemLabel}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
