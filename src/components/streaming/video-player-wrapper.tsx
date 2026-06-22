'use client'

import { useCallback, useRef } from 'react'
import { VideoPlayer } from '@/components/video-player'
import { recordWatchProgressAction } from '@/app/actions/watch-history'

interface VideoPlayerWrapperProps {
  filmId: string
  src: string
  poster?: string
  title?: string
  className?: string
}

/** Milestones (%) at which we flush progress to the server. */
const MILESTONES = [25, 50, 75, 100]

export function VideoPlayerWrapper({
  filmId,
  src,
  poster,
  title,
  className,
}: VideoPlayerWrapperProps) {
  /** Container div — used to find the underlying <video> element for duration. */
  const containerRef = useRef<HTMLDivElement>(null)

  /** Tracks which milestones have already been reported this session. */
  const reportedMilestones = useRef<Set<number>>(new Set())

  /** Timer ID for the 30-second periodic flush. */
  const flushTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  /** Latest percent seen — kept for the periodic flush. */
  const latestPctRef = useRef(0)

  /** Read the video element's duration from the DOM (VideoPlayer owns the ref). */
  const getDuration = useCallback((): number => {
    const video = containerRef.current?.querySelector('video')
    return video?.duration ?? 0
  }, [])

  /** Fire the server action without blocking the UI. */
  const flush = useCallback(
    (pct: number) => {
      const duration = getDuration()
      const watchedSec = duration ? Math.round((pct / 100) * duration) : 0
      recordWatchProgressAction(filmId, pct, watchedSec).catch(() => {
        // Silently ignore network/auth errors — non-critical
      })
    },
    [filmId, getDuration]
  )

  const handleProgress = useCallback(
    (percent: number) => {
      latestPctRef.current = percent

      // Check milestones (25 / 50 / 75 / 100 %)
      for (const milestone of MILESTONES) {
        if (percent >= milestone && !reportedMilestones.current.has(milestone)) {
          reportedMilestones.current.add(milestone)
          flush(milestone)
        }
      }

      // Reset 30-second periodic flush timer
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current)
      flushTimerRef.current = setTimeout(() => {
        flush(Math.round(latestPctRef.current))
      }, 30_000)
    },
    [flush]
  )

  const handleComplete = useCallback(() => {
    if (flushTimerRef.current) clearTimeout(flushTimerRef.current)
    // Ensure 100 % is always recorded when the video ends
    if (!reportedMilestones.current.has(100)) {
      reportedMilestones.current.add(100)
      flush(100)
    }
  }, [flush])

  return (
    <div ref={containerRef} className={className} style={{ display: 'contents' }}>
      <VideoPlayer
        src={src}
        poster={poster}
        title={title}
        className={className}
        onProgress={handleProgress}
        onComplete={handleComplete}
      />
    </div>
  )
}
