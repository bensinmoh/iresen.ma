'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type { Locale } from '@/i18n/locales'
import { pageHref } from '@/lib/site'
import {
  homeResearchSectionId,
  researchThemes,
  researchImages,
  type ResearchCopy,
} from '@/lib/home-research'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import { ResearchThemeIcon } from './ResearchThemeIcon'
import styles from './ResearchSection.module.css'

export function ResearchSection({ locale, copy }: { locale: Locale; copy: ResearchCopy }) {
  const section = useRef<HTMLElement>(null)
  useEffect(() => {
    const reveal = () => {
      const anchor = window.location.hash.slice(1)
      const theme = researchThemes.find((id) => anchor === `research-${id}`)
      if (!theme) return
      const details = section.current?.querySelector<HTMLDetailsElement>(`#research-${theme}`)
      if (details) details.open = true
    }
    reveal()
    window.addEventListener('hashchange', reveal)
    return () => window.removeEventListener('hashchange', reveal)
  }, [])

  return (
    <section
      ref={section}
      id={homeResearchSectionId}
      className={styles.section}
      aria-labelledby="research-heading"
    >
      <div className={styles.header}>
        <p className={styles.eyebrow}>
          <Image src="/brand/apex-leaf.svg" alt="" width={1773} height={2870} unoptimized />
          <span>{copy.eyebrow}</span>
        </p>
        <h2 id="research-heading">{copy.title}</h2>
      </div>
      <div className={styles.chooser}>
        {researchThemes.map((theme, index) => {
          const text = copy.themes[theme]
          const image = researchImages[theme]
          return (
            <details
              key={theme}
              id={`research-${theme}`}
              name="home-research"
              open={index === 0}
              className={styles.theme}
            >
              <summary
                style={{ gridRow: index + 1 }}
                onClick={(event) => {
                  // Wide layouts always keep a theme selected; mobile can close a disclosure.
                  if (
                    window.matchMedia('(min-width: 64rem)').matches &&
                    event.currentTarget.parentElement?.hasAttribute('open')
                  )
                    event.preventDefault()
                }}
              >
                <ResearchThemeIcon theme={theme} />
                <span>{text.title}</span>
                <NavigationIcon name="chevron" />
              </summary>
              <div className={styles.panel}>
                <p className={styles.description}>{text.description}</p>
                <ol className={styles.axes}>
                  {text.axes.map((axis, axisIndex) => (
                    <li key={axis}>
                      <span className={styles.number}>
                        {copy.axis} <bdi>{String(axisIndex + 1).padStart(2, '0')}</bdi>
                      </span>
                      <h3>{axis}</h3>
                    </li>
                  ))}
                </ol>
                <div className={styles.panorama} data-theme-image={theme} aria-hidden="true">
                  <Image
                    src={image.src}
                    alt=""
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 63.999rem) 100vw, (min-width: 128rem) 120rem, 100vw"
                  />
                </div>
              </div>
            </details>
          )
        })}
      </div>
      <a
        href={pageHref('priorities', locale, 'domains-directions')}
        className={`${styles.action} button button-primary`}
      >
        <span>{copy.action}</span>
        <NavigationIcon name="arrow" />
      </a>
    </section>
  )
}
