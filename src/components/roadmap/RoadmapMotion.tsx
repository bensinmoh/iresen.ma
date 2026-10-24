'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/** Native chapter covers with layered entrances and an idle boundary settle. */
export function RoadmapMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = rootRef.current
    if (!root || !window.IntersectionObserver || !window.ResizeObserver) return
    const panels = [...root.querySelectorAll<HTMLElement>('[data-roadmap-domain]')]
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const desktop = window.matchMedia('(min-width: 64rem)')
    let starts: number[] = []
    let heights: number[] = []
    let drawFrame = 0
    let measureFrame = 0
    let settleTimer: ReturnType<typeof setTimeout> | undefined
    let userScrollPending = false
    let pointerHeld = false
    let snapping = false
    const heldScrollKeys = new Set<string>()
    const quietPeriod = 650

    const enabled = () => desktop.matches && !reduce.matches
    const draw = () => {
      drawFrame = 0
      if (!enabled()) return
      // All geometry is read before writing the progress values.
      const progress = panels.map((panel) =>
        Math.max(
          0,
          Math.min(
            1,
            (window.innerHeight - panel.getBoundingClientRect().top) / (window.innerHeight * 0.8),
          ),
        ),
      )
      panels.forEach((panel, index) => {
        const value = progress[index].toFixed(4)
        if (panel.style.getPropertyValue('--chapter-entry') !== value) {
          panel.style.setProperty('--chapter-entry', value)
        }
      })
    }
    const measure = () => {
      const parent = panels[0]?.parentElement
      if (!parent) return
      let top = window.scrollY + parent.getBoundingClientRect().top
      starts = []
      heights = panels.map((panel) => panel.getBoundingClientRect().height)
      panels.forEach((panel, index) => {
        starts.push(top)
        top += heights[index]
        // Expanded axes and short windows can be read fully before pinning.
        panel.style.setProperty(
          '--chapter-pin-top',
          `${Math.min(0, window.innerHeight - heights[index])}px`,
        )
      })
      root.toggleAttribute('data-immersive', enabled())
      if (reduce.matches) panels.forEach((panel) => panel.setAttribute('data-plate-settled', ''))
      if (!enabled()) {
        userScrollPending = false
        clearTimeout(settleTimer)
        if (snapping) window.scrollTo({ top: window.scrollY, behavior: 'instant' })
        snapping = false
      }
      draw()
    }
    const settleScroll = () => {
      clearTimeout(settleTimer)
      if (!enabled() || !userScrollPending || pointerHeld || heldScrollKeys.size) return
      userScrollPending = false
      const y = window.scrollY
      for (let index = 0; index < panels.length - 1; index++) {
        // Snap only during the cover, never through a long chapter's reading area.
        const from = starts[index] + Math.max(0, heights[index] - window.innerHeight)
        const to = starts[index + 1]
        if (y <= from + 2 || y >= to - 2) continue
        const destination = y - from < (to - from) / 2 ? from : to
        snapping = true
        window.scrollTo({ top: destination, behavior: 'smooth' })
        break
      }
    }
    const scheduleSettle = () => {
      clearTimeout(settleTimer)
      if (enabled() && userScrollPending && !pointerHeld && !heldScrollKeys.size) {
        settleTimer = setTimeout(settleScroll, quietPeriod)
      }
    }
    const onScroll = () => {
      if (!drawFrame) drawFrame = requestAnimationFrame(draw)
      // Every movement restarts the quiet period, including trackpad momentum.
      if (!snapping) scheduleSettle()
    }
    const onScrollEnd = () => {
      if (snapping) {
        snapping = false
        return
      }
      // A wheel can emit scrollend between slow notches: never snap immediately.
      scheduleSettle()
    }
    const onUserScroll = () => {
      clearTimeout(settleTimer)
      if (snapping) {
        // New input owns the scroll immediately, rather than fighting our settle.
        snapping = false
        window.scrollTo({ top: window.scrollY, behavior: 'instant' })
      }
      userScrollPending = enabled()
      scheduleSettle()
    }
    const onPointerDown = (event: PointerEvent) => {
      const scrollbar =
        event.clientX >= window.innerWidth - 18 ||
        (document.documentElement.dir === 'rtl' && event.clientX <= 18)
      pointerHeld = event.pointerType === 'touch' || scrollbar
      if (pointerHeld) onUserScroll()
    }
    const onPointerUp = () => {
      pointerHeld = false
      scheduleSettle()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(event.key)) return
      if (
        event.target instanceof Element &&
        event.target.closest('input, textarea, select, button, summary, a, [contenteditable]')
      )
        return
      heldScrollKeys.add(event.key)
      onUserScroll()
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (!heldScrollKeys.delete(event.key)) return
      scheduleSettle()
    }
    const onBlur = () => {
      heldScrollKeys.clear()
      pointerHeld = false
      userScrollPending = false
      clearTimeout(settleTimer)
    }
    const scheduleMeasure = () => {
      cancelAnimationFrame(measureFrame)
      measureFrame = requestAnimationFrame(measure)
    }
    const navigateChapter = (event: MouseEvent) => {
      if (
        !enabled() ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return
      if (!(event.target instanceof Element)) return
      const link = event.target.closest<HTMLAnchorElement>('a[href^="#theme-"]')
      if (!link) return
      const href = link.getAttribute('href')!
      const index = panels.findIndex((panel) => `#${panel.id}` === href)
      if (index < 0) return
      // Sticky sheets share a visual top; navigate to their natural document offset.
      event.preventDefault()
      userScrollPending = false
      clearTimeout(settleTimer)
      if (window.location.hash !== href) window.history.pushState(window.history.state, '', href)
      window.scrollTo({ top: starts[index], behavior: 'instant' })
    }
    const settleFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      userScrollPending = false
      clearTimeout(settleTimer)
      const panel = event.target.closest<HTMLElement>('[data-roadmap-domain]')
      panel?.setAttribute('data-plate-settled', '')
      if (!panel || !enabled()) return
      const bounds = event.target.getBoundingClientRect()
      const x = Math.max(0, Math.min(window.innerWidth - 1, bounds.x + bounds.width / 2))
      const y = Math.max(0, Math.min(window.innerHeight - 1, bounds.y + bounds.height / 2))
      if (!panel.contains(document.elementFromPoint(x, y))) {
        window.scrollTo({ top: starts[panels.indexOf(panel)], behavior: 'instant' })
      }
    }
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
    const resizeObserver = new ResizeObserver(scheduleMeasure)
    panels.forEach((panel) => resizeObserver.observe(panel))
    window.addEventListener('resize', scheduleMeasure)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', onScrollEnd)
    window.addEventListener('wheel', onUserScroll, { passive: true })
    window.addEventListener('touchmove', onUserScroll, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onBlur)
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerUp, { passive: true })
    reduce.addEventListener('change', measure)
    desktop.addEventListener('change', measure)
    root.addEventListener('focusin', settleFocus)
    root.addEventListener('click', navigateChapter)
    measure()
    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      cancelAnimationFrame(drawFrame)
      cancelAnimationFrame(measureFrame)
      clearTimeout(settleTimer)
      window.removeEventListener('resize', scheduleMeasure)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', onScrollEnd)
      window.removeEventListener('wheel', onUserScroll)
      window.removeEventListener('touchmove', onUserScroll)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      reduce.removeEventListener('change', measure)
      desktop.removeEventListener('change', measure)
      root.removeEventListener('focusin', settleFocus)
      root.removeEventListener('click', navigateChapter)
    }
  }, [])
  return (
    <div ref={rootRef} data-motion-owned>
      {children}
    </div>
  )
}
