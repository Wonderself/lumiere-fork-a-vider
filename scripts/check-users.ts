import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Find admin user
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@lumiere.film' },
    select: { id: true, email: true, passwordHash: true, role: true },
  })

  if (!admin) {
    console.log('ERROR: admin@lumiere.film not found!')
    return
  }

  console.log('Admin found:', admin.email, admin.role)
  console.log('Hash:', admin.passwordHash)
  console.log('Hash length:', admin.passwordHash.length)
  console.log('Hash prefix:', admin.passwordHash.substring(0, 7))

  // Test with bcryptjs
  const testPassword = 'Admin1234!'
  console.log('\nTesting password:', testPassword)

  const valid = await bcrypt.compare(testPassword, admin.passwordHash)
  console.log('bcrypt.compare result:', valid)

  // Also test a fresh hash
  const freshHash = await bcrypt.hash(testPassword, 12)
  console.log('\nFresh hash:', freshHash)
  const freshValid = await bcrypt.compare(testPassword, freshHash)
  console.log('Fresh hash compare:', freshValid)

  // Compare hash formats
  console.log('\nDB hash algo:', admin.passwordHash.substring(0, 4))
  console.log('Fresh hash algo:', freshHash.substring(0, 4))

  // Test contributeur
  const contrib = await prisma.user.findUnique({
    where: { email: 'contributeur@lumiere.film' },
    select: { passwordHash: true },
  })
  if (contrib) {
    const v = await bcrypt.compare('Test1234!', contrib.passwordHash)
    console.log('\ncontributeur@lumiere.film + Test1234! =>', v ? 'PASS' : 'FAIL')
  }

  await prisma.$disconnect()
  await pool.end()
}

main().catch(console.error)
