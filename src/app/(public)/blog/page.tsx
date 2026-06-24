import { BLOG_ARTICLES, CONTENT_AGENTS } from '@/data/landing-content'
import Image from 'next/image'
import Link from 'next/link'
import { PenTool, Clock, ArrowRight, Bot } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Blog — CineGeny', description: 'Articles on collaborative cinema and AI' }

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">Blog <span className="text-[#E50914]">CineGeny</span></h1>
          <p className="text-gray-400">Participatory cinema, AI, industry trends</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOG_ARTICLES.map(article => (
            <div key={article.slug} className="rounded-2xl border border-gray-800 bg-gray-900/50 overflow-hidden group hover:border-gray-700 transition-colors">
              <div className="aspect-video relative"><Image src={article.coverImage} alt={article.title} fill className="object-cover" /></div>
              <div className="p-6">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E50914]/10 text-[#E50914] font-medium">{article.category}</span>
                <h2 className="text-lg font-bold text-white mt-3 mb-2 group-hover:text-[#E50914] transition-colors">{article.title}</h2>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{article.excerpt}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-600">
                  <span>{article.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{article.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
