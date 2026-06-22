'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { TEAM_ROLES, WIDGET_CONFIG } from '@/data/community-enhanced'
import {
  Users, Plus, Copy, Check, Mail, Link, Crown,
  Film, Briefcase, PenTool, Palette, Eye, User,
  Settings, Trash2, Shield, Code, CheckCircle2,
} from 'lucide-react'

const ROLE_ICONS: Record<string, typeof Users> = {
  crown: Crown, clapperboard: Film, briefcase: Briefcase,
  'pen-tool': PenTool, palette: Palette, user: User, eye: Eye,
}

interface TeamMember {
  id: string; name: string; email: string; role: string; joinedAt: Date; avatar: string
}

const MOCK_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Vous (Admin)', email: 'admin@admin.com', role: 'owner', joinedAt: new Date(Date.now() - 30 * 86400000), avatar: '👑' },
  { id: '2', name: 'Sophie M.', email: 'sophie@example.com', role: 'director', joinedAt: new Date(Date.now() - 20 * 86400000), avatar: '🎬' },
  { id: '3', name: 'Alex D.', email: 'alex@example.com', role: 'artist', joinedAt: new Date(Date.now() - 15 * 86400000), avatar: '🎨' },
]

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(MOCK_MEMBERS)
  const [tab, setTab] = useState<'members' | 'invite' | 'widget'>('members')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('contributor')
  const [copied, setCopied] = useState(false)
  const inviteLink = 'https://cinegeny.com/invite/abc123xyz'

  function sendInvite() {
    if (!inviteEmail.trim()) { toast.error('Email requis'); return }
    setMembers(prev => [...prev, { id: `m-${Date.now()}`, name: inviteEmail.split('@')[0], email: inviteEmail, role: inviteRole, joinedAt: new Date(), avatar: '👤' }])
    setInviteEmail('')
    toast.success(`Invitation envoyée à ${inviteEmail}`)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Team Workspace</h1>
        <p className="text-sm text-white/50 mt-1">{members.length} membres · Workspace collaboratif par film</p>
      </div>

      <div className="flex gap-2">
        {[
          { key: 'members' as const, label: 'Membres', icon: Users },
          { key: 'invite' as const, label: 'Inviter', icon: Plus },
          { key: 'widget' as const, label: 'Widget', icon: Code },
        ].map(t => {
          const TIcon = t.icon
          return <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium ${tab === t.key ? 'bg-[#E50914] text-white' : 'bg-white/[0.05] text-white/60'}`}><TIcon className="h-3.5 w-3.5" />{t.label}</button>
        })}
      </div>

      {/* MEMBERS */}
      {tab === 'members' && (
        <div className="space-y-3">
          {/* Roles Legend */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {TEAM_ROLES.map(role => {
              const RIcon = ROLE_ICONS[role.icon] || User
              return (
                <div key={role.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 shrink-0">
                  <RIcon className="h-3.5 w-3.5" style={{ color: role.color }} />
                  <span className="text-[10px] text-white/60">{role.label}</span>
                </div>
              )
            })}
          </div>

          {members.map(member => {
            const roleConf = TEAM_ROLES.find(r => r.id === member.role) || TEAM_ROLES[5]
            const RIcon = ROLE_ICONS[roleConf.icon] || User
            return (
              <div key={member.id} className="flex items-center gap-4 px-5 py-4 rounded-xl border border-white/10 bg-white/5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)] transition-shadow">
                <span className="text-2xl">{member.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{member.name}</p>
                  <p className="text-[10px] text-white/50">{member.email}</p>
                </div>
                <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${roleConf.color}15`, color: roleConf.color }}>
                  <RIcon className="h-3 w-3" />{roleConf.label}
                </span>
                <span className="text-[10px] text-white/50">{member.joinedAt.toLocaleDateString('fr-FR')}</span>
                {member.role !== 'owner' && (
                  <button onClick={() => { setMembers(prev => prev.filter(m => m.id !== member.id)); toast.success('Membre retiré') }} className="text-white/50 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* INVITE */}
      {tab === 'invite' && (
        <div className="space-y-6 max-w-lg">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-white">Inviter par email</h3>
            <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="email@example.com" className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm focus:border-[#E50914] focus:outline-none" />
            <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="w-full rounded-xl border border-white/10 px-4 py-2.5 text-sm">
              {TEAM_ROLES.filter(r => r.id !== 'owner').map(r => <option key={r.id} value={r.id}>{r.label} — {r.permissions.join(', ')}</option>)}
            </select>
            <button onClick={sendInvite} className="w-full py-3 bg-[#E50914] text-white font-semibold rounded-xl hover:bg-[#FF2D2D]"><Mail className="inline h-4 w-4 mr-2" />Envoyer l&apos;invitation</button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm font-semibold text-white mb-3">Lien d&apos;invitation</h3>
            <div className="flex gap-2">
              <code className="flex-1 px-3 py-2 rounded-lg bg-white/[0.03] text-xs font-mono text-white/60 truncate">{inviteLink}</code>
              <button onClick={copyLink} className="px-3 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-xs">{copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-white/50" />}</button>
            </div>
          </div>
        </div>
      )}

      {/* WIDGET */}
      {tab === 'widget' && (
        <div className="space-y-6 max-w-lg">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Code className="h-4 w-4 text-purple-500" />Widget Embeddable</h3>
            <p className="text-xs text-white/50 mb-4">Intégrez le chat CineGeny sur votre site externe</p>
            <code className="block px-4 py-3 rounded-lg bg-white/[0.04] text-xs text-green-500 font-mono whitespace-pre-wrap">{WIDGET_CONFIG.embedCode}</code>
            <div className="mt-4 space-y-2">
              <p className="text-[10px] text-white/50 font-semibold">Fonctionnalités incluses :</p>
              {WIDGET_CONFIG.features.map(f => <p key={f} className="text-[10px] text-white/50 flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-500" />{f}</p>)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
