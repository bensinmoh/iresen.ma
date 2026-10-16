'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'

// Left edge sampled every 16px from the existing 493×700 alpha cutout (alpha > 31).
// Coordinates follow the supplied silhouette; the image and its bytes are unchanged.
const contour = [
  [0.4057, 0.0229],
  [0.3428, 0.0457],
  [0.3327, 0.0686],
  [0.284, 0.0914],
  [0.2617, 0.1143],
  [0.2677, 0.1371],
  [0.2535, 0.16],
  [0.2475, 0.1829],
  [0.2799, 0.2057],
  [0.2677, 0.2286],
  [0.2941, 0.2514],
  [0.3043, 0.2743],
  [0.3144, 0.2971],
  [0.3144, 0.32],
  [0.2779, 0.3429],
  [0.2475, 0.3657],
  [0.2434, 0.3886],
  [0.2373, 0.4114],
  [0.2292, 0.4343],
  [0.2191, 0.4571],
  [0.1623, 0.48],
  [0.1318, 0.5029],
  [0.1156, 0.5257],
  [0.0974, 0.5486],
  [0.0872, 0.5714],
  [0.0852, 0.5943],
  [0.0791, 0.6171],
  [0.0629, 0.64],
  [0.0487, 0.6629],
  [0.0284, 0.6857],
  [0.0061, 0.7086],
  [0.0061, 0.7314],
  [0.0122, 0.7543],
  [0.0304, 0.7771],
  [0.0487, 0.8],
  [0.0669, 0.8229],
  [0.0974, 0.8457],
  [0.1095, 0.8686],
  [0.1176, 0.8914],
  [0.144, 0.9143],
  [0.1258, 0.9371],
  [0.1075, 0.96],
  [0.0913, 0.9829],
  [0.0811, 1],
] as const

/** Fit native text around the actual silhouette while keeping the portrait on the section edge. */
export function AmbitionQuote({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLQuoteElement>(null)
  useLayoutEffect(() => {
    const quote = ref.current
    const paragraph = quote?.querySelector('p')
    const portrait = quote?.querySelector('img')
    const section = quote?.closest('section')
    if (!quote || !paragraph || !portrait || !section) return
    const mobile = window.matchMedia('(max-width: 40rem)')
    let frame = 0
    let lastSignature = ''
    let disposed = false
    const clear = () => {
      quote.removeAttribute('data-contour-ready')
      for (const name of [
        '--ambition-flow-height',
        '--ambition-contour',
        '--ambition-edge-clearance',
      ])
        quote.style.removeProperty(name)
    }
    const fit = () => {
      if (disposed) return
      if (!mobile.matches) {
        clear()
        lastSignature = ''
        return
      }
      const style = getComputedStyle(paragraph)
      const padding = Number.parseFloat(getComputedStyle(section).paddingBottom)
      const signature = [
        quote.clientWidth,
        style.fontFamily,
        style.fontSize,
        style.lineHeight,
        padding,
        paragraph.textContent,
      ].join('|')
      if (signature === lastSignature) return
      lastSignature = signature
      quote.dataset.contourReady = ''
      quote.style.setProperty('--ambition-edge-clearance', `${padding}px`)
      quote.style.setProperty('--ambition-flow-height', '0px')
      quote.style.setProperty('--ambition-contour', 'polygon(0 0, 0 0, 0 0)')
      const naturalHeight = paragraph.getBoundingClientRect().height
      const imageHeight = portrait.getBoundingClientRect().height
      if (!imageHeight) {
        clear()
        lastSignature = ''
        return
      }
      const apply = (height: number) => {
        const top = height + padding - imageHeight
        const points = contour.map(([x, y]) => `${x * 100}% ${top + y * imageHeight}px`)
        points.push(`100% ${top + imageHeight}px`, `100% ${top}px`)
        quote.style.setProperty('--ambition-flow-height', `${height}px`)
        quote.style.setProperty('--ambition-contour', `polygon(${points.join(',')})`)
      }
      let low = Math.max(naturalHeight, imageHeight - padding)
      let high = naturalHeight + imageHeight + 32
      // The upper bound puts the silhouette below the full-width text. Find the
      // smallest containing height; no truncation or fixed narrow column is used.
      for (let pass = 0; pass < 12 && high - low > 1; pass++) {
        const candidate = (low + high) / 2
        apply(candidate)
        if (paragraph.getBoundingClientRect().height <= candidate) high = candidate
        else low = candidate
      }
      apply(Math.ceil(high))
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(fit)
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(quote)
    observer.observe(paragraph)
    mobile.addEventListener('change', schedule)
    const fontReady = () => {
      lastSignature = ''
      schedule()
    }
    document.fonts.addEventListener('loadingdone', fontReady)
    void document.fonts.ready.then(() => {
      if (!disposed) fontReady()
    })
    fit()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      mobile.removeEventListener('change', schedule)
      document.fonts.removeEventListener('loadingdone', fontReady)
      clear()
    }
  }, [children])
  return (
    <blockquote ref={ref} className={className}>
      {children}
    </blockquote>
  )
}
