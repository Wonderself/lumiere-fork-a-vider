'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, CheckCircle, AlertCircle, FileVideo, FileImage, FileText, Music } from 'lucide-react'

type FileUploadProps = {
  category: 'video' | 'image' | 'document' | 'subtitle' | 'audio'
  onUploaded: (url: string, fileKey: string) => void
  accept?: string
  maxSizeMB?: number
  label?: string
  className?: string
}

const CATEGORY_CONFIG = {
  video: { icon: FileVideo, accept: 'video/*', color: 'text-purple-400', maxMB: 500 },
  image: { icon: FileImage, accept: 'image/*', color: 'text-blue-400', maxMB: 50 },
  document: { icon: FileText, accept: '.pdf,.txt,.md', color: 'text-green-400', maxMB: 20 },
  subtitle: { icon: FileText, accept: '.vtt,.srt,.txt', color: 'text-yellow-400', maxMB: 5 },
  audio: { icon: Music, accept: 'audio/*', color: 'text-pink-400', maxMB: 200 },
}

export function FileUpload({
  category,
  onUploaded,
  accept,
  maxSizeMB,
  label,
  className = '',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [uploaded, setUploaded] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const config = CATEGORY_CONFIG[category]
  const Icon = config.icon
  const maxSize = (maxSizeMB || config.maxMB) * 1024 * 1024

  const handleFile = useCallback(async (file: File) => {
    setError(null)
    setUploaded(false)
    setFileName(file.name)

    if (file.size > maxSize) {
      setError(`Fichier trop volumineux (max ${maxSizeMB || config.maxMB}MB)`)
      return
    }

    setUploading(true)
    setProgress(0)

    try {
      // 1. Get presigned URL from server
      const { getPresignedUploadUrl } = await import('@/lib/upload')
      const result = await getPresignedUploadUrl(category, file.name, file.type, file.size)

      if (result.error || !result.data) {
        throw new Error(result.error || 'Failed to get upload URL')
      }

      const { uploadUrl, fileKey, publicUrl } = result.data

      // 2. Upload to S3 or local fallback
      if (uploadUrl.startsWith('/api/upload')) {
        // Dev fallback: use FormData
        const formData = new FormData()
        formData.append('file', file)
        formData.append('key', fileKey)

        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!res.ok) throw new Error('Upload failed')

        const data = await res.json()
        setProgress(100)
        setUploaded(true)
        onUploaded(data.publicUrl, fileKey)
      } else {
        // Production: direct PUT to S3
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
        }

        await new Promise<void>((resolve, reject) => {
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve()
            else reject(new Error(`Upload failed: ${xhr.status}`))
          }
          xhr.onerror = () => reject(new Error('Network error'))
          xhr.open('PUT', uploadUrl)
          xhr.setRequestHeader('Content-Type', file.type)
          xhr.send(file)
        })

        setProgress(100)
        setUploaded(true)
        onUploaded(publicUrl, fileKey)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload échoué')
    } finally {
      setUploading(false)
    }
  }, [category, maxSize, maxSizeMB, config.maxMB, onUploaded])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div className={className}>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
          uploaded
            ? 'border-green-500/30 bg-green-500/5'
            : error
              ? 'border-red-500/30 bg-red-500/5'
              : 'border-white/10 bg-white/[0.02] hover:border-[#E50914]/30 hover:bg-[#E50914]/5'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept || config.accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />

        {uploaded ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="h-8 w-8 text-green-400" />
            <p className="text-sm text-green-400 font-medium">Upload réussi</p>
            <p className="text-xs text-white/40 truncate max-w-full">{fileName}</p>
          </div>
        ) : uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/10" />
                <circle
                  cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3"
                  className="text-[#E50914]"
                  strokeDasharray={`${progress * 1.26} 126`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs text-[#E50914] font-bold">
                {progress}%
              </span>
            </div>
            <p className="text-xs text-white/40">{fileName}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Icon className={`h-8 w-8 ${config.color}`} />
            <p className="text-sm text-white/60">
              {label || `Glissez un fichier ou cliquez pour choisir`}
            </p>
            <p className="text-xs text-white/30">
              Max {maxSizeMB || config.maxMB}MB
            </p>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-center gap-2 justify-center text-red-400">
            <AlertCircle className="h-4 w-4" />
            <p className="text-xs">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
