'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'

// Right alpha edge of the complete supplied 1535×1024 image, sampled every 24px.
const contour = [
  [0, 0],
  [0.5381, 0.0234],
  [0.5759, 0.0469],
  [0.5805, 0.0703],
  [0.5824, 0.0938],
  [0.5883, 0.1172],
  [0.5961, 0.1406],
  [0.6026, 0.1641],
  [0.6098, 0.1875],
  [0.6678, 0.2109],
  [0.6769, 0.2344],
  [0.6893, 0.2578],
  [0.7062, 0.2813],
  [0.7153, 0.3047],
  [0.7218, 0.3281],
  [0.7244, 0.3516],
  [0.727, 0.375],
  [0.7303, 0.3984],
  [0.7375, 0.4219],
  [0.744, 0.4453],
  [0.7459, 0.4688],
  [0.7466, 0.4922],
  [0.7453, 0.5156],
  [0.7427, 0.5391],
  [0.7381, 0.5625],
  [0.7316, 0.5859],
  [0.7173, 0.6094],
  [0.7166, 0.6328],
  [0.7179, 0.6563],
  [0.7192, 0.6797],
  [0.7225, 0.7031],
  [0.7244, 0.7266],
  [0.7257, 0.75],
  [0.727, 0.7734],
  [0.7309, 0.7969],
  [0.7583, 0.8203],
  [0.785, 0.8438],
  [0.8124, 0.8672],
  [0.8397, 0.8906],
  [0.8664, 0.9141],
  [0.8932, 0.9375],
  [0.9186, 0.9609],
  [0.9453, 0.9844],
  [1, 1],
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
        points.push(`0% ${top + imageHeight}px`, `0% ${top}px`)
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
