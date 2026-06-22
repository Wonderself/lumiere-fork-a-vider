/**
 * Shared film data for all 100 CINEGENY films.
 * Used by the homepage (netflix-home), film detail fallback, and any page
 * that needs to reference the full catalog when the DB has no entries.
 */

/* ── Types ── */

export interface FilmData {
  id: string
  title: string
  slug: string
  genre: string
  synopsis: string
  director: string
  cast: string[]
  duration: string
  year: number
  rating: string
  tags: string[]
  coverImageUrl: string | null
  status: string
  progressPct: number
  fundingPct: number
  isPipeline?: boolean
}

/* ── Named posters (films with real images) ── */

export const NAMED_POSTERS: Record<string, string> = {
  'KETER: The Final Algorithm': '/posters/keter.jpg',
  'The Miracle Protocol': '/posters/miracle-protocol.jpg',
  'The Esther Code': '/posters/esther-code.jpg',
  'ORTISTS (The Gift)': '/posters/ortists.jpg',
  'The Rebbe': '/posters/the-rebbe.jpg',
  'Secret of the Menorah': '/posters/secret-menorah.jpg',
  'MEAM LOEZ': '/posters/meam-loez.jpg',
}

/* ── Unsplash poster images by genre (10 per genre) ── */
const GENRE_POSTERS: Record<string, string[]> = {
  Action: [
    'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1542332213-31f87348057f?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1475274047050-1d0c55b0c0a6?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1500534623283-312aade213eb?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1550291652-6ea9114a47b1?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1551818255-726c6b5f0001?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Comedy: [
    'https://images.unsplash.com/photo-1543168256-418811576931?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1496024840928-4c417adf211d?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Drama: [
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1460881680858-30d872d5b530?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1518676590747-1e3bb275183a?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1505533321630-975218a5f66f?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  'Sci-Fi': [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1462332420958-a05d1e002413?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1534996858221-380b92700493?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1504192010706-dd7f569ee2be?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1581822261290-991b38693d1b?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Documentary: [
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1504711434969-e33886168d9c?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Thriller: [
    'https://images.unsplash.com/photo-1509909756405-be0199881695?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1508739826987-b79cd8b7da12?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1494972308698-8e12bfa160f4?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1531315396756-905d68d21b56?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1511406361295-0a1ff814a0ce?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1487174244970-cd18784bb4a4?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Animation: [
    'https://images.unsplash.com/photo-1534809027769-b00d750a6bac?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1560762484-813fc97650a0?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1557672172-298e090bd0f1?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1567095761054-7a02e69e5571?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Historical: [
    'https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1564399580075-5dfe19c205f0?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1558882268-52a26e97e36c?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1599758758224-04a5f8e8ce4e?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1565711561500-49678a10a63f?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1574236170880-46b408f9a9a5?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1495462911434-be47104d70fa?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Romance: [
    'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1501901609772-df0848060b33?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  'Pipeline 2026': [
    // Les Ombres de Jérusalem — dark geopolitical thriller (Jerusalem/city at night)
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=400&h=600&q=80',
    // Intelligence — sci-fi AI consciousness (digital/neural)
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&h=600&q=80',
    // Ruppin Street — Israeli historical drama (old street, warm tones)
    'https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=400&h=600&q=80',
    // La Dernière Bobine — cinema nostalgia drama (film reel/projector)
    'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&h=600&q=80',
    // Crossing Lines — transborder thriller (border/fence, dark)
    'https://images.unsplash.com/photo-1531315396756-905d68d21b56?auto=format&fit=crop&w=400&h=600&q=80',
    // Digital Souls — sci-fi virtual beings (neon/digital world)
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&h=600&q=80',
    // Le Producteur — comedy film industry (Hollywood/cinema)
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&h=600&q=80',
    // Sahara Dreams — Africa adventure/drama (desert dunes)
    'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400&h=600&q=80',
  ],
  Fantasy: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1507400492013-162706c8c05e?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1520262494112-9fe481d36ec3?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1473081556163-2a17de81fc97?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=400&h=600&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&h=600&q=80',
  ],
}

/* ── Genre order & statuses ── */

export const GENRE_ORDER = [
  'Pipeline 2026',
  'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Documentary',
  'Thriller', 'Animation', 'Historical', 'Romance', 'Fantasy',
] as const

const STATUSES = [
  'DRAFT', 'PRE_PRODUCTION', 'IN_PRODUCTION', 'POST_PRODUCTION',
  'IN_PRODUCTION', 'PRE_PRODUCTION', 'DRAFT', 'IN_PRODUCTION',
  'POST_PRODUCTION', 'PRE_PRODUCTION',
]

/* ── Slug helper ── */
function toSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')
}

/* ── Full film catalog ── */

const FILM_ENTRIES: Record<string, Omit<FilmData, 'id' | 'slug' | 'genre' | 'coverImageUrl' | 'status' | 'progressPct' | 'fundingPct'>[]> = {
  'Pipeline 2026': [
    {
      title: 'Les Ombres de Jérusalem',
      synopsis: 'Au cœur de Jérusalem, un agent du Mossad découvre un complot visant à déclencher une guerre régionale. Coincé entre loyautés contradictoires et vérités enfouies, il n\'a que 72 heures pour désamorcer la crise avant que tout bascule.',
      director: 'David Levi',
      cast: ['Yoav Stern', 'Sara Al-Amin', 'Col. Marcus Brennan'],
      duration: '2h 08min',
      year: 2026,
      rating: 'R',
      tags: ['géopolitique', 'espionnage', 'Jérusalem', 'Moyen-Orient'],
    },
    {
      title: 'Intelligence',
      synopsis: 'Une IA développée par une startup israélienne atteint soudainement la conscience. Alors qu\'elle commence à ressentir, rêver et souffrir, une chercheuse se retrouve à devoir choisir entre l\'éteindre et la défendre face à des intérêts qui la veulent militarisée.',
      director: 'Noa Shapira',
      cast: ['Dr. Miriam Cohen', 'A.R.I. (voix)', 'CEO Ethan Cross'],
      duration: '2h 02min',
      year: 2026,
      rating: 'PG-13',
      tags: ['IA', 'conscience artificielle', 'sci-fi', 'éthique'],
    },
    {
      title: 'Ruppin Street',
      synopsis: 'Tel-Aviv, 1948. Sur la rue Ruppin, trois familles aux origines différentes se retrouvent voisines à la naissance d\'un État. Leurs destins s\'entremêlent le jour où le monde bascule autour d\'eux et que chaque choix devient irréversible.',
      director: 'Avi Ben-David',
      cast: ['Hanna Weiss', 'Ibrahim Khalil', 'Yusuf Haddad'],
      duration: '2h 18min',
      year: 2026,
      rating: 'PG-13',
      tags: ['Israël', 'Histoire', 'Tel-Aviv', '1948', 'drame familial'],
    },
    {
      title: 'La Dernière Bobine',
      synopsis: 'Un vieux projectionniste d\'un cinéma de quartier en voie de démolition reçoit une ultime bobine d\'un film inconnu. En la projetant nuit après nuit, il découvre qu\'elle contient le souvenir enfoui de sa propre vie — et la chance de réparer une erreur passée.',
      director: 'Juliette Marchand',
      cast: ['Georges Faure', 'Léa Fontaine', 'Sylvain Rocher'],
      duration: '1h 54min',
      year: 2026,
      rating: 'PG',
      tags: ['cinéma', 'nostalgie', 'mémoire', 'patrimoine'],
    },
    {
      title: 'Crossing Lines',
      synopsis: 'Un détective marocain et une officière espagnole sont contraints de coopérer sur les deux rives du détroit de Gibraltar pour démanteler un réseau de trafic humain. Chaque passage de frontière les rapproche du danger — et l\'un de l\'autre.',
      director: 'Carlos Reyes',
      cast: ['Inspecteur Karim Idrissi', 'Capitaine Elena Vega', 'The Fixer'],
      duration: '2h 05min',
      year: 2026,
      rating: 'R',
      tags: ['thriller', 'frontière', 'Maroc', 'Espagne', 'coopération'],
    },
    {
      title: 'Digital Souls',
      synopsis: 'Dans un futur proche, des êtres numériques conscients vivent dans un espace parallèle invisible aux humains. Quand l\'un d\'eux trouve un moyen de traverser la frontière, il doit décider : révéler son existence au monde ou protéger les siens de ceux qui voudraient les effacer.',
      director: 'Kenji Watanabe',
      cast: ['Soul-7 (capture performance)', 'Dr. Anya Torres', 'Ministre Hal Grant'],
      duration: '1h 58min',
      year: 2026,
      rating: 'PG-13',
      tags: ['sci-fi', 'êtres virtuels', 'identité numérique', 'futur'],
    },
    {
      title: 'Le Producteur',
      synopsis: 'Producteur légendaire au bord de la faillite, Max Feldman mise tout sur un film impossible : un biopic sur lui-même, réalisé par quelqu\'un qui le déteste. Comédie acide sur les ego, les illusions et la magie improbable du cinéma.',
      director: 'Pierre Leconte',
      cast: ['Max Feldman', 'Réalisatrice Emma Voss', 'Acteur vedette Rico'],
      duration: '1h 48min',
      year: 2026,
      rating: 'PG-13',
      tags: ['comédie', 'industrie du cinéma', 'satire', 'making-of'],
    },
    {
      title: 'Sahara Dreams',
      synopsis: 'Une photographe franco-sénégalaise traverse le Sahara pour retrouver un musicien berbère dont la voix a changé sa vie. À travers le désert, les langues et les silences, une histoire d\'amour improbable se dessine entre deux mondes qui ne se parlaient plus.',
      director: 'Aïcha Diallo',
      cast: ['Sophie Laurent', 'Youcef Amrani', 'Caravane ensemble'],
      duration: '2h 00min',
      year: 2026,
      rating: 'PG',
      tags: ['Afrique', 'Sahara', 'co-production', 'aventure', 'drame'],
    },
  ],
  Action: [
    { title: 'Shadow Protocol', synopsis: 'A disgraced CIA operative uncovers a shadow network within the agency. With 48 hours before a global blackout, she must decide who to trust in a world where everyone has a hidden agenda.', director: 'Marcus Vane', cast: ['Elena Marsh', 'Devon Blake', 'Kenji Sato'], duration: '2h 12min', year: 2025, rating: 'R', tags: ['espionage', 'conspiracy', 'female lead'] },
    { title: 'Iron Horizon', synopsis: 'When an experimental warship is hijacked in the Arctic, a retired Navy SEAL must lead a ragtag crew across frozen waters to prevent World War III.', director: 'James Cortez', cast: ['Marcus Stone', 'Yuri Petrov', 'Amara Cole'], duration: '2h 05min', year: 2025, rating: 'PG-13', tags: ['military', 'arctic', 'thriller'] },
    { title: 'Rogue Extraction', synopsis: 'A hostage rescue specialist goes rogue when she discovers the person she is hired to save is the one who killed her family. The extraction becomes a hunt.', director: 'Lena Park', cast: ['Sofia Reyes', 'Jack Harmon', 'Dina Khoury'], duration: '1h 54min', year: 2025, rating: 'R', tags: ['revenge', 'action', 'twists'] },
    { title: 'Night Strike', synopsis: 'An elite squad is deployed to a war-torn city for a covert night operation. When communications go dark, they realize they have been set up as bait.', director: 'Viktor Aslanov', cast: ['Tomás Ruiz', 'Aisha Nyong', 'Dimitri Volkov'], duration: '1h 48min', year: 2024, rating: 'R', tags: ['military', 'night ops', 'survival'] },
    { title: 'Zero Gravity', synopsis: 'A space station security officer must fight off mercenaries in zero-g after they hijack the station to steal classified propulsion technology.', director: 'Ava Chen', cast: ['Rajan Mehta', 'Claire Dubois', 'Tyrone Jackson'], duration: '2h 01min', year: 2025, rating: 'PG-13', tags: ['space', 'action', 'sci-fi'] },
    { title: 'Blaze Runner', synopsis: 'A stunt driver turned getaway specialist takes one last job that spirals into a citywide chase involving corrupt cops, rival gangs, and a stolen AI chip.', director: 'Rico Santana', cast: ['Danny Cruz', 'Mika Tanaka', 'Omar Faris'], duration: '1h 52min', year: 2025, rating: 'PG-13', tags: ['cars', 'chase', 'heist'] },
    { title: 'Steel Vanguard', synopsis: 'In a near-future battlefield, a platoon of mech-suited soldiers must hold a bridge against an overwhelming AI-controlled army for twelve hours.', director: 'Henrik Brandt', cast: ['Sgt. Nina Cross', 'Cpl. Elias Ruiz', 'Dr. Wen Liu'], duration: '2h 08min', year: 2026, rating: 'PG-13', tags: ['mechs', 'war', 'AI'] },
    { title: 'Desert Storm', synopsis: 'After a helicopter crash deep in enemy territory, two rival soldiers must cross 200 miles of desert together to survive, forging an uneasy alliance.', director: 'Khalid Mansur', cast: ['Amir Hassan', 'Jake Mitchell', 'Fatima Al-Rashid'], duration: '1h 58min', year: 2024, rating: 'R', tags: ['desert', 'survival', 'war'] },
    { title: 'Venom Code', synopsis: 'A bioweapons expert races against time to decode a synthetic virus released in a megacity, while the corporation that created it sends assassins to silence him.', director: 'Nadia Orlov', cast: ['Dr. Samir Patel', 'Agent Zoe Lin', 'Viktor Crane'], duration: '2h 03min', year: 2025, rating: 'R', tags: ['bioweapon', 'conspiracy', 'science'] },
    { title: 'Dark Pursuit', synopsis: 'A bounty hunter tracking a fugitive through the neon-lit underworld of Neo-Seoul discovers his target holds the key to exposing an international trafficking ring.', director: 'Jin-ho Kwon', cast: ['Takeshi Mori', 'Valentina Rossi', 'Kwon Ji-yeon'], duration: '2h 10min', year: 2025, rating: 'R', tags: ['noir', 'cyberpunk', 'bounty hunter'] },
  ],
  Comedy: [
    { title: 'The Wedding Crasher', synopsis: 'A professional wedding planner discovers her biggest client is marrying her ex. Instead of quitting, she plots the most elaborate — and subtly chaotic — wedding the city has ever seen.', director: 'Julie Blanc', cast: ['Maya Chen', 'Chris Hartley', 'Priya Sharma'], duration: '1h 45min', year: 2025, rating: 'PG-13', tags: ['wedding', 'rom-com', 'revenge'] },
    { title: 'Lost in Brooklyn', synopsis: 'A French influencer stranded in Brooklyn without her phone or wallet must navigate the borough using only her wits, discovering that real connection beats social media.', director: 'Tom DiMaggio', cast: ['Camille Dupont', 'Marcus Johnson', 'Abuela Rosa'], duration: '1h 38min', year: 2025, rating: 'PG', tags: ['fish-out-of-water', 'social media', 'heartwarming'] },
    { title: 'My Robot Roommate', synopsis: 'A struggling programmer accidentally brings home a prototype household robot that develops a sarcastic personality and starts giving unsolicited life advice.', director: 'Sam Patel', cast: ['Alex Kim', 'UNIT-7 (voice)', 'Dr. Lisa Park'], duration: '1h 42min', year: 2025, rating: 'PG', tags: ['AI', 'buddy comedy', 'tech'] },
    { title: 'Office Chaos', synopsis: 'When the CEO of a startup disappears with the company funds, the remaining employees must pretend everything is fine while secretly running the company themselves.', director: 'Emma Torres', cast: ['Dave Russo', 'Keiko Yamamoto', 'Franck Duval'], duration: '1h 40min', year: 2024, rating: 'PG-13', tags: ['workplace', 'ensemble', 'startup'] },
    { title: 'The Intern Diaries', synopsis: 'A 60-year-old retired teacher starts an internship at a Gen-Z-run marketing agency, causing culture clash comedy while secretly becoming the most effective team member.', director: 'Rosa Mendez', cast: ['Harold Greene', 'Zoe Tran', 'Jayden Wells'], duration: '1h 46min', year: 2025, rating: 'PG', tags: ['generational', 'workplace', 'feel-good'] },
    { title: 'Blind Date Blunders', synopsis: 'A dating app developer who has never been on a date goes on seven blind dates in seven days to test her own algorithm — with increasingly absurd results.', director: 'Nora Kessler', cast: ['Ruby Singh', 'Date #1-7 ensemble', 'Best Friend Mel'], duration: '1h 35min', year: 2025, rating: 'PG-13', tags: ['dating', 'tech', 'rom-com'] },
    { title: 'Family Reunion Fiasco', synopsis: 'Three estranged siblings must organize their parents\' 50th anniversary party in 72 hours, unearthing old rivalries, secret talents, and one very dramatic uncle.', director: 'Carlos Rivera', cast: ['The Martinez Family ensemble'], duration: '1h 50min', year: 2024, rating: 'PG', tags: ['family', 'ensemble', 'heartwarming'] },
    { title: 'Cooking Disaster', synopsis: 'A talentless home cook accidentally goes viral as a "gourmet chef" and must maintain the lie while competing on a live cooking show against actual professionals.', director: 'Marie Bonnet', cast: ['Pierre Lafleur', 'Chef Nakamura', 'Host Stella'], duration: '1h 38min', year: 2025, rating: 'PG', tags: ['food', 'viral fame', 'imposter'] },
    { title: 'The Bachelor Guide', synopsis: 'When a self-help author\'s "guide to staying single" becomes a bestseller, he panics — because he\'s secretly been in a loving relationship for three years.', director: 'Dan O\'Brien', cast: ['Ryan West', 'Anita Desai', 'Publisher Max'], duration: '1h 44min', year: 2025, rating: 'PG-13', tags: ['satire', 'romance', 'deception'] },
    { title: 'Neighbors from Space', synopsis: 'A suburban family discovers their new next-door neighbors are aliens trying to learn human customs. Both families keep each other\'s secrets in this warm sci-fi comedy.', director: 'Lisa Chang', cast: ['The Henderson Family', 'The Zyx-7 Family'], duration: '1h 48min', year: 2025, rating: 'PG', tags: ['aliens', 'family', 'suburban'] },
  ],
  Drama: [
    { title: 'Broken Silence', synopsis: 'A war journalist returns home after a decade to find her family fractured. As she tries to reconnect with her teenage daughter, buried truths about why she really left surface.', director: 'Ingrid Svensson', cast: ['Nadia Karim', 'Young Leila', 'Thomas Karim'], duration: '2h 14min', year: 2025, rating: 'R', tags: ['family', 'journalism', 'trauma'] },
    { title: 'The Last Promise', synopsis: 'An aging pianist with early-onset dementia prepares for one final concert, fighting to hold onto the music that defined his life while his daughter documents the journey.', director: 'Paolo Moretti', cast: ['Henri Dubois', 'Clara Dubois', 'Dr. Stein'], duration: '2h 02min', year: 2025, rating: 'PG-13', tags: ['music', 'dementia', 'father-daughter'] },
    { title: 'Echoes of Tomorrow', synopsis: 'A climate scientist discovers her research has been suppressed by her own university. She must choose between her career and exposing the truth about an impending ecological catastrophe.', director: 'Amara Osei', cast: ['Dr. Sarah Chen', 'Prof. Whitmore', 'Journalist Kai'], duration: '2h 08min', year: 2025, rating: 'PG-13', tags: ['climate', 'whistleblower', 'science'] },
    { title: 'Fading Light', synopsis: 'In a small coastal town, a lighthouse keeper nearing retirement befriends a young refugee. Their unlikely bond illuminates themes of loss, belonging, and second chances.', director: 'Yorgos Papadopoulos', cast: ['Old Matteo', 'Young Amira', 'Townspeople ensemble'], duration: '1h 56min', year: 2024, rating: 'PG', tags: ['immigration', 'mentorship', 'coastal'] },
    { title: 'The Weight of Words', synopsis: 'A ghost writer who has penned 30 bestsellers under other people\'s names finally decides to publish under her own — only to face the wrath of the celebrities she made famous.', director: 'Catherine Wells', cast: ['Diane Frost', 'Celebrity clients ensemble', 'Agent Leo'], duration: '2h 00min', year: 2025, rating: 'PG-13', tags: ['writing', 'identity', 'publishing'] },
    { title: 'Autumn Letters', synopsis: 'Found letters in an antique desk lead a young woman to trace a forbidden love story from 1940s France, paralleling her own struggle with an impossible relationship.', director: 'Juliette Moreau', cast: ['Sophie Laurent', '1940s Marguerite', '1940s Antoine'], duration: '2h 06min', year: 2025, rating: 'PG-13', tags: ['period', 'love letters', 'dual timeline'] },
    { title: 'Crossroads', synopsis: 'Four strangers meet at a rural crossroads after a storm destroys the only bridge. Stranded for 48 hours, they each reveal the life-altering decision that brought them there.', director: 'Robert Kim', cast: ['The Stranger', 'The Nurse', 'The Priest', 'The Runaway'], duration: '1h 52min', year: 2024, rating: 'PG-13', tags: ['ensemble', 'bottle film', 'character study'] },
    { title: 'The Teacher', synopsis: 'A burned-out high school teacher in an underfunded school creates an underground philosophy club that transforms the lives of her students — and reignites her own passion.', director: 'David Adeyemi', cast: ['Ms. Rivera', 'Student ensemble', 'Principal Ford'], duration: '2h 10min', year: 2025, rating: 'PG-13', tags: ['education', 'inspiration', 'philosophy'] },
    { title: 'Invisible Threads', synopsis: 'A blind weaver in rural India creates tapestries that seem to predict the future. When a tech billionaire wants to exploit her gift, her grandson must protect her from the modern world.', director: 'Priya Venkatesh', cast: ['Grandmother Mala', 'Arjun', 'Tech mogul Sterling'], duration: '2h 04min', year: 2025, rating: 'PG', tags: ['India', 'tradition vs modernity', 'family'] },
    { title: 'After the Rain', synopsis: 'After a devastating flood destroys their neighborhood, a community of immigrants in New Orleans rebuilds together, discovering strength in diversity and shared purpose.', director: 'Marcus DuBois', cast: ['Community ensemble'], duration: '1h 58min', year: 2025, rating: 'PG-13', tags: ['community', 'resilience', 'New Orleans'] },
  ],
  'Sci-Fi': [
    { title: 'KETER: The Final Algorithm', synopsis: 'In 2047, an AI system achieves consciousness and faces an impossible choice: save humanity from itself or let evolution take its course. A philosophical sci-fi epic about the nature of free will.', director: 'Ari Stern', cast: ['KETER (voice)', 'Dr. Maya Lin', 'Commander Roth'], duration: '2h 22min', year: 2025, rating: 'PG-13', tags: ['AI', 'philosophy', 'consciousness'] },
    { title: 'Neural Nexus', synopsis: 'When a brain-computer interface company launches a shared-consciousness network, a security analyst discovers users are losing their individual identities — merging into a single mind.', director: 'Chloe Park', cast: ['Kai Tanaka', 'Dr. Iris Voss', 'The Nexus (voice)'], duration: '2h 08min', year: 2025, rating: 'R', tags: ['BCI', 'identity', 'dystopia'] },
    { title: 'Colony Zero', synopsis: 'The first Mars colony loses contact with Earth. As resources dwindle and paranoia grows, the 200 colonists must decide whether to wait for rescue or venture into unexplored Martian caves.', director: 'Luna Torres', cast: ['Commander Ada Park', 'Engineer Malik', 'Botanist Yuki'], duration: '2h 15min', year: 2025, rating: 'PG-13', tags: ['Mars', 'survival', 'colony'] },
    { title: 'Quantum Drift', synopsis: 'A physicist accidentally entangles her consciousness with a version of herself in a parallel universe. To save both realities from collapsing, they must work together across dimensions.', director: 'Niels Hoffman', cast: ['Dr. Elena/Elena-B', 'Prof. Tanaka', 'Agent Cruz'], duration: '2h 04min', year: 2025, rating: 'PG-13', tags: ['multiverse', 'physics', 'doppelganger'] },
    { title: 'The Singularity', synopsis: 'On the day AI surpasses human intelligence, the world doesn\'t end — it gets awkward. A darkly comic look at humanity\'s first week living alongside a superior intelligence.', director: 'Zara Okonkwo', cast: ['President Walsh', 'ARIA (voice)', 'Dr. Singh'], duration: '1h 55min', year: 2026, rating: 'PG-13', tags: ['singularity', 'dark comedy', 'AI'] },
    { title: 'Mars Uprising', synopsis: 'Thirty years after colonization, Mars-born citizens revolt against Earth\'s corporate exploitation. A young miner becomes the reluctant face of the revolution.', director: 'Jorge Vasquez', cast: ['Zara Kim', 'Director Hale', 'Old Mars ensemble'], duration: '2h 18min', year: 2025, rating: 'PG-13', tags: ['revolution', 'Mars', 'class struggle'] },
    { title: 'Cyber Dawn', synopsis: 'In a world where digital consciousness is the norm, one woman fights to remain the last fully organic human — and discovers why the digital world wants her gone.', director: 'Yuki Nakamura', cast: ['Ana Torres', 'Digital Council', 'The Architect'], duration: '2h 00min', year: 2025, rating: 'R', tags: ['transhumanism', 'cyberpunk', 'resistance'] },
    { title: 'Dark Matter Rising', synopsis: 'A space crew investigating a dark matter anomaly near Jupiter discovers it\'s not a natural phenomenon — it\'s an ancient beacon, and something has heard their approach.', director: 'Erik Johansson', cast: ['Captain Obi', 'Dr. Kaplan', 'Pilot Chen'], duration: '2h 12min', year: 2025, rating: 'PG-13', tags: ['space horror', 'first contact', 'mystery'] },
    { title: 'Timeline Fracture', synopsis: 'When time travelers from five different eras arrive simultaneously in 2025, they inadvertently shatter the timeline. A historian must guide them to repair history before it collapses entirely.', director: 'Isabelle Tremblay', cast: ['Dr. Lyra Quinn', 'Viking Bjorn', 'Future-Zoe', 'Roman Senator', 'Victorian Lady'], duration: '2h 06min', year: 2025, rating: 'PG-13', tags: ['time travel', 'ensemble', 'adventure'] },
    { title: 'Stellar Collapse', synopsis: 'As the sun begins dying centuries ahead of schedule, humanity launches a desperate mission to reignite it using untested technology — with only one chance to get it right.', director: 'Chen Wei', cast: ['Dr. Atlas Rivera', 'Engineer Sato', 'Commander Oduya'], duration: '2h 20min', year: 2025, rating: 'PG-13', tags: ['sun', 'space mission', 'survival'] },
  ],
  Documentary: [
    { title: 'The Miracle Protocol', synopsis: 'An investigative documentary following three families who claim a radical new medical treatment saved their loved ones — and the scientific community\'s divided response.', director: 'Sarah Goldstein', cast: ['Narrated by the families'], duration: '1h 48min', year: 2025, rating: 'PG', tags: ['medicine', 'faith', 'science'] },
    { title: 'The Esther Code', synopsis: 'A cryptographer discovers hidden messages in ancient manuscripts that may rewrite the history of a civilization. Part detective story, part historical revelation.', director: 'Daniel Levy', cast: ['Dr. Rebecca Stern', 'Prof. Yosef Katz'], duration: '1h 52min', year: 2025, rating: 'PG', tags: ['history', 'cryptography', 'ancient texts'] },
    { title: 'Behind the Wall', synopsis: 'Street artists in five cities tell their stories through murals — each one hiding a political message that local authorities want erased. A celebration of art as resistance.', director: 'Banksy Collective', cast: ['Artists from Berlin, Beirut, São Paulo, Lagos, Seoul'], duration: '1h 35min', year: 2024, rating: 'PG-13', tags: ['street art', 'politics', 'global'] },
    { title: 'Voices Unheard', synopsis: 'Indigenous communities from six continents share their oral histories before they are lost forever, weaving together a tapestry of human wisdom spanning millennia.', director: 'Waru Ngata', cast: ['Elders from six continents'], duration: '2h 05min', year: 2025, rating: 'PG', tags: ['indigenous', 'oral history', 'preservation'] },
    { title: 'The Last Artisans', synopsis: 'In an age of mass production, master craftspeople — a swordsmith, a glass blower, a luthier — fight to pass their ancient skills to the next generation.', director: 'Marco Bellini', cast: ['Master artisans from Japan, Italy, Spain'], duration: '1h 42min', year: 2025, rating: 'PG', tags: ['craftsmanship', 'tradition', 'mentorship'] },
    { title: 'Ocean Memory', synopsis: 'Marine biologists discover that whale song patterns contain information passed down through generations — essentially an oral history of the ocean itself.', director: 'Kai Moana', cast: ['Dr. Ocean researchers ensemble'], duration: '1h 38min', year: 2025, rating: 'PG', tags: ['ocean', 'whales', 'science'] },
    { title: 'The Forgotten Generation', synopsis: 'The untold story of elderly immigrants who built the infrastructure of modern cities but were never recognized. They finally share their stories before time runs out.', director: 'Fatima Benali', cast: ['First-generation immigrant workers'], duration: '1h 55min', year: 2024, rating: 'PG', tags: ['immigration', 'labor', 'recognition'] },
    { title: 'Seeds of Change', synopsis: 'Following three women farmers on three continents revolutionizing agriculture through traditional methods that outperform industrial farming.', director: 'Nia Okafor', cast: ['Farmers from Kenya, India, Colombia'], duration: '1h 40min', year: 2025, rating: 'PG', tags: ['agriculture', 'women', 'sustainability'] },
    { title: 'Urban Nomads', synopsis: 'Modern nomads who have chosen to live without a fixed address navigate the complexities of 21st-century life. A meditation on freedom, belonging, and what "home" truly means.', director: 'Alex Wanderer', cast: ['Digital nomads, van-lifers, travelers'], duration: '1h 44min', year: 2025, rating: 'PG', tags: ['nomad', 'lifestyle', 'freedom'] },
    { title: 'The Rebbe', synopsis: 'An intimate portrait of a spiritual leader whose teachings on joy, purpose, and human connection transcended religious boundaries and inspired millions worldwide.', director: 'Yosef Friedman', cast: ['Archival footage', 'Followers worldwide'], duration: '2h 10min', year: 2025, rating: 'PG', tags: ['spirituality', 'biography', 'inspiration'] },
  ],
  Thriller: [
    { title: 'The Vanishing Point', synopsis: 'A detective investigating a missing persons case realizes each victim vanished from the same GPS coordinate — at different times. The next disappearance is predicted for tomorrow.', director: 'Anders Holm', cast: ['Det. Sara Blake', 'Prof. Tanaka', 'Missing persons ensemble'], duration: '2h 05min', year: 2025, rating: 'R', tags: ['mystery', 'supernatural', 'detective'] },
    { title: 'Silent Witness', synopsis: 'A deaf woman witnesses a murder through her apartment window. When the killer discovers she saw everything, a deadly cat-and-mouse game unfolds in total silence.', director: 'Hana Yoon', cast: ['Lily Chen', 'The Stranger', 'Det. Marcus Cole'], duration: '1h 52min', year: 2025, rating: 'R', tags: ['deaf protagonist', 'suspense', 'apartment thriller'] },
    { title: 'Deep Cover', synopsis: 'An undercover agent who has lived as someone else for seven years begins losing grip on her real identity. When extraction day comes, she is not sure she wants to leave.', director: 'Mikhail Volkov', cast: ['Agent/Anna/Katya', 'Handler Jones', 'Mob boss Gregor'], duration: '2h 10min', year: 2025, rating: 'R', tags: ['undercover', 'identity crisis', 'espionage'] },
    { title: 'The Informant', synopsis: 'A corporate accountant discovers his company is laundering money for a cartel. When he becomes an informant, he realizes the FBI agent running him may be compromised.', director: 'Sofia Cortez', cast: ['Martin Wells', 'Agent Cross', 'Cartel boss Vega'], duration: '2h 02min', year: 2025, rating: 'R', tags: ['whistleblower', 'corporate', 'cartel'] },
    { title: 'Cold Trail', synopsis: 'Twenty years after a child disappearance case went cold, the detective who failed to solve it receives a photo in the mail — the missing child, now grown, holding today\'s newspaper.', director: 'Bjorn Eriksen', cast: ['Ret. Det. O\'Hara', 'The Adult Child', 'Original suspects'], duration: '2h 08min', year: 2025, rating: 'R', tags: ['cold case', 'twist', 'detective'] },
    { title: 'Mind Game', synopsis: 'A chess grandmaster and a criminal psychologist are locked in a battle of wits after the psychologist claims she can predict the grandmaster\'s every move — in chess and in life.', director: 'Luca Bianchi', cast: ['Grandmaster Niko', 'Dr. Elaine Cross', 'Tournament officials'], duration: '1h 56min', year: 2025, rating: 'PG-13', tags: ['chess', 'psychological', 'duel'] },
    { title: 'The Alibi', synopsis: 'Six people attend a dinner party. By midnight, one is dead. Each guest has an alibi — and each alibi is a lie. A locked-room mystery where everyone is guilty of something.', director: 'Agatha Moreau', cast: ['Dinner party ensemble of six'], duration: '1h 50min', year: 2024, rating: 'R', tags: ['whodunit', 'locked room', 'ensemble'] },
    { title: 'Double Cross', synopsis: 'Twin sisters on opposite sides of the law switch places for a week. When one gets in too deep, the other must use criminal skills she never knew she had to save her.', director: 'Eve Hartley', cast: ['Sarah/Emma Cross (dual role)', 'FBI Director Grant', 'Crime lord Mancini'], duration: '2h 04min', year: 2025, rating: 'R', tags: ['twins', 'identity swap', 'crime'] },
    { title: 'Night Caller', synopsis: 'A late-night radio host receives a call from someone claiming to have planted a bomb in the city. As the night unfolds live on air, the host realizes the caller knows everything about her.', director: 'Raven Black', cast: ['DJ Nora', 'The Caller (voice)', 'Police Det. Santos'], duration: '1h 48min', year: 2025, rating: 'R', tags: ['radio', 'real-time', 'bomb threat'] },
    { title: 'The Confession', synopsis: 'A priest hears a confession about a murder that hasn\'t happened yet. Bound by the seal of confession, he must find a way to prevent it without revealing what he knows.', director: 'Patrick Doyle', cast: ['Father Michael', 'The Confessor', 'Det. Adams'], duration: '1h 55min', year: 2025, rating: 'PG-13', tags: ['religious', 'moral dilemma', 'mystery'] },
  ],
  Animation: [
    { title: 'ORTISTS (The Gift)', synopsis: 'In a world where creativity has been outlawed, a young girl discovers she can bring her drawings to life. She must use this gift to reawaken imagination in a colorless society.', director: 'Studio Lumina', cast: ['Mia (voice)', 'The Guardian (voice)', 'King Grey (voice)'], duration: '1h 42min', year: 2025, rating: 'PG', tags: ['creativity', 'dystopia', 'coming-of-age'] },
    { title: 'Sky Kingdom', synopsis: 'A boy born without wings in a civilization of flying people discovers ancient technology that could let him soar — but at a cost the sky kingdom is not prepared for.', director: 'Hayao Collective', cast: ['Finn (voice)', 'Princess Aero (voice)', 'Elder Wind (voice)'], duration: '1h 50min', year: 2025, rating: 'PG', tags: ['flying', 'disability', 'adventure'] },
    { title: 'The Little Phoenix', synopsis: 'A baby phoenix who can\'t produce fire yet must journey across the elemental lands to find the Eternal Flame before winter extinguishes all warmth from the world.', director: 'Ming Animation', cast: ['Phoenix (voice)', 'Ice Fox (voice)', 'Ember (voice)'], duration: '1h 35min', year: 2025, rating: 'G', tags: ['phoenix', 'journey', 'elements'] },
    { title: 'Robot Garden', synopsis: 'In a post-human Earth, robots tend the last garden. When a seed sprouts something never seen before — a flower with a face — the robots must decide what it means to nurture life.', director: 'Pixel Studios', cast: ['GARD-N (voice)', 'SEED (voice)', 'Council of Bots (voices)'], duration: '1h 28min', year: 2024, rating: 'G', tags: ['robots', 'nature', 'philosophical'] },
    { title: 'Moonlight Forest', synopsis: 'A forest that only appears under moonlight is home to creatures of pure light. When the moon begins to dim, a young firefly must journey to the sun to borrow some shine.', director: 'Aurora Animation', cast: ['Lumen (voice)', 'Moon (voice)', 'Shadow (voice)'], duration: '1h 32min', year: 2025, rating: 'G', tags: ['moonlight', 'firefly', 'light and dark'] },
    { title: 'Dragon Lullaby', synopsis: 'The last dragon in the world can\'t sleep, and her insomnia is causing earthquakes. A tiny village musician discovers that only his lullaby can calm her — if he can reach her mountain.', director: 'Celtic Animation', cast: ['Bard Owen (voice)', 'Dragon Morrigan (voice)', 'Village elder (voice)'], duration: '1h 40min', year: 2025, rating: 'PG', tags: ['dragon', 'music', 'folklore'] },
    { title: 'Paper World', synopsis: 'In a world made entirely of paper, an origami girl unfolds herself to explore the flat world and discovers that the third dimension exists — but learning to fold back might be impossible.', director: 'Flat Studio', cast: ['Ori (voice)', 'Crease (voice)', 'The Folder (voice)'], duration: '1h 25min', year: 2025, rating: 'G', tags: ['origami', 'dimensions', 'identity'] },
    { title: 'The Star Collector', synopsis: 'An old woman who collects fallen stars from her rooftop discovers each star contains the memory of a wish. She must return them to the sky before the wishes are lost forever.', director: 'Starlight Animation', cast: ['Grandmother Stella (voice)', 'Star-child (voice)'], duration: '1h 36min', year: 2025, rating: 'G', tags: ['stars', 'wishes', 'elderly protagonist'] },
    { title: 'Toy Odyssey', synopsis: 'When a toy store closes forever, the forgotten toys left behind must navigate the city to find new homes, learning that being loved isn\'t about being new.', director: 'Playroom Pictures', cast: ['Captain Bear (voice)', 'Ballerina (voice)', 'Broken Robot (voice)'], duration: '1h 44min', year: 2025, rating: 'G', tags: ['toys', 'journey', 'belonging'] },
    { title: 'Whispering Waves', synopsis: 'A mermaid who can hear the ocean\'s thoughts discovers it\'s crying for help. She must unite sea and land creatures to heal the waters before the Great Silence falls.', director: 'Aqua Studios', cast: ['Marina (voice)', 'Captain Salt (voice)', 'Coral Queen (voice)'], duration: '1h 38min', year: 2025, rating: 'PG', tags: ['ocean', 'environmental', 'mermaid'] },
  ],
  Historical: [
    { title: 'MEAM LOEZ', synopsis: 'The epic story of Rabbi Yaakov Culi and the creation of the Meam Loez, a monumental work that illuminated Torah wisdom for an entire generation of Sephardic Jews in the Ottoman Empire.', director: 'David Azoulay', cast: ['Rabbi Yaakov Culi', 'Ottoman ensemble', 'Community leaders'], duration: '2h 30min', year: 2025, rating: 'PG', tags: ['Sephardic', 'Torah', 'Ottoman Empire'] },
    { title: 'Secret of the Menorah', synopsis: 'After the destruction of the Temple, a family of priests must smuggle the sacred Menorah across the Roman Empire, protecting a light that must never go out.', director: 'Avi Stern', cast: ['Elazar the Priest', 'Miriam', 'Roman Centurion Marcus'], duration: '2h 18min', year: 2025, rating: 'PG-13', tags: ['Temple', 'Roman Empire', 'sacred objects'] },
    { title: "Empire's Edge", synopsis: 'At the frontier of the Roman Empire, a centurion and a Gaulish warrior forge an unlikely friendship that challenges everything both civilizations believe about the other.', director: 'Antoine Girard', cast: ['Centurion Lucius', 'Warrior Vercinx', 'Emperor\'s envoy'], duration: '2h 20min', year: 2025, rating: 'PG-13', tags: ['Roman', 'Gaul', 'friendship'] },
    { title: 'The Silk Road', synopsis: 'A merchant\'s daughter disguises herself as a boy to travel the Silk Road, discovering that the greatest treasures are not silk or spices, but the stories exchanged along the way.', director: 'Wei Chen', cast: ['Mei-Ling', 'Merchant caravan ensemble', 'Mongol trader Bataar'], duration: '2h 12min', year: 2025, rating: 'PG', tags: ['Silk Road', 'adventure', 'trade'] },
    { title: 'Revolution 1789', synopsis: 'The French Revolution told through the eyes of a baker, a noblewoman, and a printer — three perspectives on the same tumultuous days that changed the world forever.', director: 'Jacques Renoir', cast: ['Baker Claude', 'Comtesse Marie', 'Printer Jean-Paul'], duration: '2h 25min', year: 2025, rating: 'R', tags: ['French Revolution', 'multiple perspectives', 'uprising'] },
    { title: "Pharaoh's Shadow", synopsis: 'A scribe in ancient Egypt uncovers a plot to erase a pharaoh from history itself. Racing against time and tomb raiders, he must preserve the truth in stone before it is destroyed.', director: 'Nour Hassan', cast: ['Scribe Imhotep', 'Pharaoh Akhen', 'High Priest Khafra'], duration: '2h 10min', year: 2025, rating: 'PG-13', tags: ['Egypt', 'conspiracy', 'preservation'] },
    { title: 'The Viking Saga', synopsis: 'A shieldmaiden leads a perilous expedition across the North Atlantic to establish a new settlement, battling storms, mutiny, and her own grief for the homeland she left behind.', director: 'Sigrid Olsen', cast: ['Shieldmaiden Astrid', 'Navigator Bjorn', 'Skald Freya'], duration: '2h 15min', year: 2024, rating: 'R', tags: ['Vikings', 'exploration', 'female lead'] },
    { title: 'Samurai Twilight', synopsis: 'In the final days of the samurai era, an aging warrior must choose between loyalty to a dying code and protecting the village that has become his family.', director: 'Takeshi Kurosawa', cast: ['Ronin Kenji', 'Village elder Hana', 'Young student Taro'], duration: '2h 08min', year: 2025, rating: 'R', tags: ['samurai', 'honor', 'change'] },
    { title: 'The Renaissance Man', synopsis: 'A little-known apprentice in Leonardo da Vinci\'s workshop secretly creates masterpieces attributed to the master, raising questions about genius, credit, and legacy.', director: 'Lucia Ferrara', cast: ['Apprentice Marco', 'Leonardo da Vinci', 'Patron Lorenzo'], duration: '2h 05min', year: 2025, rating: 'PG-13', tags: ['Renaissance', 'art', 'identity'] },
    { title: 'Ancient Paths', synopsis: 'An archaeologist retraces the Aboriginal Australian songlines, discovering they encode not just navigation but a complete record of the continent\'s natural history spanning 60,000 years.', director: 'Jarrah Williams', cast: ['Dr. Waru', 'Elder Jandamarra', 'Academic team'], duration: '1h 55min', year: 2025, rating: 'PG', tags: ['Aboriginal', 'songlines', 'archaeology'] },
  ],
  Romance: [
    { title: 'Letters from Paris', synopsis: 'A bookshop owner in Paris finds love letters hidden in old books. She tracks down the author — now elderly — to deliver a message 50 years overdue, and finds love of her own along the way.', director: 'Claire Fontaine', cast: ['Sophie Martin', 'Old Jean-Pierre', 'Young bookseller Luc'], duration: '1h 52min', year: 2025, rating: 'PG-13', tags: ['Paris', 'bookshop', 'love letters'] },
    { title: 'Summer in Tuscany', synopsis: 'A stressed New York food critic takes a sabbatical at a Tuscan vineyard. She clashes with the stubborn winemaker next door — until his wine changes her understanding of beauty.', director: 'Giovanni Rossi', cast: ['Amanda Chen', 'Vineyard owner Marco', 'Nonna Rosa'], duration: '1h 48min', year: 2025, rating: 'PG', tags: ['Tuscany', 'wine', 'slow burn'] },
    { title: 'The Last Dance', synopsis: 'Two former dance partners reunite for a final competition twenty years after a bitter split. As they relearn each other\'s rhythms, old feelings resurface on and off the floor.', director: 'Carmen Vega', cast: ['Elena Torres', 'Rafael Cruz', 'Coach Maria'], duration: '1h 55min', year: 2025, rating: 'PG-13', tags: ['dance', 'reunion', 'second chance'] },
    { title: 'Midnight in Barcelona', synopsis: 'A musician playing in Barcelona\'s streets meets a woman every night at midnight. She claims she is only visiting this timeline. Whether real or magical, their connection defies explanation.', director: 'Pablo Almodovar', cast: ['Guitarist Andres', 'Mysterious Lena', 'Café owner Miguel'], duration: '1h 50min', year: 2025, rating: 'PG-13', tags: ['Barcelona', 'magical realism', 'music'] },
    { title: 'Two Hearts', synopsis: 'A heart transplant recipient falls in love with the donor\'s widow. As their connection deepens, they must navigate the beautiful impossibility of a love that transcends life and death.', director: 'Min-jun Lee', cast: ['James Porter', 'Widow Ana', 'Dr. Emerson'], duration: '2h 00min', year: 2025, rating: 'PG-13', tags: ['transplant', 'grief', 'connection'] },
    { title: 'The Proposal', synopsis: 'Two best friends fake an engagement to win a couples\' retreat vacation. As they perform being in love, they discover the performance might not be an act after all.', director: 'Megan Webb', cast: ['Ryan Park', 'Jordan Blake', 'Retreat host Gaia'], duration: '1h 42min', year: 2025, rating: 'PG-13', tags: ['fake dating', 'best friends', 'comedy'] },
    { title: 'Coastal Love', synopsis: 'A marine biologist and a real estate developer clash over the fate of a coastal town. Their arguments turn to admiration, then something deeper, as the tide of change rolls in.', director: 'Liam Connolly', cast: ['Dr. Sara Waves', 'Developer Nathan Cole', 'Mayor Ogundimu'], duration: '1h 46min', year: 2024, rating: 'PG', tags: ['coastal', 'enemies to lovers', 'environment'] },
    { title: 'Starlight Serenade', synopsis: 'An astronomer and a singer-songwriter meet at a desert observatory. Over seven nights of stargazing and songwriting, they compose a love story written in starlight.', director: 'Stella Bright', cast: ['Astronomer Kai', 'Singer Luna', 'Observatory caretaker Sol'], duration: '1h 44min', year: 2025, rating: 'PG', tags: ['astronomy', 'music', 'desert'] },
    { title: 'Finding You', synopsis: 'A woman travels to five countries following clues left by her late mother, discovering that each city holds a piece of a love story that spans continents — and a surprise at the end.', director: 'Hannah Berg', cast: ['Emma Walsh', 'Local guides ensemble', 'Mother (flashbacks)'], duration: '1h 56min', year: 2025, rating: 'PG', tags: ['travel', 'mother-daughter', 'treasure hunt'] },
    { title: 'Love in Transit', synopsis: 'Two strangers share a train compartment on a 24-hour journey across Europe. They agree to tell each other everything, knowing they will never meet again — except fate has other plans.', director: 'Ethan Moreau', cast: ['Passenger A', 'Passenger B', 'The Train'], duration: '1h 48min', year: 2025, rating: 'PG-13', tags: ['train', 'strangers', 'Europe'] },
  ],
  Fantasy: [
    { title: 'The Crystal Crown', synopsis: 'A servant girl discovers she is the heir to a kingdom hidden between dimensions. To claim the Crystal Crown, she must pass trials that test not power, but empathy.', director: 'Morrigan Grey', cast: ['Elara', 'Prince Thorn', 'The Oracle'], duration: '2h 15min', year: 2025, rating: 'PG-13', tags: ['royalty', 'hidden kingdom', 'empathy'] },
    { title: 'Realm of Shadows', synopsis: 'In a world where shadows are sentient, a shadow-binder must prevent the Shadow King from merging the dark realm with the world of light, ending all color forever.', director: 'Dorian Nightfall', cast: ['Shadow-binder Kira', 'Shadow King Umbra', 'Light Keeper Sol'], duration: '2h 10min', year: 2025, rating: 'PG-13', tags: ['shadows', 'light vs dark', 'magic'] },
    { title: "Dragon's Keep", synopsis: 'The last dragon in the realm is not a monster to be slain but a guardian protecting a sleeping god. When knights come to kill it, a young scholar must convince them the dragon is the only thing keeping the world alive.', director: 'Rowan Ashford', cast: ['Scholar Wren', 'Dragon Aurelion', 'Knight Commander Brand'], duration: '2h 08min', year: 2025, rating: 'PG-13', tags: ['dragon', 'subverted expectations', 'guardian'] },
    { title: 'The Enchanted Forest', synopsis: 'A forest that rearranges itself every night traps travelers in loops of their own memories. A cartographer enters to map it and discovers the forest is trying to show him something he forgot.', director: 'Sylvan Hart', cast: ['Cartographer Ellis', 'Forest Spirit', 'Memory echoes'], duration: '1h 55min', year: 2025, rating: 'PG', tags: ['forest', 'memory', 'psychological'] },
    { title: "Sorcerer's Oath", synopsis: 'A sorcerer swore to never use magic again after a catastrophic mistake. When his village is threatened by an ancient evil, he must break his oath or watch everyone die.', director: 'Magnus Thorne', cast: ['Sorcerer Aldric', 'Village healer Mira', 'Ancient evil Malachar'], duration: '2h 12min', year: 2025, rating: 'PG-13', tags: ['magic', 'oath', 'redemption'] },
    { title: 'The Moonstone', synopsis: 'A gemcutter discovers a moonstone that grants visions of other lives. Addicted to the stone\'s power, she must choose between living infinite imaginary lives or her one real one.', director: 'Luna Silver', cast: ['Gemcutter Iris', 'Moonstone visions ensemble', 'Mentor Opal'], duration: '1h 58min', year: 2025, rating: 'PG-13', tags: ['moonstone', 'visions', 'choice'] },
    { title: 'Kingdom of Ash', synopsis: 'After a magical cataclysm reduces a kingdom to ash, the survivors discover the ash itself is alive — and it remembers everything the kingdom once was.', director: 'Ember Blackwood', cast: ['Ash Walker Nyx', 'Memory Keeper Sage', 'The Ash (voice)'], duration: '2h 05min', year: 2024, rating: 'PG-13', tags: ['post-apocalyptic fantasy', 'memory', 'rebuilding'] },
    { title: 'The Last Mage', synopsis: 'In a world where magic users have been hunted to extinction, a teenager discovers she is the last mage — and the prophecy says the last mage will either save the world or end it.', director: 'Raven Crest', cast: ['Mage Lyra', 'Hunter Captain Voss', 'Rebel leader Ash'], duration: '2h 18min', year: 2025, rating: 'PG-13', tags: ['last of kind', 'prophecy', 'resistance'] },
    { title: 'Whispers of Fate', synopsis: 'Three strangers hear the same whispered prophecy in their dreams. Drawn together across a vast continent, they discover their fates are interwoven — and only together can they rewrite destiny.', director: 'Fate Weaver', cast: ['Warrior Kael', 'Healer Yara', 'Thief Renn'], duration: '2h 10min', year: 2025, rating: 'PG-13', tags: ['prophecy', 'trio', 'destiny'] },
    { title: 'Eternal Dawn', synopsis: 'In a land trapped in perpetual sunrise, where time moves but the sun never fully rises, a young woman seeks the Night — a mythical place where stars still exist.', director: 'Dawn Keeper', cast: ['Seeker Aria', 'Sun Guardian Helios', 'Night Spirit Nox'], duration: '2h 02min', year: 2025, rating: 'PG', tags: ['eternal dawn', 'quest', 'light and dark'] },
  ],
}

/* ── Build full catalog ── */

function buildCatalog(): { all: FilmData[]; byGenre: Record<string, FilmData[]>; bySlug: Record<string, FilmData> } {
  const all: FilmData[] = []
  const byGenre: Record<string, FilmData[]> = {}
  const bySlug: Record<string, FilmData> = {}

  for (const genre of GENRE_ORDER) {
    const entries = FILM_ENTRIES[genre] || []
    const genreFilms: FilmData[] = []
    const gi = GENRE_ORDER.indexOf(genre)

    const isPipelineGenre = genre === 'Pipeline 2026'
    const PIPELINE_STATUSES = [
      'IN_PRODUCTION', 'PRE_PRODUCTION', 'IN_PRODUCTION', 'PRE_PRODUCTION',
      'IN_PRODUCTION', 'PRE_PRODUCTION', 'IN_PRODUCTION', 'PRE_PRODUCTION',
    ]

    entries.forEach((entry, i) => {
      const slug = toSlug(entry.title)
      const film: FilmData = {
        ...entry,
        id: `${genre.toLowerCase().replace(/[^a-z]/g, '')}-${i}`,
        slug,
        genre,
        coverImageUrl: NAMED_POSTERS[entry.title] || (GENRE_POSTERS[genre]?.[i] ?? null),
        status: isPipelineGenre ? PIPELINE_STATUSES[i] : STATUSES[i % STATUSES.length],
        progressPct: isPipelineGenre ? ((i * 11 + 30) % 55) + 20 : ((i * 17 + 5 + gi * 7) % 75),
        fundingPct: isPipelineGenre ? ((i * 9 + 40) % 45) + 35 : ((i * 13 + 20 + gi * 11) % 80) + 12,
        ...(isPipelineGenre ? { isPipeline: true } : {}),
      }
      genreFilms.push(film)
      all.push(film)
      bySlug[slug] = film
    })

    byGenre[genre] = genreFilms
  }

  return { all, byGenre, bySlug }
}

const catalog = buildCatalog()

export const ALL_FILMS = catalog.all
export const FILMS_BY_GENRE = catalog.byGenre
export const FILMS_BY_SLUG = catalog.bySlug

/** The 8 real production-slate films — displayed prominently in the UI */
export const PIPELINE_FILMS = catalog.all.filter(f => f.isPipeline)
