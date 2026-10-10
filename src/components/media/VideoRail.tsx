'use client'

import Image from 'next/image'
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Locale } from '@/i18n/locales'
import { ViewerIcon } from './ViewerIcon'
import styles from './MediaLibrary.module.css'
import navigation from './VideoRail.module.css'

type Video = {
  id: number
  title: string
  caption?: string | null
  url: string
  mimeType: string
  poster?: string
  durationSeconds?: number
}
export function VideoRail({
  videos,
  locale,
  label,
  close,
  download,
}: {
  videos: Video[]
  locale: Locale
  label: string
  previous: string
  next: string
  close: string
  download: string
}) {
  const rail = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const player = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState<Video | null>(null)
  const t = useTranslations('VideoRailNavigation')
  const railId = useId()
  const requestedItem = useRef<number | null>(null)
  const [position, setPosition] = useState({
    stops: [] as number[],
    current: 0,
    ready: false,
    overflow: false,
  })
  useEffect(() => {
    const element = rail.current
    if (!element) return
    let frame = 0
    const measure = () => {
      const maximum = Math.max(0, element.scrollWidth - element.clientWidth)
      const cards = Array.from(element.querySelectorAll(':scope > article'))
      const first = cards[0]?.getBoundingClientRect()
      const stops: number[] = []
      if (first) {
        for (const card of cards) {
          const rect = card.getBoundingClientRect()
          const offset = locale === 'ar' ? first.right - rect.right : rect.left - first.left
          const stop = Math.min(maximum, Math.max(0, offset))
          stops.push(stop)
        }
      }
      const offset = Math.min(maximum, Math.max(0, element.scrollLeft * (locale === 'ar' ? -1 : 1)))
      const requested = requestedItem.current
      const current =
        requested !== null && Math.abs(stops[requested] - offset) < 1
          ? requested
          : maximum > 1 && maximum - offset < 1
            ? stops.length - 1
            : stops.reduce(
                (nearest, stop, index) =>
                  Math.abs(stop - offset) < Math.abs(stops[nearest] - offset) ? index : nearest,
                0,
              )
      setPosition((previous) =>
        previous.ready &&
        previous.overflow === maximum > 1 &&
        previous.current === current &&
        previous.stops.length === stops.length &&
        previous.stops.every((stop, index) => Math.abs(stop - stops[index]) < 0.5)
          ? previous
          : { stops, current, ready: true, overflow: maximum > 1 },
      )
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }
    const clearRequest = () => {
      requestedItem.current = null
    }
    for (const event of ['wheel', 'pointerdown', 'keydown'])
      element.addEventListener(event, clearRequest, { passive: true })
    const observer = new ResizeObserver(schedule)
    observer.observe(element)
    for (const card of element.children) observer.observe(card)
    element.addEventListener('scroll', schedule, { passive: true })
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      for (const event of ['wheel', 'pointerdown', 'keydown'])
        element.removeEventListener(event, clearRequest)
      element.removeEventListener('scroll', schedule)
    }
  }, [locale, videos])
  const goTo = (index: number) => {
    requestedItem.current = index
    setPosition((previous) => ({ ...previous, current: index }))
    rail.current?.scrollTo({
      left: position.stops[index] * (locale === 'ar' ? -1 : 1),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }
  const total = position.stops.length
  return (
    <>
      <div
        ref={rail}
        id={railId}
        className={`${styles.videos} ${navigation.rail} ${position.ready ? navigation.enhanced : ''}`}
        aria-label={label}
        role="group"
        tabIndex={0}
        data-video-rail
      >
        {videos.map((video, index) => (
          <article id={`video-${video.id}`} key={video.id}>
            <button
              type="button"
              className={styles.videoCard}
              aria-haspopup="dialog"
              aria-label={video.title}
              onClick={() => {
                setActive(video)
                dialog.current?.showModal()
              }}
            >
              {video.poster && (
                <Image
                  src={video.poster}
                  alt=""
                  fill
                  sizes="(max-width: 40rem) 78vw, 18rem"
                  className={styles.videoBackdrop}
                />
              )}
              {video.poster && (
                <Image
                  src={video.poster}
                  alt=""
                  fill
                  sizes="(max-width: 40rem) 78vw, 18rem"
                  className={styles.videoThumbnail}
                />
              )}
              <span className={styles.videoPlay} aria-hidden="true">
                <svg width="64" height="64" viewBox="0 0 40 40" fill="none">
                  <circle
                    cx="20"
                    cy="20"
                    r="18"
                    fill="rgb(18 52 90 / 45%)"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path d="m16 12 12 8-12 8z" fill="currentColor" />
                </svg>
              </span>
              <span className={styles.videoCopy}>
                <span className={styles.videoTitle}>
                  <bdi>{video.title}</bdi>
                </span>
                <span className={styles.videoMeta}>
                  <bdi>
                    {String(index + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}
                  </bdi>
                  {video.durationSeconds !== undefined && (
                    <bdi>
                      {Math.floor(video.durationSeconds / 60)}:
                      {String(Math.floor(video.durationSeconds % 60)).padStart(2, '0')}
                    </bdi>
                  )}
                </span>
              </span>
            </button>
            <noscript>
              <a href={video.url}>{video.title}</a>
            </noscript>
          </article>
        ))}
      </div>
      {position.overflow && total > 1 && (
        <div
          className={navigation.controls}
          role="group"
          aria-label={t('label')}
          data-video-navigation
        >
          <div className={navigation.pills}>
            {videos.map((video, index) => (
              <button
                key={video.id}
                type="button"
                className={navigation.pill}
                aria-label={`${t('position', { current: index + 1, total })} — ${video.title}`}
                aria-controls={railId}
                aria-current={index === position.current ? 'true' : undefined}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>
      )}
      <dialog
        ref={dialog}
        data-viewer="video"
        className={styles.dialog}
        aria-labelledby="video-dialog-title"
        onClose={() => {
          player.current?.pause()
          setActive(null)
        }}
      >
        <div className={styles.dialogBar}>
          <h2 id="video-dialog-title">
            <bdi>{active?.title}</bdi>
          </h2>
          <div className={styles.videoActions}>
            {active && (
              <a href={active.url} download dir="auto">
                {download}
                <ViewerIcon name="download" />
              </a>
            )}
            <button
              type="button"
              className={styles.iconButton}
              aria-label={close}
              title={close}
              onClick={() => dialog.current?.close()}
            >
              <ViewerIcon name="close" />
            </button>
          </div>
        </div>
        {active && (
          <video
            ref={player}
            key={active.id}
            className={styles.popupVideo}
            controls
            preload="none"
            poster={active.poster}
            aria-label={active.title}
            playsInline
          >
            <source src={active.url} type={active.mimeType} />
            <a href={active.url}>{active.title}</a>
          </video>
        )}
      </dialog>
    </>
  )
}
