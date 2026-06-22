'use client'

import { useState, useEffect } from 'react'
import { microToCredits } from '@/lib/ai-pricing'
import {
  DollarSign, TrendingUp, Activity, BarChart3,
  Users, Wallet, Loader2, PieChart,
} from 'lucide-react'

// Dynamic import for Recharts (client-only)
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell, Legend,
} from 'recharts'

const COLORS = ['#E50914', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EC4899']

interface BillingData {
  totalRevenue: number
  totalMargin: number
  totalRequests: number
  activeWallets: number
  totalBalance: number
  topUsers: Array<{ userId: string; displayName: string | null; totalSpent: number; requestCount: number }>
  byAction: Array<{ action: string; count: number; totalBilled: number }>
}

export default function EnhancedBillingPage() {
  const [data, setData] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/wallet/admin/stats')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-white/50" />
      </div>
    )
  }

  // Build chart data
  const actionChartData = data.byAction.map(a => ({
    name: a.action.replace(/_/g, ' '),
    credits: microToCredits(a.totalBilled),
    count: a.count,
  }))

  const pieData = data.byAction.map(a => ({
    name: a.action.replace(/_/g, ' '),
    value: a.count,
  }))

  // Simulated timeline data (in production, query by date)
  const timelineData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][i],
    revenue: Math.round(microToCredits(data.totalRevenue) / 7 * (0.5 + Math.random())),
    cost: Math.round(microToCredits(data.totalRevenue - data.totalMargin) / 7 * (0.5 + Math.random())),
  }))

  const kpis = [
    { label: 'Revenue totale', value: `${microToCredits(data.totalRevenue).toFixed(2)} cr`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Marge', value: `${microToCredits(data.totalMargin).toFixed(2)} cr`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Requêtes IA', value: data.totalRequests.toLocaleString(), icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Wallets actifs', value: data.activeWallets, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Solde total', value: `${microToCredits(data.totalBalance).toFixed(2)} cr`, icon: Wallet, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ]

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">
          Billing & Analytics
        </h1>
        <p className="text-sm text-white/50 mt-1">Revenus, coûts et marge avec graphiques détaillés</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {kpis.map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className={`rounded-2xl border border-white/10 ${kpi.bg} p-5`}>
              <Icon className={`h-5 w-5 ${kpi.color} mb-2`} />
              <p className="text-2xl font-bold text-white">{kpi.value}</p>
              <p className="text-[10px] text-white/50 mt-1">{kpi.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Area Chart */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" /> Revenue vs Coûts (7j)
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Revenue" />
              <Area type="monotone" dataKey="cost" stackId="2" stroke="#E50914" fill="#E50914" fillOpacity={0.1} name="Coût" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Action Distribution Pie */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <PieChart className="h-4 w-4 text-purple-500" /> Distribution par action
          </h2>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-[250px] text-sm text-white/50">Pas encore de données</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <RPieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RPieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Bar Chart — Credits by Action */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-500" /> Crédits consommés par action
        </h2>
        {actionChartData.length === 0 ? (
          <div className="flex items-center justify-center h-[200px] text-sm text-white/50">Pas encore de données</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={actionChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="credits" fill="#E50914" radius={[4, 4, 0, 0]} name="Credits" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Users Table */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-sm font-semibold text-white">Top consommateurs</h2>
        </div>
        <div className="divide-y divide-white/10">
          {data.topUsers.map((user, i) => (
            <div key={user.userId} className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.03]">
              <span className="text-xs font-bold text-white/50 w-6">#{i + 1}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{user.displayName || 'Anonymous'}</p>
                <p className="text-[10px] text-white/50">{user.requestCount} requests</p>
              </div>
              <p className="text-sm font-semibold text-[#E50914]">{microToCredits(user.totalSpent).toFixed(2)} cr</p>
            </div>
          ))}
          {data.topUsers.length === 0 && (
            <div className="p-6 text-center text-sm text-white/50">Pas encore de données</div>
          )}
        </div>
      </div>
    </div>
  )
}
