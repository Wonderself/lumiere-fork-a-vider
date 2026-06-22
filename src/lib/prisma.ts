import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. This should only happen during build — ' +
      'ensure all pages using prisma have `export const dynamic = "force-dynamic"`.'
    )
  }
  const pool = new Pool({ connectionString, connectionTimeoutMillis: 15000 })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

// Lazy singleton: only create the client when first accessed at runtime
// This prevents crashes during Next.js build when DATABASE_URL is not set
let _prisma: PrismaClient | undefined = globalForPrisma.prisma

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!_prisma) {
      _prisma = createPrismaClient()
      if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = _prisma
    }
    return Reflect.get(_prisma, prop)
  },
})
