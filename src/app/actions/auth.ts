'use server'

import { prisma } from '@/lib/prisma'
import { auth, signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { randomBytes } from 'crypto'
import { sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email'
import { loginLimiter, registerLimiter, passwordResetLimiter } from '@/lib/rate-limit'
import { headers } from 'next/headers'

// ─── Helpers ─────────────────────────────────────────────────

async function getClientIP(): Promise<string> {
  const hdrs = await headers()
  return hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    hdrs.get('x-real-ip') ||
    'unknown'
}

// ─── Schemas ─────────────────────────────────────────────────

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Minimum 8 caractères'),
  displayName: z.string().min(2, 'Minimum 2 caractères'),
  role: z.enum(['CONTRIBUTOR', 'ARTIST', 'STUNT_PERFORMER', 'VIEWER', 'SCREENWRITER', 'CREATOR']).default('CONTRIBUTOR'),
  portfolioUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
})

export type RegisterFormState = {
  error?: string
  success?: boolean
}

// ─── Register ────────────────────────────────────────────────

export async function registerAction(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  // Rate limiting
  const ip = await getClientIP()
  const rl = await registerLimiter.check(`register:${ip}`)
  if (!rl.allowed) {
    return { error: `Trop de tentatives. Réessayez dans ${rl.retryAfterSeconds}s.` }
  }

  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    displayName: formData.get('displayName') as string,
    role: (formData.get('role') as string) || 'CONTRIBUTOR',
    portfolioUrl: formData.get('portfolioUrl') as string,
    skills: formData.getAll('skills') as string[],
    languages: formData.getAll('languages') as string[],
  }

  const parsed = registerSchema.safeParse(rawData)
  if (!parsed.success) {
    const firstError = parsed.error.issues?.[0]
    return { error: firstError?.message ?? 'Données invalides.' }
  }

  const { email, password, displayName, role, portfolioUrl, skills, languages } = parsed.data

  try {
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (existing) {
      return { error: 'Un compte existe déjà avec cet email.' }
    }

    const passwordHash = await bcrypt.hash(password, 12)

    // Generate email verification token
    const verificationToken = randomBytes(32).toString('hex')
    const verificationExpires = new Date()
    verificationExpires.setHours(verificationExpires.getHours() + 24) // 24h validity

    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        displayName,
        role: role as never,
        portfolioUrl: portfolioUrl || null,
        skills: skills || [],
        languages: languages || [],
        isVerified: false,
      },
    })

    // Store email verification token (with verify: prefix to match verifyEmailAction lookup)
    await prisma.passwordReset.create({
      data: {
        userId: newUser.id,
        token: `verify:${verificationToken}`,
        expiresAt: verificationExpires,
      },
    })

    // Send welcome email with verification link (non-blocking)
    sendWelcomeEmail(email.toLowerCase(), displayName, verificationToken).catch((err) => console.error("[Email] Failed to send welcome email:", err))

    return { success: true }
  } catch (error) {
    console.error('Register error:', error)
    return { error: 'Une erreur est survenue. Veuillez réessayer.' }
  }
}

// ─── Login ───────────────────────────────────────────────────

export type LoginFormState = {
  error?: string
  redirectTo?: string
}

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const callbackUrl = (formData.get('callbackUrl') as string) || '/dashboard'

  // Sanitize callbackUrl
  const safeCallbackUrl = callbackUrl.startsWith('/') && !callbackUrl.startsWith('//') && !callbackUrl.includes('\\')
    ? callbackUrl
    : '/dashboard'

  if (!email || !password) {
    return { error: 'Email et mot de passe requis.' }
  }

  // Rate limiting by IP + email combo
  const ip = await getClientIP()
  const rl = await loginLimiter.check(`login:${ip}:${email?.toLowerCase()}`)
  if (!rl.allowed) {
    return { error: `Trop de tentatives. Réessayez dans ${rl.retryAfterSeconds}s.` }
  }

  // Dev/demo bypass — skip DB validation for hardcoded admin
  const isDemoLogin = email.toLowerCase() === 'admin@admin.com' && password === 'adminadmin'

  // Step 1: Validate credentials BEFORE calling signIn (skip for demo)
  if (!isDemoLogin) {
    let user
    try {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      })
    } catch (dbError) {
      console.error('[loginAction] Database error:', dbError)
      return { error: 'Erreur de connexion à la base de données. Réessayez.' }
    }

    if (!user || !user.passwordHash) {
      return { error: 'Email ou mot de passe incorrect.' }
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return { error: 'Email ou mot de passe incorrect.' }
    }
  }

  // Step 2: Credentials are valid — call signIn to create the session cookie
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  } catch (error: unknown) {
    // NEXT_REDIRECT — let it propagate (signIn may still throw this)
    if (error && typeof error === 'object' && 'digest' in error) {
      const digest = (error as { digest: string }).digest
      if (typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT')) {
        throw error
      }
    }

    if (error instanceof AuthError) {
      return { error: 'Email ou mot de passe incorrect.' }
    }

    // Log but don't fail — session cookie may already be set
    console.error('[loginAction] signIn error (session may still be valid):', error)
  }

  // Step 3: Return redirect URL — client will handle the navigation
  return { redirectTo: safeCallbackUrl }
}

