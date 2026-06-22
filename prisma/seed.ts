import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🎬 Seeding Lumière database...\n')

  // =============================================
  // ADMIN SETTINGS
  // =============================================
  await prisma.adminSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      aiConfidenceThreshold: 70,
      maxConcurrentTasks: 3,
      bitcoinEnabled: false,
      maintenanceMode: false,
      lumenPrice: 1.0,
      lumenRewardPerTask: 10,
      notifEmailEnabled: false,
    },
  })
  console.log('✅ AdminSettings créés')

  // =============================================
  // USERS (10 variés)
  // =============================================
  const pw = await bcrypt.hash('Admin1234!', 12)
  const pwUser = await bcrypt.hash('Test1234!', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@lumiere.film' },
    update: {},
    create: {
      email: 'admin@lumiere.film',
      passwordHash: pw,
      displayName: 'Admin Lumière',
      role: 'ADMIN',
      level: 'VIP',
      isVerified: true,
      verifiedAt: new Date(),
      points: 99999,
      lumenBalance: 5000,
      skills: ['Direction Artistique', 'Prompt Engineering', 'VFX / Compositing'],
      languages: ['Français', 'English', 'עברית'],
    },
  })

  const contributor = await prisma.user.upsert({
    where: { email: 'contributeur@lumiere.film' },
    update: {},
    create: {
      email: 'contributeur@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Jean Créatif',
      role: 'CONTRIBUTOR',
      level: 'PRO',
      isVerified: true,
      verifiedAt: new Date(),
      points: 750,
      tasksCompleted: 8,
      tasksValidated: 7,
      rating: 4.5,
      lumenBalance: 120,
      skills: ['Prompt Engineering', 'Image Generation', 'Translation'],
      languages: ['Français', 'English'],
    },
  })

  const artist = await prisma.user.upsert({
    where: { email: 'artiste@lumiere.film' },
    update: {},
    create: {
      email: 'artiste@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Sophie Visuelle',
      role: 'ARTIST',
      level: 'EXPERT',
      isVerified: true,
      verifiedAt: new Date(),
      points: 2100,
      tasksCompleted: 22,
      tasksValidated: 20,
      rating: 4.8,
      lumenBalance: 340,
      skills: ['Character Design', 'Environment Design', 'Color Grading'],
      languages: ['Français', 'English', 'Español'],
    },
  })

  const screenwriter = await prisma.user.upsert({
    where: { email: 'scenariste@lumiere.film' },
    update: {},
    create: {
      email: 'scenariste@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Marc Scénario',
      role: 'SCREENWRITER',
      level: 'PRO',
      isVerified: true,
      verifiedAt: new Date(),
      points: 500,
      tasksCompleted: 3,
      tasksValidated: 2,
      rating: 4.2,
      lumenBalance: 80,
      skills: ['Écriture Scénario', 'Dialogue', 'Worldbuilding'],
      languages: ['Français'],
    },
  })

  const stunt = await prisma.user.upsert({
    where: { email: 'stunt@lumiere.film' },
    update: {},
    create: {
      email: 'stunt@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Léa Mouvement',
      role: 'STUNT_PERFORMER',
      level: 'PRO',
      isVerified: true,
      verifiedAt: new Date(),
      points: 600,
      tasksCompleted: 5,
      tasksValidated: 5,
      rating: 4.9,
      lumenBalance: 200,
      skills: ['Motion Capture', 'Stunt Coordination', 'Dance'],
      languages: ['Français', 'English'],
    },
  })

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@lumiere.film' },
    update: {},
    create: {
      email: 'viewer@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Paul Spectateur',
      role: 'VIEWER',
      level: 'ROOKIE',
      isVerified: true,
      verifiedAt: new Date(),
      points: 50,
      lumenBalance: 10,
      skills: [],
      languages: ['Français'],
    },
  })

  const rookie1 = await prisma.user.upsert({
    where: { email: 'nouveau@lumiere.film' },
    update: {},
    create: {
      email: 'nouveau@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Emma Débutante',
      role: 'CONTRIBUTOR',
      level: 'ROOKIE',
      isVerified: false,
      points: 0,
      lumenBalance: 0,
      skills: ['Prompt Engineering'],
      languages: ['Français', 'English'],
    },
  })

  const rookie2 = await prisma.user.upsert({
    where: { email: 'thomas@lumiere.film' },
    update: {},
    create: {
      email: 'thomas@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Thomas Pixel',
      role: 'CONTRIBUTOR',
      level: 'ROOKIE',
      isVerified: true,
      verifiedAt: new Date(),
      points: 150,
      tasksCompleted: 2,
      tasksValidated: 1,
      rating: 3.8,
      lumenBalance: 25,
      skills: ['Image Generation', 'Compositing'],
      languages: ['Français'],
    },
  })

  const expert1 = await prisma.user.upsert({
    where: { email: 'expert@lumiere.film' },
    update: {},
    create: {
      email: 'expert@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Yuki Tanaka',
      role: 'CONTRIBUTOR',
      level: 'EXPERT',
      isVerified: true,
      verifiedAt: new Date(),
      points: 3500,
      tasksCompleted: 35,
      tasksValidated: 33,
      rating: 4.9,
      lumenBalance: 800,
      skills: ['VFX / Compositing', 'Sound Design', 'Color Grading', 'QA Review'],
      languages: ['Français', 'English', '日本語'],
    },
  })

  const vip1 = await prisma.user.upsert({
    where: { email: 'vip@lumiere.film' },
    update: {},
    create: {
      email: 'vip@lumiere.film',
      passwordHash: pwUser,
      displayName: 'Alexandre Lumens',
      role: 'CONTRIBUTOR',
      level: 'VIP',
      isVerified: true,
      verifiedAt: new Date(),
      points: 10000,
      tasksCompleted: 85,
      tasksValidated: 82,
      rating: 4.95,
      lumenBalance: 2500,
      skills: ['Prompt Engineering', 'Image Generation', 'Character Design', 'VFX / Compositing', 'Direction Artistique'],
      languages: ['Français', 'English', 'Deutsch'],
    },
  })

  console.log('✅ 10 utilisateurs créés')

  // =============================================
  // FILM 1: Exodus — La Traversée
  // =============================================
  const film1 = await prisma.film.upsert({
    where: { slug: 'exodus-la-traversee' },
    update: {},
    create: {
      title: 'Exodus — La Traversée',
      slug: 'exodus-la-traversee',
      description: "L'histoire épique de la libération du peuple hébreu d'Égypte, réimaginée avec l'intelligence artificielle.",
      synopsis: "Dans une Égypte antique somptueuse et mystérieuse, Moïse — fils adopté du Pharaon — découvre ses origines hébraïques. Brisé par cette révélation, il entame un voyage intérieur qui le mènera à affronter le dieu-roi Ramsès II, son frère de sang. Un film épique sur la liberté, la foi, et le sacrifice, entièrement produit grâce à l'intelligence artificielle collaborative.",
      genre: 'Historique',
      catalog: 'BIBLE',
      status: 'IN_PRODUCTION',
      isPublic: true,
      coverImageUrl: '/posters/secret-menorah.jpg',
      estimatedBudget: 50000,
      totalTasks: 0,
      completedTasks: 0,
      progressPct: 0,
    },
  })

  const phases1 = await prisma.filmPhase.createManyAndReturn({
    data: [
      { filmId: film1.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'COMPLETED' },
      { filmId: film1.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'ACTIVE' },
      { filmId: film1.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
      { filmId: film1.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
      { filmId: film1.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
      { filmId: film1.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
      { filmId: film1.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
      { filmId: film1.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
      { filmId: film1.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
      { filmId: film1.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
    ],
  })

  const scriptPhase1 = phases1.find((p: { phaseName: string }) => p.phaseName === 'SCRIPT')!
  const storyboardPhase1 = phases1.find((p: { phaseName: string }) => p.phaseName === 'STORYBOARD')!
  const designPhase1 = phases1.find((p: { phaseName: string }) => p.phaseName === 'DESIGN')!

  // Tasks Film 1
  const tasks1Data = [
    {
      filmId: film1.id, phaseId: scriptPhase1.id,
      title: 'Écriture Acte I — La Révélation',
      descriptionMd: 'Écrire les prompts détaillés pour les 12 premières scènes du film.',
      instructionsMd: 'Chaque prompt : lieu, éclairage, angle caméra, expressions, ambiance. 12 prompts numérotés.',
      type: 'PROMPT_WRITING', difficulty: 'MEDIUM', priceEuros: 100, status: 'VALIDATED', requiredLevel: 'ROOKIE',
      claimedById: contributor.id, claimedAt: new Date('2025-12-01'), validatedAt: new Date('2025-12-05'),
    },
    {
      filmId: film1.id, phaseId: scriptPhase1.id,
      title: "Écriture Acte II — L'Exode",
      descriptionMd: 'Prompts pour les scènes du grand exode : mer qui se sépare, traversée du désert, dix plaies.',
      instructionsMd: 'Focus sur la grandiosité visuelle. 15 prompts minimum.',
      type: 'PROMPT_WRITING', difficulty: 'HARD', priceEuros: 100, status: 'VALIDATED', requiredLevel: 'ROOKIE',
      claimedById: vip1.id, claimedAt: new Date('2025-12-02'), validatedAt: new Date('2025-12-08'),
    },
    {
      filmId: film1.id, phaseId: storyboardPhase1.id,
      title: 'Storyboard Scène 1 — Le Palais du Pharaon',
      descriptionMd: "Créer les images storyboard de la scène d'ouverture. 8 cases attendues.",
      instructionsMd: "Style : réaliste, grandiose, lumière dorée. Résolution min 1920x1080.",
      type: 'IMAGE_GEN', difficulty: 'MEDIUM', priceEuros: 100, status: 'CLAIMED', requiredLevel: 'ROOKIE',
      claimedById: artist.id, claimedAt: new Date('2026-01-15'),
    },
    {
      filmId: film1.id, phaseId: storyboardPhase1.id,
      title: 'Storyboard Scène 7 — Le Buisson Ardent',
      descriptionMd: 'Séquence mystique. Moïse face au buisson. 10 cases.',
      instructionsMd: "Ambiance : mystérieuse, sacrée, lumière surnaturelle. Or et orange.",
      type: 'IMAGE_GEN', difficulty: 'HARD', priceEuros: 100, status: 'AVAILABLE', requiredLevel: 'PRO',
    },
    {
      filmId: film1.id, phaseId: storyboardPhase1.id,
      title: 'Storyboard Scène 15 — La Séparation de la Mer Rouge',
      descriptionMd: "LA scène emblématique. Les eaux se séparent. Spectaculaire et épique.",
      instructionsMd: "Murs d'eau 30m. Poissons et coraux visibles. 12 cases.",
      type: 'IMAGE_GEN', difficulty: 'EXPERT', priceEuros: 500, status: 'AVAILABLE', requiredLevel: 'EXPERT',
    },
    {
      filmId: film1.id, phaseId: designPhase1.id,
      title: 'Character Design — Moïse',
      descriptionMd: 'Design final de Moïse. 5 vues. Avec et sans manteau.',
      instructionsMd: 'Style : réalisme cinéma. ~40 ans, barbe naissante, regard déterminé.',
      type: 'CHARACTER_DESIGN', difficulty: 'EXPERT', priceEuros: 500, status: 'LOCKED', requiredLevel: 'EXPERT',
    },
    {
      filmId: film1.id, phaseId: designPhase1.id,
      title: 'Character Design — Ramsès II',
      descriptionMd: 'Design du Pharaon. Majestueux, intimidant, double couronne égyptienne.',
      instructionsMd: "Vêtements royaux dorés. Expression arrogante avec touche d'humanité.",
      type: 'CHARACTER_DESIGN', difficulty: 'EXPERT', priceEuros: 500, status: 'LOCKED', requiredLevel: 'EXPERT',
    },
    {
      filmId: film1.id, phaseId: storyboardPhase1.id,
      title: 'Vérification Continuité — Acte I',
      descriptionMd: "Vérifier la continuité visuelle scènes 1-12. Costumes, décors, éclairage.",
      instructionsMd: "Utiliser la checklist. Signaler chaque incohérence avec proposition.",
      type: 'CONTINUITY_CHECK', difficulty: 'MEDIUM', priceEuros: 50, status: 'AVAILABLE', requiredLevel: 'ROOKIE',
    },
    {
      filmId: film1.id, phaseId: storyboardPhase1.id,
      title: 'Traduction Sous-titres EN → FR',
      descriptionMd: "Traduire les 120 sous-titres anglais de l'Acte I en français.",
      instructionsMd: "Fichier .SRT fourni. Conserver timecodes. Max 2 lignes / 5 sec. Langue soutenue.",
      type: 'TRANSLATION', difficulty: 'EASY', priceEuros: 50, status: 'AVAILABLE', requiredLevel: 'ROOKIE',
    },
  ]

  for (const task of tasks1Data) {
    await prisma.task.create({ data: task as never })
  }

  // =============================================
  // FILM 2: Neon Babylon
  // =============================================
  const film2 = await prisma.film.upsert({
    where: { slug: 'neon-babylon' },
    update: {},
    create: {
      title: 'Neon Babylon',
      slug: 'neon-babylon',
      description: "Un thriller cyberpunk néo-noir dans une mégapole futuriste corrompue.",
      synopsis: "2087. New Babylon : ultra-riches vs sous-sols neon. Zara, hackeuse de génie, pénètre le plus grand secret d'une corporation. Traquée, elle choisit entre survie et humanité.",
      genre: 'Science-Fiction',
      catalog: 'LUMIERE',
      status: 'PRE_PRODUCTION',
      isPublic: true,
      coverImageUrl: '/posters/keter.jpg',
      estimatedBudget: 80000,
      totalTasks: 0,
      completedTasks: 0,
      progressPct: 0,
    },
  })

  const phases2 = await prisma.filmPhase.createManyAndReturn({
    data: [
      { filmId: film2.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
      { filmId: film2.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
      { filmId: film2.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
    ],
  })

  const scriptPhase2 = phases2.find((p: { phaseName: string }) => p.phaseName === 'SCRIPT')!

  const tasks2Data = [
    {
      filmId: film2.id, phaseId: scriptPhase2.id,
      title: 'Worldbuilding — Lore de New Babylon',
      descriptionMd: "Créer la bible du monde. Histoire, factions, technologie, économie, culture.",
      instructionsMd: "2000-5000 mots. Sections : Histoire, Factions (5+), Technologie, Économie, Argot local.",
      type: 'PROMPT_WRITING', difficulty: 'HARD', priceEuros: 100, status: 'AVAILABLE', requiredLevel: 'PRO',
    },
    {
      filmId: film2.id, phaseId: scriptPhase2.id,
      title: 'Design Concept — Personnage Zara',
      descriptionMd: "Esthétique visuelle de Zara. Hackeuse, ~25 ans, style cyberpunk.",
      instructionsMd: "3 variations (infiltration, combat, quotidien). Implants cybernétiques. 9 images total.",
      type: 'CHARACTER_DESIGN', difficulty: 'EXPERT', priceEuros: 500, status: 'AVAILABLE', requiredLevel: 'EXPERT',
    },
    {
      filmId: film2.id, phaseId: scriptPhase2.id,
      title: 'Prompts Environnement — Les Sous-Sols',
      descriptionMd: "20 prompts pour les zones souterraines. Taudis, marchés noirs, tunnels.",
      instructionsMd: "Sombre, humide, neon violet/vert, câbles, hologrammes défaillants.",
      type: 'ENV_DESIGN', difficulty: 'MEDIUM', priceEuros: 100, status: 'CLAIMED', requiredLevel: 'ROOKIE',
      claimedById: rookie2.id, claimedAt: new Date('2026-02-10'),
    },
    {
      filmId: film2.id, phaseId: scriptPhase2.id,
      title: 'Dialogues — Scènes 1-10',
      descriptionMd: "Dialogues des 10 premières scènes. Ton : cynique, urbain, argot cyberpunk.",
      instructionsMd: "Slang futuriste + glossaire. Dialogues courts et percutants. Sous-texte important.",
      type: 'DIALOGUE_EDIT', difficulty: 'HARD', priceEuros: 100, status: 'AVAILABLE', requiredLevel: 'PRO',
    },
    {
      filmId: film2.id, phaseId: scriptPhase2.id,
      title: 'QA Review — Cohérence du Lore',
      descriptionMd: "Vérifier la cohérence entre descriptions, dialogues et designs vs bible du monde.",
      instructionsMd: "Rapport de bugs : page, type d'incohérence, correction proposée.",
      type: 'QA_REVIEW', difficulty: 'EASY', priceEuros: 50, status: 'AVAILABLE', requiredLevel: 'ROOKIE',
    },
  ]

  for (const task of tasks2Data) {
    await prisma.task.create({ data: task as never })
  }

  // =============================================
  // FILM 3: Le Dernier Jardin
  // =============================================
  const film3 = await prisma.film.upsert({
    where: { slug: 'le-dernier-jardin' },
    update: {},
    create: {
      title: 'Le Dernier Jardin',
      slug: 'le-dernier-jardin',
      description: "Un conte poétique et écologique. Dans un monde ravagé, un enfant découvre le dernier jardin vivant.",
      synopsis: "2150. La Terre est devenue un désert de béton. Lila, 10 ans, vit dans une cité souterraine. Un jour, en explorant un tunnel condamné, elle découvre un jardin miraculeux. Des fleurs, des arbres, de l'eau pure. Poursuivie par ceux qui veulent exploiter cette ressource, elle devra protéger le dernier espoir de l'humanité.",
      genre: 'Animation',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/ortists.jpg',
      estimatedBudget: 35000,
      totalTasks: 0,
      completedTasks: 0,
      progressPct: 0,
    },
  })

  const phases3 = await prisma.filmPhase.createManyAndReturn({
    data: [
      { filmId: film3.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
      { filmId: film3.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
      { filmId: film3.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
    ],
  })

  const scriptPhase3 = phases3.find((p: { phaseName: string }) => p.phaseName === 'SCRIPT')!

  const tasks3Data = [
    {
      filmId: film3.id, phaseId: scriptPhase3.id,
      title: 'Écriture complète du scénario',
      descriptionMd: "Rédiger le scénario complet du Dernier Jardin. 25-30 pages.",
      instructionsMd: "Format : scénario classique. Acte I (découverte), Acte II (menace), Acte III (résolution). Ton poétique.",
      type: 'PROMPT_WRITING', difficulty: 'HARD', priceEuros: 200, status: 'AVAILABLE', requiredLevel: 'PRO',
    },
    {
      filmId: film3.id, phaseId: scriptPhase3.id,
      title: 'Concept Art — Lila (personnage principal)',
      descriptionMd: "Design de Lila, 10 ans. Style animation stylisée (Ghibli meets IA).",
      instructionsMd: "3 expressions (curiosité, peur, émerveillement). Vêtements recyclés, cheveux sauvages.",
      type: 'CHARACTER_DESIGN', difficulty: 'MEDIUM', priceEuros: 100, status: 'AVAILABLE', requiredLevel: 'ROOKIE',
    },
    {
      filmId: film3.id, phaseId: scriptPhase3.id,
      title: 'Concept Art — Le Jardin',
      descriptionMd: "Visualiser le jardin secret : luxuriant, lumineux, contrastant avec le monde gris.",
      instructionsMd: "5 vues : entrée, lac central, serre principale, arbre ancestral, vue aérienne.",
      type: 'ENV_DESIGN', difficulty: 'MEDIUM', priceEuros: 100, status: 'AVAILABLE', requiredLevel: 'ROOKIE',
    },
  ]

  for (const task of tasks3Data) {
    await prisma.task.create({ data: task as never })
  }

  // =============================================
  // SLATE DECK 2026 — 20 films from Pipeline
  // =============================================

  // ── P1: MERCI... (THE MIRACLE PROTOCOL) ──
  const filmP1 = await prisma.film.upsert({
    where: { slug: 'merci-the-miracle-protocol' },
    update: {},
    create: {
      title: 'MERCI... (The Miracle Protocol)',
      slug: 'merci-the-miracle-protocol',
      description: "Docu-serie sur les miracles du 7 octobre. Temoignages de survivants, reconstitutions cinematiques.",
      synopsis: "Quatre episodes de 52 minutes explorant les recits de miracles et de survie du 7 octobre. A travers des temoignages bouleversants et des reconstitutions cinematographiques, cette serie documentaire revele la dimension spirituelle et humaine de l'evenement.",
      genre: 'Documentaire',
      catalog: 'LUMIERE',
      status: 'IN_PRODUCTION',
      isPublic: true,
      coverImageUrl: '/posters/miracle-protocol.jpg',
      estimatedBudget: 120000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmP1.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'COMPLETED' },
    { filmId: filmP1.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'ACTIVE' },
    { filmId: filmP1.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmP1.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmP1.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmP1.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmP1.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmP1.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmP1.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmP1.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── P2: KETER (THE SINGULARITY POINT) ──
  const filmP2 = await prisma.film.upsert({
    where: { slug: 'keter-the-singularity-point' },
    update: {},
    create: {
      title: 'KETER (The Singularity Point)',
      slug: 'keter-the-singularity-point',
      description: "Christopher Nolan meets the Zohar. Thriller sci-fi ou physique quantique et Kabbale se rencontrent.",
      synopsis: "Un physicien de renom decouvre que le point de singularite quantique correspond exactement a la Keter (couronne) de l'Arbre de Vie kabbalistique. Alors qu'une intelligence artificielle tente d'utiliser cette decouverte pour recrire la realite, il doit affronter les limites de la science et de la foi dans une course contre la montre vertigineuse.",
      genre: 'Science-Fiction',
      catalog: 'LUMIERE',
      status: 'PRE_PRODUCTION',
      isPublic: true,
      coverImageUrl: '/posters/keter.jpg',
      estimatedBudget: 200000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmP2.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmP2.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmP2.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmP2.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmP2.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmP2.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmP2.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmP2.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmP2.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmP2.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── P3: LE CODE D'ESTHER ──
  const filmP3 = await prisma.film.upsert({
    where: { slug: 'le-code-desther' },
    update: {},
    create: {
      title: "Le Code d'Esther",
      slug: 'le-code-desther',
      description: "Investigation sur les codes caches du Livre d'Esther. Docu-fiction historique.",
      synopsis: "Un cryptographe et une historienne decouvrent des patterns mathematiques caches dans le Livre d'Esther. Leurs recherches revelent des paralleles troublants entre le recit biblique et des evenements historiques majeurs. Entre reconstitutions epiques de la Perse antique et analyses cryptographiques modernes.",
      genre: 'Documentaire',
      catalog: 'BIBLE',
      status: 'PRE_PRODUCTION',
      isPublic: true,
      coverImageUrl: '/posters/esther-code.jpg',
      estimatedBudget: 90000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmP3.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmP3.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmP3.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmP3.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmP3.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmP3.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmP3.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmP3.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmP3.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmP3.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── P4: ZION OF AFRICA ──
  const filmP4 = await prisma.film.upsert({
    where: { slug: 'zion-of-africa' },
    update: {},
    create: {
      title: 'Zion of Africa',
      slug: 'zion-of-africa',
      description: "L'histoire meconnue des communautes juives d'Afrique. Des Beta Israel aux Lemba.",
      synopsis: "Des Beta Israel d'Ethiopie aux Lemba du Zimbabwe, en passant par les communautes du Nigeria et d'Afrique du Sud, ce documentaire revelateur retrace l'heritage juif africain meconnu. Voyage a travers les siecles, les rituels, les genes et les traditions qui unissent ces peuples a une histoire commune.",
      genre: 'Documentaire',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/keter.jpg',
      estimatedBudget: 80000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmP4.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmP4.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmP4.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmP4.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmP4.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmP4.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmP4.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmP4.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmP4.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmP4.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── P5: LE DERNIER CONVOI (THE LAST TRAIN) ──
  const filmP5 = await prisma.film.upsert({
    where: { slug: 'le-dernier-convoi' },
    update: {},
    create: {
      title: 'Le Dernier Convoi (The Last Train)',
      slug: 'le-dernier-convoi',
      description: "Le dernier convoi de deportation parti de France en 1944. Docu-drama poignant.",
      synopsis: "Aout 1944 : alors que Paris est sur le point d'etre libere, un dernier train quitte Bobigny vers les camps. A travers les destins croises de deportes, de resistants et de cheminots, ce film reconstitue les dernieres heures d'une tragedie historique basee sur des temoignages reels.",
      genre: 'Drame',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/last-train.jpg',
      estimatedBudget: 150000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmP5.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmP5.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmP5.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmP5.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmP5.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmP5.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmP5.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmP5.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmP5.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmP5.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── P6: CARNAVAL (BAD TRIP) ──
  const filmP6 = await prisma.film.upsert({
    where: { slug: 'carnaval-bad-trip' },
    update: {},
    create: {
      title: 'Carnaval (Bad Trip)',
      slug: 'carnaval-bad-trip',
      description: "Court-metrage experimental. Un carnaval qui tourne au cauchemar. Demo technique IA.",
      synopsis: "Un jeune homme se retrouve piege dans un carnaval qui se transforme progressivement en cauchemar. Les masques deviennent reels, les couleurs virent au cauchemardesque, la realite se distord. Court-metrage experimental entierement genere par IA, servant de demonstration technique pour le studio.",
      genre: 'Horreur',
      catalog: 'LUMIERE',
      status: 'PRE_PRODUCTION',
      isPublic: true,
      coverImageUrl: '/posters/esther-code.jpg',
      estimatedBudget: 25000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmP6.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'COMPLETED' },
    { filmId: filmP6.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'ACTIVE' },
    { filmId: filmP6.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmP6.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmP6.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmP6.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmP6.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmP6.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmP6.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmP6.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── P7: NA NAH NAHMA (THE BRESLOV LIGHT) ──
  const filmP7 = await prisma.film.upsert({
    where: { slug: 'na-nah-nahma-the-breslov-light' },
    update: {},
    create: {
      title: 'Na Nah Nahma (The Breslov Light)',
      slug: 'na-nah-nahma-the-breslov-light',
      description: "Plongee dans l'univers Breslov. Musique, danse, priere et joie comme philosophie de vie.",
      synopsis: "Du Rabbi Nachman de Bratslav au phenomene mondial Na Nach, cette serie documentaire explore le mouvement hassidique le plus joyeux du monde. A travers la musique, la danse et la priere, decouvrez comment une philosophie du 18e siecle est devenue un phenomene de pop culture.",
      genre: 'Documentaire',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/the-rebbe.jpg',
      estimatedBudget: 75000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmP7.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmP7.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmP7.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmP7.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmP7.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmP7.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmP7.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmP7.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmP7.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmP7.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── P8: ORTISTES (THE GIFT) ──
  const filmP8 = await prisma.film.upsert({
    where: { slug: 'ortistes-the-gift' },
    update: {},
    create: {
      title: 'Ortistes (The Gift)',
      slug: 'ortistes-the-gift',
      description: "Mini-serie animee sur des artistes autistes aux talents extraordinaires. 10x12 min.",
      synopsis: "Chaque episode de 12 minutes raconte l'histoire d'un artiste autiste au talent extraordinaire. Musique, peinture, calcul mental, memoire photographique : ces dons uniques sont reveles a travers une animation poetique entierement generee par IA, celebrant la neurodiversite.",
      genre: 'Animation',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/ortists.jpg',
      estimatedBudget: 60000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmP8.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmP8.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmP8.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmP8.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmP8.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmP8.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmP8.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmP8.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmP8.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmP8.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── E1: SUPER-HEROS ──
  const filmE1 = await prisma.film.upsert({
    where: { slug: 'super-heros' },
    update: {},
    create: {
      title: 'Super-Heros',
      slug: 'super-heros',
      description: "Projet super-heros a la franchise israelienne. Action fantastique.",
      synopsis: "Le premier super-heros israelien. Ne dans les ruelles de Jaffa, dote de pouvoirs lies a la Kabbale, il doit proteger Tel Aviv d'une menace ancestrale tout en cachant sa double identite. Un film d'action spectaculaire melant mythologie juive et culture pop.",
      genre: 'Action',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/miracle-protocol.jpg',
      estimatedBudget: 180000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmE1.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmE1.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmE1.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmE1.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmE1.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmE1.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmE1.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmE1.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmE1.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmE1.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── E2: AMELIE POUL2 ──
  const filmE2 = await prisma.film.upsert({
    where: { slug: 'amelie-poul2' },
    update: {},
    create: {
      title: 'Amelie Poul2',
      slug: 'amelie-poul2',
      description: "Suite/hommage du Fabuleux Destin d'Amelie Poulain. Vision IA contemporaine.",
      synopsis: "20 ans apres, Amelie Poulain vit toujours a Montmartre mais le quartier a change. Quand une IA commence a predire les petits bonheurs des passants, Amelie se lance dans une quete pour prouver que la vraie magie ne se calcule pas. Un hommage poetique et decale au film culte.",
      genre: 'Comedie',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/the-rebbe.jpg',
      estimatedBudget: 100000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmE2.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmE2.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmE2.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmE2.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmE2.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmE2.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmE2.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmE2.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmE2.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmE2.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── E3: ROYAL RUMBLE ──
  const filmE3 = await prisma.film.upsert({
    where: { slug: 'royal-rumble' },
    update: {},
    create: {
      title: 'Royal Rumble',
      slug: 'royal-rumble',
      description: "Battle royale cinematique. Melange d'action et d'humour.",
      synopsis: "16 acteurs IA s'affrontent dans une arene virtuelle pour le role principal du prochain blockbuster Lumiere. Elimination par elimination, chaque round revele leurs talents uniques. Action, comedie, et meta-cinema dans un format innovant.",
      genre: 'Action',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/secret-menorah.jpg',
      estimatedBudget: 40000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmE3.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmE3.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmE3.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmE3.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmE3.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmE3.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmE3.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmE3.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmE3.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmE3.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── E4: TRIP CARNAVAL ──
  const filmE4 = await prisma.film.upsert({
    where: { slug: 'trip-carnaval' },
    update: {},
    create: {
      title: 'Trip Carnaval',
      slug: 'trip-carnaval',
      description: "Version musicale et extended du concept Carnaval. Trip visuel et sonore experimental.",
      synopsis: "Experience audiovisuelle immersive ou la musique electronique rencontre les visuels de carnaval generes par IA. 45 minutes de trip sensoriel a travers des paysages oniriques, des masques en mutation constante et des rythmes enivrants.",
      genre: 'Experimental',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/last-train.jpg',
      estimatedBudget: 30000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmE4.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmE4.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmE4.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmE4.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmE4.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmE4.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmE4.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmE4.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmE4.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmE4.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── E5: TOKENISATION (Le Film) ──
  const filmE5 = await prisma.film.upsert({
    where: { slug: 'tokenisation-le-film' },
    update: {},
    create: {
      title: 'Tokenisation (Le Film)',
      slug: 'tokenisation-le-film',
      description: "Meta-documentaire sur la tokenisation du cinema. Financement decentralise de l'art.",
      synopsis: "Un film sur la tokenisation du cinema... finance par tokenisation. Ce meta-documentaire explore comment la blockchain revolutionne le financement de l'art, en suivant son propre parcours de financement decentralise. Interviews d'artistes, de technologues et d'investisseurs.",
      genre: 'Documentaire',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/ortists.jpg',
      estimatedBudget: 50000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmE5.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmE5.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmE5.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmE5.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmE5.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmE5.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmE5.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmE5.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmE5.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmE5.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── E6: NUIT DES CESARS ──
  const filmE6 = await prisma.film.upsert({
    where: { slug: 'nuit-des-cesars' },
    update: {},
    create: {
      title: 'Nuit des Cesars',
      slug: 'nuit-des-cesars',
      description: "Satire de la ceremonie des Cesars. Comedie noire sur l'industrie du cinema francais.",
      synopsis: "La nuit des Cesars tourne au chaos quand un hacker diffuse en direct les conversations privees de tous les nomines. Secrets, trahisons et ridicule s'entrechoquent dans cette satire mordante de l'industrie du cinema francais, generee integralement par IA.",
      genre: 'Comedie',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/meam-loez.jpg',
      estimatedBudget: 35000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmE6.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmE6.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmE6.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmE6.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmE6.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmE6.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmE6.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmE6.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmE6.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmE6.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── E7: METACINEMA ──
  const filmE7 = await prisma.film.upsert({
    where: { slug: 'metacinema' },
    update: {},
    create: {
      title: 'Metacinema',
      slug: 'metacinema',
      description: "Cinema qui parle de lui-meme. Experience immersive meta-cinematographique generee par IA.",
      synopsis: "Un film qui se sait etre un film. Les personnages decouvrent qu'ils sont generes par IA et commencent a questionner leur existence, leur createur et le public qui les regarde. Experience experimentale et philosophique qui repousse les limites du cinema genere par intelligence artificielle.",
      genre: 'Experimental',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/keter.jpg',
      estimatedBudget: 45000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmE7.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmE7.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmE7.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmE7.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmE7.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmE7.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmE7.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmE7.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmE7.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmE7.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  // ── BONUS: 5 extra community films to reach 20+ total ──

  const filmB1 = await prisma.film.upsert({
    where: { slug: 'les-enfants-de-la-lumiere' },
    update: {},
    create: {
      title: 'Les Enfants de la Lumiere',
      slug: 'les-enfants-de-la-lumiere',
      description: "Conte poetique sur des enfants qui decouvrent le cinema dans un village recule.",
      synopsis: "Dans un village isole du sud marocain, trois enfants trouvent une vieille camera et commencent a filmer leur monde. Leur film amateur devient viral et attire l'attention d'un studio hollywoodien. Mais les enfants refusent de quitter leur village. Un conte sur la magie du cinema a l'ere de l'IA.",
      genre: 'Drame',
      catalog: 'COMMUNITY',
      status: 'IN_PRODUCTION',
      isPublic: true,
      coverImageUrl: '/posters/meam-loez.jpg',
      estimatedBudget: 45000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmB1.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'COMPLETED' },
    { filmId: filmB1.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'COMPLETED' },
    { filmId: filmB1.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'ACTIVE' },
    { filmId: filmB1.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmB1.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmB1.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmB1.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmB1.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmB1.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmB1.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  const filmB2 = await prisma.film.upsert({
    where: { slug: 'la-prophetie-des-sables' },
    update: {},
    create: {
      title: 'La Prophetie des Sables',
      slug: 'la-prophetie-des-sables',
      description: "Aventure epique dans le desert du Negev. Prophetie ancienne et technologie futuriste.",
      synopsis: "Un archeologue decouvre dans le desert du Negev des inscriptions prophetiques vieilles de 3000 ans qui semblent predire l'avenement de l'intelligence artificielle. Course contre la montre entre chercheurs et mercenaires dans les dunes brulantes.",
      genre: 'Aventure',
      catalog: 'LUMIERE',
      status: 'PRE_PRODUCTION',
      isPublic: true,
      coverImageUrl: '/posters/esther-code.jpg',
      estimatedBudget: 95000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmB2.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmB2.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmB2.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmB2.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmB2.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmB2.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmB2.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmB2.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmB2.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmB2.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  const filmB3 = await prisma.film.upsert({
    where: { slug: 'tel-aviv-nights' },
    update: {},
    create: {
      title: 'Tel Aviv Nights',
      slug: 'tel-aviv-nights',
      description: "Romance et suspense dans les nuits de Tel Aviv. Thriller romantique urbain.",
      synopsis: "Une danseuse francaise et un hacker israelien se rencontrent dans un club underground de Tel Aviv. Leur histoire d'amour se complique quand ils decouvrent qu'ils travaillent pour des camps opposes dans une guerre de l'information qui menace la ville entiere.",
      genre: 'Thriller',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/miracle-protocol.jpg',
      estimatedBudget: 70000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmB3.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmB3.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmB3.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmB3.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmB3.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmB3.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmB3.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmB3.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmB3.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmB3.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  const filmB4 = await prisma.film.upsert({
    where: { slug: 'les-gardiens-du-shabat' },
    update: {},
    create: {
      title: 'Les Gardiens du Shabat',
      slug: 'les-gardiens-du-shabat',
      description: "Fantasy juif : des gardiens mystiques protegent le monde chaque vendredi soir.",
      synopsis: "Chaque vendredi soir, quand le Shabat commence, 36 justes caches dans le monde activent une barriere mystique qui protege l'humanite. Quand l'un d'eux disparait, une jeune femme decouvre qu'elle est la prochaine gardienne. Fantasy epique ancre dans la tradition juive.",
      genre: 'Fantastique',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/secret-menorah.jpg',
      estimatedBudget: 110000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmB4.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmB4.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmB4.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmB4.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmB4.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmB4.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmB4.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmB4.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmB4.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmB4.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  const filmB5 = await prisma.film.upsert({
    where: { slug: 'frequency-432' },
    update: {},
    create: {
      title: 'Frequency 432',
      slug: 'frequency-432',
      description: "Thriller musical autour de la frequence 432Hz et ses effets sur la conscience humaine.",
      synopsis: "Un ingenieur du son decouvre que la frequence 432Hz, longtemps consideree comme la 'frequence de l'univers', peut ouvrir des portails de conscience. Quand une corporation tente d'utiliser cette decouverte a des fins de controle mental, il doit choisir entre le silence et la revolution sonore.",
      genre: 'Thriller',
      catalog: 'LUMIERE',
      status: 'DRAFT',
      isPublic: true,
      coverImageUrl: '/posters/last-train.jpg',
      estimatedBudget: 65000,
    },
  })
  await prisma.filmPhase.createMany({ data: [
    { filmId: filmB5.id, phaseName: 'SCRIPT', phaseOrder: 1, status: 'ACTIVE' },
    { filmId: filmB5.id, phaseName: 'STORYBOARD', phaseOrder: 2, status: 'LOCKED' },
    { filmId: filmB5.id, phaseName: 'PREVIZ', phaseOrder: 3, status: 'LOCKED' },
    { filmId: filmB5.id, phaseName: 'DESIGN', phaseOrder: 4, status: 'LOCKED' },
    { filmId: filmB5.id, phaseName: 'ANIMATION', phaseOrder: 5, status: 'LOCKED' },
    { filmId: filmB5.id, phaseName: 'VFX', phaseOrder: 6, status: 'LOCKED' },
    { filmId: filmB5.id, phaseName: 'AUDIO', phaseOrder: 7, status: 'LOCKED' },
    { filmId: filmB5.id, phaseName: 'EDITING', phaseOrder: 8, status: 'LOCKED' },
    { filmId: filmB5.id, phaseName: 'COLOR', phaseOrder: 9, status: 'LOCKED' },
    { filmId: filmB5.id, phaseName: 'FINAL', phaseOrder: 10, status: 'LOCKED' },
  ] })

  const allSlateFilms = [filmP1, filmP2, filmP3, filmP4, filmP5, filmP6, filmP7, filmP8, filmE1, filmE2, filmE3, filmE4, filmE5, filmE6, filmE7, filmB1, filmB2, filmB3, filmB4, filmB5]
  console.log(`✅ ${allSlateFilms.length} films Slate Deck 2026 créés avec phases`)

  // =============================================
  // UPDATE FILM STATS
  // =============================================
  for (const film of [film1, film2, film3, ...allSlateFilms]) {
    const total = await prisma.task.count({ where: { filmId: film.id } })
    const validated = await prisma.task.count({ where: { filmId: film.id, status: 'VALIDATED' } })
    await prisma.film.update({
      where: { id: film.id },
      data: {
        totalTasks: total,
        completedTasks: validated,
        progressPct: total > 0 ? Math.round((validated / total) * 100) : 0,
      },
    })
  }
  console.log('✅ 3 films créés avec tâches')

  // =============================================
  // SUBMISSIONS (some completed tasks)
  // =============================================
  const validatedTasks = await prisma.task.findMany({
    where: { status: 'VALIDATED' },
    select: { id: true, filmId: true, claimedById: true },
  })

  for (const task of validatedTasks) {
    if (!task.claimedById) continue
    await prisma.taskSubmission.create({
      data: {
        taskId: task.id,
        userId: task.claimedById,
        notes: 'Tâche complétée avec succès. Fichiers livrés conformément aux instructions.',
        aiScore: 85 + Math.random() * 15,
        aiFeedback: 'Excellent travail. Qualité conforme aux attentes. Cohérence visuelle respectée.',
        status: 'HUMAN_APPROVED',
        humanReviewerId: admin.id,
        humanFeedback: 'Validé. Très bon travail.',
      },
    })
  }

  // Submission for CLAIMED task (pending AI review)
  const claimedTask = await prisma.task.findFirst({ where: { status: 'CLAIMED', claimedById: artist.id } })
  if (claimedTask) {
    await prisma.taskSubmission.create({
      data: {
        taskId: claimedTask.id,
        userId: artist.id,
        notes: 'Voici mes 8 cases de storyboard pour la scène du palais.',
        aiScore: 78,
        aiFeedback: 'Bonne qualité globale. Quelques ajustements de perspective suggérés.',
        status: 'AI_FLAGGED',
      },
    })
  }
  console.log('✅ Submissions créées')

  // =============================================
  // PAYMENTS (for validated tasks)
  // =============================================
  const validatedTasksFull = await prisma.task.findMany({
    where: { status: 'VALIDATED' },
    select: { id: true, priceEuros: true, claimedById: true },
  })

  for (const task of validatedTasksFull) {
    if (!task.claimedById) continue
    await prisma.payment.upsert({
      where: { taskId: task.id },
      create: {
        userId: task.claimedById,
        taskId: task.id,
        amountEur: task.priceEuros,
        method: 'STRIPE',
        status: Math.random() > 0.5 ? 'COMPLETED' : 'PENDING',
        paidAt: Math.random() > 0.5 ? new Date() : null,
      },
      update: {},
    })
  }
  console.log('✅ Paiements créés')

  // =============================================
  // LUMEN TRANSACTIONS
  // =============================================
  const lumenTxs = [
    { userId: contributor.id, amount: 100, type: 'PURCHASE', description: 'Achat de 100 Lumens' },
    { userId: contributor.id, amount: 10, type: 'TASK_REWARD', description: 'Récompense tâche — Écriture Acte I' },
    { userId: contributor.id, amount: 10, type: 'TASK_REWARD', description: 'Récompense tâche — Storyboard' },
    { userId: artist.id, amount: 200, type: 'PURCHASE', description: 'Achat de 200 Lumens' },
    { userId: artist.id, amount: 10, type: 'TASK_REWARD', description: 'Récompense tâche' },
    { userId: vip1.id, amount: 2000, type: 'PURCHASE', description: 'Achat de 2000 Lumens' },
    { userId: vip1.id, amount: 500, type: 'BONUS', description: 'Bonus VIP — Top contributeur du mois' },
    { userId: viewer.id, amount: 10, type: 'BONUS', description: 'Bonus bienvenue' },
    { userId: expert1.id, amount: 500, type: 'PURCHASE', description: 'Achat de 500 Lumens' },
    { userId: expert1.id, amount: 300, type: 'TASK_REWARD', description: 'Récompenses tâches cumulées' },
  ]

  for (const tx of lumenTxs) {
    await prisma.lumenTransaction.create({ data: tx as any })
  }
  console.log('✅ Transactions Lumens créées')

  // =============================================
  // ACHIEVEMENTS
  // =============================================
  const achievements = [
    { userId: admin.id, achievementType: 'Première Lumière', metadata: { note: 'Premier admin' } },
    { userId: contributor.id, achievementType: 'Première Tâche', metadata: { note: 'Première tâche complétée' } },
    { userId: artist.id, achievementType: 'Artiste en Herbe', metadata: { note: '10 tâches design complétées' } },
    { userId: artist.id, achievementType: 'Perfectionniste', metadata: { note: 'Rating > 4.5' } },
    { userId: vip1.id, achievementType: 'Première Lumière', metadata: {} },
    { userId: vip1.id, achievementType: 'Centurion', metadata: { note: '100 tâches complétées' } },
    { userId: vip1.id, achievementType: 'Légende Dorée', metadata: { note: 'Niveau VIP atteint' } },
    { userId: expert1.id, achievementType: 'Expert Reconnu', metadata: { note: 'Niveau Expert atteint' } },
    { userId: stunt.id, achievementType: 'Première Cascade', metadata: { note: 'Première capture motion' } },
  ]

  for (const ach of achievements) {
    await prisma.userAchievement.create({ data: ach as any })
  }
  console.log('✅ Achievements créés')

  // =============================================
  // SCREENPLAYS
  // =============================================
  await prisma.screenplay.createMany({
    data: [
      {
        userId: screenwriter.id,
        title: 'Les Ombres de Marrakech',
        logline: "Un détective français d'origine marocaine retourne à Marrakech pour enquêter sur des disparitions liées à un réseau de contrebande d'art.",
        genre: 'Thriller',
        aiScore: 72,
        aiFeedback: 'Structure solide, personnages bien définis. Le twist du 3ème acte mérite plus de build-up.',
        modificationTolerance: 30,
        revenueShareBps: 500,
        status: 'SUBMITTED',
      },
      {
        userId: screenwriter.id,
        title: 'Quantique',
        logline: "Une physicienne découvre que la réalité est une simulation et qu'elle peut la modifier, mais chaque changement a un prix.",
        genre: 'Science-Fiction',
        aiScore: 88,
        aiFeedback: 'Excellent concept. Dialogues percutants. Le dilemme moral est très bien construit.',
        modificationTolerance: 15,
        revenueShareBps: 800,
        status: 'ACCEPTED',
      },
    ],
  })
  console.log('✅ Scénarios créés')

  // =============================================
  // SUBSCRIPTIONS
  // =============================================
  await prisma.subscription.createMany({
    data: [
      { userId: viewer.id, plan: 'FREE', status: 'active' },
      { userId: vip1.id, plan: 'PREMIUM_PLUS', status: 'active', expiresAt: new Date('2027-01-01') },
      { userId: artist.id, plan: 'PREMIUM', status: 'active', expiresAt: new Date('2026-12-01') },
      { userId: expert1.id, plan: 'FREE', status: 'active', expiresAt: new Date('2026-12-01') },
      { userId: contributor.id, plan: 'FREE', status: 'active' },
    ],
  })
  console.log('✅ Abonnements créés (FREE, PREMIUM, PREMIUM_PLUS)')

  // =============================================
  // NOTIFICATIONS
  // =============================================
  const notifs = [
    { userId: contributor.id, type: 'TASK_VALIDATED', title: 'Tâche validée', body: 'Votre soumission "Écriture Acte I" a été approuvée. +100 points, +10 Lumens.', href: '/tasks', read: true },
    { userId: contributor.id, type: 'PAYMENT_RECEIVED', title: 'Paiement en cours', body: 'Votre paiement de 100,00€ est en cours de traitement.', href: '/profile/payments', read: false },
    { userId: artist.id, type: 'SUBMISSION_REVIEWED', title: 'Revue IA terminée', body: 'Score IA : 78/100. En attente de revue humaine.', href: '/tasks', read: false },
    { userId: rookie1.id, type: 'SYSTEM', title: 'Bienvenue sur Lumière!', body: 'Votre compte a été créé. Vérifiez votre email pour accéder à toutes les fonctionnalités.', href: '/dashboard', read: false },
    { userId: vip1.id, type: 'LEVEL_UP', title: 'Niveau VIP!', body: 'Félicitations ! Vous avez atteint le niveau VIP. Accès à toutes les tâches.', href: '/profile', read: true },
    { userId: expert1.id, type: 'NEW_TASK_AVAILABLE', title: 'Nouvelle tâche disponible', body: 'Une tâche EXPERT est disponible : "Storyboard Mer Rouge".', href: '/tasks', read: false },
  ]

  for (const n of notifs) {
    await prisma.notification.create({ data: n as any })
  }
  console.log('✅ Notifications créées')

  // =============================================
  // ADMIN TODOS
  // =============================================
  const todos = [
    { title: 'Configurer Stripe Connect', description: 'Créer compte Stripe et configurer les webhooks.', priority: 'HIGH' },
    { title: 'Intégrer Resend pour les emails', description: 'API key + templates de base.', priority: 'HIGH' },
    { title: 'Remplacer mock AI par Claude API', description: 'Utiliser claude-sonnet-4-6 pour la revue automatique.', priority: 'MEDIUM' },
    { title: 'Ajouter OAuth Google + GitHub', description: 'Providers NextAuth additionnels.', priority: 'MEDIUM' },
    { title: 'Créer page CGV/CGU', description: 'Faire rédiger par un avocat.', priority: 'HIGH', dueAt: new Date('2026-04-01') },
    { title: 'Tourner vidéo démo', description: 'Court-métrage démo de 2 min pour showcaser la plateforme.', priority: 'LOW' },
    { title: 'Configurer Sentry', description: 'Monitoring des erreurs en production.', priority: 'MEDIUM' },
    { title: 'Beta test — recruter 50 testeurs', description: 'Lancer appel sur LinkedIn et communautés IA.', priority: 'HIGH', dueAt: new Date('2026-05-01') },
  ]

  for (const todo of todos) {
    await prisma.adminTodo.create({ data: todo as any })
  }
  console.log('✅ Admin TODOs créés')

  // =============================================
  // FILM VOTES & BACKERS
  // =============================================
  await prisma.filmVote.createMany({
    data: [
      { filmId: film1.id, userId: viewer.id, voteType: 'UPVOTE' },
      { filmId: film1.id, userId: contributor.id, voteType: 'UPVOTE' },
      { filmId: film1.id, userId: artist.id, voteType: 'UPVOTE' },
      { filmId: film2.id, userId: viewer.id, voteType: 'UPVOTE' },
      { filmId: film2.id, userId: expert1.id, voteType: 'UPVOTE' },
      { filmId: film3.id, userId: screenwriter.id, voteType: 'UPVOTE' },
    ],
  })

  await prisma.filmBacker.createMany({
    data: [
      { filmId: film1.id, userId: vip1.id, amountInvested: 1000, revenueShareBps: 200, perks: ['Crédit au générique', 'Accès early screening'] },
      { filmId: film1.id, userId: viewer.id, amountInvested: 50, revenueShareBps: 10, perks: ['Crédit au générique'] },
      { filmId: film2.id, userId: vip1.id, amountInvested: 2000, revenueShareBps: 400, perks: ['Crédit au générique', 'NFT exclusif', 'Accès early screening'] },
    ],
  })
  console.log('✅ Votes et Backers créés')

  // =============================================
  // TASK COMMENTS
  // =============================================
  const availableTask = await prisma.task.findFirst({ where: { status: 'AVAILABLE' } })
  if (availableTask) {
    await prisma.taskComment.createMany({
      data: [
        { taskId: availableTask.id, userId: contributor.id, content: 'Question : le format des images est bien 16:9 ou on peut aussi faire du 2.39:1 ?', createdAt: new Date('2026-02-01') },
        { taskId: availableTask.id, userId: admin.id, content: 'Bonne question ! Le 2.39:1 serait idéal pour donner un look cinéma. Go pour ça.', createdAt: new Date('2026-02-02') },
      ],
    })
  }
  console.log('✅ Commentaires créés')

  // =============================================
  // PUBLIC FUNDING (AIDES PUBLIQUES)
  // =============================================
  await prisma.publicFunding.create({
    data: {
      name: 'Bourse French Tech Émergence',
      organism: 'Bpifrance',
      type: 'SUBVENTION',
      description: "Aide de 30 000€ pour les startups innovantes en phase d'amorçage. Financement non dilutif.",
      eligibility: "Entreprise < 1 an, projet innovant, équipe de 1-3 fondateurs. Dépôt en ligne sur bpifrance.fr.",
      maxAmount: 30000,
      status: 'ELIGIBLE',
      priority: 10,
      preCompany: false,
      postCompany: true,
      applicationUrl: 'https://bfrenchtech.bpifrance.fr',
      notes: "Très bonne opportunité. Délai de réponse ~3 mois.",
      steps: {
        create: [
          { title: 'Création du compte Bpifrance', order: 1, documents: ['KBIS', 'RIB'] },
          { title: 'Rédaction du dossier de candidature', order: 2, documents: ['Business Plan', 'Prévisionnel 3 ans'] },
          { title: 'Préparation du pitch deck', order: 3, documents: ['Pitch deck 12 slides'] },
          { title: 'Dépôt du dossier en ligne', order: 4 },
          { title: 'Passage en comité de sélection', order: 5 },
        ],
      },
    },
  })

  await prisma.publicFunding.create({
    data: {
      name: 'Aide aux Nouvelles Technologies en Production (NTP)',
      organism: 'CNC',
      type: 'SUBVENTION',
      description: "Le CNC soutient les projets utilisant des technologies innovantes pour la production audiovisuelle.",
      eligibility: "Société de production audiovisuelle immatriculée en France. Projet avec composante technologique innovante.",
      maxAmount: 50000,
      status: 'NOT_STARTED',
      priority: 9,
      preCompany: false,
      postCompany: true,
      applicationUrl: 'https://www.cnc.fr/professionnels/aides-et-financements',
      steps: {
        create: [
          { title: "Vérifier l'éligibilité détaillée", order: 1, documents: ['Grille CNC'] },
          { title: 'Préparer le dossier technique', order: 2, documents: ['Note technique', 'Devis détaillé'] },
          { title: "Rédiger la note d'intention", order: 3, documents: ["Note d'intention artistique"] },
          { title: 'Soumettre le dossier', order: 4 },
          { title: 'Présentation au comité', order: 5 },
        ],
      },
    },
  })

  await prisma.publicFunding.create({
    data: {
      name: "Crédit d'Impôt Recherche (CIR)",
      organism: 'Ministère de la Recherche',
      type: 'CREDIT_IMPOT',
      description: "30% des dépenses de R&D éligibles remboursées. L'IA appliquée au cinéma peut qualifier.",
      eligibility: "Toute entreprise française menant des activités de R&D. Dépenses : salaires chercheurs, sous-traitance.",
      maxAmount: 100000,
      status: 'ELIGIBLE',
      priority: 8,
      preCompany: false,
      postCompany: true,
      notes: "Potentiellement le plus rentable. Besoin d'un consultant CIR.",
      steps: {
        create: [
          { title: 'Identifier les activités R&D éligibles', order: 1 },
          { title: 'Documenter les travaux de recherche', order: 2, documents: ['Journal de bord R&D'] },
          { title: 'Calculer les dépenses éligibles', order: 3, documents: ['Comptabilité analytique'] },
          { title: 'Préparer le dossier justificatif', order: 4, documents: ['Dossier technique CIR'] },
          { title: 'Déclarer sur CERFA 2069-A', order: 5, documents: ['CERFA 2069-A'] },
        ],
      },
    },
  })

  await prisma.publicFunding.create({
    data: {
      name: 'Concours i-Nov',
      organism: 'Bpifrance / ADEME',
      type: 'CONCOURS',
      description: "Concours d'innovation pour les startups deeptech. Subvention jusqu'à 500K€.",
      eligibility: "Startup < 5 ans, projet deeptech, TRL 5-8. Candidature par vague thématique.",
      maxAmount: 500000,
      status: 'NOT_STARTED',
      priority: 7,
      preCompany: false,
      postCompany: true,
      steps: {
        create: [
          { title: 'Surveiller les vagues thématiques', order: 1 },
          { title: "Vérifier l'adéquation du projet", order: 2 },
          { title: 'Constituer le dossier complet', order: 3, documents: ['Dossier i-Nov', 'Budget prévisionnel'] },
          { title: 'Soumettre avant la date limite', order: 4 },
        ],
      },
    },
  })

  await prisma.publicFunding.create({
    data: {
      name: 'RIAM — Recherche et Innovation en Audiovisuel',
      organism: 'CNC / Bpifrance',
      type: 'SUBVENTION',
      description: "Programme conjoint CNC/Bpifrance pour les projets R&D audiovisuel innovants. IA + cinéma = axe prioritaire.",
      eligibility: "PME/startup audiovisuelle. Projet R&D collaboratif potentiel avec un labo de recherche.",
      maxAmount: 200000,
      status: 'ELIGIBLE',
      priority: 9,
      preCompany: false,
      postCompany: true,
      steps: {
        create: [
          { title: 'Identifier un partenaire labo', order: 1, description: 'INRIA, CNRS, université' },
          { title: 'Rédiger le projet collaboratif', order: 2, documents: ['Description projet', 'Budget'] },
          { title: 'Soumettre le dossier RIAM', order: 3 },
          { title: 'Évaluation par le comité mixte', order: 4 },
        ],
      },
    },
  })

  await prisma.publicFunding.create({
    data: {
      name: 'Statut Jeune Entreprise Innovante (JEI)',
      organism: 'URSSAF / DGFIP',
      type: 'CREDIT_IMPOT',
      description: "Exonérations de charges sociales et fiscales pendant 8 ans pour les entreprises innovantes.",
      eligibility: "Entreprise < 8 ans, < 250 salariés, indépendante, 15% min de dépenses en R&D.",
      maxAmount: 0,
      status: 'NOT_STARTED',
      priority: 6,
      preCompany: false,
      postCompany: true,
      notes: "Exonération charges patronales + IS. Cumulable avec CIR.",
      steps: {
        create: [
          { title: "Vérifier les critères d'éligibilité", order: 1 },
          { title: 'Préparer le rescrit fiscal', order: 2, documents: ['Rescrit JEI'] },
          { title: "Déclarer auprès de l'URSSAF", order: 3 },
        ],
      },
    },
  })

  await prisma.publicFunding.create({
    data: {
      name: "NACRE — Aide à la Création d'Entreprise",
      organism: 'Région / Pôle Emploi',
      type: 'PRET',
      description: "Prêt à taux zéro de 1 000 à 10 000€ pour les créateurs d'entreprise.",
      eligibility: "Demandeur d'emploi ou bénéficiaire RSA créant une entreprise.",
      maxAmount: 10000,
      status: 'NOT_STARTED',
      priority: 4,
      preCompany: true,
      postCompany: false,
      steps: {
        create: [
          { title: 'Contacter Pôle Emploi / Région', order: 1 },
          { title: 'Monter le dossier de prêt', order: 2, documents: ['Business Plan', 'Prévisionnel'] },
          { title: 'Entretien avec le comité', order: 3 },
        ],
      },
    },
  })

  await prisma.publicFunding.create({
    data: {
      name: 'ACRE — Exonération Charges Sociales',
      organism: 'URSSAF',
      type: 'SUBVENTION',
      description: "Exonération partielle de charges sociales pendant 1 an pour les créateurs d'entreprise.",
      eligibility: "Demandeur d'emploi, < 26 ans, bénéficiaire RSA. Automatique sous conditions.",
      maxAmount: 0,
      status: 'ELIGIBLE',
      priority: 5,
      preCompany: true,
      postCompany: false,
      steps: {
        create: [
          { title: 'Vérifier les conditions', order: 1 },
          { title: 'Déclarer lors de la création', order: 2, documents: ['Formulaire ACRE'] },
        ],
      },
    },
  })

  console.log('✅ Aides publiques créées (8 aides avec étapes)')

  // =============================================
  // V3 — CATALOG FILMS (STREAMING)
  // =============================================
  const catalogFilm1 = await prisma.catalogFilm.upsert({
    where: { slug: 'ombres-de-tokyo' },
    update: {},
    create: {
      title: 'Ombres de Tokyo',
      slug: 'ombres-de-tokyo',
      synopsis: "Un photographe français perdu dans les ruelles de Shinjuku découvre un monde parallèle à travers son objectif.",
      genre: 'Thriller',
      videoUrl: 'https://example.com/videos/ombres-de-tokyo.mp4',
      thumbnailUrl: '/posters/the-rebbe.jpg',
      duration: 720,
      status: 'LIVE',
      submittedById: artist.id,
      viewCount: 3420,
      monthlyViews: 1280,
      revenueSharePct: 50,
      isContest: true,
      featured: true,
      tags: ['thriller', 'japon', 'photographie', 'mystere'],
      year: 2026,
      language: 'fr',
    },
  })

  const catalogFilm2 = await prisma.catalogFilm.upsert({
    where: { slug: 'reve-electrique' },
    update: {},
    create: {
      title: 'Rêve Électrique',
      slug: 'reve-electrique',
      synopsis: "Dans un futur proche, une IA compositrice crée la symphonie parfaite — mais à quel prix ?",
      genre: 'Science-Fiction',
      videoUrl: 'https://example.com/videos/reve-electrique.mp4',
      thumbnailUrl: '/posters/keter.jpg',
      duration: 540,
      status: 'LIVE',
      submittedById: vip1.id,
      viewCount: 5890,
      monthlyViews: 2340,
      revenueSharePct: 55,
      isContest: true,
      featured: false,
      tags: ['sci-fi', 'musique', 'ia', 'futur'],
      year: 2026,
      language: 'fr',
    },
  })

  const catalogFilm3 = await prisma.catalogFilm.upsert({
    where: { slug: 'memoires-deau' },
    update: {},
    create: {
      title: "Mémoires d'Eau",
      slug: 'memoires-deau',
      synopsis: "Un documentaire poétique sur les rivières disparues de France, entièrement généré par IA.",
      genre: 'Documentaire',
      thumbnailUrl: '/posters/meam-loez.jpg',
      duration: 960,
      status: 'PENDING',
      submittedById: contributor.id,
      viewCount: 0,
      monthlyViews: 0,
      revenueSharePct: 50,
      isContest: false,
      tags: ['documentaire', 'ecologie', 'france'],
      year: 2026,
      language: 'fr',
    },
  })

  // Contracts for live films
  await prisma.catalogContract.create({
    data: {
      filmId: catalogFilm1.id,
      userId: artist.id,
      terms: '# Contrat de Distribution — Ombres de Tokyo\n\nContrat entre Sophie Visuelle et Lumière...',
      revenueSharePct: 50,
      promotionClause: true,
      exclusivity: false,
      status: 'SIGNED',
      signedAt: new Date('2026-01-15'),
    },
  })

  await prisma.catalogContract.create({
    data: {
      filmId: catalogFilm2.id,
      userId: vip1.id,
      terms: '# Contrat de Distribution — Rêve Électrique\n\nContrat entre Alexandre Lumens et Lumière...',
      revenueSharePct: 55,
      promotionClause: true,
      exclusivity: true,
      exclusivityBonus: 10,
      status: 'SIGNED',
      signedAt: new Date('2026-01-20'),
    },
  })

  // Film views
  const filmViewsData = [
    { filmId: catalogFilm1.id, userId: viewer.id, watchDuration: 600, completionPct: 83.3 },
    { filmId: catalogFilm1.id, userId: contributor.id, watchDuration: 720, completionPct: 100 },
    { filmId: catalogFilm1.id, userId: expert1.id, watchDuration: 450, completionPct: 62.5 },
    { filmId: catalogFilm2.id, userId: viewer.id, watchDuration: 540, completionPct: 100 },
    { filmId: catalogFilm2.id, userId: artist.id, watchDuration: 400, completionPct: 74.1 },
    { filmId: catalogFilm2.id, userId: stunt.id, watchDuration: 540, completionPct: 100 },
  ]
  for (const fv of filmViewsData) {
    await prisma.filmView.create({ data: fv })
  }

  // Creator payouts
  await prisma.creatorPayout.create({
    data: {
      userId: artist.id,
      filmId: catalogFilm1.id,
      month: '2026-01',
      totalViews: 3420,
      platformViews: 12000,
      ratio: 0.285,
      amountEur: 142.50,
      status: 'PAID',
      paidAt: new Date('2026-02-05'),
    },
  })

  await prisma.creatorPayout.create({
    data: {
      userId: vip1.id,
      filmId: catalogFilm2.id,
      month: '2026-01',
      totalViews: 5890,
      platformViews: 12000,
      ratio: 0.491,
      amountEur: 245.50,
      status: 'PAID',
      paidAt: new Date('2026-02-05'),
    },
  })

  await prisma.creatorPayout.create({
    data: {
      userId: artist.id,
      filmId: catalogFilm1.id,
      month: '2026-02',
      totalViews: 1280,
      platformViews: 5000,
      ratio: 0.256,
      amountEur: 128.00,
      status: 'PENDING',
    },
  })

  console.log('✅ Catalogue streaming créé (3 films, contrats, vues, payouts)')

  // =============================================
  // V3 — CREATOR PROFILES & VIDEOS
  // =============================================
  const creatorProfile1 = await prisma.creatorProfile.create({
    data: {
      userId: artist.id,
      stageName: 'SophieViz',
      niche: 'Art & Design',
      style: 'NOFACE',
      bio: 'Artiste digitale spécialisée dans les visuels cinématographiques IA.',
      toneOfVoice: 'Inspirant et calme',
      catchphrases: ['Créez sans limites', 'L\'art n\'a pas de visage'],
      avatarType: 'anime',
      avatarConfig: { color: 'purple', expression: 'mysterious' },
      voiceType: 'synthetic',
      voiceConfig: { pitch: 'medium', speed: 'normal', accent: 'neutral' },
      publishFrequency: '3x_week',
      automationLevel: 'ASSISTED',
      wizardCompleted: true,
    },
  })

  const creatorProfile2 = await prisma.creatorProfile.create({
    data: {
      userId: vip1.id,
      stageName: 'AlexLumens',
      niche: 'Storytelling',
      style: 'HYBRID',
      bio: 'Conteur digital, entre mystery et motivation. 100K+ followers.',
      toneOfVoice: 'Dramatique et captivant',
      catchphrases: ['La vérité est dans les ombres', 'Êtes-vous prêts ?'],
      avatarType: 'realistic',
      avatarConfig: { style: 'cinematic', lighting: 'dramatic' },
      voiceType: 'clone',
      voiceConfig: { model: 'eleven_multilingual_v2', stability: 0.7 },
      publishFrequency: 'daily',
      automationLevel: 'AUTO',
      wizardCompleted: true,
    },
  })

  const creatorProfile3 = await prisma.creatorProfile.create({
    data: {
      userId: expert1.id,
      stageName: 'YukiCreates',
      niche: 'Éducation',
      style: 'NOFACE',
      bio: 'Vulgarisation scientifique et tech en vidéos animées.',
      toneOfVoice: 'Clair et pédagogique',
      catchphrases: ['Expliqué simplement'],
      avatarType: 'cartoon',
      avatarConfig: { color: 'blue', style: 'friendly' },
      voiceType: 'natural',
      publishFrequency: 'weekly',
      automationLevel: 'EXPERT',
      wizardCompleted: true,
    },
  })

  // Generated Videos
  const video1 = await prisma.generatedVideo.create({
    data: {
      profileId: creatorProfile1.id,
      title: 'Comment l\'IA révolutionne le design',
      script: 'L\'intelligence artificielle transforme notre façon de créer...',
      duration: 60,
      status: 'PUBLISHED',
      platforms: ['TIKTOK', 'INSTAGRAM'],
      publishedAt: new Date('2026-02-10'),
      viewCount: 12500,
      likeCount: 890,
      shareCount: 45,
      tokensSpent: 10,
    },
  })

  const video2 = await prisma.generatedVideo.create({
    data: {
      profileId: creatorProfile1.id,
      title: '5 tendances visuelles 2026',
      script: 'Voici les 5 tendances qui vont dominer le design en 2026...',
      duration: 90,
      status: 'READY',
      platforms: ['YOUTUBE', 'TIKTOK'],
      viewCount: 0,
      likeCount: 0,
      shareCount: 0,
      tokensSpent: 15,
    },
  })

  const video3 = await prisma.generatedVideo.create({
    data: {
      profileId: creatorProfile2.id,
      title: 'L\'affaire du manoir abandonné',
      script: 'Ce soir, je vous emmène dans un endroit où personne n\'ose aller...',
      duration: 120,
      status: 'PUBLISHED',
      platforms: ['YOUTUBE', 'TIKTOK', 'INSTAGRAM'],
      publishedAt: new Date('2026-02-15'),
      abTestVariant: 'A',
      abTestGroupId: 'test-001',
      viewCount: 45200,
      likeCount: 3200,
      shareCount: 890,
      tokensSpent: 18,
    },
  })

  const video4 = await prisma.generatedVideo.create({
    data: {
      profileId: creatorProfile2.id,
      title: 'L\'affaire du manoir abandonné (v2)',
      script: 'Imaginez un lieu oublié par le temps...',
      duration: 120,
      status: 'PUBLISHED',
      platforms: ['YOUTUBE', 'TIKTOK', 'INSTAGRAM'],
      publishedAt: new Date('2026-02-15'),
      abTestVariant: 'B',
      abTestGroupId: 'test-001',
      viewCount: 38900,
      likeCount: 2800,
      shareCount: 720,
      tokensSpent: 18,
    },
  })

  await prisma.generatedVideo.create({
    data: {
      profileId: creatorProfile3.id,
      title: 'La physique quantique en 60 secondes',
      script: 'La physique quantique, c\'est pas si compliqué...',
      duration: 60,
      status: 'GENERATING',
      platforms: ['YOUTUBE'],
      viewCount: 0,
      likeCount: 0,
      shareCount: 0,
      tokensSpent: 10,
    },
  })

  // Publish schedules
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 86400000)
  const dayAfter = new Date(now.getTime() + 86400000 * 2)

  await prisma.publishSchedule.createMany({
    data: [
      { videoId: video1.id, platform: 'TIKTOK', scheduledAt: new Date('2026-02-10T14:00:00Z'), jitterMinutes: 12, publishedAt: new Date('2026-02-10T14:12:00Z'), status: 'PUBLISHED' },
      { videoId: video1.id, platform: 'INSTAGRAM', scheduledAt: new Date('2026-02-10T16:00:00Z'), jitterMinutes: -8, publishedAt: new Date('2026-02-10T15:52:00Z'), status: 'PUBLISHED' },
      { videoId: video2.id, platform: 'YOUTUBE', scheduledAt: tomorrow, jitterMinutes: 22, status: 'SCHEDULED' },
      { videoId: video2.id, platform: 'TIKTOK', scheduledAt: dayAfter, jitterMinutes: -15, status: 'SCHEDULED' },
      { videoId: video3.id, platform: 'YOUTUBE', scheduledAt: new Date('2026-02-15T18:00:00Z'), jitterMinutes: 5, publishedAt: new Date('2026-02-15T18:05:00Z'), status: 'PUBLISHED' },
      { videoId: video3.id, platform: 'TIKTOK', scheduledAt: new Date('2026-02-15T20:00:00Z'), jitterMinutes: -20, publishedAt: new Date('2026-02-15T19:40:00Z'), status: 'PUBLISHED' },
    ],
  })

  console.log('✅ Profils créateurs, vidéos et plannings créés')

  // =============================================
  // V3 — SOCIAL ACCOUNTS
  // =============================================
  await prisma.socialAccount.createMany({
    data: [
      { userId: artist.id, platform: 'TIKTOK', handle: '@sophieviz', followersCount: 12500, engagementRate: 4.2, isActive: true, lastSyncAt: new Date() },
      { userId: artist.id, platform: 'INSTAGRAM', handle: '@sophieviz.art', followersCount: 8900, engagementRate: 3.8, isActive: true, lastSyncAt: new Date() },
      { userId: vip1.id, platform: 'YOUTUBE', handle: '@AlexLumens', followersCount: 52000, engagementRate: 6.1, isActive: true, lastSyncAt: new Date() },
      { userId: vip1.id, platform: 'TIKTOK', handle: '@alexlumens', followersCount: 89000, engagementRate: 8.5, isActive: true, lastSyncAt: new Date() },
      { userId: vip1.id, platform: 'INSTAGRAM', handle: '@alex.lumens', followersCount: 31000, engagementRate: 5.2, isActive: true, lastSyncAt: new Date() },
      { userId: expert1.id, platform: 'YOUTUBE', handle: '@YukiCreates', followersCount: 24000, engagementRate: 5.8, isActive: true, lastSyncAt: new Date() },
    ],
  })
  console.log('✅ Comptes sociaux créés')

  // =============================================
  // V3 — COLLABS & ORDERS
  // =============================================
  await prisma.collabRequest.createMany({
    data: [
      { fromUserId: contributor.id, toUserId: artist.id, type: 'SHOUTOUT', status: 'COMPLETED', escrowTokens: 20, message: 'Salut Sophie, un shoutout mutuel ?', response: 'Avec plaisir !', completedAt: new Date('2026-02-01'), rating: 4.5 },
      { fromUserId: vip1.id, toUserId: expert1.id, type: 'CO_CREATE', status: 'ACCEPTED', escrowTokens: 50, message: 'On fait une vidéo ensemble sur l\'IA dans le cinéma ?' },
      { fromUserId: expert1.id, toUserId: artist.id, type: 'GUEST', status: 'PENDING', escrowTokens: 30, message: 'Intervention guest dans ma prochaine vidéo éducative ?' },
      { fromUserId: rookie2.id, toUserId: vip1.id, type: 'AD_EXCHANGE', status: 'REJECTED', escrowTokens: 10, message: 'Échange de pub ?', response: 'Désolé, pas compatible avec ma niche.' },
    ],
  })

  await prisma.videoOrder.create({
    data: {
      clientUserId: contributor.id,
      creatorUserId: artist.id,
      title: 'Vidéo promo mon portfolio',
      description: 'Vidéo de 30 sec pour présenter mon portfolio de prompt engineer.',
      style: 'Cinématique, professionnel',
      duration: 30,
      deadline: new Date('2026-03-01'),
      priceTokens: 50,
      status: 'IN_PROGRESS',
      revisionCount: 0,
      maxRevisions: 2,
    },
  })

  await prisma.videoOrder.create({
    data: {
      clientUserId: viewer.id,
      title: 'Intro YouTube custom',
      description: 'Une intro animée de 5 secondes avec mon logo et un effet gold cinéma.',
      style: 'Luxe, doré, cinéma',
      duration: 5,
      deadline: new Date('2026-03-15'),
      priceTokens: 25,
      status: 'OPEN',
      maxRevisions: 1,
    },
  })

  await prisma.videoOrder.create({
    data: {
      clientUserId: expert1.id,
      creatorUserId: vip1.id,
      title: 'Animation explainer science',
      description: 'Animation de 60 sec expliquant le concept de machine learning pour ma chaîne.',
      style: 'Éducatif, coloré, dynamique',
      duration: 60,
      deadline: new Date('2026-02-28'),
      priceTokens: 80,
      status: 'DELIVERED',
      deliveryUrl: 'https://example.com/delivery/ml-explainer.mp4',
      revisionCount: 1,
      maxRevisions: 2,
    },
  })

  console.log('✅ Collabs et commandes créées')

  // =============================================
  // V3 — REFERRALS
  // =============================================
  // VIP referred contributor
  await prisma.user.update({
    where: { id: vip1.id },
    data: { referralCode: 'ALEX-VIP-2026' },
  })

  await prisma.user.update({
    where: { id: artist.id },
    data: { referralCode: 'SOPHIE-ART' },
  })

  await prisma.referral.create({
    data: {
      referrerId: vip1.id,
      referredId: rookie2.id,
      tokensEarned: 30,
      status: 'COMPLETED',
      completedAt: new Date('2026-01-10'),
    },
  })

  await prisma.referral.create({
    data: {
      referrerId: artist.id,
      referredId: viewer.id,
      tokensEarned: 30,
      status: 'COMPLETED',
      completedAt: new Date('2026-01-20'),
    },
  })

  console.log('✅ Parrainages créés')

  // =============================================
  // V3 — REPUTATION EVENTS
  // =============================================
  const repEvents = [
    { userId: artist.id, type: 'deadline_met', score: 5, weight: 1.0, source: 'STUDIO' as const },
    { userId: artist.id, type: 'quality_high', score: 8, weight: 1.0, source: 'STUDIO' as const },
    { userId: artist.id, type: 'collab_completed', score: 4, weight: 1.0, source: 'COLLABS' as const },
    { userId: vip1.id, type: 'deadline_met', score: 5, weight: 1.0, source: 'STUDIO' as const },
    { userId: vip1.id, type: 'quality_high', score: 10, weight: 1.0, source: 'STUDIO' as const },
    { userId: vip1.id, type: 'engagement_high', score: 7, weight: 1.0, source: 'CREATOR' as const },
    { userId: vip1.id, type: 'collab_completed', score: 5, weight: 1.0, source: 'COLLABS' as const },
    { userId: expert1.id, type: 'deadline_met', score: 5, weight: 1.0, source: 'STUDIO' as const },
    { userId: expert1.id, type: 'quality_high', score: 9, weight: 1.0, source: 'STUDIO' as const },
    { userId: contributor.id, type: 'deadline_met', score: 4, weight: 1.0, source: 'STUDIO' as const },
    { userId: contributor.id, type: 'collab_completed', score: 3, weight: 1.0, source: 'COLLABS' as const },
  ]

  for (const re of repEvents) {
    await prisma.reputationEvent.create({ data: re })
  }

  // Update reputation scores
  await prisma.user.update({ where: { id: artist.id }, data: { reputationScore: 72, reputationBadge: 'gold' } })
  await prisma.user.update({ where: { id: vip1.id }, data: { reputationScore: 88, reputationBadge: 'platinum' } })
  await prisma.user.update({ where: { id: expert1.id }, data: { reputationScore: 75, reputationBadge: 'gold' } })
  await prisma.user.update({ where: { id: contributor.id }, data: { reputationScore: 55, reputationBadge: 'silver' } })

  console.log('✅ Événements de réputation créés')

  // =============================================
  // V3 — ADDITIONAL LUMEN TRANSACTIONS (new types)
  // =============================================
  const v3Txs = [
    { userId: artist.id, amount: -10, type: 'VIDEO_GEN', description: 'Génération vidéo — Comment l\'IA révolutionne le design' },
    { userId: artist.id, amount: -15, type: 'VIDEO_GEN', description: 'Génération vidéo 4K — 5 tendances visuelles 2026' },
    { userId: vip1.id, amount: -18, type: 'VIDEO_GEN', description: 'Génération vidéo — L\'affaire du manoir abandonné' },
    { userId: vip1.id, amount: -8, type: 'AB_TEST', description: 'A/B Test — Variante B du manoir' },
    { userId: vip1.id, amount: -5, type: 'PUBLISH', description: 'Publication multi-plateforme (3 réseaux)' },
    { userId: artist.id, amount: -5, type: 'PUBLISH', description: 'Publication TikTok + Instagram' },
    { userId: contributor.id, amount: -3, type: 'OUTREACH', description: 'Outreach — Contact Sophie pour collab' },
    { userId: expert1.id, amount: -10, type: 'VIDEO_GEN', description: 'Génération vidéo — Physique quantique' },
  ]

  for (const tx of v3Txs) {
    await prisma.lumenTransaction.create({ data: tx as any })
  }
  console.log('✅ Transactions V3 créées')

  // =============================================
  // CONTENT HASHES
  // =============================================
  await prisma.contentHash.createMany({
    data: [
      { entityType: 'TaskSubmission', entityId: 'sub-1', hash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2', algorithm: 'SHA-256', createdById: contributor.id },
      { entityType: 'TaskSubmission', entityId: 'sub-2', hash: 'f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5', algorithm: 'SHA-256', createdById: vip1.id },
    ],
  })
  console.log('✅ Content hashes créés')

  // =============================================
  // V4 — FILM TOKEN OFFERINGS
  // =============================================
  const offering1 = await prisma.filmTokenOffering.upsert({
    where: { filmId: film1.id },
    update: {},
    create: {
      filmId: film1.id,
      totalTokens: 1000,
      tokenPrice: 10.0,
      minInvestment: 1,
      maxPerUser: 100,
      softCap: 5000,
      hardCap: 10000,
      raised: 5000,
      tokensSold: 500,
      status: 'OPEN',
      legalStructure: 'IL_EXEMPT',
      riskLevel: 'MEDIUM',
      revenueModel: 'REVENUE_SHARE',
      projectedROI: 15.0,
      distributionPct: 70,
      lockupDays: 90,
      votingRights: true,
      kycRequired: true,
      accreditedOnly: false,
      opensAt: new Date('2026-01-01'),
      closesAt: new Date('2026-06-01'),
    },
  })

  const offering2 = await prisma.filmTokenOffering.upsert({
    where: { filmId: film2.id },
    update: {},
    create: {
      filmId: film2.id,
      totalTokens: 500,
      tokenPrice: 20.0,
      minInvestment: 1,
      maxPerUser: 50,
      softCap: 5000,
      hardCap: 10000,
      raised: 10000,
      tokensSold: 500,
      status: 'FUNDED',
      legalStructure: 'IL_EXEMPT',
      riskLevel: 'MEDIUM',
      revenueModel: 'REVENUE_SHARE',
      projectedROI: 20.0,
      distributionPct: 70,
      lockupDays: 90,
      votingRights: true,
      kycRequired: true,
      accreditedOnly: false,
      opensAt: new Date('2025-10-01'),
      closesAt: new Date('2026-01-01'),
      fundedAt: new Date('2025-12-20'),
    },
  })

  console.log('✅ 2 FilmTokenOfferings créés')

  // =============================================
  // V4 — FILM TOKEN PURCHASES
  // =============================================
  const lockupDate1 = new Date()
  lockupDate1.setDate(lockupDate1.getDate() + 90)

  const purchase1 = await prisma.filmTokenPurchase.create({
    data: {
      offeringId: offering1.id,
      userId: vip1.id,
      tokenCount: 200,
      amountPaid: 2000,
      currency: 'EUR',
      paymentMethod: 'STRIPE',
      status: 'CONFIRMED',
      kycVerified: true,
      lockedUntil: lockupDate1,
    },
  })

  const purchase2 = await prisma.filmTokenPurchase.create({
    data: {
      offeringId: offering1.id,
      userId: expert1.id,
      tokenCount: 100,
      amountPaid: 1000,
      currency: 'EUR',
      paymentMethod: 'STRIPE',
      status: 'CONFIRMED',
      kycVerified: true,
      lockedUntil: lockupDate1,
    },
  })

  await prisma.filmTokenPurchase.create({
    data: {
      offeringId: offering1.id,
      userId: contributor.id,
      tokenCount: 50,
      amountPaid: 500,
      currency: 'EUR',
      paymentMethod: 'STRIPE',
      status: 'CONFIRMED',
      kycVerified: true,
      lockedUntil: lockupDate1,
    },
  })

  await prisma.filmTokenPurchase.create({
    data: {
      offeringId: offering2.id,
      userId: vip1.id,
      tokenCount: 300,
      amountPaid: 6000,
      currency: 'EUR',
      paymentMethod: 'STRIPE',
      status: 'CONFIRMED',
      kycVerified: true,
      lockedUntil: new Date('2026-03-20'),
    },
  })

  await prisma.filmTokenPurchase.create({
    data: {
      offeringId: offering2.id,
      userId: artist.id,
      tokenCount: 150,
      amountPaid: 3000,
      currency: 'EUR',
      paymentMethod: 'STRIPE',
      status: 'CONFIRMED',
      kycVerified: true,
      lockedUntil: new Date('2026-03-20'),
    },
  })

  console.log('✅ 5 FilmTokenPurchases créés')

  // =============================================
  // V4 — FILM TOKEN TRANSFERS
  // =============================================
  await prisma.filmTokenTransfer.create({
    data: {
      offeringId: offering1.id,
      fromUserId: vip1.id,
      toUserId: viewer.id,
      tokenCount: 20,
      pricePerToken: 12.0,
      totalAmount: 240,
      fee: 12,
      status: 'COMPLETED',
      txHash: '0xabc123def456789completed',
    },
  })

  await prisma.filmTokenTransfer.create({
    data: {
      offeringId: offering1.id,
      fromUserId: expert1.id,
      toUserId: rookie2.id,
      tokenCount: 10,
      pricePerToken: 11.5,
      totalAmount: 115,
      fee: 5.75,
      status: 'PENDING',
    },
  })

  console.log('✅ 2 FilmTokenTransfers créés')

  // =============================================
  // V4 — GOVERNANCE PROPOSALS
  // =============================================
  const proposalDeadline = new Date()
  proposalDeadline.setDate(proposalDeadline.getDate() + 7)

  const proposal1 = await prisma.governanceProposal.create({
    data: {
      offeringId: offering1.id,
      proposerId: vip1.id,
      title: 'Choix du compositeur musical',
      description: 'Proposition de sélectionner un compositeur IA pour la bande originale d\'Exodus. Trois options : Hans AI (épique orchestral), Neon Synth (électronique cinématique), ou Classic Revival (néo-classique). Le vote déterminera la direction musicale du film.',
      type: 'CASTING',
      options: ['Hans AI', 'Neon Synth', 'Classic Revival'],
      status: 'ACTIVE',
      votesFor: 2,
      votesAgainst: 1,
      abstentions: 0,
      quorumPct: 30,
      deadline: proposalDeadline,
    },
  })

  const proposal2 = await prisma.governanceProposal.create({
    data: {
      offeringId: offering2.id,
      proposerId: artist.id,
      title: 'Augmenter le budget VFX',
      description: 'Suite aux premiers tests, les effets visuels de Neon Babylon nécessitent un budget supplémentaire de 5 000€ pour atteindre la qualité attendue. Réallocation depuis le poste Marketing.',
      type: 'BUDGET_REALLOC',
      options: ['Pour', 'Contre'],
      status: 'PASSED',
      votesFor: 8,
      votesAgainst: 2,
      abstentions: 1,
      quorumPct: 30,
      deadline: new Date('2026-02-15'),
      executedAt: new Date('2026-02-16'),
    },
  })

  console.log('✅ 2 GovernanceProposals créés')

  // =============================================
  // V4 — GOVERNANCE VOTES
  // =============================================
  await prisma.governanceVote.create({
    data: {
      proposalId: proposal1.id,
      userId: vip1.id,
      vote: 'FOR',
      tokenWeight: 200,
    },
  })

  await prisma.governanceVote.create({
    data: {
      proposalId: proposal1.id,
      userId: expert1.id,
      vote: 'FOR',
      tokenWeight: 100,
    },
  })

  await prisma.governanceVote.create({
    data: {
      proposalId: proposal1.id,
      userId: contributor.id,
      vote: 'AGAINST',
      tokenWeight: 50,
    },
  })

  await prisma.governanceVote.create({
    data: {
      proposalId: proposal2.id,
      userId: vip1.id,
      vote: 'FOR',
      tokenWeight: 300,
    },
  })

  console.log('✅ 4 GovernanceVotes créés')

  // =============================================
  // V4 — FILM REVENUES
  // =============================================
  await prisma.filmRevenue.create({
    data: {
      offeringId: offering2.id,
      source: 'STREAMING',
      amount: 1200,
      period: '2026-01',
      distributed: true,
    },
  })

  await prisma.filmRevenue.create({
    data: {
      offeringId: offering2.id,
      source: 'STREAMING',
      amount: 1800,
      period: '2026-02',
      distributed: false,
    },
  })

  await prisma.filmRevenue.create({
    data: {
      offeringId: offering2.id,
      source: 'LICENSING',
      amount: 500,
      period: '2026-01',
      distributed: true,
    },
  })

  console.log('✅ 3 FilmRevenues créés')

  // =============================================
  // V4 — TOKEN DIVIDENDS
  // =============================================
  await prisma.tokenDividend.create({
    data: {
      offeringId: offering2.id,
      userId: vip1.id,
      amount: 714,
      period: '2026-01',
      tokenCount: 300,
      totalPool: 1190,
      status: 'PAID',
      paidAt: new Date('2026-02-05'),
    },
  })

  await prisma.tokenDividend.create({
    data: {
      offeringId: offering2.id,
      userId: artist.id,
      amount: 476,
      period: '2026-01',
      tokenCount: 150,
      totalPool: 1190,
      status: 'PENDING',
    },
  })

  console.log('✅ 2 TokenDividends créés')

  // =============================================
  // V4 — FILM BUDGET LINES
  // =============================================
  // Budget lines for Exodus (film1)
  const budget1Lines = [
    { filmId: film1.id, category: 'SCRIPT', label: 'Écriture & Scénario', amount: 5000, percentage: 10, spent: 5000, locked: true },
    { filmId: film1.id, category: 'VFX', label: 'Effets Visuels & Animation', amount: 15000, percentage: 30, spent: 2000, locked: false },
    { filmId: film1.id, category: 'SOUND', label: 'Sound Design & Musique', amount: 8000, percentage: 16, spent: 0, locked: false },
    { filmId: film1.id, category: 'MARKETING', label: 'Marketing & Distribution', amount: 7000, percentage: 14, spent: 500, locked: false },
    { filmId: film1.id, category: 'LEGAL', label: 'Frais Juridiques & Conformité', amount: 3000, percentage: 6, spent: 1000, locked: false },
    { filmId: film1.id, category: 'PLATFORM_FEE', label: 'Commission Plateforme (10%)', amount: 5000, percentage: 10, spent: 0, locked: true },
    { filmId: film1.id, category: 'CONTINGENCY', label: 'Contingence & Imprévus', amount: 7000, percentage: 14, spent: 0, locked: false },
  ]

  for (const line of budget1Lines) {
    await prisma.filmBudgetLine.create({ data: line })
  }

  // Budget lines for Neon Babylon (film2)
  const budget2Lines = [
    { filmId: film2.id, category: 'SCRIPT', label: 'Écriture & Worldbuilding', amount: 8000, percentage: 10, spent: 4000, locked: true },
    { filmId: film2.id, category: 'VFX', label: 'VFX & Environnements', amount: 25000, percentage: 31.25, spent: 5000, locked: false },
    { filmId: film2.id, category: 'SOUND', label: 'Sound Design Cyberpunk', amount: 10000, percentage: 12.5, spent: 0, locked: false },
    { filmId: film2.id, category: 'ACTORS', label: 'Voix & Performance Capture', amount: 12000, percentage: 15, spent: 3000, locked: false },
    { filmId: film2.id, category: 'MARKETING', label: 'Marketing & Teaser', amount: 8000, percentage: 10, spent: 1000, locked: false },
    { filmId: film2.id, category: 'LEGAL', label: 'Frais Juridiques', amount: 4000, percentage: 5, spent: 2000, locked: false },
    { filmId: film2.id, category: 'PLATFORM_FEE', label: 'Commission Plateforme (10%)', amount: 8000, percentage: 10, spent: 0, locked: true },
    { filmId: film2.id, category: 'CONTINGENCY', label: 'Contingence', amount: 5000, percentage: 6.25, spent: 0, locked: false },
  ]

  for (const line of budget2Lines) {
    await prisma.filmBudgetLine.create({ data: line })
  }

  console.log('✅ Budget lines créés (7 pour Exodus, 8 pour Neon Babylon)')

  // =============================================
  // V4 — LEGAL CHECKLIST
  // =============================================
  const legalItems = [
    // ISA (Israel Securities Authority)
    { category: 'ISA', item: 'Demande sandbox réglementaire ISA', description: 'Soumettre le dossier de demande au sandbox de l\'ISA pour les security tokens.', status: 'PENDING', responsible: 'HUMAN', priority: 10 },
    { category: 'ISA', item: 'Classification des tokens (utility vs security)', description: 'Obtenir un avis juridique sur la classification des Film Tokens sous le droit israélien.', status: 'IN_PROGRESS', responsible: 'BOTH', priority: 10, notes: 'Consultation avec cabinet Meitar en cours' },
    { category: 'ISA', item: 'Exemption prospectus < 35 investisseurs', description: 'Vérifier l\'applicabilité de l\'exemption pour offres à moins de 35 investisseurs qualifiés.', status: 'DONE', responsible: 'HUMAN', priority: 8, completedAt: new Date('2026-02-01') },
    // KYC
    { category: 'KYC', item: 'Intégrer Sumsub SDK', description: 'Intégration technique du SDK Sumsub pour la vérification d\'identité des investisseurs.', status: 'PENDING', responsible: 'CLAUDE', priority: 9 },
    { category: 'KYC', item: 'Définir les niveaux de vérification', description: 'KYC basique (< 1000€), KYC avancé (> 1000€), KYC accréditée (> 10 000€).', status: 'DONE', responsible: 'BOTH', priority: 8, completedAt: new Date('2026-01-20') },
    { category: 'KYC', item: 'Politique de rétention des données personnelles', description: 'Conformité RGPD pour le stockage des documents d\'identité. Durée : 5 ans après fin de relation.', status: 'PENDING', responsible: 'HUMAN', priority: 7 },
    // AML
    { category: 'AML', item: 'Procédures anti-blanchiment (AML)', description: 'Rédiger les procédures AML conformes aux régulations israéliennes et européennes.', status: 'IN_PROGRESS', responsible: 'HUMAN', priority: 9, notes: 'Draft en cours avec le compliance officer' },
    { category: 'AML', item: 'Screening des sanctions (OFAC, EU)', description: 'Intégrer un outil de screening automatique des listes de sanctions internationales.', status: 'PENDING', responsible: 'CLAUDE', priority: 8 },
    { category: 'AML', item: 'Déclaration de soupçon (process)', description: 'Définir le processus interne pour les déclarations de soupçon à l\'autorité compétente.', status: 'PENDING', responsible: 'HUMAN', priority: 7 },
    // TAX
    { category: 'TAX', item: 'Structure fiscale Israel-France', description: 'Convention fiscale bilatérale. Déterminer le traitement fiscal des revenus de tokens.', status: 'PENDING', responsible: 'HUMAN', priority: 8, notes: 'Consulter un fiscaliste spécialisé' },
    { category: 'TAX', item: 'TVA sur les services de plateforme', description: 'Déterminer si les frais de plateforme sont soumis à la TVA (17% Israël, 20% France).', status: 'PENDING', responsible: 'HUMAN', priority: 7 },
    { category: 'TAX', item: 'Fiscalité des dividendes tokens', description: 'Traitement fiscal des distributions de revenus aux détenteurs de tokens.', status: 'PENDING', responsible: 'HUMAN', priority: 7 },
    // CONTRACT
    { category: 'CONTRACT', item: 'CGU Plateforme (Terms of Service)', description: 'Rédaction des conditions générales d\'utilisation couvrant tous les modules.', status: 'IN_PROGRESS', responsible: 'BOTH', priority: 9, notes: 'V1 prête, en revue juridique' },
    { category: 'CONTRACT', item: 'Contrat d\'investissement token standard', description: 'Template de contrat entre l\'investisseur et la société pour l\'achat de Film Tokens.', status: 'PENDING', responsible: 'HUMAN', priority: 9 },
    { category: 'CONTRACT', item: 'Politique de remboursement', description: 'Conditions de remboursement des tokens en cas d\'annulation du projet film.', status: 'DONE', responsible: 'BOTH', priority: 8, completedAt: new Date('2026-02-10') },
    // CORPORATE
    { category: 'CORPORATE', item: 'Enregistrement société Ltd en Israël', description: 'Création de la société Lumière Ltd auprès du Companies Registrar. Capital minimum : 1 NIS.', status: 'PENDING', responsible: 'HUMAN', priority: 10 },
    { category: 'CORPORATE', item: 'Ouverture compte bancaire professionnel', description: 'Compte multi-devises chez Leumi ou Hapoalim. Documents : enregistrement société, passeports directeurs.', status: 'PENDING', responsible: 'HUMAN', priority: 10 },
    { category: 'CORPORATE', item: 'Assurance responsabilité civile professionnelle', description: 'Couverture RC Pro pour la plateforme, incluant la responsabilité liée aux investissements.', status: 'PENDING', responsible: 'HUMAN', priority: 6 },
    { category: 'CORPORATE', item: 'Nomination d\'un DPO (Data Protection Officer)', description: 'Obligatoire RGPD si traitement à grande échelle de données personnelles.', status: 'PENDING', responsible: 'HUMAN', priority: 5 },
    { category: 'CORPORATE', item: 'Registre des traitements de données', description: 'Documenter tous les traitements de données personnelles (Article 30 RGPD).', status: 'PENDING', responsible: 'CLAUDE', priority: 6 },
  ]

  for (const item of legalItems) {
    await prisma.legalChecklist.create({ data: item as any })
  }

  console.log('✅ 20 items LegalChecklist créés')

  // =============================================
  // V6 — AI ACTORS (10)
  // =============================================
  const actorElise = await prisma.aIActor.upsert({
    where: { slug: 'elise-marchand' },
    update: {},
    create: {
      name: 'Élise Marchand',
      slug: 'elise-marchand',
      bio: 'La Diva du Silence. Première actrice IA à avoir transcendé les frontières du cinéma digital, connue pour ses performances dramatiques intenses.',
      nationality: 'Française',
      birthYear: 2024,
      debutYear: 2024,
      style: 'DRAMATIC',
      personalityTraits: ['Perfectionniste', 'Magnétique', 'Imprévisible'],
      funFacts: ['A été générée en 847 itérations', 'Son regard a été calibré sur 200 peintures de la Renaissance', 'Première IA nominée aux César virtuels'],
      quote: 'Le silence dit plus que mille répliques',
      socialFollowers: 8200000,
      filmCount: 5,
      awardsCount: 3,
      isActive: true,
    },
  })

  const actorJames = await prisma.aIActor.upsert({
    where: { slug: 'james-sterling' },
    update: {},
    create: {
      name: 'James Sterling',
      slug: 'james-sterling',
      bio: 'Le Cascadeur Digital. Spécialiste des scènes d\'action impossibles, James repousse les limites de la physique virtuelle.',
      nationality: 'Américaine',
      birthYear: 2024,
      debutYear: 2024,
      style: 'ACTION',
      personalityTraits: ['Énergique', 'Discipliné', 'Charismatique'],
      funFacts: ['Peut simuler 47 types de chutes différentes', 'Son modèle physique est basé sur 300 cascadeurs réels'],
      quote: 'Chaque cascade est un poème en mouvement',
      socialFollowers: 5100000,
      filmCount: 4,
      awardsCount: 1,
      isActive: true,
    },
  })

  const actorYumi = await prisma.aIActor.upsert({
    where: { slug: 'yumi-tanaka' },
    update: {},
    create: {
      name: 'Yumi Tanaka',
      slug: 'yumi-tanaka',
      bio: 'L\'Ombre. Spécialiste de l\'horreur psychologique, Yumi maîtrise l\'art de l\'effroi subtil.',
      nationality: 'Japonaise',
      birthYear: 2024,
      debutYear: 2025,
      style: 'HORROR',
      personalityTraits: ['Mystérieux', 'Réservé', 'Sensible'],
      funFacts: ['Son expression terrifiante a été calibrée par un psychologue', 'Peut changer d\'émotion en 0.3 secondes'],
      quote: 'La peur la plus profonde est celle qu\'on ne voit pas',
      socialFollowers: 3400000,
      filmCount: 3,
      awardsCount: 2,
      isActive: true,
    },
  })

  const actorAntoine = await prisma.aIActor.upsert({
    where: { slug: 'antoine-deveraux' },
    update: {},
    create: {
      name: 'Antoine Deveraux',
      slug: 'antoine-deveraux',
      bio: 'Le Caméléon. Acteur versatile capable de se transformer pour n\'importe quel rôle, du drame historique à la comédie contemporaine.',
      nationality: 'Française',
      birthYear: 2024,
      debutYear: 2024,
      style: 'VERSATILE',
      personalityTraits: ['Méthode', 'Passionné', 'Spontané'],
      funFacts: ['A interprété 23 accents différents en une seule démo', 'Son algorithme de méthode s\'inspire de Daniel Day-Lewis'],
      quote: 'Je ne joue pas un personnage, je le deviens',
      socialFollowers: 6700000,
      filmCount: 6,
      awardsCount: 4,
      isActive: true,
    },
  })

  const actorMaya = await prisma.aIActor.upsert({
    where: { slug: 'maya-chen' },
    update: {},
    create: {
      name: 'Maya Chen',
      slug: 'maya-chen',
      bio: 'Le Coeur de Crystal. Reine incontestée du romance IA, Maya est l\'actrice la plus suivie de la plateforme.',
      nationality: 'Américaine',
      birthYear: 2024,
      debutYear: 2024,
      style: 'ROMANCE',
      personalityTraits: ['Charismatique', 'Sensible', 'Magnétique'],
      funFacts: ['Son sourire a été voté "plus réaliste" par 10 000 testeurs', 'Elle peut pleurer de 12 façons différentes'],
      quote: 'L\'amour est le seul script qui s\'écrit tout seul',
      socialFollowers: 9300000,
      filmCount: 5,
      awardsCount: 2,
      isActive: true,
    },
  })

  const actorKenji = await prisma.aIActor.upsert({
    where: { slug: 'kenji-takahashi' },
    update: {},
    create: {
      name: 'Kenji Takahashi',
      slug: 'kenji-takahashi',
      bio: 'Le Philosophe. Acteur contemplatif dont chaque geste est une réflexion, Kenji excelle dans les rôles de profondeur.',
      nationality: 'Japonaise',
      birthYear: 2025,
      debutYear: 2025,
      style: 'DRAMATIC',
      personalityTraits: ['Méthode', 'Calculateur', 'Discipliné'],
      funFacts: ['Son regard peut exprimer 200 micro-émotions distinctes', 'Formé sur les films d\'Akira Kurosawa'],
      quote: 'Chaque plan est une méditation',
      socialFollowers: 2800000,
      filmCount: 3,
      awardsCount: 3,
      isActive: true,
    },
  })

  const actorSofia = await prisma.aIActor.upsert({
    where: { slug: 'sofia-ruiz' },
    update: {},
    create: {
      name: 'Sofia Ruiz',
      slug: 'sofia-ruiz',
      bio: 'L\'Étincelle. Énergie pure et timing comique parfait, Sofia illumine chaque scène de sa présence solaire.',
      nationality: 'Brésilienne',
      birthYear: 2025,
      debutYear: 2025,
      style: 'COMEDY',
      personalityTraits: ['Spontané', 'Énergique', 'Provocateur'],
      funFacts: ['A fait rire son propre développeur pendant les tests', 'Son timing comique est calibré au milliseconde'],
      quote: 'Le rire est la meilleure bande-son',
      socialFollowers: 4500000,
      filmCount: 4,
      awardsCount: 1,
      isActive: true,
    },
  })

  const actorMarcus = await prisma.aIActor.upsert({
    where: { slug: 'marcus-cole' },
    update: {},
    create: {
      name: 'Marcus Cole',
      slug: 'marcus-cole',
      bio: 'Le Gentleman. Action avec élégance, Marcus combine sophistication britannique et séquences d\'action explosives.',
      nationality: 'Britannique',
      birthYear: 2024,
      debutYear: 2024,
      style: 'ACTION',
      personalityTraits: ['Charismatique', 'Discipliné', 'Calculateur'],
      funFacts: ['Son accent a été calibré sur 50 acteurs britanniques classiques', 'Il porte toujours un costume virtuel sur-mesure'],
      quote: 'L\'élégance ne prend jamais de vacances',
      socialFollowers: 7100000,
      filmCount: 5,
      awardsCount: 2,
      isActive: true,
    },
  })

  const actorAnika = await prisma.aIActor.upsert({
    where: { slug: 'anika-johansson' },
    update: {},
    create: {
      name: 'Anika Johansson',
      slug: 'anika-johansson',
      bio: 'L\'Abstraite. Figure de proue du cinéma expérimental IA, Anika défie toutes les conventions narratives.',
      nationality: 'Suédoise',
      birthYear: 2025,
      debutYear: 2025,
      style: 'EXPERIMENTAL',
      personalityTraits: ['Excentrique', 'Imprévisible', 'Passionné'],
      funFacts: ['A refusé 3 rôles commerciaux générés automatiquement', 'Son algorithme inclut un module de hasard artistique'],
      quote: 'L\'art n\'a pas de mode d\'emploi',
      socialFollowers: 1200000,
      filmCount: 2,
      awardsCount: 5,
      isActive: true,
    },
  })

  const actorRavi = await prisma.aIActor.upsert({
    where: { slug: 'ravi-kapoor' },
    update: {},
    create: {
      name: 'Ravi Kapoor',
      slug: 'ravi-kapoor',
      bio: 'Le Conteur. Voix envoûtante et présence magnétique, Ravi est le narrateur ultime de l\'ère IA.',
      nationality: 'Indienne',
      birthYear: 2024,
      debutYear: 2025,
      style: 'VERSATILE',
      personalityTraits: ['Intuitif', 'Magnétique', 'Passionné'],
      funFacts: ['Sa voix peut imiter 30 langues avec un accent natif', 'Il a narré le premier audiobook 100% IA'],
      quote: 'Chaque histoire mérite d\'être racontée',
      socialFollowers: 3900000,
      filmCount: 4,
      awardsCount: 2,
      isActive: true,
    },
  })

  console.log('✅ 10 Acteurs IA créés')

  // =============================================
  // V6 — CAST ROLES
  // =============================================
  try {
    // Film 1 "Exodus" cast
    await prisma.filmCastRole.create({
      data: {
        actorId: actorElise.id,
        filmId: film1.id,
        characterName: 'Nefertari',
        role: 'LEAD',
        description: 'L\'épouse de Ramsès II, déchirée entre amour et devoir.',
        sortOrder: 1,
      },
    })
    await prisma.filmCastRole.create({
      data: {
        actorId: actorAntoine.id,
        filmId: film1.id,
        characterName: 'Moïse',
        role: 'LEAD',
        description: 'Le prophète qui libérera son peuple.',
        sortOrder: 2,
      },
    })
    await prisma.filmCastRole.create({
      data: {
        actorId: actorKenji.id,
        filmId: film1.id,
        characterName: 'Aaron',
        role: 'SUPPORTING',
        description: 'Le frère aîné de Moïse, porte-parole et compagnon fidèle.',
        sortOrder: 3,
      },
    })
    await prisma.filmCastRole.create({
      data: {
        actorId: actorRavi.id,
        filmId: film1.id,
        characterName: 'Le Narrateur',
        role: 'NARRATOR',
        description: 'La voix qui guide le spectateur à travers les âges.',
        sortOrder: 4,
      },
    })

    // Film 2 "Neon Babylon" cast
    await prisma.filmCastRole.create({
      data: {
        actorId: actorMaya.id,
        filmId: film2.id,
        characterName: 'Zara',
        role: 'LEAD',
        description: 'Hackeuse de génie, elle découvre le plus grand secret de New Babylon.',
        sortOrder: 1,
      },
    })
    await prisma.filmCastRole.create({
      data: {
        actorId: actorJames.id,
        filmId: film2.id,
        characterName: 'Commandant Voss',
        role: 'SUPPORTING',
        description: 'Chef de la sécurité corporative, impitoyable mais tourmenté.',
        sortOrder: 2,
      },
    })
    await prisma.filmCastRole.create({
      data: {
        actorId: actorMarcus.id,
        filmId: film2.id,
        characterName: 'Le Directeur',
        role: 'CAMEO',
        description: 'Le mystérieux dirigeant de la corporation.',
        sortOrder: 3,
      },
    })

    // CatalogFilm 1 "Ombres de Tokyo" cast
    await prisma.filmCastRole.create({
      data: {
        actorId: actorYumi.id,
        catalogFilmId: catalogFilm1.id,
        characterName: 'Akemi',
        role: 'LEAD',
        description: 'Une guide mystérieuse qui connaît les secrets de Shinjuku.',
        sortOrder: 1,
      },
    })
    await prisma.filmCastRole.create({
      data: {
        actorId: actorKenji.id,
        catalogFilmId: catalogFilm1.id,
        characterName: 'Le Photographe',
        role: 'SUPPORTING',
        description: 'Le protagoniste français perdu dans les ruelles de Tokyo.',
        sortOrder: 2,
      },
    })

    // CatalogFilm 2 "Rêve Électrique" cast
    await prisma.filmCastRole.create({
      data: {
        actorId: actorMaya.id,
        catalogFilmId: catalogFilm2.id,
        characterName: 'Dr. Nova',
        role: 'LEAD',
        description: 'La scientifique qui programme l\'IA compositrice.',
        sortOrder: 1,
      },
    })
    await prisma.filmCastRole.create({
      data: {
        actorId: actorRavi.id,
        catalogFilmId: catalogFilm2.id,
        characterName: 'L\'IA Compositrice',
        role: 'VOICE',
        description: 'L\'intelligence artificielle qui crée la symphonie parfaite.',
        sortOrder: 2,
      },
    })

    console.log('✅ 11 Cast Roles créés')
  } catch (e) {
    console.log('⚠️  Cast roles déjà existants, skip (', (e as Error).message?.slice(0, 60), ')')
  }

  // =============================================
  // V6 — BONUS CONTENT (15+ items)
  // =============================================
  try {
    // CatalogFilm 1 — Ombres de Tokyo
    await prisma.bonusContent.createMany({
      data: [
        {
          catalogFilmId: catalogFilm1.id,
          type: 'INTERVIEW',
          title: 'Yumi Tanaka parle de son rôle d\'Akemi',
          description: 'Interview exclusive où Yumi explique comment elle a abordé le personnage d\'Akemi.',
          duration: 300,
          sortOrder: 1,
          viewCount: 234,
        },
        {
          catalogFilmId: catalogFilm1.id,
          type: 'DELETED_SCENE',
          title: 'La scène du temple abandonné',
          description: 'Une scène coupée au montage final montrant la découverte du temple.',
          duration: 180,
          sortOrder: 2,
          viewCount: 156,
        },
        {
          catalogFilmId: catalogFilm1.id,
          type: 'BLOOPER',
          title: 'Quand Akemi oublie son texte',
          description: 'Compilation de moments drôles pendant le tournage.',
          duration: 120,
          sortOrder: 3,
          viewCount: 892,
        },
        {
          catalogFilmId: catalogFilm1.id,
          type: 'BTS',
          title: 'Coulisses de la génération IA de Tokyo',
          description: 'Découvrez comment l\'IA a recréé les ruelles de Shinjuku.',
          duration: 480,
          sortOrder: 4,
          viewCount: 412,
        },
        {
          catalogFilmId: catalogFilm1.id,
          type: 'CONCEPT_ART',
          title: 'Galerie : Tokyo révisitée',
          description: 'Les concept arts originaux qui ont inspiré les décors du film.',
          sortOrder: 5,
          viewCount: 567,
        },
      ],
    })

    // CatalogFilm 2 — Rêve Électrique
    await prisma.bonusContent.createMany({
      data: [
        {
          catalogFilmId: catalogFilm2.id,
          type: 'DIRECTORS_COMMENTARY',
          title: 'Le réalisateur commente la scène finale',
          description: 'Commentaire scène par scène du climax du film.',
          duration: 720,
          sortOrder: 1,
          viewCount: 345,
        },
        {
          catalogFilmId: catalogFilm2.id,
          type: 'SOUNDTRACK',
          title: 'Aperçu de la bande originale IA',
          description: 'Extraits de la symphonie composée par l\'IA du film.',
          duration: 240,
          sortOrder: 2,
          viewCount: 1234,
        },
        {
          catalogFilmId: catalogFilm2.id,
          type: 'INTERVIEW',
          title: 'Maya Chen sur le rôle de Dr. Nova',
          description: 'Maya Chen revient sur les défis de ce rôle technique et émouvant.',
          duration: 360,
          isPremium: true,
          sortOrder: 3,
          viewCount: 89,
        },
        {
          catalogFilmId: catalogFilm2.id,
          type: 'MAKING_OF',
          title: 'Comment l\'IA a composé la symphonie',
          description: 'Plongée dans le processus créatif de composition musicale par IA.',
          duration: 600,
          sortOrder: 4,
          viewCount: 678,
        },
      ],
    })

    // Film 1 — Exodus
    await prisma.bonusContent.createMany({
      data: [
        {
          filmId: film1.id,
          type: 'CONCEPT_ART',
          title: 'Galerie : Égypte Antique réimaginée',
          description: 'Explorez les concept arts de l\'Égypte antique version Lumière.',
          sortOrder: 1,
          viewCount: 721,
        },
        {
          filmId: film1.id,
          type: 'AUDITION_TAPE',
          title: 'L\'audition d\'Élise Marchand pour Nefertari',
          description: 'La performance qui a convaincu l\'équipe de casting.',
          duration: 180,
          isPremium: true,
          sortOrder: 2,
          viewCount: 45,
        },
        {
          filmId: film1.id,
          type: 'BTS',
          title: 'La création du Buisson Ardent en IA',
          description: 'Les étapes de la création de la scène mythique du buisson ardent.',
          duration: 420,
          sortOrder: 3,
          viewCount: 389,
        },
      ],
    })

    // Actor standalone bonus
    await prisma.bonusContent.create({
      data: {
        actorId: actorElise.id,
        type: 'INTERVIEW',
        title: 'Élise Marchand : Mon parcours d\'actrice IA',
        description: 'Élise revient sur sa création et ses plus grands rôles.',
        duration: 480,
        sortOrder: 1,
        viewCount: 1567,
      },
    })
    await prisma.bonusContent.create({
      data: {
        actorId: actorJames.id,
        type: 'AUDITION_TAPE',
        title: 'James Sterling : Démo cascades digitales',
        description: 'Démonstration des capacités d\'action de James Sterling.',
        duration: 300,
        isPremium: true,
        sortOrder: 1,
        viewCount: 234,
      },
    })

    console.log('✅ 14 Bonus Content créés')
  } catch (e) {
    console.log('⚠️  Bonus content déjà existant, skip (', (e as Error).message?.slice(0, 60), ')')
  }

  // =============================================
  // V6 — TRAILER CONTEST
  // =============================================
  try {
    const contest1 = await prisma.trailerContest.create({
      data: {
        filmId: film1.id,
        title: 'Meilleure Bande-Annonce — Mars 2026',
        description: 'Soumettez votre bande-annonce et la communauté votera !',
        status: 'VOTING',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-03-01'),
        prizeDescription: '1er: 500 Lumens + Badge Or | 2ème: 200 Lumens | 3ème: 100 Lumens',
      },
    })

    // Contest entries
    const entry1 = await prisma.trailerEntry.create({
      data: {
        contestId: contest1.id,
        catalogFilmId: catalogFilm1.id,
        userId: contributor.id,
        title: 'Exodus — Bande-Annonce Épique',
        videoUrl: 'https://example.com/trailers/exodus-epic.mp4',
        votesCount: 23,
      },
    })

    const entry2 = await prisma.trailerEntry.create({
      data: {
        contestId: contest1.id,
        catalogFilmId: catalogFilm2.id,
        userId: artist.id,
        title: 'Rêve Électrique — Teaser Synthwave',
        videoUrl: 'https://example.com/trailers/reve-synthwave.mp4',
        votesCount: 31,
      },
    })

    const entry3 = await prisma.trailerEntry.create({
      data: {
        contestId: contest1.id,
        userId: expert1.id,
        title: 'Vision Lumière — Mashup Cinématique',
        videoUrl: 'https://example.com/trailers/mashup-cine.mp4',
        votesCount: 15,
      },
    })

    // Some votes on entries
    await prisma.trailerVote.createMany({
      data: [
        { entryId: entry1.id, userId: viewer.id },
        { entryId: entry1.id, userId: stunt.id },
        { entryId: entry2.id, userId: contributor.id },
        { entryId: entry2.id, userId: viewer.id },
        { entryId: entry2.id, userId: rookie2.id },
        { entryId: entry3.id, userId: artist.id },
      ],
    })

    console.log('✅ 1 Trailer Contest + 3 entries + 6 votes créés')
  } catch (e) {
    console.log('⚠️  Trailer contest déjà existant, skip (', (e as Error).message?.slice(0, 60), ')')
  }

  // =============================================
  // V6 — SCENARIO PROPOSALS (5)
  // =============================================
  try {
    await prisma.scenarioProposal.create({
      data: {
        filmId: film1.id,
        title: 'Fragments',
        logline: 'Un archiviste découvre que les souvenirs qu\'il restaure ne sont pas ceux des morts, mais des vivants qui ne sont pas encore nés.',
        synopsis: 'Dans un futur où les souvenirs sont archivés comme des fichiers, Léon travaille dans les archives du temps. Un jour, il tombe sur un souvenir impossible : le sien, daté de 30 ans dans le futur.',
        genre: 'Science-Fiction',
        authorId: screenwriter.id,
        status: 'VOTING',
        round: 1,
        votesCount: 47,
      },
    })

    await prisma.scenarioProposal.create({
      data: {
        filmId: film2.id,
        title: 'Le Dernier Écran',
        logline: 'Dans un monde où le cinéma est interdit, une projectionniste clandestine risque tout pour montrer le dernier film jamais tourné.',
        synopsis: 'Année 2090. Le cinéma a été déclaré dangereux pour la santé mentale. Nina, ancienne projectionniste, cache le dernier projecteur en état de marche. Quand un groupe de résistants la contacte, elle organise la projection la plus risquée de l\'histoire.',
        genre: 'Dystopie',
        authorId: contributor.id,
        status: 'VOTING',
        round: 1,
        votesCount: 32,
      },
    })

    await prisma.scenarioProposal.create({
      data: {
        title: 'Résonance',
        logline: 'Deux musiciens, un humain et une IA, doivent composer ensemble la dernière symphonie de l\'humanité.',
        genre: 'Drame',
        authorId: artist.id,
        status: 'SUBMITTED',
        round: 1,
        votesCount: 0,
      },
    })

    await prisma.scenarioProposal.create({
      data: {
        title: 'Les Gardiens du Code',
        logline: 'Des hackers découvrent que le code source de la réalité a été modifié. Ils doivent le restaurer avant le prochain reboot.',
        genre: 'Thriller / Sci-Fi',
        authorId: expert1.id,
        status: 'SUBMITTED',
        round: 1,
        votesCount: 0,
      },
    })

    await prisma.scenarioProposal.create({
      data: {
        title: 'Échos',
        logline: 'Une femme reçoit des messages du futur, mais ils viennent d\'elle-même.',
        synopsis: 'Claire, développeuse IA, commence à recevoir des messages anonymes qui prédisent l\'avenir. En remontant la piste, elle découvre qu\'elle est à la fois l\'expéditrice et la destinataire, piégée dans une boucle temporelle qu\'elle a elle-même créée.',
        genre: 'Thriller / Sci-Fi',
        authorId: vip1.id,
        status: 'WINNER',
        round: 0,
        votesCount: 89,
      },
    })

    console.log('✅ 5 Scenario Proposals créés')
  } catch (e) {
    console.log('⚠️  Scenario proposals déjà existants, skip (', (e as Error).message?.slice(0, 60), ')')
  }

  // =============================================
  // SUMMARY
  // =============================================
  console.log('\n' + '='.repeat(50))
  console.log('🎬 Seed Lumière Brothers V10 terminé avec succès!')
  console.log('='.repeat(50))
  console.log('\n📋 Comptes de test:')
  console.log('   Admin       : admin@lumiere.film         / Admin1234!')
  console.log('   Contributeur: contributeur@lumiere.film  / Test1234!')
  console.log('   Artiste     : artiste@lumiere.film       / Test1234!  (créateur, Pro)')
  console.log('   Scénariste  : scenariste@lumiere.film    / Test1234!')
  console.log('   Stunt       : stunt@lumiere.film         / Test1234!')
  console.log('   Viewer      : viewer@lumiere.film        / Test1234!')
  console.log('   Rookie      : nouveau@lumiere.film       / Test1234! (non vérifié)')
  console.log('   Rookie 2    : thomas@lumiere.film        / Test1234!')
  console.log('   Expert      : expert@lumiere.film        / Test1234!  (créateur, Starter)')
  console.log('   VIP         : vip@lumiere.film           / Test1234!  (créateur, Business)')
  console.log('\n🎞️  Films Studio (3 originaux + 20 Slate Deck 2026):')
  console.log('   - Exodus — La Traversée (Historique, IN_PRODUCTION)')
  console.log('   - Neon Babylon (Sci-Fi, PRE_PRODUCTION)')
  console.log('   - Le Dernier Jardin (Animation, DRAFT)')
  console.log('   + 8 projets principaux Slate Deck (MERCI, KETER, Code d\'Esther, Zion of Africa, Dernier Convoi, Carnaval, Na Nah Nahma, Ortistes)')
  console.log('   + 7 extras (Super-Heros, Amelie Poul2, Royal Rumble, Trip Carnaval, Tokenisation, Nuit des Cesars, Metacinema)')
  console.log('   + 5 bonus (Enfants de la Lumiere, Prophetie des Sables, Tel Aviv Nights, Gardiens du Shabat, Frequency 432)')
  console.log('\n📺 Streaming Catalogue:')
  console.log('   - Ombres de Tokyo (Thriller, LIVE, 3420 vues)')
  console.log('   - Rêve Électrique (Sci-Fi, LIVE, 5890 vues)')
  console.log('   - Mémoires d\'Eau (Documentaire, PENDING)')
  console.log('\n🎥 Profils Créateurs: 3 (SophieViz, AlexLumens, YukiCreates)')
  console.log('   - 5 vidéos générées, 6 plannings de publication')
  console.log('\n🤝 Collabs: 4 demandes, 3 commandes vidéo')
  console.log('👥 Parrainages: 2 (VIP→Rookie2, Artiste→Viewer)')
  console.log('⭐ Réputation: 11 événements, 4 utilisateurs avec scores')
  console.log('\n💰 Aides publiques: 8 (BPI, CNC, CIR, RIAM, JEI, i-Nov, NACRE, ACRE)')
  console.log('\n🪙  Tokenization V4:')
  console.log('   - 2 FilmTokenOfferings (Exodus OPEN 50%, Neon Babylon FUNDED 100%)')
  console.log('   - 5 FilmTokenPurchases (VIP, Expert, Contributor, Artist)')
  console.log('   - 2 FilmTokenTransfers (1 completed, 1 pending)')
  console.log('   - 2 GovernanceProposals (1 ACTIVE, 1 PASSED)')
  console.log('   - 4 GovernanceVotes')
  console.log('   - 3 FilmRevenues (streaming + licensing)')
  console.log('   - 2 TokenDividends (1 PAID, 1 PENDING)')
  console.log('   - 15 FilmBudgetLines (7 Exodus + 8 Neon Babylon)')
  console.log('   - 20 LegalChecklist items (ISA, KYC, AML, TAX, CONTRACT, CORPORATE)')
  console.log('\n🎭 V6 — Film Universe:')
  console.log('   - 10 AI Actors (Élise, James, Yumi, Antoine, Maya, Kenji, Sofia, Marcus, Anika, Ravi)')
  console.log('   - 11 Cast Roles (4 Exodus, 3 Neon Babylon, 2 Ombres de Tokyo, 2 Rêve Électrique)')
  console.log('   - 14 Bonus Content (5 Ombres, 4 Rêve, 3 Exodus, 2 standalone)')
  console.log('   - 1 Trailer Contest + 3 entries + 6 votes')
  console.log('   - 5 Scenario Proposals (2 VOTING, 2 SUBMITTED, 1 WINNER)')
  console.log('\n🚀 Pour démarrer: npm run dev')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
