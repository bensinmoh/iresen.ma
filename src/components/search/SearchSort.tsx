'use client'

import type { ReactNode } from 'react'

export function SearchSort({
  sort,
  children,
}: {
  sort: 'relevance' | 'newest'
  children: ReactNode
}) {
  return (
    <select
      data-ui-field
      key={sort}
      id="search-sort"
      name="sort"
      defaultValue={sort}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
    >
      {children}
    </select>
  )
}
