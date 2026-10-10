'use client'

import Image from 'next/image'
import { useLayoutEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/locales'
import type { MediaPhoto } from '@/lib/media-library'
import { NavigationIcon } from '@/components/layout/NavigationIcon'
import styles from './MediaLibrary.module.css'
import { ViewerIcon } from './ViewerIcon'

type Copy = {
  all: string
  open: string
  download: string
  close: string
  previous: string
  next: string
  found: string
  categories: Record<string, string>
}

export function PhotoGallery({
  photos,
  locale,
  copy,
}: {
  photos: MediaPhoto[]
  locale: Locale
  copy: Copy
}) {
  const [category, setCategory] = useState('all')
  const [active, setActive] = useState<MediaPhoto | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const gallery = useRef<HTMLDivElement>(null)
  const previousTiles = useRef<Map<string, DOMRect> | null>(null)
  const fullPhoto = useRef<HTMLImageElement>(null)
  const openingRect = useRef<DOMRect | null>(null)
  const visible = photos.filter((photo) => category === 'all' || photo.category === category)
  const move = (step: number) => {
    if (!active) return
    const index = visible.findIndex((photo) => photo.id === active.id)
    setActive(visible[(index + step + visible.length) % visible.length])
  }

  useLayoutEffect(() => {
    const from = openingRect.current
    openingRect.current = null
    if (
      !from ||
      !fullPhoto.current ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return
    const image = fullPhoto.current
    const to = image.getBoundingClientRect()
    if (!to.width || !to.height) return
    const animation = image.animate(
      [
        {
          transform: `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`,
          opacity: 0.85,
        },
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      ],
      { duration: 440, easing: 'cubic-bezier(.2,.8,.2,1)' },
    )
    return () => animation.cancel()
  }, [active])

  useLayoutEffect(() => {
    const previous = previousTiles.current
    previousTiles.current = null
    if (!previous || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const animations = Array.from(gallery.current?.querySelectorAll('figure') ?? []).map(
      (tile, index) => {
        const before = previous.get(tile.id)
        const after = tile.getBoundingClientRect()
        const from = before
          ? `translate(${before.left - after.left}px, ${before.top - after.top}px) scale(${before.width / after.width}, ${before.height / after.height})`
          : 'translateY(12px) scale(.98)'
        return tile.animate(
          [
            { transform: from, opacity: before ? 1 : 0 },
            { transform: 'translate(0,0) scale(1)', opacity: 1 },
          ],
          {
            duration: 340,
            delay: before ? 0 : Math.min(index * 15, 120),
            easing: 'cubic-bezier(.2,.8,.2,1)',
          },
        )
      },
    )
    return () => animations.forEach((animation) => animation.cancel())
  }, [category])

  return (
    <>
      <div className={styles.filters} aria-label={copy.all}>
        {['all', ...Object.keys(copy.categories)].map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={category === key}
            onClick={() => {
              previousTiles.current = new Map(
                Array.from(gallery.current?.querySelectorAll('figure') ?? []).map((tile) => [
                  tile.id,
                  tile.getBoundingClientRect(),
                ]),
              )
              setCategory(key)
            }}
          >
            {key === 'all' ? copy.all : copy.categories[key]}
          </button>
        ))}
        <span className={styles.count} role="status">
          {visible.length} {copy.found}
        </span>
      </div>
      <div ref={gallery} className={styles.photoGrid} data-filtered={category !== 'all'}>
        {Array.from({ length: Math.ceil(visible.length / 5) }, (_, group) => (
          <div className={styles.photoGroup} key={group} data-side={group % 2 ? 'right' : 'left'}>
            {visible.slice(group * 5, group * 5 + 5).map((photo) => (
              <figure id={`photo-${photo.id}`} key={photo.id} className={styles.photo}>
                <a
                  href={photo.src}
                  aria-label={`${copy.open} — ${photo.title[locale]}`}
                  onClick={(event) => {
                    event.preventDefault()
                    openingRect.current =
                      event.currentTarget.querySelector('img')?.getBoundingClientRect() ?? null
                    setActive(photo)
                    dialog.current?.showModal()
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.title[locale]}
                    width={photo.width}
                    height={photo.height}
                    sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 50vw"
                  />
                  <span className={styles.enlarge} aria-hidden="true">
                    <NavigationIcon name="arrow" />
                  </span>
                </a>
                <figcaption>
                  <span>{copy.categories[photo.category]}</span>
                  <h3>{photo.title[locale]}</h3>
                </figcaption>
              </figure>
            ))}
          </div>
        ))}
      </div>
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-labelledby="photo-dialog-title"
        onClose={() => setActive(null)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            move(locale === 'ar' ? -1 : 1)
          }
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            move(locale === 'ar' ? 1 : -1)
          }
        }}
      >
        <div className={styles.dialogBar}>
          <h2 id="photo-dialog-title">{active?.title[locale]}</h2>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={copy.close}
            title={copy.close}
            onClick={() => dialog.current?.close()}
          >
            <ViewerIcon name="close" />
          </button>
        </div>
        <div className={styles.photoStage}>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.previousPhoto}`}
            aria-label={copy.previous}
            title={copy.previous}
            onClick={() => move(-1)}
          >
            <ViewerIcon name={locale === 'ar' ? 'next' : 'previous'} />
          </button>
          {active && (
            <Image
              ref={fullPhoto}
              src={active.src}
              alt={active.title[locale]}
              width={active.width}
              height={active.height}
              sizes="90vw"
              loading="eager"
              className={styles.fullPhoto}
            />
          )}
          <button
            type="button"
            className={`${styles.iconButton} ${styles.nextPhoto}`}
            aria-label={copy.next}
            title={copy.next}
            onClick={() => move(1)}
          >
            <ViewerIcon name={locale === 'ar' ? 'previous' : 'next'} />
          </button>
        </div>
        <div className={styles.dialogBar}>
          <span className={styles.photoPosition}>
            <bdi>
              {active ? visible.findIndex((photo) => photo.id === active.id) + 1 : 0} /{' '}
              {visible.length}
            </bdi>
          </span>
          {active && (
            <a href={active.src} download>
              {copy.download} <NavigationIcon name="arrow" />
            </a>
          )}
        </div>
      </dialog>
    </>
  )
}