// ─── Forgot Password ──────────────────────────────────────────

export async function forgotPasswordAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  if (!email) return { error: 'Veuillez entrer votre email.' }

  // Rate limiting
  const ip = await getClientIP()
  const rl = await passwordResetLimiter.check(`reset:${ip}`)
  if (!rl.allowed) {
    return { error: `Trop de tentatives. Réessayez dans ${rl.retryAfterSeconds}s.` }
  }

  const user = await prisma.user.findUnique({ where: { email } })

  // Always return success to prevent email enumeration
  if (!user) {
    return { success: true }
  }

  // Generate token
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 1)

  // Delete existing reset tokens for this user (but NOT verification tokens with verify: prefix)
  await prisma.passwordReset.deleteMany({
    where: { userId: user.id, token: { not: { startsWith: 'verify:' } } },
  })

  // Create new reset token
  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  })

  // Send reset email (logs in dev if no RESEND_API_KEY)
  await sendPasswordResetEmail(email, token)

  return { success: true }
}

// ─── Reset Password ───────────────────────────────────────────

export async function resetPasswordAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const token = formData.get('token') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!token) return { error: 'Token manquant.' }
  if (!password || password.length < 8) return { error: 'Minimum 8 caractères.' }
  if (password !== confirmPassword) return { error: 'Les mots de passe ne correspondent pas.' }

  const resetRecord = await prisma.passwordReset.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!resetRecord) return { error: 'Lien invalide ou expiré.' }
  if (resetRecord.usedAt) return { error: 'Ce lien a déjà été utilisé.' }
  if (resetRecord.expiresAt < new Date()) return { error: 'Ce lien a expiré. Demandez un nouveau lien.' }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetRecord.userId },
      data: { passwordHash },
    }),
    prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { usedAt: new Date() },
    }),
  ])

  return { success: true }
}

// ─── Email Verification ──────────────────────────────────────

export async function verifyEmailAction(token: string) {
  if (!token) return { error: 'Token manquant.' }

  // Use PasswordReset table with 'verify:' prefix for email verification tokens
  const record = await prisma.passwordReset.findUnique({
    where: { token: `verify:${token}` },
    include: { user: true },
  })

  if (!record) return { error: 'Lien de verification invalide.' }
  if (record.usedAt) return { error: 'Ce lien a deja ete utilise.' }
  if (record.expiresAt < new Date()) return { error: 'Ce lien a expire. Demandez un nouveau lien.' }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { isVerified: true, verifiedAt: new Date() },
    }),
    prisma.passwordReset.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    }),
  ])

  return { success: true }
}

export async function resendVerificationAction() {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return { error: 'Utilisateur introuvable' }
  if (user.isVerified) return { success: true }

  // Rate limit verification emails
  const rl = await passwordResetLimiter.check(`verify:${user.id}`)
  if (!rl.allowed) {
    return { error: `Trop de tentatives. Réessayez dans ${rl.retryAfterSeconds}s.` }
  }

  // Delete old verification tokens (those with 'verify:' prefix)
  const oldTokens = await prisma.passwordReset.findMany({
    where: { userId: user.id, token: { startsWith: 'verify:' } },
    select: { id: true },
  })
  if (oldTokens.length > 0) {
    await prisma.passwordReset.deleteMany({
      where: { id: { in: oldTokens.map(t => t.id) } },
    })
  }

  // Generate new verification token
  const verificationToken = randomBytes(32).toString('hex')
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24)

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      token: `verify:${verificationToken}`,
      expiresAt,
    },
  })

  // Send verification email
  sendWelcomeEmail(user.email, user.displayName || 'Utilisateur', verificationToken).catch((err) => console.error("[Email] Failed to send verification email:", err))

  return { success: true }
}

// ─── Update Profile ───────────────────────────────────────────

const profileSchema = z.object({
  displayName: z.string().min(2, 'Minimum 2 caractères').max(50),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  portfolioUrl: z.string().url('URL invalide').optional().or(z.literal('')),
  skills: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  walletAddress: z.string().max(100).optional().or(z.literal('')),
})

export async function updateProfileAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'Non authentifié' }

  const rawData = {
    displayName: formData.get('displayName') as string,
    bio: formData.get('bio') as string,
    avatarUrl: formData.get('avatarUrl') as string,
    portfolioUrl: formData.get('portfolioUrl') as string,
    skills: formData.getAll('skills') as string[],
    languages: formData.getAll('languages') as string[],
    walletAddress: formData.get('walletAddress') as string,
  }

  const parsed = profileSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: parsed.error.issues?.[0]?.message || 'Données invalides' }
  }

  const { displayName, bio, avatarUrl, portfolioUrl, skills, languages, walletAddress } = parsed.data

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        displayName,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
        portfolioUrl: portfolioUrl || null,
        skills: skills || [],
        languages: languages || [],
        walletAddress: walletAddress || null,
      },
    })

    revalidatePath('/profile')
    return { success: true }
  } catch (error) {
    console.error('Profile update error:', error)
    return { error: 'Une erreur est survenue lors de la mise à jour.' }
  }
}
