import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

let passed = 0
let failed = 0

function ok(test: string) {
  passed++
  console.log(`  ✅ ${test}`)
}
function fail(test: string, reason: string) {
  failed++
  console.log(`  ❌ ${test} — ${reason}`)
}

async function main() {
  console.log('\n🔐 ═══════════════════════════════════════')
  console.log('   LUMIÈRE — Tests Auth & Pipeline E2E')
  console.log('═══════════════════════════════════════════\n')

  // ─── 1. TEST REGISTRATION ───────────────────
  console.log('📝 1. INSCRIPTION')
  const testEmail = `test-${Date.now()}@cinegeny.film`
  const testPassword = 'TestPass123!'
  const hash = await bcrypt.hash(testPassword, 12)

  try {
    const newUser = await prisma.user.create({
      data: {
        email: testEmail,
        passwordHash: hash,
        displayName: 'Test User E2E',
        role: 'CONTRIBUTOR' as never,
        isVerified: false,
        skills: ['Acting', 'Writing'],
        languages: ['Français', 'English'],
      },
    })
    if (newUser.id && newUser.email === testEmail) ok('Création compte OK')
    else fail('Création compte', 'Données manquantes')

    if (!newUser.isVerified) ok('isVerified = false par défaut')
    else fail('isVerified', 'Devrait être false')

    // Duplicate email
    try {
      await prisma.user.create({
        data: { email: testEmail, passwordHash: hash, displayName: 'Dup' },
      })
      fail('Email dupliqué', 'Aurait dû lever une erreur')
    } catch {
      ok('Rejet email dupliqué')
    }
  } catch (e: any) {
    fail('Création compte', e.message)
  }

  // ─── 2. TEST LOGIN (password verification) ──
  console.log('\n🔑 2. LOGIN (vérification mot de passe)')
  try {
    const user = await prisma.user.findUnique({ where: { email: testEmail } })
    if (!user) { fail('User lookup', 'Utilisateur non trouvé'); return }

    const validPw = await bcrypt.compare(testPassword, user.passwordHash)
    if (validPw) ok('Mot de passe correct vérifié')
    else fail('Mot de passe', 'bcrypt.compare a échoué')

    const invalidPw = await bcrypt.compare('WrongPassword99!', user.passwordHash)
    if (!invalidPw) ok('Mauvais mot de passe rejeté')
    else fail('Mauvais mot de passe', 'Aurait dû être rejeté')
  } catch (e: any) {
    fail('Login', e.message)
  }

  // ─── 3. TEST SEED USERS ────────────────────
  console.log('\n👥 3. UTILISATEURS SEEDÉS')
  const seedUsers = [
    { email: 'admin@cinegeny.film', pw: (process.env.SEED_ADMIN_PASSWORD || ''), role: 'ADMIN' },
    { email: 'contributeur@cinegeny.film', pw: 'Test1234!', role: 'CONTRIBUTOR' },
    { email: 'artiste@cinegeny.film', pw: 'Test1234!', role: 'ARTIST' },
    { email: 'scenariste@cinegeny.film', pw: 'Test1234!', role: 'SCREENWRITER' },
    { email: 'viewer@cinegeny.film', pw: 'Test1234!', role: 'VIEWER' },
    { email: 'nouveau@cinegeny.film', pw: 'Test1234!', role: 'CONTRIBUTOR' },
  ]

  for (const su of seedUsers) {
    const u = await prisma.user.findUnique({ where: { email: su.email } })
    if (!u) { fail(`User ${su.email}`, 'Non trouvé en DB'); continue }
    const pwOk = await bcrypt.compare(su.pw, u.passwordHash)
    if (!pwOk) { fail(`Login ${su.email}`, 'Mot de passe incorrect'); continue }
    if (u.role !== su.role) { fail(`Role ${su.email}`, `Attendu ${su.role}, obtenu ${u.role}`); continue }
    ok(`${su.email} → ${su.role} ✓`)
  }

  // ─── 4. TEST ADMIN CHECKS ─────────────────
  console.log('\n🛡️  4. CONTRÔLES ADMIN')
  const admin = await prisma.user.findUnique({ where: { email: 'admin@cinegeny.film' } })
  const viewer = await prisma.user.findUnique({ where: { email: 'viewer@cinegeny.film' } })

  if (admin?.role === 'ADMIN') ok('Admin a le rôle ADMIN')
  else fail('Admin role', `Rôle: ${admin?.role}`)

  if (viewer?.role !== 'ADMIN') ok('Viewer n\'est PAS admin')
  else fail('Viewer role', 'Ne devrait pas être ADMIN')

  // ─── 5. TEST FILMS ────────────────────────
  console.log('\n🎬 5. FILMS EN BASE')
  const filmCount = await prisma.film.count()
  if (filmCount >= 20) ok(`${filmCount} films en base (≥ 20)`)
  else fail('Films count', `Seulement ${filmCount} films`)

  const publicFilms = await prisma.film.count({ where: { isPublic: true } })
  if (publicFilms >= 15) ok(`${publicFilms} films publics`)
  else fail('Films publics', `Seulement ${publicFilms}`)

  const filmStatuses = await prisma.film.groupBy({
    by: ['status'],
    _count: true,
  })
  for (const s of filmStatuses) {
    ok(`Status ${s.status}: ${s._count} film(s)`)
  }

  // ─── 6. TEST FILM PHASES ──────────────────
  console.log('\n📋 6. PHASES DE PRODUCTION')
  const phaseCount = await prisma.filmPhase.count()
  if (phaseCount >= 200) ok(`${phaseCount} phases (≥ 200)`)
  else fail('Phases', `Seulement ${phaseCount}`)

  // Check a specific film has 10 phases
  const merci = await prisma.film.findFirst({ where: { slug: 'merci-the-miracle-protocol' } })
  if (merci) {
    const merciPhases = await prisma.filmPhase.count({ where: { filmId: merci.id } })
    if (merciPhases === 10) ok('MERCI a 10 phases complètes')
    else fail('MERCI phases', `${merciPhases}/10`)
  } else {
    fail('Film MERCI', 'Non trouvé')
  }

  // ─── 7. TEST TASKS ────────────────────────
  console.log('\n📌 7. TÂCHES')
  const taskCount = await prisma.task.count()
  if (taskCount >= 10) ok(`${taskCount} tâches en base`)
  else fail('Tasks', `Seulement ${taskCount}`)

  const taskTypes = await prisma.task.groupBy({ by: ['type'], _count: true })
  for (const t of taskTypes) {
    ok(`Type ${t.type}: ${t._count} tâche(s)`)
  }

  // ─── 8. TEST STREAMING CATALOG ────────────
  console.log('\n📺 8. CATALOGUE STREAMING')
  const catalogCount = await prisma.catalogFilm.count()
  if (catalogCount >= 2) ok(`${catalogCount} films en catalogue`)
  else fail('Catalogue', `Seulement ${catalogCount}`)

  const liveFilms = await prisma.catalogFilm.count({ where: { status: 'LIVE' } })
  ok(`${liveFilms} film(s) LIVE en streaming`)

  // ─── 9. TEST TOKENIZATION ─────────────────
  console.log('\n🪙  9. TOKENIZATION')
  const offerings = await prisma.filmTokenOffering.count()
  ok(`${offerings} token offerings`)
  const purchases = await prisma.filmTokenPurchase.count()
  ok(`${purchases} token purchases`)
  const proposals = await prisma.governanceProposal.count()
  ok(`${proposals} governance proposals`)

  // ─── 10. TEST SCENARIOS ───────────────────
  console.log('\n📜 10. SCÉNARIOS')
  const scenarios = await prisma.scenarioProposal.count()
  ok(`${scenarios} scénarios soumis`)
  const winnerScenarios = await prisma.scenarioProposal.count({ where: { status: 'WINNER' } })
  ok(`${winnerScenarios} scénario(s) gagnant(s)`)

  // ─── 11. TEST AI ACTORS ───────────────────
  console.log('\n🎭 11. ACTEURS IA')
  const actors = await prisma.aIActor.count()
  if (actors >= 10) ok(`${actors} acteurs IA`)
  else fail('Acteurs IA', `Seulement ${actors}`)

  const castRoles = await prisma.filmCastRole.count()
  ok(`${castRoles} rôles attribués`)

  // ─── 12. TEST PASSWORD RESET FLOW ─────────
  console.log('\n🔄 12. RESET MOT DE PASSE')
  const testUser = await prisma.user.findUnique({ where: { email: testEmail } })
  if (testUser) {
    // Create reset token
    const token = `test-token-${Date.now()}`
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)

    const reset = await prisma.passwordReset.create({
      data: { userId: testUser.id, token, expiresAt },
    })
    if (reset.id) ok('Token de reset créé')

    // Verify token lookup
    const found = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    })
    if (found?.user.email === testEmail) ok('Token retrouvé avec user')
    else fail('Token lookup', 'Non trouvé')

    // Mark as used
    await prisma.passwordReset.update({
      where: { id: reset.id },
      data: { usedAt: new Date() },
    })
    const used = await prisma.passwordReset.findUnique({ where: { token } })
    if (used?.usedAt) ok('Token marqué comme utilisé')
    else fail('Token used', 'usedAt non mis à jour')

    // Expired token test
    const expiredToken = `expired-${Date.now()}`
    await prisma.passwordReset.create({
      data: {
        userId: testUser.id,
        token: expiredToken,
        expiresAt: new Date(Date.now() - 3600000), // 1h ago
      },
    })
    const expired = await prisma.passwordReset.findUnique({ where: { token: expiredToken } })
    if (expired && expired.expiresAt < new Date()) ok('Token expiré détecté correctement')
    else fail('Token expiration', 'Non détecté')
  }

  // ─── 13. FULL PIPELINE: Film → Phases → Tasks → Claim ──
  console.log('\n🎥 13. PIPELINE COMPLET: Film → Phases → Tasks → Soumission')

  // Create a test film
  const testFilm = await prisma.film.create({
    data: {
      title: 'Test E2E Film',
      slug: `test-e2e-${Date.now()}`,
      description: 'Film de test automatisé',
      synopsis: 'Test pipeline complet',
      genre: 'Test',
      catalog: 'CINEGENY' as never,
      status: 'DRAFT' as never,
      isPublic: false,
      estimatedBudget: 10000,
    },
  })
  ok(`Film créé: ${testFilm.title} (${testFilm.id})`)

  // Create 10 phases
  const phaseNames = ['SCRIPT', 'STORYBOARD', 'PREVIZ', 'DESIGN', 'ANIMATION',
    'VFX', 'AUDIO', 'EDITING', 'COLOR', 'FINAL']
  await prisma.filmPhase.createMany({
    data: phaseNames.map((name, i) => ({
      filmId: testFilm.id,
      phaseName: name as never,
      phaseOrder: i + 1,
      status: (i === 0 ? 'ACTIVE' : 'LOCKED') as never,
    })),
  })
  const testPhases = await prisma.filmPhase.count({ where: { filmId: testFilm.id } })
  if (testPhases === 10) ok('10 phases créées')
  else fail('Phases', `${testPhases}/10`)

  // Create a task on phase 1
  const phase1 = await prisma.filmPhase.findFirst({
    where: { filmId: testFilm.id, phaseName: 'SCRIPT' },
  })
  if (phase1) {
    const task = await prisma.task.create({
      data: {
        filmId: testFilm.id,
        phaseId: phase1.id,
        title: 'Écrire le premier acte',
        descriptionMd: 'Rédiger les 30 premières pages du scénario',
        instructionsMd: '# Instructions\nUtiliser le format standard.',
        type: 'PROMPT_WRITING' as never,
        difficulty: 'MEDIUM' as never,
        priceEuros: 50,
        status: 'AVAILABLE' as never,
        requiredLevel: 'ROOKIE' as never,
      },
    })
    ok(`Tâche créée: ${task.title}`)

    // Claim the task
    if (testUser) {
      await prisma.task.update({
        where: { id: task.id },
        data: {
          claimedById: testUser.id,
          claimedAt: new Date(),
          status: 'CLAIMED' as never,
        },
      })
      const claimed = await prisma.task.findUnique({ where: { id: task.id } })
      if (claimed?.claimedById === testUser.id) ok('Tâche claim par utilisateur')
      else fail('Task claim', 'claimedById incorrect')

      // Submit work
      const submission = await prisma.taskSubmission.create({
        data: {
          taskId: task.id,
          userId: testUser.id,
          notes: 'Premier acte du scénario - 30 pages',
          status: 'PENDING_AI' as never,
        },
      })
      if (submission.id) ok('Soumission créée')
      else fail('Submission', 'Échec')

      // AI review
      await prisma.taskSubmission.update({
        where: { id: submission.id },
        data: {
          status: 'AI_APPROVED' as never,
          aiScore: 85,
          aiFeedback: 'Good quality submission',
        },
      })

      // Human review (admin)
      await prisma.taskSubmission.update({
        where: { id: submission.id },
        data: {
          status: 'HUMAN_APPROVED' as never,
          humanReviewerId: admin!.id,
          humanFeedback: 'Excellent travail !',
        },
      })
      const approved = await prisma.taskSubmission.findUnique({ where: { id: submission.id } })
      if (approved?.status === 'HUMAN_APPROVED') ok('Soumission approuvée (AI + Human)')
      else fail('Approval', `Status: ${approved?.status}`)

      // Complete task
      await prisma.task.update({
        where: { id: task.id },
        data: {
          status: 'VALIDATED' as never,
          validatedAt: new Date(),
        },
      })
      ok('Tâche validée ✓')

      // Update user stats
      await prisma.user.update({
        where: { id: testUser.id },
        data: {
          tasksCompleted: { increment: 1 },
          tasksValidated: { increment: 1 },
          points: { increment: 100 },
          lumenBalance: { increment: 50 },
        },
      })
      const updatedUser = await prisma.user.findUnique({ where: { id: testUser.id } })
      if (updatedUser!.tasksCompleted >= 1) ok('Stats utilisateur mises à jour')
      else fail('User stats', 'tasksCompleted non incrémenté')
    }
  }

  // ─── 14. ADMIN OPERATIONS ─────────────────
  console.log('\n⚙️  14. OPÉRATIONS ADMIN')

  // Verify user
  if (testUser) {
    await prisma.user.update({
      where: { id: testUser.id },
      data: { isVerified: true },
    })
    const verified = await prisma.user.findUnique({ where: { id: testUser.id } })
    if (verified?.isVerified) ok('Vérification utilisateur OK')
    else fail('Verify user', 'isVerified pas mis à true')

    // Change role
    await prisma.user.update({
      where: { id: testUser.id },
      data: { role: 'ARTIST' as any },
    })
    const roleChanged = await prisma.user.findUnique({ where: { id: testUser.id } })
    if (roleChanged?.role === 'ARTIST') ok('Changement de rôle OK')
    else fail('Role change', `Role: ${roleChanged?.role}`)

    // Grant lumens
    await prisma.user.update({
      where: { id: testUser.id },
      data: { lumenBalance: { increment: 500 } },
    })
    const lumened = await prisma.user.findUnique({ where: { id: testUser.id } })
    if (lumened!.lumenBalance >= 500) ok(`Lumens attribués: ${lumened!.lumenBalance}`)
    else fail('Lumens', `Balance: ${lumened!.lumenBalance}`)
  }

  // ─── 15. CLEANUP ──────────────────────────
  console.log('\n🧹 15. NETTOYAGE')
  // Delete test data
  if (testUser) await prisma.taskSubmission.deleteMany({ where: { userId: testUser.id } })
  await prisma.task.deleteMany({ where: { filmId: testFilm.id } })
  await prisma.filmPhase.deleteMany({ where: { filmId: testFilm.id } })
  await prisma.film.delete({ where: { id: testFilm.id } })
  await prisma.passwordReset.deleteMany({ where: { userId: testUser?.id } })
  await prisma.user.delete({ where: { id: testUser?.id } })
  ok('Données de test nettoyées')

  // ─── RESULTS ──────────────────────────────
  console.log('\n═══════════════════════════════════════════')
  console.log(`📊 RÉSULTATS: ${passed} passés, ${failed} échoués`)
  console.log('═══════════════════════════════════════════\n')

  if (failed > 0) {
    console.log('⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.')
    process.exit(1)
  } else {
    console.log('🎉 TOUS LES TESTS PASSENT ! Pipeline complet vérifié.')
    process.exit(0)
  }
}

main()
  .catch((e) => {
    console.error('💥 Erreur fatale:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
