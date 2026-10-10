'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import type { Locale } from '@/i18n/locales'
import { ViewerIcon } from './ViewerIcon'
import styles from './MediaLibrary.module.css'

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
  previous,
  next,
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
  const scroll = (step: number) => {
    const element = rail.current
    if (!element) return
    element.scrollBy({
      left: step * (locale === 'ar' ? -1 : 1) * element.clientWidth * 0.8,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    })
  }
  return (
    <>
      <div className={styles.railControls}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label={previous}
          title={previous}
          onClick={() => scroll(-1)}
        >
          <ViewerIcon name={locale === 'ar' ? 'next' : 'previous'} />
        </button>
        <button
          type="button"
          className={styles.iconButton}
          aria-label={next}
          title={next}
          onClick={() => scroll(1)}
        >
          <ViewerIcon name={locale === 'ar' ? 'previous' : 'next'} />
        </button>
      </div>
      <div ref={rail} className={styles.videos} aria-label={label} role="group" tabIndex={0}>
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
