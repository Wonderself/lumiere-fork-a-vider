import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = 'test-register@lumiere.film'

  // Clean up if exists
  await prisma.user.deleteMany({ where: { email } })

  // Register a new user (same logic as registerAction)
  const passwordHash = await bcrypt.hash('TestRegister123!', 12)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      displayName: 'Test Register User',
      role: 'CONTRIBUTOR',
      isVerified: false,
    },
  })

  console.log('Created user:', user.email, user.role, user.id)

  // Test login
  const dbUser = await prisma.user.findUnique({ where: { email } })
  if (dbUser) {
    const valid = await bcrypt.compare('TestRegister123!', dbUser.passwordHash)
    console.log('Password verify:', valid ? 'PASS' : 'FAIL')
  }

  // Now test login via the running server
  // Get CSRF
  const csrfRes = await fetch('http://localhost:3000/api/auth/csrf')
  const cookies = csrfRes.headers.getSetCookie()
  const csrfData = await csrfRes.json() as { csrfToken: string }
  console.log('CSRF token:', csrfData.csrfToken.substring(0, 20) + '...')

  // Login
  const loginRes = await fetch('http://localhost:3000/api/auth/callback/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: cookies.join('; '),
    },
    body: `csrfToken=${csrfData.csrfToken}&email=${encodeURIComponent(email)}&password=${encodeURIComponent('TestRegister123!')}`,
    redirect: 'manual',
  })

  console.log('Login status:', loginRes.status)
  console.log('Login redirect:', loginRes.headers.get('location'))

  // Get session
  const sessionCookies = loginRes.headers.getSetCookie()
  const allCookies = [...cookies, ...sessionCookies].join('; ')
  const sessionRes = await fetch('http://localhost:3000/api/auth/session', {
    headers: { Cookie: allCookies },
  })
  const session = await sessionRes.json()
  console.log('Session:', JSON.stringify(session, null, 2))

  // Cleanup
  await prisma.user.delete({ where: { email } })
  console.log('\nCleanup: test user deleted')

  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
