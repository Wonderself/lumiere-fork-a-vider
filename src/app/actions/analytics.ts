'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// ============================================
// ADMIN ANALYTICS OVERVIEW — Platform-wide metrics
// ============================================

export async function getAnalyticsOverview() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifie' }

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (user?.role !== 'ADMIN') return { error: 'Acces refuse' }

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    newUsers30d,
    newUsers7d,
    verifiedUsers,
    totalFilms,
    filmsInProduction,
    filmsReleased,
    totalTasks,
    completedTasks,
    availableTasks,
    inProgressTasks,
    totalScenarios,
    approvedScenarios,
    totalPayments,
    totalNotifications,
    recentPayments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.user.count({ where: { isVerified: true } }),
    prisma.film.count(),
    prisma.film.count({ where: { status: { in: ['IN_PRODUCTION', 'PRE_PRODUCTION', 'POST_PRODUCTION'] } } }),
    prisma.film.count({ where: { status: 'RELEASED' } }),
    prisma.task.count(),
    prisma.task.count({ where: { status: 'VALIDATED' } }),
    prisma.task.count({ where: { status: 'AVAILABLE' } }),
    prisma.task.count({ where: { status: 'CLAIMED' as never } }),
    prisma.scenarioProposal.count(),
    prisma.scenarioProposal.count({ where: { status: 'APPROVED' as never } }),
    prisma.payment.aggregate({ _sum: { amountEur: true } }),
    prisma.notification.count(),
    prisma.payment.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { amountEur: true, createdAt: true, status: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ])

  // Build daily user growth for last 30 days
  const userGrowth = await prisma.user.groupBy({
    by: ['createdAt'],
    _count: true,
    where: { createdAt: { gte: thirtyDaysAgo } },
    orderBy: { createdAt: 'asc' },
  })

  const dailyGrowth: Record<string, number> = {}
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000)
    dailyGrowth[date.toISOString().split('T')[0]] = 0
  }
  for (const row of userGrowth) {
    const key = row.createdAt.toISOString().split('T')[0]
    if (dailyGrowth[key] !== undefined) {
      dailyGrowth[key] += row._count
    }
  }

  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Revenue by day
  const dailyRevenue: Record<string, number> = {}
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000)
    dailyRevenue[date.toISOString().split('T')[0]] = 0
  }
  for (const payment of recentPayments) {
    const key = payment.createdAt.toISOString().split('T')[0]
    if (dailyRevenue[key] !== undefined) {
      dailyRevenue[key] += Number(payment.amountEur)
    }
  }

  // Role distribution
  const roleDistribution = await prisma.user.groupBy({
    by: ['role'],
    _count: true,
    orderBy: { _count: { role: 'desc' } },
  })

  // Top contributors
  const topContributors = await prisma.user.findMany({
    where: { claimedTasks: { some: { status: 'VALIDATED' as never } } },
    select: {
      id: true,
      displayName: true,
      role: true,
      lumenBalance: true,
      _count: { select: { claimedTasks: { where: { status: 'VALIDATED' as never } } } },
    },
    orderBy: { lumenBalance: 'desc' },
    take: 10,
  })

  return {
    data: {
      users: {
        total: totalUsers,
        new30d: newUsers30d,
        new7d: newUsers7d,
        verified: verifiedUsers,
        verificationRate: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0,
        dailyGrowth: Object.entries(dailyGrowth).map(([date, count]) => ({ date, count })),
        roleDistribution: roleDistribution.map((r) => ({ role: r.role, count: r._count })),
      },
      films: {
        total: totalFilms,
        inProduction: filmsInProduction,
        released: filmsReleased,
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        available: availableTasks,
        inProgress: inProgressTasks,
        completionRate: taskCompletionRate,
      },
      scenarios: {
        total: totalScenarios,
        approved: approvedScenarios,
        approvalRate: totalScenarios > 0 ? Math.round((approvedScenarios / totalScenarios) * 100) : 0,
      },
      revenue: {
        total: Number(totalPayments._sum.amountEur || 0),
        dailyRevenue: Object.entries(dailyRevenue).map(([date, amount]) => ({ date, amount })),
      },
      engagement: {
        totalNotifications,
        topContributors: topContributors.map((u) => ({
          id: u.id,
          name: u.displayName,
          role: u.role,
          lumens: u.lumenBalance,
          tasksCompleted: u._count.claimedTasks,
        })),
      },
    },
  }
}

// ============================================
// CREATOR STATS — Aggregate video views, likes, shares
// ============================================

