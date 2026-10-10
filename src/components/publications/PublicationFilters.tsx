'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import styles from './PublicationsPage.module.css'

/** Native disclosure stays usable without JS; wide layouts reveal the sidebar. */
export function PublicationFilters({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const media = window.matchMedia('(min-width: 48.01rem)')
    const update = () => {
      if (ref.current) ref.current.open = media.matches
    }
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return (
    <details ref={ref} className={styles.filterDisclosure}>
      <summary>
        {label}
        <NavigationIcon name="chevron" />
      </summary>
      {children}
    </details>
  )
}
