/**
 * CineGeny Business Tools
 * Email IA, Facturation, Traduction, Banque d'images.
 * 7 specialized agents.
 */

// ─── 7 Business Agents ─────────────────────────────────────────────

export interface BusinessAgent {
  slug: string; name: string; role: string; description: string; icon: string; color: string
}

export const BUSINESS_AGENTS: BusinessAgent[] = [
  { slug: 'cg-email-writer', name: 'Rédacteur Email', role: 'Rédaction emails pro', description: 'Rédige des emails professionnels adaptés au cinéma : pitchs investisseurs, invitations casting, relances distributeurs, communiqués presse.', icon: 'mail', color: '#3B82F6' },
  { slug: 'cg-email-designer', name: 'Designer Email', role: 'Templates & signatures', description: 'Crée des templates email élégants et des signatures HTML professionnelles avec branding CineGeny.', icon: 'palette', color: '#8B5CF6' },
  { slug: 'cg-sequence-planner', name: 'Planificateur Séquences', role: 'Séquences automatiques', description: 'Conçoit des séquences email automatiques : onboarding, relance, nurturing. Optimise les taux d\'ouverture et de clic.', icon: 'git-branch', color: '#10B981' },
  { slug: 'cg-invoice-manager', name: 'Gestionnaire Factures', role: 'Facturation & devis', description: 'Génère devis et factures conformes, calcul TVA automatique, suivi paiements et relances.', icon: 'file-text', color: '#F59E0B' },
  { slug: 'cg-translator', name: 'Traducteur Culturel', role: 'Traduction & adaptation', description: 'Traduit avec finesse culturelle. Détecte les sensibilités (religion, politique, humour local) et adapte le contenu pour chaque marché.', icon: 'languages', color: '#EC4899' },
  { slug: 'cg-subtitle-master', name: 'Maître Sous-Titres', role: 'Sous-titrage & doublage', description: 'Spécialisé en sous-titrage cinéma : timing, contraintes de caractères, registre de langue, lip-sync pour doublage.', icon: 'captions', color: '#06B6D4' },
  { slug: 'cg-image-curator', name: 'Curateur Visuel', role: 'Banque d\'images & moodboards', description: 'Recherche et sélectionne des images pour moodboards, présentations et lookbooks cinéma. Intégration Unsplash.', icon: 'image', color: '#EF4444' },
]

// ─── 15 Email Templates (complets, prêts à envoyer) ────────────────

export interface EmailTemplate {
  id: string; name: string; category: string; subject: string; body: string; variables: string[]
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  { id: 'welcome', name: 'Bienvenue', category: 'onboarding', subject: 'Bienvenue sur CineGeny, {name} ! 🎬', body: `Bonjour {name},\n\nBienvenue dans l'aventure CineGeny !\n\nVous venez de rejoindre la première plateforme de cinéma participatif propulsée par l'IA. Voici vos premiers pas :\n\n1. 🎭 Complétez votre profil créateur\n2. 🎬 Explorez les films en cours de production\n3. 🗳️ Votez pour vos projets favoris\n4. 🤖 Découvrez nos 22 agents IA cinéma\n\nVotre compte est crédité de 2 crédits gratuits pour tester nos outils IA.\n\nÀ très vite sur CineGeny,\nL'équipe CineGeny`, variables: ['name'] },

  { id: 'first-steps', name: 'Premiers Pas (J+2)', category: 'onboarding', subject: '{name}, avez-vous exploré le studio créatif ? 🎨', body: `Bonjour {name},\n\nVoici 3 choses que vous pouvez faire aujourd'hui sur CineGeny :\n\n🎬 Créer votre premier projet de film\nNotre assistant IA vous guide étape par étape.\n\n🤖 Discuter avec un agent IA cinéma\n22 agents spécialisés à votre service.\n\n📸 Générer une affiche de film avec votre visage\nNotre Poster Maker crée des affiches pro en 30 secondes.\n\nBesoin d'aide ? Répondez simplement à cet email.\n\nCréativement,\nL'équipe CineGeny`, variables: ['name'] },