export async function getCreatorStats(userId: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  // Only allow users to see their own stats (or admins to see any)
  const isAdmin = (session.user as { role?: string }).role === 'ADMIN'
  if (session.user.id !== userId && !isAdmin) return null

  const profile = await prisma.creatorProfile.findUnique({
    where: { userId },
    include: {
      videos: {
        where: { status: { in: ['PUBLISHED', 'READY'] } },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          viewCount: true,
          likeCount: true,
          shareCount: true,
          platforms: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          thumbnailUrl: true,
          duration: true,
        },
      },
    },
  })

  if (!profile) return null

  const videos = profile.videos
  const totalViews = videos.reduce((sum, v) => sum + v.viewCount, 0)
  const totalLikes = videos.reduce((sum, v) => sum + v.likeCount, 0)
  const totalShares = videos.reduce((sum, v) => sum + v.shareCount, 0)
  const engagementRate = totalViews > 0
    ? Math.round(((totalLikes + totalShares) / totalViews) * 10000) / 100
    : 0

  // Aggregate platform breakdown
  const platformMap: Record<string, { views: number; likes: number; shares: number; count: number }> = {}
  for (const video of videos) {
    for (const platform of video.platforms) {
      if (!platformMap[platform]) {
        platformMap[platform] = { views: 0, likes: 0, shares: 0, count: 0 }
      }
      platformMap[platform].views += video.viewCount
      platformMap[platform].likes += video.likeCount
      platformMap[platform].shares += video.shareCount
      platformMap[platform].count += 1
    }
  }

  // Social accounts for follower counts
  const socialAccounts = await prisma.socialAccount.findMany({
    where: { userId },
    select: { platform: true, followersCount: true, engagementRate: true },
  })

  const totalFollowers = socialAccounts.reduce((sum, a) => sum + a.followersCount, 0)

  // Generate trend data (last 7 periods mock from real data)
  const viewsTrend = generateTrendData(videos, 'viewCount', 7)
  const likesTrend = generateTrendData(videos, 'likeCount', 7)
  const engagementTrend = viewsTrend.map((v, i) => ({
    label: v.label,
    value: v.value > 0 ? Math.round(((likesTrend[i]?.value || 0) / v.value) * 100) : 0,
  }))

  return {
    totalViews,
    totalLikes,
    totalShares,
    totalFollowers,
    engagementRate,
    videoCount: videos.length,
    videos,
    platformBreakdown: Object.entries(platformMap).map(([platform, stats]) => ({
      platform,
      ...stats,
    })),
    socialAccounts,
    viewsTrend,
    likesTrend,
    engagementTrend,
  }
}

// ============================================
// REVENUE STATS — Aggregate token transactions
// ============================================

export async function getRevenueStats(userId: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  const isAdmin = (session.user as { role?: string }).role === 'ADMIN'
  if (session.user.id !== userId && !isAdmin) return null

  // Lumen transactions
  const transactions = await prisma.lumenTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  // Payments received (for task completions)
  const payments = await prisma.payment.findMany({
    where: { userId, status: 'COMPLETED' },
    orderBy: { createdAt: 'desc' },
    include: { task: { select: { title: true } } },
  })

  // Creator payouts
  const payouts = await prisma.creatorPayout.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { film: { select: { title: true } } },
  })

  // Referral earnings
  const referrals = await prisma.referral.findMany({
    where: { referrerId: userId, status: 'COMPLETED' },
    select: { tokensEarned: true, createdAt: true },
  })

  // Revenue by source
  const taskRevenue = payments.reduce((sum, p) => sum + p.amountEur, 0)
  const streamingRevenue = payouts
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amountEur, 0)
  const referralTokens = referrals.reduce((sum, r) => sum + r.tokensEarned, 0)
  const lumenEarned = transactions
    .filter(t => ['TASK_REWARD', 'BONUS', 'REFERRAL_BONUS', 'STREAK_BONUS'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0)
  const lumenSpent = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const totalRevenueEur = taskRevenue + streamingRevenue
  const totalTokensEarned = lumenEarned + referralTokens

  // Monthly revenue aggregation
  const monthlyRevenue: Record<string, { tasks: number; streaming: number; tokens: number }> = {}
  for (const p of payments) {
    const month = new Date(p.createdAt).toISOString().slice(0, 7)
    if (!monthlyRevenue[month]) monthlyRevenue[month] = { tasks: 0, streaming: 0, tokens: 0 }
    monthlyRevenue[month].tasks += p.amountEur
  }
  for (const p of payouts) {
    if (p.status !== 'PAID') continue
    const month = p.month
    if (!monthlyRevenue[month]) monthlyRevenue[month] = { tasks: 0, streaming: 0, tokens: 0 }
    monthlyRevenue[month].streaming += p.amountEur
  }
  for (const t of transactions) {
    if (t.amount <= 0) continue
    const month = new Date(t.createdAt).toISOString().slice(0, 7)
    if (!monthlyRevenue[month]) monthlyRevenue[month] = { tasks: 0, streaming: 0, tokens: 0 }
    monthlyRevenue[month].tokens += t.amount
  }

  const monthlyData = Object.entries(monthlyRevenue)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, data]) => ({
      label: month,
      tasks: data.tasks,
      streaming: data.streaming,
      tokens: data.tokens,
      total: data.tasks + data.streaming,
    }))

  // Simple projection: average of last 3 months * 1.1
  const recent = monthlyData.slice(-3)
  const avgMonthly = recent.length > 0
    ? recent.reduce((sum, m) => sum + m.total, 0) / recent.length
    : 0
  const projection = Math.round(avgMonthly * 1.1 * 100) / 100

  return {
    totalRevenueEur,
    taskRevenue,
    streamingRevenue,
    referralTokens,
    totalTokensEarned,
    lumenSpent,
    lumenBalance: totalTokensEarned - lumenSpent,
    transactions: transactions.slice(0, 50),
    payments: payments.slice(0, 20),
    payouts,
    monthlyData,
    projection,
    revenueBySource: [
      { label: 'Taches', value: Math.round(taskRevenue * 100) / 100, color: '#E50914' },
      { label: 'Streaming', value: Math.round(streamingRevenue * 100) / 100, color: '#22c55e' },
      { label: 'Referrals', value: referralTokens, color: '#3b82f6' },
      { label: 'Bonus', value: lumenEarned - referralTokens, color: '#a855f7' },
    ],
  }
}

