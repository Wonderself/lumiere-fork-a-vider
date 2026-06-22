'use client'

import { useState } from 'react'
import { executeAgentAction, toggleFavoriteAction } from '@/app/actions/agents'
import { Send, Star, Loader2, Bot, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface AgentExecutePanelProps {
  agentSlug: string
  agentName: string
  agentColor: string
  tier: string
}

export function AgentExecutePanel({ agentSlug, agentName, agentColor, tier }: AgentExecutePanelProps) {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [favorited, setFavorited] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleExecute() {
    if (!prompt.trim()) return
    setLoading(true)
    setResponse(null)

    try {
      const result = await executeAgentAction({
        agentSlug,
        prompt: prompt.trim(),
      })

      if ('error' in result && result.error) {
        toast.error(result.error)
      } else if ('response' in result) {
        setResponse((result as any).response || 'No response')
      }
    } catch {
      toast.error('Erreur lors de l\'exécution')
    }
    setLoading(false)
  }

  async function handleToggleFavorite() {
    try {
      const result = await toggleFavoriteAction(agentSlug)
      if ('error' in result && result.error) {
        toast.error(result.error)
      } else if ('favorited' in result) {
        setFavorited(result.favorited)
        toast.success(result.favorited ? 'Agent ajouté aux favoris' : 'Agent retiré des favoris')
      }
    } catch {
      toast.error('Erreur')
    }
  }

  async function handleCopy() {
    if (!response) return
    await navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Execute Section */}
      <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="h-5 w-5" style={{ color: agentColor }} />
            Exécuter {agentName}
          </h2>
          <button
            onClick={handleToggleFavorite}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-yellow-400 transition-colors"
          >
            <Star className={`h-4 w-4 ${favorited ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            {favorited ? 'Favori' : 'Ajouter aux favoris'}
          </button>
        </div>

        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Décrivez votre demande pour ${agentName}...`}
            className="w-full h-32 rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[#E50914] focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between">
            <p className="text-[10px] text-white/60">
              Modèle: {tier === 'L3_STRATEGY' ? 'Opus + Extended Thinking' : tier === 'L2_MANAGEMENT' ? 'Opus' : 'Sonnet'}
              {' · '}Coût estimé basé sur les tokens consommés
            </p>
            <button
              onClick={handleExecute}
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#E50914] hover:bg-[#FF2D2D] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exécution...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Exécuter
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Response */}
      {response && (
        <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bot className="h-4 w-4" style={{ color: agentColor }} />
              Réponse
            </h3>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copié' : 'Copier'}
            </button>
          </div>
          <div className="prose prose-invert prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed">
              {response}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
