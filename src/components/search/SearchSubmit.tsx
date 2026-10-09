'use client'

import { useTranslations } from 'next-intl'
import { useFormStatus } from 'react-dom'
import { NavigationIcon } from '@/components/layout/NavigationIcon'

export function SearchSubmit() {
  const t = useTranslations('Search')
  const { pending } = useFormStatus()

  return (
    <button className="button button-primary search-submit" type="submit" disabled={pending}>
      <NavigationIcon name="search" />
      <span>{t(pending ? 'searching' : 'submit')}</span>
    </button>
  )
}
