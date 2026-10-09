'use client'

import { useEffect, useRef, useState } from 'react'

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasFrame, setHasFrame] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    function applyMotionPreference() {
      if (!video) return
      if (reducedMotion.matches) {
        video.pause()
        video.removeAttribute('src')
        video.load()
        return
      }

      // Assign only after checking motion preferences; the photo is the fallback.
      video.muted = true
      video.src = '/videos/hero.mp4'
      void video.play().catch(() => {
        // A browser may block autoplay; leave the static background available.
      })
    }

    applyMotionPreference()
    reducedMotion.addEventListener('change', applyMotionPreference)
    return () => {
      reducedMotion.removeEventListener('change', applyMotionPreference)
      video.pause()
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className={`hero-video${hasFrame ? ' hero-video--ready' : ''}`}
      width={4096}
      height={1974}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      onPlaying={() => setHasFrame(true)}
      onEmptied={() => setHasFrame(false)}
      onError={() => setHasFrame(false)}
    />
  )
}
