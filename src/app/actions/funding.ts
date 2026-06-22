'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.id || (session.user as { role?: string }).role !== 'ADMIN') {
    throw new Error('Accès refusé')
  }
  return session
}

export async function toggleFundingStepAction(formData: FormData) {
  await requireAdmin()

  const stepId = formData.get('stepId') as string
  if (!stepId) return

  const step = await prisma.fundingStep.findUnique({ where: { id: stepId } })
  if (!step) return

  await prisma.fundingStep.update({
    where: { id: stepId },
    data: {
      completed: !step.completed,
      completedAt: !step.completed ? new Date() : null,
    },
  })

  revalidatePath('/admin/funding')
}

export async function updateFundingStatusAction(formData: FormData) {
  await requireAdmin()

  const fundingId = formData.get('fundingId') as string
  const status = formData.get('status') as string

  if (!fundingId || !status) return

  await prisma.publicFunding.update({
    where: { id: fundingId },
    data: { status: status as never },
  })

  revalidatePath('/admin/funding')
}

export async function addFundingNoteAction(formData: FormData) {
  await requireAdmin()

  const fundingId = formData.get('fundingId') as string
  const notes = formData.get('notes') as string

  if (!fundingId) return

  await prisma.publicFunding.update({
    where: { id: fundingId },
    data: { notes },
  })

  revalidatePath('/admin/funding')
}

export async function createFundingAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  await requireAdmin()

  const name = formData.get('name') as string
  const organism = formData.get('organism') as string
  const type = formData.get('type') as string
  const description = formData.get('description') as string
  const eligibility = formData.get('eligibility') as string
  const maxAmount = formData.get('maxAmount') ? parseFloat(formData.get('maxAmount') as string) : null
  const preCompany = formData.get('preCompany') === 'true'
  const postCompany = formData.get('postCompany') === 'true'
  const priority = parseInt(formData.get('priority') as string || '0', 10)

  if (!name || !organism || !type || !description || !eligibility) {
    return { error: 'Tous les champs obligatoires doivent être remplis' }
  }

  await prisma.publicFunding.create({
    data: {
      name,
      organism,
      type: type as never,
      description,
      eligibility,
      maxAmount,
      preCompany,
      postCompany,
      priority,
    },
  })

  revalidatePath('/admin/funding')
  return { success: true }
}
