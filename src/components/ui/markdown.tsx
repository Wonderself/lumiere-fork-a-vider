import React from 'react'

export function Markdown({ content }: { content: string }) {
  if (!content) return null

  const lines = content.split('\n')
  const elements: React.ReactElement[] = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Headings
    if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-base font-semibold text-white mt-4 mb-2">{parseLine(line.slice(4))}</h3>)
      continue
    }
    if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-lg font-bold text-white mt-5 mb-2">{parseLine(line.slice(3))}</h2>)
      continue
    }
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-xl font-bold text-white mt-6 mb-3">{parseLine(line.slice(2))}</h1>)
      continue
    }

    // Unordered list
    if (line.match(/^[-*]\s/)) {
      elements.push(
        <div key={i} className="flex gap-2 ml-2 mb-1">
          <span className="text-[#E50914] mt-1">•</span>
          <span className="text-white/70">{parseLine(line.slice(2))}</span>
        </div>
      )
      continue
    }

    // Ordered list
    const olMatch = line.match(/^(\d+)\.\s/)
    if (olMatch) {
      elements.push(
        <div key={i} className="flex gap-2 ml-2 mb-1">
          <span className="text-[#E50914] font-medium min-w-[1.2rem]">{olMatch[1]}.</span>
          <span className="text-white/70">{parseLine(line.slice(olMatch[0].length))}</span>
        </div>
      )
      continue
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={i} className="h-2" />)
      continue
    }

    // Normal paragraph
    elements.push(<p key={i} className="text-white/70 mb-1 leading-relaxed">{parseLine(line)}</p>)
  }

  return <div className="space-y-0.5">{elements}</div>
}

function parseLine(text: string): (string | React.ReactElement)[] {
  const parts: (string | React.ReactElement)[] = []
  let remaining = text
  let key = 0

  while (remaining) {
    // Code inline
    const codeMatch = remaining.match(/`([^`]+)`/)
    if (codeMatch && codeMatch.index !== undefined) {
      if (codeMatch.index > 0) parts.push(remaining.slice(0, codeMatch.index))
      parts.push(
        <code key={key++} className="px-1.5 py-0.5 rounded bg-white/10 text-[#E50914] text-sm font-mono">
          {codeMatch[1]}
        </code>
      )
      remaining = remaining.slice(codeMatch.index + codeMatch[0].length)
      continue
    }

    // Bold
    const boldMatch = remaining.match(/\*\*([^*]+)\*\*/)
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) parts.push(remaining.slice(0, boldMatch.index))
      parts.push(<strong key={key++} className="font-semibold text-white">{boldMatch[1]}</strong>)
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length)
      continue
    }

    // Italic
    const italicMatch = remaining.match(/\*([^*]+)\*/)
    if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) parts.push(remaining.slice(0, italicMatch.index))
      parts.push(<em key={key++} className="italic text-white/80">{italicMatch[1]}</em>)
      remaining = remaining.slice(italicMatch.index + italicMatch[0].length)
      continue
    }

    // Link
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/)
    if (linkMatch && linkMatch.index !== undefined) {
      if (linkMatch.index > 0) parts.push(remaining.slice(0, linkMatch.index))
      parts.push(
        <a key={key++} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
           className="text-[#E50914] underline hover:text-[#FF2D2D] transition-colors">
          {linkMatch[1]}
        </a>
      )
      remaining = remaining.slice(linkMatch.index + linkMatch[0].length)
      continue
    }

    parts.push(remaining)
    break
  }

  return parts
}
