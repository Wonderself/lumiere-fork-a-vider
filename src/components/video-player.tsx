'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Play, Pause, Maximize, Minimize, Volume2, VolumeX, SkipForward, SkipBack, Settings, Subtitles, Check, X } from 'lucide-react'

type SubtitleTrack = {
  label: string
  srclang: string
  src: string
}

type VideoPlayerProps = {
  src: string
  poster?: string
  title?: string
  subtitles?: SubtitleTrack[]
  autoPlay?: boolean
  onProgress?: (percent: number) => void
  onComplete?: () => void
  className?: string
}

export function VideoPlayer({
  src,
  poster,
  title,
  subtitles = [],
  autoPlay = false,
  onProgress,
  onComplete,
  className = '',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [progress, setProgress] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [volume, setVolume] = useState(1)
  const [activeSubtitle, setActiveSubtitle] = useState<string | null>(null) // srclang or null = off
  const [showCCMenu, setShowCCMenu] = useState(false)

  // Format time
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  // Show controls temporarily
  const revealControls = useCallback(() => {
    setShowControls(true)
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current)
    if (playing) {
      hideControlsTimer.current = setTimeout(() => setShowControls(false), 3000)
    }
  }, [playing])

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }, [])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current
    if (!container) return
    if (!document.fullscreenElement) {
      await container.requestFullscreen()
      setFullscreen(true)
    } else {
      await document.exitFullscreen()
      setFullscreen(false)
    }
  }, [])

  // Seek
  const seek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    const bar = progressRef.current
    if (!video || !bar) return
    const rect = bar.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    video.currentTime = pct * video.duration
  }, [])

  // Skip forward/back
  const skip = useCallback((seconds: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds))
  }, [])

  // Handle volume change
  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const v = parseFloat(e.target.value)
    video.volume = v
    setVolume(v)
    setMuted(v === 0)
  }, [])

  // Switch active subtitle track (srclang) or disable all (null)
  const selectSubtitle = useCallback((srclang: string | null) => {
    const video = videoRef.current
    if (!video) return
    const tracks = Array.from(video.textTracks)
    tracks.forEach((track) => {
      track.mode = track.language === srclang ? 'showing' : 'hidden'
    })
    setActiveSubtitle(srclang)
    setShowCCMenu(false)
  }, [])

  // Time/progress updates
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => {
      if (video.duration) {
        const pct = (video.currentTime / video.duration) * 100
        setProgress(pct)
        setCurrentTime(video.currentTime)
        onProgress?.(pct)
      }
    }

    const onLoadedMetadata = () => {
      setDuration(video.duration)
    }

    const onBufferUpdate = () => {
      if (video.buffered.length > 0) {
        setBuffered((video.buffered.end(video.buffered.length - 1) / video.duration) * 100)
      }
    }

    const onEnded = () => {
      setPlaying(false)
      setShowControls(true)
      onComplete?.()
    }

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('progress', onBufferUpdate)
    video.addEventListener('ended', onEnded)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('progress', onBufferUpdate)
      video.removeEventListener('ended', onEnded)
    }
  }, [onProgress, onComplete])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'f':
          toggleFullscreen()
          break
        case 'm':
          toggleMute()
          break
        case 'ArrowLeft':
          skip(-10)
          break
        case 'ArrowRight':
          skip(10)
          break
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [togglePlay, toggleFullscreen, toggleMute, skip])

  return (
    <div
      ref={containerRef}
      className={`relative group bg-black rounded-xl overflow-hidden select-none ${className}`}
      onMouseMove={revealControls}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        playsInline
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
      >
        {subtitles.map((sub) => (
          <track key={sub.srclang} kind="subtitles" label={sub.label} srcLang={sub.srclang} src={sub.src} />
        ))}
      </video>

      {/* Play overlay (when paused) */}
      {!playing && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 rounded-full bg-[#E50914] flex items-center justify-center shadow-lg shadow-[#E50914]/30 hover:scale-110 transition-transform">
            <Play className="h-7 w-7 text-black ml-1" />
          </div>
        </div>
      )}

      {/* Title bar */}
      {title && showControls && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent transition-opacity duration-300">
          <p className="text-white text-sm font-medium truncate">{title}</p>
        </div>
      )}

      {/* Controls bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="h-1 mx-4 mb-2 bg-white/20 rounded-full cursor-pointer group/bar hover:h-2 transition-all"
          onClick={seek}
        >
          <div className="absolute h-full bg-white/10 rounded-full" style={{ width: `${buffered}%` }} />
          <div className="relative h-full bg-[#E50914] rounded-full" style={{ width: `${progress}%` }}>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#E50914] opacity-0 group-hover/bar:opacity-100 transition-opacity shadow-sm" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 px-4 pb-3">
          <button onClick={togglePlay} className="text-white hover:text-[#E50914] transition-colors">
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button onClick={() => skip(-10)} className="text-white/60 hover:text-white transition-colors">
            <SkipBack className="h-4 w-4" />
          </button>
          <button onClick={() => skip(10)} className="text-white/60 hover:text-white transition-colors">
            <SkipForward className="h-4 w-4" />
          </button>

          {/* Time */}
          <span className="text-xs text-white/50 tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
              {muted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="w-16 h-1 accent-[#E50914] cursor-pointer"
            />
          </div>

          {/* CC / Subtitles */}
          {subtitles.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowCCMenu((prev) => !prev)}
                className={`text-white/60 hover:text-white transition-colors ${activeSubtitle ? 'text-[#E50914]' : ''}`}
                title="Sous-titres"
              >
                <Subtitles className="h-4 w-4" />
              </button>

              {/* CC popup */}
              {showCCMenu && (
                <div className="absolute bottom-8 right-0 min-w-[160px] rounded-xl border border-white/10 bg-[#111]/95 backdrop-blur-sm shadow-2xl p-1 z-50">
                  <div className="px-2 py-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">Sous-titres</span>
                    <button onClick={() => setShowCCMenu(false)} className="text-white/30 hover:text-white/60 transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Off option */}
                  <button
                    onClick={() => selectSubtitle(null)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                      activeSubtitle === null
                        ? 'bg-[#E50914]/10 text-[#E50914]'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <span>Désactivé</span>
                    {activeSubtitle === null && <Check className="h-3 w-3 shrink-0" />}
                  </button>

                  {/* Track options */}
                  {subtitles.map((sub) => (
                    <button
                      key={sub.srclang}
                      onClick={() => selectSubtitle(sub.srclang)}
                      className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                        activeSubtitle === sub.srclang
                          ? 'bg-[#E50914]/10 text-[#E50914]'
                          : 'text-white/50 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <span>{sub.label}</span>
                      {activeSubtitle === sub.srclang && <Check className="h-3 w-3 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} className="text-white/60 hover:text-white transition-colors">
            {fullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
