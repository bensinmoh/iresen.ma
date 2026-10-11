'use client'

import type { ReactNode } from 'react'

/** Native GET remains functional without hydration; selects apply immediately. */
export function ProjectFilters({ action, children }: { action: string; children: ReactNode }) {
  return (
    <form
      action={action}
      method="get"
      onChange={(event) => {
        if (event.target instanceof HTMLSelectElement) event.currentTarget.requestSubmit()
      }}
    >
      {children}
    </form>
  )
}
