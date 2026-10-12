'use client'

import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

export function CookieNecessaryLabel() {
  const t = useTranslations('CookieConsent')
  const full = t('necessaryOnly')
  const compact = t('necessaryOnlyShort')
  const tiny = t('necessaryOnlyTiny')
  const labels = useMemo(() => [full, compact, tiny], [full, compact, tiny])
  const root = useRef<HTMLSpanElement>(null)
  const measurements = useRef<HTMLSpanElement[]>([])
  const [variant, setVariant] = useState(0)

  useLayoutEffect(() => {
    const button = root.current?.closest('button')
    if (!button) return
    function update() {
      if (!button || !button.getClientRects().length) return
      const style = getComputedStyle(button)
      const padding = parseFloat(style.paddingInlineStart) + parseFloat(style.paddingInlineEnd)
      const borders =
        parseFloat(style.borderInlineStartWidth) + parseFloat(style.borderInlineEndWidth)
      const widths = measurements.current.map((span) => span.getBoundingClientRect().width)
      // Auto-sized desktop controls must retain enough intrinsic space for the full label.
      const fullWidth = `${widths[0] + padding + borders}px`
      if (button.style.getPropertyValue('--cookie-full-label-width') !== fullWidth)
        button.style.setProperty('--cookie-full-label-width', fullWidth)
      const available = button.clientWidth - padding
      const fit = widths.findIndex((width) => width <= available + 0.5)
      setVariant(fit < 0 ? labels.length - 1 : fit)
    }
    const observer = new ResizeObserver(update)
    observer.observe(button)
    void document.fonts.ready.then(update)
    window.addEventListener('resize', update)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [labels])

  return (
    <span ref={root} className="cookie-fit-label">
      <span>{labels[variant]}</span>
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          inlineSize: 0,
          blockSize: 0,
          overflow: 'hidden',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {labels.map((label, index) => (
          <span
            key={label}
            ref={(node) => {
              if (node) measurements.current[index] = node
            }}
            style={{ display: 'block', inlineSize: 'max-content', whiteSpace: 'nowrap' }}
          >
            {label}
          </span>
        ))}
      </span>
    </span>
  )
}
