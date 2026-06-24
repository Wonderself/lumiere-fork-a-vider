'use client'

import { motion } from 'framer-motion'
import { Lightbulb, ImageIcon } from 'lucide-react'
import Image from 'next/image'
import type { Block } from '@/content/academy'
import { CopyPrompt } from './copy-prompt'

const reveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
}

export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h':
            return (
              <motion.h3 {...reveal} key={i} className="relative text-xl font-semibold text-white pt-3 pl-4">
                <span className="absolute left-0 top-3 bottom-1 w-1 rounded-full bg-gradient-to-b from-[#E50914] to-[#E50914]/20" />
                {block.text}
              </motion.h3>
            )
          case 'p':
            return (
              <motion.p {...reveal} key={i} className="text-white/70 leading-relaxed text-[15px]">
                {block.text}
              </motion.p>
            )
          case 'ul':
            return (
              <motion.ul {...reveal} key={i} className="space-y-2.5 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-white/70 text-[15px] leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E50914]" />
                    <span>{item}</span>
                  </li>
                ))}
              </motion.ul>
            )
          case 'ol':
            return (
              <motion.ol {...reveal} key={i} className="space-y-2.5">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-white/70 text-[15px] leading-relaxed">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E50914]/15 text-xs font-semibold text-[#E50914]">
                      {j + 1}
                    </span>
                    <span className="pt-0.5">{item}</span>
                  </li>
                ))}
              </motion.ol>
            )
          case 'tip':
            return (
              <motion.div
                {...reveal}
                key={i}
                className="flex gap-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4 shadow-[0_0_30px_-12px_rgba(245,158,11,0.4)]"
              >
                <Lightbulb className="h-5 w-5 shrink-0 text-amber-400" />
                <p className="text-[15px] leading-relaxed text-amber-100/80">{block.text}</p>
              </motion.div>
            )
          case 'table':
            return (
              <motion.figure {...reveal} key={i} className="space-y-2">
                <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-white/[0.02]">
                  <table className="w-full border-collapse text-left text-[13.5px]">
                    <thead>
                      <tr className="border-b border-white/[0.1] bg-white/[0.04]">
                        {block.headers.map((h, k) => (
                          <th key={k} className="px-4 py-2.5 font-semibold text-white/90 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, r) => (
                        <tr key={r} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03] transition-colors">
                          {row.map((cell, c) => (
                            <td key={c} className={`px-4 py-2.5 align-top ${c === 0 ? 'font-medium text-white/85 whitespace-nowrap' : 'text-white/60'}`}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.caption && <figcaption className="text-center text-xs text-white/40">{block.caption}</figcaption>}
              </motion.figure>
            )
          case 'img':
            return (
              <motion.figure {...reveal} key={i} className="space-y-2">
                <div className="group relative aspect-video overflow-hidden rounded-xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-[#E50914]/[0.06]">
                  {block.src ? (
                    <>
                      <Image
                        src={block.src}
                        alt={block.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 720px"
                        className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center gap-2 px-6 text-center">
                        <ImageIcon className="h-8 w-8 text-white/30" />
                        <span className="text-xs text-white/40">{block.alt}</span>
                      </div>
                    </div>
                  )}
                </div>
                <figcaption className="text-center text-xs text-white/40">{block.caption}</figcaption>
              </motion.figure>
            )
          case 'prompt':
            return (
              <motion.div {...reveal} key={i}>
                <CopyPrompt label={block.label} text={block.text} />
              </motion.div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
