import { useCallback, useEffect, useRef } from 'react'

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_115001_bcdaa3b4-03de-47e7-ad63-ae3e392c32d4.mp4'
const FADE_MS = 500
const FADE_OUT_REMAINING = 0.55

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef<number | null>(null)
  const fadingOutRef = useRef(false)

  const fadeTo = useCallback((target: number) => {
    const video = videoRef.current
    if (!video) return
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    const startOpacity = parseFloat(video.style.opacity || '0')
    const startTime = performance.now()
    const step = (now: number) => {
      const t = Math.min((now - startTime) / FADE_MS, 1)
      video.style.opacity = String(startOpacity + (target - startOpacity) * t)
      rafRef.current = t < 1 ? requestAnimationFrame(step) : null
    }
    rafRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
  }, [])

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration || fadingOutRef.current) return
    if (video.duration - video.currentTime <= FADE_OUT_REMAINING) {
      fadingOutRef.current = true
      fadeTo(0)
    }
  }

  const handleEnded = () => {
    const video = videoRef.current
    if (!video) return
    video.style.opacity = '0'
    window.setTimeout(() => {
      video.currentTime = 0
      void video.play().catch(() => {})
      fadingOutRef.current = false
      fadeTo(1)
    }, 100)
  }

  return (
    <video
      ref={videoRef}
      src={VIDEO_URL}
      autoPlay
      muted
      playsInline
      style={{ opacity: 0 }}
      className="absolute inset-0 w-full h-full object-cover translate-y-[17%]"
      onLoadedData={() => fadeTo(1)}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  )
}