  { id: 'success-story', name: 'Success Story (J+5)', category: 'onboarding', subject: 'Comment {creatorName} a créé son film sur CineGeny 🌟', body: `Bonjour {name},\n\n{creatorName} a utilisé CineGeny pour créer "{filmTitle}" — un {genre} qui a été voté par 847 membres de la communauté.\n\nSon parcours :\n• Scénario rédigé avec l'agent Scénariste IA\n• Storyboard généré par le studio créatif\n• Bande-annonce assemblée automatiquement\n• Financement participatif réussi\n\n"CineGeny m'a permis de réaliser mon rêve de cinéma sans budget Hollywood."\n\nÀ votre tour !\n\nL'équipe CineGeny`, variables: ['name', 'creatorName', 'filmTitle', 'genre'] },

  { id: 'investor-pitch', name: 'Pitch Investisseur', category: 'business', subject: 'CineGeny — Opportunité d\'investissement dans le cinéma IA', body: `Cher(e) {investorName},\n\nJe me permets de vous contacter car {reason}.\n\nCineGeny est la première plateforme de cinéma participatif propulsée par l'IA :\n\n📊 Chiffres clés :\n• {userCount} créateurs inscrits\n• {filmCount} films en production\n• Modèle 0% commission sur les tokens IA\n• Revenue model : abonnements + crédits IA\n\n💡 Notre avantage :\nNous démocratisons la création cinématographique grâce à 71 agents IA spécialisés.\n\nSeriez-vous disponible pour un call de 20 minutes la semaine prochaine ?\n\nCordialement,\n{senderName}\nFondateur, CineGeny`, variables: ['investorName', 'reason', 'userCount', 'filmCount', 'senderName'] },

  { id: 'distributor-outreach', name: 'Proposition Distributeur', category: 'business', subject: 'Catalogue CineGeny — Films originaux pour votre réseau', body: `Bonjour {distributorName},\n\nCineGeny produit des films originaux via sa communauté de créateurs et l'IA.\n\nNotre catalogue actuel comprend {filmCount} films dont {topFilm} qui a reçu {voteCount} votes communautaires.\n\nNous cherchons des partenaires de distribution pour :\n• VOD / SVOD\n• Télévision\n• Festivals\n\nPourrions-nous organiser un visionnage privé ?\n\nCordialement,\n{senderName}`, variables: ['distributorName', 'filmCount', 'topFilm', 'voteCount', 'senderName'] },

  { id: 'casting-invitation', name: 'Invitation Casting', category: 'production', subject: 'Invitation casting — "{filmTitle}" by CineGeny', body: `Bonjour {actorName},\n\nNous préparons le casting de "{filmTitle}", un {genre} produit sur la plateforme CineGeny.\n\nRôle : {roleName}\nDescription : {roleDescription}\n\nLe tournage est prévu {shootingDates}.\n\nSi vous êtes intéressé(e), merci de nous envoyer votre CV et une bande démo.\n\nCordialement,\n{senderName}\nDirection du casting, CineGeny`, variables: ['actorName', 'filmTitle', 'genre', 'roleName', 'roleDescription', 'shootingDates', 'senderName'] },

  { id: 'press-release', name: 'Communiqué Presse', category: 'communication', subject: '[CP] {headline}', body: `COMMUNIQUÉ DE PRESSE\n\n{headline}\n\n{city}, le {date} — {leadParagraph}\n\n{bodyText}\n\nÀ propos de CineGeny :\nCineGeny est la première plateforme de cinéma participatif propulsée par l'IA. La plateforme permet à chacun de créer, financer et distribuer des films grâce à 71 agents IA spécialisés.\n\nContact presse :\n{pressContact}\n{pressEmail}`, variables: ['headline', 'city', 'date', 'leadParagraph', 'bodyText', 'pressContact', 'pressEmail'] },

