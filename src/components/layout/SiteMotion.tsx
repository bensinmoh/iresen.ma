'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Observe reading units, never section wrappers: transforming a wrapper would
// change the containing block of sticky navigation, dialogs and horizontal rails.
const targets = [
  'main h1',
  'main h2',
  'main h3',
  'main blockquote',
  'main article:not([id^="publication-"]):not([id^="patent-"]):not(.published-content)',
  'main .hero-description',
  'main .hero-actions',
  'main section > p',
  'main section > header > p',
  'main section > ol > li',
  'main section > ul > li',
  'main [data-motion-reveal]',
  '.site-footer h2',
].join(',')

/** Progressive enhancement: no hidden styles, wrappers or scroll interception. */
export function SiteMotion() {
  const pathname = usePathname()

  useEffect(() => {
    if (!window.IntersectionObserver || !Element.prototype.animate) return

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const visited = new WeakSet<Element>()
    const animations = new Map<Element, Animation>()
    const root = document.getElementById('main-content')
    const footer = document.querySelector('.site-footer')
    if (!root) return
    let frame = 0
    const tokens = getComputedStyle(document.documentElement)
    // The production CSS optimizer can serialize 420ms as .42s.
    const timing = tokens.getPropertyValue('--duration-reveal').trim()
    const duration = parseFloat(timing) * (timing.endsWith('ms') ? 1 : 1000) || 420
    const easing = tokens.getPropertyValue('--ease-arrival').trim() || 'ease-out'

    const stop = () => {
      animations.forEach((animation) => animation.cancel())
      animations.clear()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let order = 0
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting) continue
          observer.unobserve(target)
          if (visited.has(target)) continue
          visited.add(target)
          // Focus and hash destinations must remain immediately readable.
          if (
            preference.matches ||
            target.contains(document.activeElement) ||
            target.closest('[id^="publication-"], [id^="patent-"]') ||
            target.getAnimations().length
          )
            continue
          const animation = target.animate(
            [
              { opacity: 0.35, translate: '0 14px' },
              { opacity: 1, translate: '0 0' },
            ],
            { duration, easing, delay: Math.min(order++ * 35, 105), fill: 'backwards' },
          )
          animations.set(target, animation)
          animation.finished
            .then(() => {
              if (animations.get(target) === animation) animations.delete(target)
            })
            .catch(() => {})
        }
      },
      { threshold: 0, rootMargin: '0px 0px -24px 0px' },
    )

    function register(scope: Element) {
      const candidates = scope.matches(targets)
        ? [scope, ...scope.querySelectorAll(targets)]
        : [...scope.querySelectorAll(targets)]
      for (const target of candidates) {
        if (visited.has(target)) continue
        // Avoid nested animations and preserve component-owned list transitions.
        if (target.closest('[id^="publication-"], [id^="patent-"]')) continue
        const ancestor = target.parentElement?.closest(targets)
        if (ancestor && (root?.contains(ancestor) || footer?.contains(ancestor))) continue
        if (preference.matches) visited.add(target)
        else observer.observe(target)
      }
    }

    function settleDestination() {
      let id: string
      try {
        id = decodeURIComponent(window.location.hash.slice(1))
      } catch {
        return
      }
      const destination = document.getElementById(id)
      if (!destination) return
      const heading = destination.querySelector('h1, h2, h3')
      const visible = [...destination.querySelectorAll(targets)].filter((target) => {
        const rect = target.getBoundingClientRect()
        return rect.top < window.innerHeight && rect.bottom > 0
      })
      for (const target of [destination, ...(heading ? [heading] : []), ...visible]) {
        visited.add(target)
        observer.unobserve(target)
        animations.get(target)?.cancel()
        animations.delete(target)
      }
    }

    settleDestination()
    register(root)
    if (footer) register(footer)

    // New CMS content/client navigation can arrive after the layout mounts.
    // Observe additions only; animation attributes and scrolling never rescan.
    const pending = new Set<Element>()
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) if (node instanceof Element) pending.add(node)
      }
      if (frame || !pending.size) return
      frame = requestAnimationFrame(() => {
        frame = 0
        pending.forEach(register)
        pending.clear()
        settleDestination()
      })
    })
    mutations.observe(root, { childList: true, subtree: true })
    window.addEventListener('hashchange', settleDestination)
    preference.addEventListener('change', stop)
    // Keyboard navigation never waits for a reveal to finish.
    const settleFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      animations.forEach((animation, target) => {
        if (target.contains(event.target as Element)) {
          animation.cancel()
          animations.delete(target)
        }
      })
    }
    document.addEventListener('focusin', settleFocus)

    return () => {
      observer.disconnect()
      mutations.disconnect()
      cancelAnimationFrame(frame)
      stop()
      window.removeEventListener('hashchange', settleDestination)
      document.removeEventListener('focusin', settleFocus)
      preference.removeEventListener('change', stop)
    }
  }, [pathname])

  return null
}
