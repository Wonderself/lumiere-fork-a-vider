/**
 * Blockchain Service Layer
 *
 * Abstracts on-chain operations for the CINEGENY platform.
 * Currently uses a hash-based proof system (storing SHA-256 hashes as proof-of-record).
 * Ready to integrate with Ethereum smart contracts when deployed.
 *
 * Architecture:
 * 1. Every vote, prize distribution, and contest closing generates a deterministic hash
 * 2. The hash + metadata are stored in BlockchainEvent table
 * 3. When smart contracts are deployed, these hashes are submitted on-chain
 * 4. txHash is updated once confirmed
 */

import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

// ─── Configuration ───────────────────────────────────────────────

const CHAIN = process.env.BLOCKCHAIN_NETWORK || 'ethereum'
const CONTRACT_ADDRESS = process.env.VOTE_CONTRACT_ADDRESS || ''
const IS_LIVE = !!CONTRACT_ADDRESS // true when smart contract is deployed

// ─── Hash Generation ─────────────────────────────────────────────

function generateProofHash(data: Record<string, unknown>): string {
  const canonical = JSON.stringify(data, Object.keys(data).sort())
  return crypto.createHash('sha256').update(canonical).digest('hex')
}

// ─── Vote Recording ──────────────────────────────────────────────

export async function recordVoteOnChain(params: {
  voteType: 'SCENARIO' | 'TRAILER' | 'GOVERNANCE'
  entityId: string
  voterId: string
  proposalId?: string
  weight?: number
}): Promise<{ eventId: string; proofHash: string }> {
  const proofHash = generateProofHash({
    type: 'VOTE_CAST',
    voteType: params.voteType,
    entityId: params.entityId,
    voterId: params.voterId,
    timestamp: new Date().toISOString(),
  })

  const event = await prisma.blockchainEvent.create({
    data: {
      type: 'VOTE_CAST',
      entityType: `${params.voteType}Vote`,
      entityId: params.entityId,
      chain: CHAIN,
      data: {
        voteType: params.voteType,
        voterId: params.voterId,
        proposalId: params.proposalId,
        weight: params.weight || 1,
        proofHash,
      },
      status: IS_LIVE ? 'SUBMITTED' : 'CONFIRMED',
      txHash: IS_LIVE ? undefined : `0x${proofHash.slice(0, 64)}`,
      confirmedAt: IS_LIVE ? undefined : new Date(),
    },
  })

  return { eventId: event.id, proofHash }
}

// ─── Vote Tally ──────────────────────────────────────────────────

export async function recordVoteTallyOnChain(params: {
  contestType: 'SCENARIO' | 'TRAILER' | 'GOVERNANCE'
  contestId: string
  results: Record<string, number> // entityId -> vote count
  winnerId?: string
}): Promise<{ eventId: string; proofHash: string }> {
  const proofHash = generateProofHash({
    type: 'VOTE_TALLY',
    contestType: params.contestType,
    contestId: params.contestId,
    results: params.results,
    winnerId: params.winnerId,
    timestamp: new Date().toISOString(),
  })

  const event = await prisma.blockchainEvent.create({
    data: {
      type: 'VOTE_TALLY',
      entityType: `${params.contestType}Contest`,
      entityId: params.contestId,
      chain: CHAIN,
      data: {
        results: params.results,
        winnerId: params.winnerId,
        totalVotes: Object.values(params.results).reduce((a, b) => a + b, 0),
        proofHash,
      },
      status: IS_LIVE ? 'SUBMITTED' : 'CONFIRMED',
      txHash: IS_LIVE ? undefined : `0x${proofHash.slice(0, 64)}`,
      confirmedAt: IS_LIVE ? undefined : new Date(),
    },
  })

  return { eventId: event.id, proofHash }
}

// ─── Prize Distribution ──────────────────────────────────────────

