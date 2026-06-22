export const PERSONALITY_TRAITS = [
  'Perfectionniste', 'Methode', 'Intuitif', 'Charismatique',
  'Mysterieux', 'Energique', 'Reserve', 'Passionne',
  'Imprevisible', 'Discipline', 'Excentrique', 'Magnetique',
  'Provocateur', 'Sensible', 'Calculateur', 'Spontane',
] as const

export const FUN_FACTS = [
  'A refuse 3 roles avant d\'accepter celui-ci',
  'A ete genere(e) en 847 iterations avant validation',
  'Son regard a ete calibre sur 200 peintures de la Renaissance',
  'Fait toutes ses cascades IA sans doublure',
  'A improvise la replique la plus celebre du film',
  'Son personnage devait mourir dans la premiere version',
  'A appris le japonais en 48h pour un role',
  'Premiere IA a recevoir une nomination aux Cesar virtuels',
  'Son sourire a necessite 12 modeles differents',
  'A ete cree(e) a partir de 50 000 photos de reference',
] as const

export function formatFollowers(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`
  return count.toString()
}

export const NATIONALITY_FLAGS: Record<string, string> = {
  'Francaise': '\u{1F1EB}\u{1F1F7}',
  'Americaine': '\u{1F1FA}\u{1F1F8}',
  'Britannique': '\u{1F1EC}\u{1F1E7}',
  'Japonaise': '\u{1F1EF}\u{1F1F5}',
  'Coreenne': '\u{1F1F0}\u{1F1F7}',
  'Indienne': '\u{1F1EE}\u{1F1F3}',
  'Bresilienne': '\u{1F1E7}\u{1F1F7}',
  'Suedoise': '\u{1F1F8}\u{1F1EA}',
  'Australienne': '\u{1F1E6}\u{1F1FA}',
  'Israelienne': '\u{1F1EE}\u{1F1F1}',
  'Italienne': '\u{1F1EE}\u{1F1F9}',
  'Mexicaine': '\u{1F1F2}\u{1F1FD}',
}

export const NATIONALITIES = Object.keys(NATIONALITY_FLAGS)

export function getNationalityFlag(nationality: string | null | undefined): string {
  if (!nationality) return ''
  // Try direct match
  if (NATIONALITY_FLAGS[nationality]) return NATIONALITY_FLAGS[nationality]
  // Try normalized match (strip accents)
  const normalized = nationality.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  for (const [key, flag] of Object.entries(NATIONALITY_FLAGS)) {
    if (key.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === normalized) {
      return flag
    }
  }
  return ''
}
