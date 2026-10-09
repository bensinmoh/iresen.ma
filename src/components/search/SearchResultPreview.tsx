'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import type { SearchPreview } from '@/lib/search/previews'
import { NavigationIcon } from '@/components/layout/NavigationIcon'

export function SearchResultPreview({
  preview,
  title,
  destination,
}: {
  preview: SearchPreview
  title: string
  destination: string
}) {
  const t = useTranslations('Search')
  const [open, setOpen] = useState(false)
  if (preview.kind === 'image' && preview.url)
    return (
      <a
        href={destination}
        className="search-result-preview search-image-preview"
        tabIndex={-1}
        aria-hidden="true"
        data-inverse={
          ['/brand/logo-white.svg', '/brand/logo-dark.svg'].includes(preview.url) || undefined
        }
      >
        <Image
          src={preview.url}
          alt=""
          width={320}
          height={210}
          sizes="(max-width: 40rem) 100vw, 14rem"
          unoptimized={!preview.url.startsWith('/images/')}
        />
      </a>
    )
  if (preview.kind === 'video' && preview.url)
    return (
      <div className="search-result-preview">
        <video
          controls
          preload="none"
          playsInline
          aria-label={t('previewTitle', { title })}
          src={preview.url}
        />
      </div>
    )
  if (preview.kind === 'audio' && preview.url)
    return (
      <div className="search-result-preview">
        <audio
          controls
          preload="none"
          aria-label={t('previewTitle', { title })}
          src={preview.url}
        />
      </div>
    )
  return (
    <div className="search-result-preview search-file-preview">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M5 3h9l5 5v13H5V3Zm9 0v5h5M8 12h8M8 16h8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span>{preview.format || t(preview.kind === 'news' ? 'types.news' : 'types.document')}</span>
      {preview.kind === 'pdf' && preview.url && (
        <details
          className="search-document-preview"
          onToggle={(event) => setOpen(event.currentTarget.open)}
        >
          <summary>
            <span>{t('preview')}</span>
            <NavigationIcon name="chevron" />
          </summary>
          {open && <iframe src={preview.url} title={t('previewTitle', { title })} />}
          <a href={destination}>{t('openResource')}</a>
        </details>
      )}
      {preview.kind === 'file' && <a href={destination}>{t('openResource')}</a>}
    </div>
  )
}