export async function recordPrizeDistribution(params: {
  contestId: string
  contestType: 'SCENARIO' | 'TRAILER'
  winners: Array<{ userId: string; rank: number; amountEur: number }>
  totalPool: number
}): Promise<{ eventId: string; proofHash: string }> {
  const proofHash = generateProofHash({
    type: 'PRIZE_DISTRIBUTED',
    contestId: params.contestId,
    winners: params.winners,
    totalPool: params.totalPool,
    timestamp: new Date().toISOString(),
  })

  const event = await prisma.blockchainEvent.create({
    data: {
      type: 'PRIZE_DISTRIBUTED',
      entityType: `${params.contestType}Contest`,
      entityId: params.contestId,
      chain: CHAIN,
      data: {
        winners: params.winners,
        totalPool: params.totalPool,
        proofHash,
      },
      status: IS_LIVE ? 'SUBMITTED' : 'CONFIRMED',
      txHash: IS_LIVE ? undefined : `0x${proofHash.slice(0, 64)}`,
      confirmedAt: IS_LIVE ? undefined : new Date(),
    },
  })

  return { eventId: event.id, proofHash }
}

// ─── Contest Closing ─────────────────────────────────────────────

export async function recordContestClosed(params: {
  contestId: string
  contestType: 'SCENARIO' | 'TRAILER'
  winnerId: string
  totalVotes: number
}): Promise<{ eventId: string; proofHash: string }> {
  const proofHash = generateProofHash({
    type: 'CONTEST_CLOSED',
    contestId: params.contestId,
    winnerId: params.winnerId,
    totalVotes: params.totalVotes,
    timestamp: new Date().toISOString(),
  })

  const event = await prisma.blockchainEvent.create({
    data: {
      type: 'CONTEST_CLOSED',
      entityType: `${params.contestType}Contest`,
      entityId: params.contestId,
      chain: CHAIN,
      data: {
        winnerId: params.winnerId,
        totalVotes: params.totalVotes,
        proofHash,
      },
      status: IS_LIVE ? 'SUBMITTED' : 'CONFIRMED',
      txHash: IS_LIVE ? undefined : `0x${proofHash.slice(0, 64)}`,
      confirmedAt: IS_LIVE ? undefined : new Date(),
    },
  })

  return { eventId: event.id, proofHash }
}

// ─── Content Registration ────────────────────────────────────────

export async function recordContentOnChain(params: {
  entityType: string
  entityId: string
  contentHash: string
  authorId: string
}): Promise<{ eventId: string }> {
  const event = await prisma.blockchainEvent.create({
    data: {
      type: 'CONTENT_REGISTERED',
      entityType: params.entityType,
      entityId: params.entityId,
      chain: CHAIN,
      data: {
        contentHash: params.contentHash,
        authorId: params.authorId,
      },
      status: IS_LIVE ? 'SUBMITTED' : 'CONFIRMED',
      txHash: IS_LIVE ? undefined : `0x${params.contentHash.slice(0, 64)}`,
      confirmedAt: IS_LIVE ? undefined : new Date(),
    },
  })

  return { eventId: event.id }
}

// ─── Generic Event Recording ────────────────────────────────────
// Used for film lifecycle, task lifecycle, phase changes, tokenization, contracts

export async function recordEvent(params: {
  type: string
  entityType: string
  entityId: string
  data: Record<string, unknown>
}): Promise<{ eventId: string; proofHash: string }> {
  const proofHash = generateProofHash({
    type: params.type,
    entityType: params.entityType,
    entityId: params.entityId,
    ...params.data,
    timestamp: new Date().toISOString(),
  })

  const event = await prisma.blockchainEvent.create({
    data: {
      type: params.type as never,
      entityType: params.entityType,
      entityId: params.entityId,
      chain: CHAIN,
      data: { ...params.data, proofHash },
      status: IS_LIVE ? 'SUBMITTED' : 'CONFIRMED',
      txHash: IS_LIVE ? undefined : `0x${proofHash.slice(0, 64)}`,
      confirmedAt: IS_LIVE ? undefined : new Date(),
    },
  })

  return { eventId: event.id, proofHash }
}

// ─── Query Helpers ───────────────────────────────────────────────

export async function getBlockchainEvents(entityType: string, entityId: string) {
  return prisma.blockchainEvent.findMany({
    where: { entityType, entityId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getEventByTxHash(txHash: string) {
  return prisma.blockchainEvent.findUnique({ where: { txHash } })
}

export async function getChainStats() {
  const [totalEvents, confirmedEvents, pendingEvents] = await Promise.all([
    prisma.blockchainEvent.count(),
    prisma.blockchainEvent.count({ where: { status: 'CONFIRMED' } }),
    prisma.blockchainEvent.count({ where: { status: 'PENDING' } }),
  ])
  return { totalEvents, confirmedEvents, pendingEvents, chain: CHAIN, isLive: IS_LIVE }
}
