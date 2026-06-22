'use client'

import { useState } from 'react'
import {
  USER_LEVELS, CINEMA_BADGES, STREAK_MULTIPLIERS, REFERRAL_CONFIG,
  RARITY_CONFIG, XP_ACTIONS, getXPProgress, getDailyChallenges, getStreakMultiplier,
  ENGAGEMENT_AGENTS,
} from '@/data/engagement'
import { microToCredits } from '@/lib/ai-pricing'
import {
  Trophy, Star, Flame, Target, Users, Gift, TrendingUp,
  Award, Zap, CheckCircle2, Lock, Clock, Copy, Check,
  Bot, BarChart3, ChevronRight, Shield, Heart,
} from 'lucide-react'
import { toast } from 'sonner'

export default function RewardsPage() {
  const [tab, setTab] = useState<'overview' | 'badges' | 'challenges' | 'referral'>('overview')
  const [userXP] = useState(1850) // Simulated
  const [streak] = useState(5)     // Simulated
  const [unlockedBadges] = useState(['first-clap', 'first-vote', 'profile-star', 'ai-explorer', 'streak-7'])
  const [copied, setCopied] = useState(false)

  const xpProgress = getXPProgress(userXP)
  const streakMulti = getStreakMultiplier(streak)
  const dailyChallenges = getDailyChallenges(3)
  const referralCode = 'CINEGENY-ABC123'

  async function copyReferral() {
    await navigator.clipboard.writeText(`https://cinegen.com/register?ref=${referralCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Lien de parrainage copié !')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Récompenses & Progression</span>
          </div>
          <h1 className="text-4xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">
            Votre <span className="text-[#E50914]">Parcours</span> Cinéma
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">
            Gagnez de l&apos;XP, débloquez des badges cinéma, maintenez votre streak et relevez des défis quotidiens.
          </p>
        </div>

        {/* Level Card */}
        <div className="rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-900/30 p-8 mb-8">
          <div className="flex items-center gap-6">
            <div className="text-5xl">{xpProgress.level.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-white">{xpProgress.level.title}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-400">Niv. {xpProgress.level.level}</span>
              </div>
              <p className="text-sm text-gray-400 mb-3">{userXP.toLocaleString()} XP total</p>
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden mb-1">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${xpProgress.progress}%`, backgroundColor: xpProgress.level.color }} />
              </div>
              <div className="flex justify-between text-[10px] text-gray-500">
                <span>{xpProgress.level.title}</span>
                {xpProgress.nextLevel && <span>{xpProgress.remaining} XP → {xpProgress.nextLevel.title} {xpProgress.nextLevel.icon}</span>}
              </div>
            </div>
            {/* Streak */}
            <div className="text-center px-6 py-4 rounded-xl border border-gray-800 bg-gray-900/50">
              <Flame className="h-6 w-6 text-orange-500 mx-auto mb-1" />
              <p className="text-2xl font-bold text-white">{streak}</p>
              <p className="text-[10px] text-gray-500">jours</p>
              <p className="text-[10px] text-orange-400 mt-1">{streakMulti.emoji} x{streakMulti.multiplier}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { key: 'overview' as const, label: 'Vue d\'ensemble', icon: TrendingUp },
            { key: 'badges' as const, label: `Badges (${unlockedBadges.length}/${CINEMA_BADGES.length})`, icon: Award },
            { key: 'challenges' as const, label: 'Défis du jour', icon: Target },
            { key: 'referral' as const, label: 'Parrainage', icon: Users },
          ].map(t => {
            const TIcon = t.icon
            return <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium ${tab === t.key ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}><TIcon className="h-4 w-4" />{t.label}</button>
          })}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {/* Levels Roadmap */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Progression des niveaux</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {USER_LEVELS.map(level => {
                  const isUnlocked = userXP >= level.minXP
                  return (
                    <div key={level.level} className={`rounded-xl border p-4 text-center ${isUnlocked ? 'border-gray-700 bg-gray-800/50' : 'border-gray-800/50 bg-gray-900/30 opacity-50'}`}>
                      <span className="text-2xl">{level.icon}</span>
                      <p className="text-sm font-semibold text-white mt-1">{level.title}</p>
                      <p className="text-[10px] text-gray-500">{level.minXP.toLocaleString()} XP</p>
                      {isUnlocked && <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto mt-1" />}
                      {!isUnlocked && <Lock className="h-4 w-4 text-gray-600 mx-auto mt-1" />}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* XP Actions */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Comment gagner de l&apos;XP</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {XP_ACTIONS.slice(0, 12).map(action => (
                  <div key={action.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-800 bg-gray-900/50">
                    <Zap className="h-4 w-4 text-yellow-400 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-white">{action.label}</p>
                      <p className="text-[10px] text-gray-500">{action.description}</p>
                    </div>
                    <span className="text-xs font-bold text-yellow-400">+{action.xp} XP</span>
                    {action.creditReward && <span className="text-[10px] text-emerald-400">+{microToCredits(action.creditReward).toFixed(1)} cr</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Streak Multipliers */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" /> Multiplicateurs Streak
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {STREAK_MULTIPLIERS.map(sm => (
                  <div key={sm.days} className={`shrink-0 rounded-xl border p-4 text-center min-w-[100px] ${streak >= sm.days ? 'border-orange-500/30 bg-orange-500/5' : 'border-gray-800'}`}>
                    <p className="text-lg">{sm.emoji || '⏳'}</p>
                    <p className="text-sm font-bold text-white">x{sm.multiplier}</p>
                    <p className="text-[10px] text-gray-500">{sm.days}j+</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BADGES */}
        {tab === 'badges' && (
          <div className="space-y-6">
            {(['common', 'rare', 'epic', 'legendary'] as const).map(rarity => {
              const badges = CINEMA_BADGES.filter(b => b.rarity === rarity)
              const rc = RARITY_CONFIG[rarity]
              return (
                <div key={rarity}>
                  <h3 className="text-sm font-semibold mb-3" style={{ color: rc.color }}>{rc.label} ({badges.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {badges.map(badge => {
                      const isUnlocked = unlockedBadges.includes(badge.id)
                      return (
                        <div key={badge.id} className={`rounded-xl border p-4 text-center transition-all ${isUnlocked ? 'border-gray-700 bg-gray-800/50' : 'border-gray-800/30 bg-gray-900/20 opacity-40'}`}>
                          <span className="text-3xl">{badge.icon}</span>
                          <p className="text-xs font-semibold text-white mt-2">{badge.name}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{badge.description}</p>
                          <div className="flex items-center justify-center gap-2 mt-2 text-[10px]">
                            <span className="text-yellow-400">+{badge.xpReward} XP</span>
                            <span className="text-emerald-400">+{microToCredits(badge.creditReward).toFixed(0)} cr</span>
                          </div>
                          {isUnlocked && <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto mt-1" />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CHALLENGES */}
        {tab === 'challenges' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5 flex items-center gap-3">
              <Target className="h-6 w-6 text-yellow-400" />
              <div>
                <p className="text-sm font-semibold text-white">Défis du jour</p>
                <p className="text-xs text-gray-400">Complétez les défis pour des récompenses bonus. Se renouvelle à minuit.</p>
              </div>
              <Clock className="h-4 w-4 text-gray-500 ml-auto" />
            </div>

            {dailyChallenges.map(challenge => {
              const diffColor = challenge.difficulty === 'easy' ? 'text-green-400 bg-green-400/10' : challenge.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-400/10' : 'text-red-400 bg-red-400/10'
              return (
                <div key={challenge.id} className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{challenge.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-white">{challenge.title}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${diffColor}`}>{challenge.difficulty}</span>
                      </div>
                      <p className="text-xs text-gray-400">{challenge.description}</p>
                      <div className="w-full h-2 bg-gray-800 rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-[#E50914] rounded-full" style={{ width: '0%' }} />
                      </div>
                      <p className="text-[10px] text-gray-600 mt-1">0/{challenge.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-yellow-400">+{challenge.xpReward} XP</p>
                      <p className="text-[10px] text-emerald-400">+{microToCredits(challenge.creditReward).toFixed(1)} cr</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* REFERRAL */}
        {tab === 'referral' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent p-8 text-center">
              <Users className="h-10 w-10 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Programme de Parrainage</h3>
              <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
                Invitez vos amis et gagnez des crédits et de l&apos;XP pour chaque filleul inscrit.
              </p>

              <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-4 max-w-sm mx-auto flex items-center gap-3">
                <code className="flex-1 text-sm font-mono text-white">{referralCode}</code>
                <button onClick={copyReferral} className="px-3 py-1.5 rounded-lg text-xs bg-[#E50914] text-white hover:bg-[#FF2D2D]">
                  {copied ? <Check className="inline h-3.5 w-3.5" /> : <Copy className="inline h-3.5 w-3.5" />}
                  {copied ? ' Copié' : ' Copier'}
                </button>
              </div>
            </div>

            {/* Rewards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center">
                <Gift className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Pour vous (parrain)</p>
                <p className="text-lg font-bold text-yellow-400 mt-1">{REFERRAL_CONFIG.referrerReward.label}</p>
                <p className="text-[10px] text-gray-500">par filleul inscrit</p>
              </div>
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center">
                <Heart className="h-6 w-6 text-pink-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">Pour votre ami (filleul)</p>
                <p className="text-lg font-bold text-pink-400 mt-1">{REFERRAL_CONFIG.refereeReward.label}</p>
                <p className="text-[10px] text-gray-500">à l&apos;inscription</p>
              </div>
            </div>

            {/* Milestones */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Paliers bonus</h3>
              {REFERRAL_CONFIG.milestones.map((m, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-800 mb-2">
                  <span className="text-lg">🎯</span>
                  <p className="text-xs text-white flex-1">{m.label}</p>
                  <span className="text-xs text-emerald-400">+{microToCredits(m.bonus).toFixed(0)} cr</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