  { id: 'newsletter-film', name: 'Newsletter Film', category: 'newsletter', subject: '🎬 CineGeny Weekly — {weekHighlight}', body: `📬 CineGeny Weekly\n\n🎬 FILM DE LA SEMAINE\n{featuredFilm} — {featuredDescription}\n\n🏆 TOP VOTES\n{topVotedList}\n\n🤖 AGENT SPOTLIGHT\nCette semaine, découvrez {agentName} : {agentDescription}\n\n📊 EN CHIFFRES\n• {newUsers} nouveaux créateurs\n• {newFilms} nouveaux projets\n• {totalVotes} votes cette semaine\n\n👉 Connectez-vous : cinegeny.com\n\nÀ la semaine prochaine !\nL'équipe CineGeny`, variables: ['weekHighlight', 'featuredFilm', 'featuredDescription', 'topVotedList', 'agentName', 'agentDescription', 'newUsers', 'newFilms', 'totalVotes'] },

  { id: 'premiere-promo', name: 'Promo Première', category: 'event', subject: '🎬 Avant-première "{filmTitle}" — Vous êtes invité(e) !', body: `{name},\n\nVous êtes cordialement invité(e) à l'avant-première de\n\n🎬 "{filmTitle}"\nUn film {genre} produit par la communauté CineGeny\n\n📅 {date}\n📍 {location}\n🕐 {time}\n\nDress code : {dressCode}\n\nRéservez votre place : {rsvpLink}\n\nNous avons hâte de vous y voir !\n\nL'équipe CineGeny`, variables: ['name', 'filmTitle', 'genre', 'date', 'location', 'time', 'dressCode', 'rsvpLink'] },

  { id: 'investor-followup', name: 'Relance Investisseur', category: 'business', subject: 'Suite à notre échange — CineGeny', body: `Cher(e) {investorName},\n\nSuite à notre {lastInteraction}, je souhaitais revenir vers vous.\n\nDepuis notre dernier échange :\n{updates}\n\nNous serions ravis de poursuivre la discussion. Êtes-vous disponible {proposedDate} ?\n\nCordialement,\n{senderName}`, variables: ['investorName', 'lastInteraction', 'updates', 'proposedDate', 'senderName'] },

  { id: 'task-notification', name: 'Notification Tâche', category: 'platform', subject: '⚡ Nouvelle tâche disponible — {taskTitle}', body: `Bonjour {name},\n\nUne nouvelle tâche créative est disponible pour vous :\n\n⚡ {taskTitle}\n🎬 Film : {filmTitle}\n💰 Récompense : {reward}\n⏰ Deadline : {deadline}\n\nAccédez à la tâche : {taskLink}\n\nBonne création !\nCineGeny`, variables: ['name', 'taskTitle', 'filmTitle', 'reward', 'deadline', 'taskLink'] },

  { id: 'vote-result', name: 'Résultat Vote', category: 'platform', subject: '🗳️ Résultats du vote — "{filmTitle}"', body: `Bonjour {name},\n\nLes résultats du vote sont tombés !\n\n🎬 "{filmTitle}"\n✅ Résultat : {result}\n📊 Votes : {voteCount}\n🏆 Score : {score}/10\n\n{resultMessage}\n\nMerci pour votre participation !\nCineGeny`, variables: ['name', 'filmTitle', 'result', 'voteCount', 'score', 'resultMessage'] },

  { id: 'low-balance', name: 'Alerte Solde Bas', category: 'platform', subject: '⚠️ Votre solde de crédits est bas', body: `Bonjour {name},\n\nVotre solde de crédits CineGeny est de {balance} crédits.\n\nPour continuer à utiliser les agents IA et les outils de création, rechargez votre compte.\n\n💰 Rappel : 0% de commission — vous ne payez que le coût réel des tokens IA.\n\nRecharger : {rechargeLink}\n\nCineGeny`, variables: ['name', 'balance', 'rechargeLink'] },

  { id: 'referral-success', name: 'Parrainage Réussi', category: 'platform', subject: '🎉 {referredName} a rejoint CineGeny grâce à vous !', body: `Félicitations {name} !\n\n{referredName} vient de s'inscrire sur CineGeny avec votre code de parrainage.\n\n🎁 Vos récompenses :\n• +5 crédits IA\n• +100 XP\n\nContinuez à inviter vos amis : {referralLink}\n\nMerci d'agrandir la communauté !\nCineGeny`, variables: ['name', 'referredName', 'referralLink'] },

