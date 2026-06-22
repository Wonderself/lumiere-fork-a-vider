import { createHash } from 'crypto'
import { prisma } from '@/lib/prisma'

export function computeContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

export async function registerContentHash(
  entityType: string,
  entityId: string,
  content: string,
  createdById: string
): Promise<string> {
  const hash = computeContentHash(content)

  await prisma.contentHash.upsert({
    where: {
      entityType_entityId: {
        entityType,
        entityId,
      },
    },
    update: {
      hash,
      createdById,
    },
    create: {
      entityType,
      entityId,
      hash,
      createdById,
    },
  })

  return hash
}