// ============================================
// COLLAB STATS — Completion rates, ratings
// ============================================

export async function getCollabStats(userId: string) {
  const session = await auth()
  if (!session?.user?.id) return null

  const isAdmin = (session.user as { role?: string }).role === 'ADMIN'
  if (session.user.id !== userId && !isAdmin) return null

  // Sent collabs
  const sentCollabs = await prisma.collabRequest.findMany({
    where: { fromUserId: userId },
    include: {
      toUser: { select: { displayName: true, avatarUrl: true, reputationScore: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Received collabs
  const receivedCollabs = await prisma.collabRequest.findMany({
    where: { toUserId: userId },
    include: {
      fromUser: { select: { displayName: true, avatarUrl: true, reputationScore: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const allCollabs = [...sentCollabs, ...receivedCollabs]
  const completed = allCollabs.filter(c => c.status === 'COMPLETED')
  const pending = allCollabs.filter(c => c.status === 'PENDING' || c.status === 'IN_PROGRESS')
  const rejected = allCollabs.filter(c => c.status === 'REJECTED' || c.status === 'CANCELLED')

  const successRate = allCollabs.length > 0
    ? Math.round((completed.length / allCollabs.length) * 100)
    : 0

  const avgRating = completed.length > 0
    ? Math.round((completed.reduce((sum, c) => sum + (c.rating || 0), 0) / completed.filter(c => c.rating).length) * 10) / 10 || 0
    : 0

  // Collab type breakdown
  const typeBreakdown: Record<string, { total: number; completed: number; avgRating: number }> = {}
  for (const collab of allCollabs) {
    if (!typeBreakdown[collab.type]) {
      typeBreakdown[collab.type] = { total: 0, completed: 0, avgRating: 0 }
    }
    typeBreakdown[collab.type].total += 1
    if (collab.status === 'COMPLETED') {
      typeBreakdown[collab.type].completed += 1
    }
  }

  // ROI estimation (followers gained from social accounts synced after collabs)
  const socialAccounts = await prisma.socialAccount.findMany({
    where: { userId },
    select: { followersCount: true, engagementRate: true },
  })

  const totalFollowers = socialAccounts.reduce((sum, a) => sum + a.followersCount, 0)
  const avgEngagement = socialAccounts.length > 0
    ? Math.round((socialAccounts.reduce((sum, a) => sum + a.engagementRate, 0) / socialAccounts.length) * 100) / 100
    : 0

  // Tokens spent on collabs
  const totalEscrowSpent = allCollabs.reduce((sum, c) => sum + c.escrowTokens, 0)

  // Video orders (as creator or client)
  const orders = await prisma.videoOrder.findMany({
    where: { OR: [{ clientUserId: userId }, { creatorUserId: userId }] },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const ordersCompleted = orders.filter(o => o.status === 'COMPLETED').length
  const ordersDisputed = orders.filter(o => o.status === 'DISPUTED').length

  return {
    totalCollabs: allCollabs.length,
    completed: completed.length,
    pending: pending.length,
    rejected: rejected.length,
    successRate,
    avgRating,
    typeBreakdown: Object.entries(typeBreakdown).map(([type, stats]) => ({
      type,
      ...stats,
    })),
    totalEscrowSpent,
    totalFollowers,
    avgEngagement,
    sentCollabs: sentCollabs.slice(0, 20),
    receivedCollabs: receivedCollabs.slice(0, 20),
    orders: orders.slice(0, 20),
    ordersCompleted,
    ordersDisputed,
  }
}

// ============================================
// HELPERS
// ============================================

function generateTrendData(
  videos: { viewCount: number; likeCount: number; createdAt: Date }[],
  field: 'viewCount' | 'likeCount',
  periods: number
): { label: string; value: number }[] {
  const now = new Date()
  const result: { label: string; value: number }[] = []

  for (let i = periods - 1; i >= 0; i--) {
    const periodStart = new Date(now)
    periodStart.setDate(periodStart.getDate() - (i + 1) * 7)
    const periodEnd = new Date(now)
    periodEnd.setDate(periodEnd.getDate() - i * 7)

    const periodVideos = videos.filter(v => {
      const d = new Date(v.createdAt)
      return d >= periodStart && d < periodEnd
    })

    const value = periodVideos.reduce((sum, v) => sum + v[field], 0)
    const label = `S${periods - i}`

    result.push({ label, value })
  }

  return result
}