  { id: 'partnership-proposal', name: 'Proposition Partenariat', category: 'business', subject: 'Proposition de partenariat — CineGeny x {partnerCompany}', body: `Cher(e) {partnerName},\n\nCineGeny cherche des partenaires pour {partnershipGoal}.\n\nNotre plateforme réunit :\n• {userCount} créateurs\n• 71 agents IA cinéma\n• Un modèle unique 0% commission\n\nNous pensons qu'une collaboration avec {partnerCompany} pourrait {mutualBenefit}.\n\nSeriez-vous intéressé(e) par un premier échange ?\n\nCordialement,\n{senderName}\nCineGeny`, variables: ['partnerName', 'partnerCompany', 'partnershipGoal', 'userCount', 'mutualBenefit', 'senderName'] },
]

// ─── Email Signatures ───────────────────────────────────────────────

export interface EmailSignature {
  id: string; name: string; style: string; html: string
}

export const EMAIL_SIGNATURES: EmailSignature[] = [
  { id: 'classic', name: 'Classique', style: 'minimal', html: `<div style="font-family:Arial;font-size:13px;color:#333;border-top:2px solid #E50914;padding-top:12px;margin-top:20px"><strong style="color:#1A1A2E">{name}</strong><br/><span style="color:#666">{title} — CineGeny</span><br/><span style="color:#999;font-size:11px">{email} | {phone}</span><br/><a href="https://cinegeny.com" style="color:#E50914;font-size:11px">cinegeny.com</a></div>` },
  { id: 'modern', name: 'Moderne', style: 'bold', html: `<table style="font-family:Arial;font-size:13px"><tr><td style="border-right:3px solid #E50914;padding-right:15px"><strong style="font-size:16px;color:#1A1A2E">{name}</strong><br/><span style="color:#E50914">{title}</span></td><td style="padding-left:15px"><span style="color:#666">CineGeny — Cinéma Participatif IA</span><br/><span style="color:#999;font-size:11px">{email}</span><br/><a href="https://cinegeny.com" style="color:#E50914;font-size:11px">cinegeny.com</a></td></tr></table>` },
  { id: 'minimal', name: 'Minimaliste', style: 'clean', html: `<div style="font-family:Arial;font-size:12px;color:#999;margin-top:20px">— {name} | {title} | CineGeny | <a href="https://cinegeny.com" style="color:#E50914">cinegeny.com</a></div>` },
]

// ─── Onboarding Sequence ────────────────────────────────────────────

export interface SequenceStep { day: number; templateId: string; trigger: string }

export const ONBOARDING_SEQUENCE: SequenceStep[] = [
  { day: 0, templateId: 'welcome', trigger: 'Inscription' },
  { day: 2, templateId: 'first-steps', trigger: 'J+2 automatique' },
  { day: 5, templateId: 'success-story', trigger: 'J+5 automatique' },
]

// ─── Invoice Config ─────────────────────────────────────────────────

export interface InvoiceLineItem { description: string; quantity: number; unitPrice: number; vatRate: number }

export const VAT_RATES = [
  { id: 'fr-standard', label: 'TVA France 20%', rate: 20, country: 'FR' },
  { id: 'fr-reduced', label: 'TVA France 10%', rate: 10, country: 'FR' },
  { id: 'fr-super-reduced', label: 'TVA France 5.5%', rate: 5.5, country: 'FR' },
  { id: 'de-standard', label: 'MwSt Allemagne 19%', rate: 19, country: 'DE' },
  { id: 'uk-standard', label: 'VAT UK 20%', rate: 20, country: 'GB' },
  { id: 'us-none', label: 'USA (pas de TVA fédérale)', rate: 0, country: 'US' },
  { id: 'il-standard', label: 'VAT Israel 17%', rate: 17, country: 'IL' },
]

export const INVOICE_STATUSES = [
  { id: 'draft', label: 'Brouillon', color: '#6B7280' },
  { id: 'sent', label: 'Envoyée', color: '#3B82F6' },
  { id: 'paid', label: 'Payée', color: '#10B981' },
  { id: 'overdue', label: 'En retard', color: '#EF4444' },
  { id: 'cancelled', label: 'Annulée', color: '#9CA3AF' },
]

// ─── Translation Languages ──────────────────────────────────────────

