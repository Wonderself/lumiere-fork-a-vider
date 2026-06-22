'use client'

import { useState } from 'react'
import { ModelSelector } from '@/components/tasks/model-selector'
import { AITaskAssistant } from '@/components/tasks/ai-task-assistant'
import { VideoGenerator } from '@/components/tasks/video-generator'
import { TASK_AGENTS } from '@/lib/task-ai.service'
import {
  PenTool, Palette, Music, Film, Zap, Bot,
  Video, Camera, Scissors, Volume2, Shield,
} from 'lucide-react'

const TASK_CATEGORIES = [
  { id: 'screenplay', label: 'Write Screenplay', icon: PenTool, color: '#3B82F6', modelCategory: 'llm' as const, taskType: 'BRAINSTORM' },
  { id: 'vfx', label: 'Design & VFX', icon: Palette, color: '#F97316', modelCategory: 'image' as const, taskType: 'CONCEPT_ART' },
  { id: 'music', label: 'Compose Music', icon: Music, color: '#06B6D4', modelCategory: 'music' as const, taskType: 'MUSIC_COMPOSE' },
  { id: 'directing', label: 'Direct & Produce', icon: Film, color: '#E50914', modelCategory: 'llm' as const, taskType: 'BRAINSTORM' },
  { id: 'editing', label: 'Video Editing', icon: Scissors, color: '#EC4899', modelCategory: 'video' as const, taskType: 'VIDEO_SCENE' },
  { id: 'sound', label: 'Sound Design', icon: Volume2, color: '#14B8A6', modelCategory: 'audio' as const, taskType: 'VOICE_ACTING' },
  { id: 'cinematography', label: 'Cinematography', icon: Camera, color: '#8B5CF6', modelCategory: 'image' as const, taskType: 'STORYBOARD' },
]

export default function AIEnhancedTasksPage() {
  const [activeCategory, setActiveCategory] = useState(TASK_CATEGORIES[0])
  const [selectedModel, setSelectedModel] = useState('')
  const [content, setContent] = useState('')

  const agent = TASK_AGENTS.find(a => a.taskCategory === activeCategory.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          AI-Enhanced Tasks
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Créez avec l&apos;IA — choisissez votre modèle ou laissez le système garantir la cohérence
        </p>
      </div>

      {/* 0% Commission Banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
        <Shield className="h-5 w-5 text-emerald-600 shrink-0" />
        <p className="text-xs text-emerald-700">
          <span className="font-semibold">0% commission</span> — vous ne payez que les tokens IA consommés.
          Prix affichés par modèle, transparence totale.
        </p>
      </div>

      {/* Task Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {TASK_CATEGORIES.map(cat => {
          const CIcon = cat.icon
          const isActive = activeCategory.id === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? 'text-white' : 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08]'
              }`}
              style={isActive ? { backgroundColor: cat.color } : {}}
            >
              <CIcon className="h-4 w-4" />
              {cat.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Work Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agent Info */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3 mb-3">
              <Bot className="h-5 w-5" style={{ color: activeCategory.color }} />
              <div>
                <p className="text-sm font-semibold text-white">Agent dédié : {agent?.name || 'IA'}</p>
                <p className="text-[10px] text-white/50">{agent?.capabilities.join(' · ')}</p>
              </div>
            </div>
            <p className="text-xs text-white/50">
              Cet agent vous accompagne tout au long de la tâche : suggestions créatives, review de cohérence, et chat direct.
            </p>
          </div>

          {/* Content Area */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <label className="text-xs text-white/50 mb-2 block">Votre contribution</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder={`Travaillez sur votre ${activeCategory.label}...`}
              rows={10}
              className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm focus:border-[#E50914] focus:outline-none resize-none"
            />
            <p className="text-[10px] text-white/50 mt-1">{content.length} caractères</p>
          </div>

          {/* Model Selector */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <ModelSelector
              taskType={activeCategory.taskType}
              category={activeCategory.modelCategory}
              selectedModel={selectedModel}
              onSelect={setSelectedModel}
            />
          </div>

          {/* Video Generator (for video/editing tasks) */}
          {(activeCategory.modelCategory === 'video' || activeCategory.id === 'vfx') && (
            <VideoGenerator filmProjectId={undefined} />
          )}
        </div>

        {/* Sidebar: AI Assistant */}
        <div>
          <AITaskAssistant
            taskCategory={activeCategory.id}
            taskDescription={activeCategory.label}
            content={content}
          />
        </div>
      </div>
    </div>
  )
}
