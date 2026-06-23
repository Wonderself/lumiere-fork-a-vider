import { Lightbulb, ImageIcon } from 'lucide-react'
import type { Block } from '@/content/academy'
import { CopyPrompt } from './copy-prompt'

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h':
            return (
              <h3 key={i} className="text-xl font-semibold text-white pt-2">
                {block.text}
              </h3>
            )
          case 'p':
            return (
              <p key={i} className="text-white/70 leading-relaxed text-[15px]">
                {block.text}
              </p>
            )
          case 'ul':
            return (
              <ul key={i} className="space-y-2.5 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-white/70 text-[15px] leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E50914]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={i} className="space-y-2.5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-white/70 text-[15px] leading-relaxed">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E50914]/15 text-xs font-semibold text-[#E50914]">
                      {j + 1}
                    </span>
                    <span className="pt-0.5">{item}</span>
                  </li>
                ))}
              </ol>
            )
          case 'tip':
            return (
              <div
                key={i}
                className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4"
              >
                <Lightbulb className="h-5 w-5 shrink-0 text-amber-400" />
                <p className="text-[15px] leading-relaxed text-amber-100/80">{block.text}</p>
              </div>
            )
          case 'img':
            return (
              <figure key={i} className="space-y-2">
                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-[#E50914]/[0.06]">
                  <div className="flex flex-col items-center gap-2 px-6 text-center">
                    <ImageIcon className="h-8 w-8 text-white/30" />
                    <span className="text-xs text-white/40">{block.alt}</span>
                  </div>
                </div>
                <figcaption className="text-center text-xs text-white/40">{block.caption}</figcaption>
              </figure>
            )
          case 'prompt':
            return <CopyPrompt key={i} label={block.label} text={block.text} />
          default:
            return null
        }
      })}
    </div>
  )
}