export interface TranslationLanguage {
  code: string; name: string; flag: string; nativeName: string
  sensitivityNotes: string[]  // Cultural sensitivities to watch for
}

export const TRANSLATION_LANGUAGES: TranslationLanguage[] = [
  { code: 'en', name: 'Anglais', flag: '🇬🇧', nativeName: 'English', sensitivityNotes: ['US vs UK spelling', 'Inclusive language expectations vary by market'] },
  { code: 'es', name: 'Espagnol', flag: '🇪🇸', nativeName: 'Español', sensitivityNotes: ['Espagne vs Amérique latine (vocabulaire différent)', 'Tutoiement vs vouvoiement varie par pays'] },
  { code: 'de', name: 'Allemand', flag: '🇩🇪', nativeName: 'Deutsch', sensitivityNotes: ['Sensibilité historique WWII', 'Formalité du Sie/Du importante'] },
  { code: 'it', name: 'Italien', flag: '🇮🇹', nativeName: 'Italiano', sensitivityNotes: ['Références religieuses courantes mais à doser', 'Humour régional très différent'] },
  { code: 'pt', name: 'Portugais', flag: '🇧🇷', nativeName: 'Português', sensitivityNotes: ['Portugal vs Brésil (vocabulaire et culture très différents)', 'Références raciales à adapter avec soin'] },
  { code: 'ar', name: 'Arabe', flag: '🇸🇦', nativeName: 'العربية', sensitivityNotes: ['Sensibilité religieuse élevée', 'Contenu romantique/sexuel à adapter', 'Dialectes très variés (MSA vs dialectaux)', 'Direction droite-à-gauche'] },
  { code: 'ja', name: 'Japonais', flag: '🇯🇵', nativeName: '日本語', sensitivityNotes: ['Niveaux de politesse (keigo) essentiels', 'Références culturelles à localiser, pas traduire', 'Humour très différent'] },
  { code: 'ko', name: 'Coréen', flag: '🇰🇷', nativeName: '한국어', sensitivityNotes: ['Hiérarchie sociale dans le langage', 'Sensibilité Corée du Nord/Japon', 'Niveaux de formalité stricts'] },
  { code: 'zh', name: 'Chinois (Mandarin)', flag: '🇨🇳', nativeName: '中文', sensitivityNotes: ['Censure politique (Taiwan, Tibet, Tiananmen)', 'Simplifié (continent) vs traditionnel (Taiwan/HK)', 'Superstitions numériques (4 = mort)'] },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी', sensitivityNotes: ['Sensibilité religieuse multi-confessionnelle', 'Système de castes à éviter dans les références', 'Partition Inde/Pakistan = sujet délicat'] },
  { code: 'ru', name: 'Russe', flag: '🇷🇺', nativeName: 'Русский', sensitivityNotes: ['Contexte géopolitique actuel sensible', 'Références historiques soviétiques à doser', 'Formalité ты/вы importante'] },
  { code: 'tr', name: 'Turc', flag: '🇹🇷', nativeName: 'Türkçe', sensitivityNotes: ['Sensibilité Arménie/Kurde/Chypre', 'Laïcité vs religion = sujet clivant', 'Honneur et famille = valeurs centrales'] },
]

// ─── Unsplash Config ────────────────────────────────────────────────

export const UNSPLASH_CATEGORIES = [
  { id: 'cinema', label: 'Cinéma', query: 'cinema film movie', icon: '🎬' },
  { id: 'landscape', label: 'Paysages', query: 'landscape nature cinematic', icon: '🏔️' },
  { id: 'urban', label: 'Urbain', query: 'city urban night neon', icon: '🌃' },
  { id: 'portrait', label: 'Portraits', query: 'portrait face dramatic lighting', icon: '👤' },
  { id: 'interior', label: 'Intérieurs', query: 'interior room moody', icon: '🏠' },
  { id: 'texture', label: 'Textures', query: 'texture abstract dark', icon: '🎨' },
  { id: 'mood', label: 'Ambiances', query: 'moody atmospheric fog', icon: '🌫️' },
  { id: 'action', label: 'Action', query: 'action movement speed', icon: '💥' },
]
