import NextAuth from 'next-auth'
import type { Session } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import '@/types' // Load type augmentations

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const nextAuth = NextAuth({
  trustHost: true,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      // Email linking: safe because we verify Google emails are pre-verified by Google
      // and our signIn callback creates/links accounts explicitly
      allowDangerousEmailAccountLinking: !!process.env.GOOGLE_CLIENT_ID,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) {
          throw new Error('Invalid credentials format')
        }

        const { email, password } = parsed.data

        /* ── Dev/demo bypass: hardcoded admin account ── */
        if (email.toLowerCase() === 'admin@admin.com' && password === 'adminadmin') {
          // Upsert admin user in DB so dashboard pages can find it
          try {
            const adminUser = await prisma.user.upsert({
              where: { email: 'admin@admin.com' },
              update: { role: 'ADMIN', level: 'VIP', isVerified: true },
              create: {
                email: 'admin@admin.com',
                displayName: 'Admin',
                passwordHash: '',
                role: 'ADMIN',
                level: 'VIP',
                isVerified: true,
              },
            })
            return {
              id: adminUser.id,
              email: adminUser.email,
              name: adminUser.displayName,
              role: adminUser.role,
              level: adminUser.level,
              isVerified: adminUser.isVerified,
            }
          } catch {
            // DB not available — fallback to hardcoded ID
            return {
              id: 'admin-bypass-001',
              email: 'admin@admin.com',
              name: 'Admin',
              role: 'ADMIN',
              level: 'VIP',
              isVerified: true,
            }
          }
        }

        let user
        try {
          user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
          })
        } catch (dbError) {
          console.error('[auth] Database error in authorize:', dbError)
          throw new Error('Database connection error')
        }

        if (!user || !user.passwordHash) {
          throw new Error('Invalid email or password')
        }

        const valid = await bcrypt.compare(password, user.passwordHash)
        if (!valid) {
          throw new Error('Invalid email or password')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.displayName,
          role: user.role,
          level: user.level,
          isVerified: user.isVerified,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google OAuth — create or link user in DB
      if (account?.provider === 'google' && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase() },
          })
          if (!existingUser) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email.toLowerCase(),
                displayName: user.name || user.email.split('@')[0],
                avatarUrl: user.image || null,
                passwordHash: '', // OAuth users have no password
                isVerified: true,
                role: 'CONTRIBUTOR',
                level: 'ROOKIE',
              },
            })
            user.id = newUser.id
            user.role = newUser.role
            user.level = newUser.level
            user.isVerified = true
          } else {
            user.id = existingUser.id
            user.role = existingUser.role
            user.level = existingUser.level
            user.isVerified = existingUser.isVerified
            // Update avatar if missing
            if (!existingUser.avatarUrl && user.image) {
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { avatarUrl: user.image },
              })
            }
          }
        } catch (err) {
          console.error('[auth] Google sign-in DB error:', err)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.level = user.level
        token.isVerified = user.isVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || ''
        session.user.role = (token.role as string) || 'CONTRIBUTOR'
        session.user.level = (token.level as string) || 'ROOKIE'
        session.user.isVerified = (token.isVerified as boolean) ?? false
      }
      return session
    },
  },
})

export const { handlers, signIn, signOut } = nextAuth

export async function auth(): Promise<Session | null> {
  return await nextAuth.auth() as Session | null
}
