'use client'

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { Lightbulb } from '@phosphor-icons/react/dist/ssr/Lightbulb'
import { Flask } from '@phosphor-icons/react/dist/ssr/Flask'
import { TrendUp } from '@phosphor-icons/react/dist/ssr/TrendUp'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr/ArrowRight'
import { SiteIcon } from '@/components/ui/SiteIcon'
import styles from './InstituteModel.module.css'

function subscribe(listener: () => void) {
  window.addEventListener('hashchange', listener)
  return () => window.removeEventListener('hashchange', listener)
}
const getHash = () => window.location.hash
const serverHash = () => null
function subscribePreferences(listener: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', listener)
  document.addEventListener('visibilitychange', listener)
  return () => {
    media.removeEventListener('change', listener)
    document.removeEventListener('visibilitychange', listener)
  }
}
const canAnimate = () =>
  !document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
const serverAnimation = () => false
const readingTime = 10000
const icons = [Lightbulb, Flask, TrendUp]

/** Native links and readable server panels progressively become a controlled pathway. */
export function ResearchTabs({
  label,
  direction,
  controls,
  items,
}: {
  label: string
  direction: 'ltr' | 'rtl'
  controls: { title: string; hint: string }
  items: { id: string; title: string; content: ReactNode }[]
}) {
  const hash = useSyncExternalStore<string | null>(subscribe, getHash, serverHash)
  const motionAllowed = useSyncExternalStore(subscribePreferences, canAnimate, serverAnimation)
  const enhanced = hash !== null
  const root = useRef<HTMLDivElement>(null)
  const refs = useRef<(HTMLAnchorElement | null)[]>([])
  const [cycle, setCycle] = useState<{ hash: string | null; index: number }>({
    hash: null,
    index: 0,
  })
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const linkedIndex = items.findIndex(({ id }) => `#${id}` === hash)
  const active = cycle.hash === hash ? cycle.index : Math.max(0, linkedIndex)
  const running = enhanced && motionAllowed && visible && !paused && !hovered && !focused

  useEffect(() => {
    if (!root.current || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.2),
      {
        threshold: 0.2,
      },
    )
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => {
      setCycle({ hash, index: (active + 1) % items.length })
    }, readingTime)
    return () => window.clearTimeout(timer)
  }, [running, active, hash, items.length])

  const select = (index: number) => {
    const nextHash = `#${items[index].id}`
    setPaused(true)
    setCycle({ hash: nextHash, index })
    window.history.replaceState(window.history.state, '', nextHash)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }
  return (
    <div
      ref={root}
      data-research-tabs
      data-enhanced={enhanced || undefined}
      data-running={running}
      style={{ '--pathway-duration': `${readingTime}ms` } as CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
    >
      <div className={styles.pathwayToolbar}>
        <p>
          {controls.title}
          <span>{controls.hint}</span>
        </p>
      </div>
      <div className={styles.tabs} role={enhanced ? 'tablist' : undefined} aria-label={label}>
        {items.map(({ id, title }, index) => (
          <a
            key={id}
            href={`#${id}`}
            id={`${id}-tab`}
            ref={(node) => {
              refs.current[index] = node
            }}
            role={enhanced ? 'tab' : undefined}
            aria-selected={enhanced ? active === index : undefined}
            aria-controls={enhanced ? id : undefined}
            tabIndex={enhanced && active !== index ? -1 : 0}
            onClick={(event) => {
              event.preventDefault()
              select(index)
            }}
            onKeyDown={(event) => {
              let next: number
              if (event.key === 'Home') next = 0
              else if (event.key === 'End') next = items.length - 1
              else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                const step = (event.key === 'ArrowRight') === (direction === 'ltr') ? 1 : -1
                next = (index + step + items.length) % items.length
              } else if (event.key === ' ') {
                event.preventDefault()
                select(index)
                return
              } else return
              event.preventDefault()
              select(next)
              refs.current[next]?.focus()
            }}
          >
            <span className={styles.stepNumber} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <SiteIcon icon={icons[index]} />
            <span className={styles.stepTitle}>{title}</span>
            <SiteIcon icon={ArrowRight} className={styles.stepArrow} size={20} />
            {enhanced && active === index && (
              <span
                key={`${active}-${running}`}
                className={styles.stepProgress}
                aria-hidden="true"
              />
            )}
          </a>
        ))}
      </div>
      <div className={styles.pathwayPanels}>
        {items.map(({ id, content }, index) => (
          <div
            key={id}
            id={id}
            className={styles.pathwayPanel}
            role={enhanced ? 'tabpanel' : undefined}
            aria-labelledby={enhanced ? `${id}-tab` : undefined}
            aria-hidden={enhanced && index !== active ? true : undefined}
            inert={enhanced && index !== active ? true : undefined}
            data-active={!enhanced || index === active}
            tabIndex={enhanced && index === active ? 0 : undefined}
          >
            {content}
          </div>
        ))}
      </div>
    </div>
  )
}
