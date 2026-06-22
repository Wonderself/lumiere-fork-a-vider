'use client'

import { useState, useCallback, useMemo } from 'react'
import {
  AlertTriangle, CheckCircle, Clock, Search, Filter,
  ExternalLink, ChevronDown, ChevronRight, Landmark, Building2,
  Banknote, FileText, BookOpen, Users, Briefcase, GraduationCap,
  Globe2, Shield, Star, TrendingUp, MapPin, DollarSign, Scale, Film,
} from 'lucide-react'

// ==================== TYPES ====================
type StructureIssue = {
  id: string; cat: string; item: string; desc: string;
  action: string; entity: string; status: string;
}

type SubsidyTask = { t: string; done: boolean }

type Subsidy = {
  id: string; name: string; entity: string; cat: string;
  amount: string; rate: string; timing: string; difficulty: number;
  priority: number; deadline: string; status: string; url: string;
  desc: string; residency: string;
  tasks: SubsidyTask[]; docs: string[];
}

type Institution = {
  id: string; name: string; cat: string; type: string;
  focus: string; stage: string; ticket: string; url: string;
  contact: string; what_to_send: string; why: string; status: string;
}

// ==================== STRUCTURE ISSUES ====================
const INIT_STRUCTURE_ISSUES: StructureIssue[] = [
  { id:"s1", cat: "FATAL", item: "Transfer Pricing non documenté", desc: "Si la Ltd IL facture des royalties/licences à la SAS FR sans étude TP, le fisc FR requalifie en distribution déguisée de dividendes → amende 40% + intérêts. DOUBLEMENT critique car Emmanuel + Éric sont actionnaires des DEUX entités = parties liées.", action: "Commander une étude TP (3-8K€) AVANT le premier flux financier entre les 2 entités. Documenter chaque transaction inter-sociétés.", entity: "BOTH", status: "todo" },
  { id:"s2", cat: "FATAL", item: "IP tech créée par la SAS FR assignée à la Ltd IL", desc: "Des devs FR qui créent du code/IP attribué à la Ltd IL = transfert d'actif imposable. Le fisc FR peut imposer une plus-value fictive sur l'IP transférée.", action: "Les devs FR travaillent UNIQUEMENT sur des livrables FR (films, contenus, pipeline de post-prod FR). L'IP tech (micro-task engine, IA, plateforme) est développée UNIQUEMENT par l'équipe IL.", entity: "BOTH", status: "todo" },
  { id:"s3", cat: "FATAL", item: "IIA IP Lock — pénalité 6x", desc: "L'IP financée par l'Autorité de l'Innovation ne peut PAS être transférée à la SAS FR. Une licence exclusive mal rédigée = transfert → pénalité = 6x le grant + intérêts.", action: "Licence d'utilisation NON-exclusive avec clause de retour automatique. Faire valider par avocat IL spécialisé IIA (ex: Pearl Cohen, Meitar).", entity: "IL", status: "todo" },
  { id:"s4", cat: "FATAL", item: "Établissement stable non déclaré", desc: "Si Emmanuel dirige de facto la SAS FR depuis Jérusalem, la France considère que la Ltd IL a un établissement stable (PE) en France → imposition FR sur les revenus de la Ltd IL.", action: "La SAS FR DOIT avoir un dirigeant résident FR (même temps partiel). Emmanuel = CEO de la Ltd IL uniquement. Recommandation: nommer Éric comme Président de la SAS si Éric est aussi à JLM → trouver un 3ème résident FR.", entity: "BOTH", status: "todo" },
  { id:"s5", cat: "RISQUE", item: "JEI perdu si Ltd IL détient >50% de la SAS", desc: "Le statut JEI exige 50%+ du capital détenu par des personnes physiques. Avec le montage 51% fondateurs / 49% Ltd → JEI PRÉSERVÉ. Mais attention: si Ltd IL monte à 50%+ → JEI perdu = ~80-160K€/an de charges en plus.", action: "MAINTENIR strictement 51%+ aux personnes physiques dans la SAS FR. Le pacte d'actionnaires doit verrouiller cette répartition. Prévoir une clause anti-dilution JEI.", entity: "FR", status: "todo" },
  { id:"s6", cat: "RISQUE", item: "CNC: initiative française vs étrangère", desc: "Un film 'commandité' par la Ltd IL = initiative étrangère → pas de soutien automatique CNC ni de CIA. Seul le C2I (20%) reste accessible.", action: "La SAS FR DOIT être producteur délégué avec droits Europe. Le scénario naît à la SAS, pas à la Ltd IL. Pour les films internationaux → initiative IL via C2I.", entity: "FR", status: "todo" },
  { id:"s7", cat: "RISQUE", item: "IFCIC: indépendance de la production", desc: "L'IFCIC exige que la prod déléguée ne soit PAS majoritairement détenue par un groupe. Avec Ltd IL à 49% → PASSE, mais vérifier les critères exacts de 'contrôle' vs 'détention'.", action: "Confirmer avec l'IFCIC que 49% corporate + 51% physiques = indépendant. Attention si pacte d'actionnaires donne des droits de veto à la Ltd → pourrait être requalifié en contrôle.", entity: "FR", status: "todo" },
  { id:"s8", cat: "RISQUE", item: "Double imposition des royalties FR↔IL", desc: "Sans activation de la convention fiscale FR-IL de 1995, les royalties peuvent être imposées 2 fois.", action: "Déposer les formulaires 5000-FR + 5002-FR dès le 1er paiement. Taux conventionnel: max 10% retenue à la source.", entity: "BOTH", status: "todo" },
  { id:"s9", cat: "RISQUE", item: "CIR: dépenses éligibles strictes", desc: "Utiliser l'app de la Ltd IL pour créer des films ≠ R&D. Le CIR ne couvre que les dépenses de R&D PROPRES de la SAS FR.", action: "La SAS FR doit avoir ses propres projets R&D distincts: workflow IA cinéma, QC automatisé, pipeline post-prod. Séparer clairement R&D (CIR) vs production.", entity: "FR", status: "todo" },
  { id:"s10", cat: "RISQUE", item: "Fonds Cinéma JLM: Projet Jérusalémite", desc: "Le fonds cinéma de Jérusalem exige que 2 des 3 postes clés (scriptwriter, director, producer) résident à Jérusalem. Résidence récente → la JDA pourrait questionner la bona fide.", action: "S'inscrire à Jérusalem AVANT la candidature. Pas de condition d'ancienneté explicite dans la procédure mais la JDA peut vérifier.", entity: "IL", status: "todo" },
  { id:"s11", cat: "ASTUCE", item: "C2I = conçu pour ce montage", desc: "Le C2I est FAIT pour les films d'initiative étrangère fabriqués en France. La Ltd IL commande, la SAS FR exécute → 20% des dépenses FR remboursées (max 4M€/œuvre).", action: "Films internationaux/anglais = initiative IL → C2I via SAS FR. Structurer le deal memo correctement (Ltd IL = producteur délégué, SAS FR = exécutif).", entity: "FR", status: "todo" },
  { id:"s12", cat: "ASTUCE", item: "Dual track: initiative FR + initiative IL", desc: "Rien n'interdit d'avoir des films d'initiative FR (→ CNC automatique) ET des films d'initiative IL (→ C2I). Les 2 dispositifs coexistent.", action: "Films à forte DA française = initiative FR → CNC. Films internationaux = initiative IL → C2I. Maximiser les 2.", entity: "BOTH", status: "todo" },
  { id:"s13", cat: "ASTUCE", item: "Traité coprod FR-IL 2002", desc: "Ce traité permet la double nationalité du film → ouvre TOUS les dispositifs des 2 pays simultanément.", action: "Vérifier si l'auto-coprod (mêmes fondateurs dans les 2 entités) est acceptée ou si un 3ème partenaire est requis. QUESTION PRIORITAIRE pour l'avocat.", entity: "BOTH", status: "todo" },
  { id:"s14", cat: "ASTUCE", item: "SAS FR = cost center liquidable", desc: "Pour un exit US propre, la SAS FR doit pouvoir être fermée sans impact sur la valuation de la Ltd IL.", action: "NE JAMAIS mettre d'IP tech dans la SAS FR. Le catalogue de films = actif SAS, mais les droits internationaux restent chez la Ltd IL via licence.", entity: "FR", status: "todo" },
  { id:"s15", cat: "ASTUCE", item: "Label Fair AI Cinema = avantage CNC", desc: "Le CNC réfléchit à l'IA dans la création. Premier studio avec un label éthique IA = avantage compétitif dans les commissions.", action: "Rédiger une charte éthique IA formelle. L'utiliser dans chaque dossier CNC et Rabinovich.", entity: "BOTH", status: "todo" },
  { id:"s16", cat: "ASTUCE", item: "JNEXT Rova HaKnisa = grants DOUBLÉS", desc: "Le nouveau quartier d'entrée de Jérusalem offre des grants DOUBLÉS: 120K NIS/employé résident JLM (au lieu de 60K), 60K hors JLM, 50K/stagiaire. Max 7.2M NIS.", action: "Vérifier si des bureaux sont disponibles au Rova HaKnisa. Si oui → les grants sont DOUBLÉS vs le programme standard JNEXT.", entity: "IL", status: "todo" },
  { id:"s17", cat: "RISQUE", item: "SAS 51% physiques / 49% Ltd IL → Question expert-comptable", desc: "Les fondateurs (Emmanuel 25.5% + Éric 25.5%) détiennent 51% de la SAS directement, et leur propre Ltd IL détient 49%. Légal en droit FR = OUI. MAIS: le fisc FR peut requalifier en 'contrôle' si le pacte d'actionnaires ou les votes sont alignés. L'enjeu = JEI (50%+ physiques) + IFCIC (indépendance) + CNC (initiative française).", action: "DEMANDER À L'EXPERT-COMPTABLE: 1) Confirmer éligibilité JEI avec ce montage exact. 2) Vérifier que les droits de vote sont bien 51/49. 3) Rédiger un pacte d'actionnaires avec clause de sauvegarde JEI. 4) Prévoir rescrit fiscal JEI.", entity: "BOTH", status: "in-progress" },
]

// ==================== SUBSIDIES ====================
const INIT_SUBSIDIES: Subsidy[] = [
  // ===== ISRAEL - JERUSALEM =====
  { id: "jnext-startup", name: "JNEXT — Grant Startups", entity: "IL", cat: "Jerusalem", amount: "Jusqu'à 60K NIS/employé (max 600K NIS / ~150K€)", rate: "Grant direct", timing: "Continu — Plan Quinquennal jusqu'à fin 2026", difficulty: 2, priority: 1, deadline: "Continu (budget limité, fin 2026)", status: "todo",
    url: "https://jnext.org.il/grant-application/",
    desc: "Grant JDA/JNEXT pour startups hi-tech à Jérusalem. 60K NIS par employé éligible résidant à Jérusalem, 40K NIS hors Jérusalem, 26K NIS par student. Max 10 employés = 600K NIS. Versement étalé sur 2 ans.",
    residency: "L'employé doit être résident Jérusalem pour le taux max 60K. Pas de durée minimum de résidence. Le siège social doit être à Jérusalem.",
    tasks: [
      {t:"Vérifier inscription au Registre des Sociétés avec adresse Jérusalem",done:false},
      {t:"Obtenir certificat IIA confirmant activité R&D",done:false},
      {t:"Préparer contrats de travail des employés",done:false},
      {t:"Rassembler preuves résidence JLM",done:false},
      {t:"Vérifier aucune dette à la mairie de Jérusalem",done:false},
      {t:"Contacter Igal Falkovitz: igal@segevcpa.co.il",done:false},
      {t:"Soumettre formulaire sur jnext.org.il",done:false},
    ],
    docs: ["Certificat incorporation", "Contrats travail", "Preuves résidence", "Business plan 1 page", "Certificat IIA"] },

  { id: "jnext-rova", name: "JNEXT — Quartier d'Entrée DOUBLÉ", entity: "IL", cat: "Jerusalem", amount: "120K NIS/employé JLM, 60K hors JLM, 50K/student (max 7.2M NIS!)", rate: "Grant direct", timing: "Programme spécial — tant que budgets disponibles", difficulty: 2, priority: 2, deadline: "Ouvert (dépend disponibilité bureaux)", status: "todo",
    url: "https://www.calcalist.co.il/article/s1kyiqs4yx",
    desc: "Programme SPÉCIAL pour entreprises dans le nouveau quartier d'entrée de Jérusalem. Les grants sont DOUBLÉS: 120K NIS par employé JLM (vs 60K standard). Géré par Eden (société développement mairie).",
    residency: "Bureau doit être physiquement dans le Rova HaKnisa.",
    tasks: [
      {t:"Vérifier disponibilité bureaux au Rova HaKnisa",done:false},
      {t:"Contacter Eden (société développement mairie JLM)",done:false},
      {t:"Comparer avec le programme standard JNEXT (x2 les montants!)",done:false},
      {t:"Si pertinent, réserver un espace et soumettre",done:false},
    ],
    docs: ["Bail bureau Rova HaKnisa", "Même dossier que JNEXT standard"] },

  { id: "min-eco-salaires", name: "Min. Économie — Subvention Salaires Zone A", entity: "IL", cat: "Jerusalem", amount: "30% salaires Y1, 20% Y2 (max 30K NIS/mois/employé)", rate: "30% puis 20%", timing: "24 mois, candidature continue", difficulty: 1, priority: 1, deadline: "Continu", status: "todo",
    url: "https://jnext.org.il/information/government-funding_non-jda_grants/",
    desc: "Financement partiel des salaires pendant 24 mois pour entreprises en Zone A. Jérusalem = seule ville du centre à être Zone A! CUMULABLE avec les grants JNEXT.",
    residency: "L'ENTREPRISE doit être en Zone A (= Jérusalem).",
    tasks: [
      {t:"Vérifier éligibilité sectorielle (industrie knowledge-intensive)",done:false},
      {t:"Préparer fiches de paie prévisionnelles",done:false},
      {t:"Soumettre via portail Min. Économie",done:false},
    ],
    docs: ["Enregistrement sectoriel", "Fiches de paie", "Formulaire Min. Économie"] },

  { id: "jda-office-grant", name: "JDA — Grant Bureaux 400 NIS/m²", entity: "IL", cat: "Jerusalem", amount: "400 NIS/m² (max 2,000 m²) = jusqu'à 800K NIS (~200K€)", rate: "250 NIS/m² Y1 + 150 NIS/m² Y2", timing: "Lors de l'installation", difficulty: 1, priority: 2, deadline: "Continu", status: "todo",
    url: "https://www.jda.gov.il/",
    desc: "Grant pour entreprises hi-tech qui s'installent à Jérusalem. Min 100 m² pour transfert ou 700 m² pour extension.",
    residency: "Pas de condition de résidence personnelle. L'activité doit être dans les limites municipales de Jérusalem.",
    tasks: [
      {t:"Trouver bureau à Jérusalem (min 100 m²)",done:false},
      {t:"Signer bail",done:false},
      {t:"Soumettre formulaire JDA avec bail et plan",done:false},
    ],
    docs: ["Bail", "Plan bureau", "Preuve activité hi-tech"] },

  { id: "jnext-accelerateur", name: "JNEXT — Post-Accélérateur", entity: "IL", cat: "Jerusalem", amount: "15,000-25,000 NIS (~4-6K€)", rate: "Grant one-time", timing: "Post-accélérateur", difficulty: 1, priority: 3, deadline: "Continu", status: "todo",
    url: "https://jnext.org.il/grant-application/",
    desc: "Grant pour startups ayant complété un programme d'accélération à Jérusalem.",
    residency: "La startup doit avoir fait un accélérateur basé à Jérusalem.",
    tasks: [
      {t:"Identifier un accélérateur à Jérusalem (MassChallenge JLM, Siftech, etc.)",done:false},
      {t:"Compléter le programme",done:false},
      {t:"Soumettre preuve + bail",done:false},
    ],
    docs: ["Certificat accélérateur", "Bail Jérusalem"] },

  // ===== ISRAEL - CINEMA =====
  { id: "jda-film-fund", name: "Fonds Cinéma Jérusalem", entity: "IL", cat: "Jerusalem Cinéma", amount: "100K-2M NIS/projet (budget ~16M NIS/an)", rate: "Investissement sélectif", timing: "Appels à projets multiples/an", difficulty: 3, priority: 1, deadline: "thejerusalemfilmfund.com", status: "todo",
    url: "https://thejerusalemfilmfund.com/",
    desc: "Plus gros fonds cinéma municipal d'Israël. ~142M NIS investis depuis 2008. Parcours: développement scénario, production séries TV, séries web (min 4 épisodes), film petit budget (<2M NIS), productions internationales.",
    residency: "CRITIQUE: 2 des 3 postes clés (scriptwriter/director/producer) doivent résider à Jérusalem.",
    tasks: [
      {t:"Vérifier dates du prochain appel à projets sur thejerusalemfilmfund.com",done:false},
      {t:"Développer un projet ancré dans Jérusalem",done:false},
      {t:"Confirmer que 2/3 postes clés résident à JLM",done:false},
      {t:"Préparer scénario + note d'intention + budget",done:false},
      {t:"Pour film petit budget: <2M NIS, 80% temps écran = JLM, 80% jours tournage = JLM",done:false},
    ],
    docs: ["Scénario complet", "Note intention réalisateur", "Budget production", "Preuves résidence JLM", "CV producteur + réalisateur"] },

  { id: "jda-film-intl", name: "Fonds Cinéma JLM — Productions Internationales", entity: "IL", cat: "Jerusalem Cinéma", amount: "Variable selon taille du projet", rate: "Investissement", timing: "Continu", difficulty: 3, priority: 2, deadline: "Continu", status: "todo",
    url: "https://thejerusalemfilmfund.com/",
    desc: "Parcours spécial pour productions internationales filmées à Jérusalem. Conditions: financement principal étranger (80%+), producteur et société enregistrés à l'étranger → la SAS FR!, langue principale non-hébreu.",
    residency: "Pas de condition de résidence — programme pour les étrangers. La SAS FR = le producteur étranger parfait!",
    tasks: [
      {t:"Structurer un projet avec la SAS FR comme co-producteur étranger",done:false},
      {t:"Préparer package production complet",done:false},
      {t:"Montrer 80%+ financement étranger garanti",done:false},
      {t:"Plan distribution internationale",done:false},
    ],
    docs: ["Contrat producteur étranger", "Package production", "Preuves financement", "Plan distribution"] },

  { id: "jda-film-web", name: "Fonds Cinéma JLM — Séries Web/Digital", entity: "IL", cat: "Jerusalem Cinéma", amount: "Grant sélectif", rate: "Investissement", timing: "Appels à projets", difficulty: 2, priority: 2, deadline: "Prochain appel à vérifier", status: "todo",
    url: "https://thejerusalemfilmfund.com/",
    desc: "Séries web: min 4 épisodes, 30 min total. Contenu original fiction ou documentaire. 50%+ temps écran = JLM, 50%+ jours tournage = JLM, 30%+ équipe = Jérusalémites, 25%+ budget = dépenses locales.",
    residency: "30% de l'équipe doit être Jérusalémite. Les dirigeants comptent.",
    tasks: [
      {t:"Développer concept série ancrée à Jérusalem",done:false},
      {t:"Vérifier prochain appel à projets",done:false},
      {t:"Préparer dossier avec budget montrant 25%+ dépenses JLM",done:false},
    ],
    docs: ["Concept série", "Scénario épisode pilote", "Budget avec ventilation JLM"] },

  { id: "tax-75", name: "IS 7.5% — Entreprise Tech Préférée Zone A", entity: "IL", cat: "Jerusalem Fiscalité", amount: "IS 7.5% au lieu de 23%", rate: "Permanent", timing: "Dès la 1ère année profitable", difficulty: 2, priority: 1, deadline: "Déclaration annuelle", status: "todo",
    url: "https://innovationisrael.org.il/tax-benefit-guide/",
    desc: "En tant qu'entreprise tech en Zone A, IS = 7.5% au lieu de 23% (taux normal IL) ou 25% (France). Condition: IP qualifié. Demande via procédure 200-05 de l'IIA.",
    residency: "L'ENTREPRISE doit être en Zone A. Pas de condition de résidence des dirigeants.",
    tasks: [
      {t:"Faire reconnaître la R&D comme IP qualifié par l'IIA",done:false},
      {t:"Préparer dossier selon procédure 200-05",done:false},
      {t:"Soumettre déclaration direction + rapport comptable",done:false},
      {t:"Appliquer taux 7.5% dans déclaration fiscale annuelle",done:false},
    ],
    docs: ["Formulaire 200-05", "Déclaration direction", "Rapport comptable", "États financiers audités"] },

  // ===== ISRAEL - IIA NATIONAL =====
  { id: "tnufa", name: "IIA Tnufa (Élan)", entity: "IL", cat: "IIA National", amount: "200K NIS (~50K€)", rate: "85% du budget approuvé", timing: "Continu, réponse ~3 mois", difficulty: 2, priority: 1, deadline: "Continu", status: "todo",
    url: "https://innovationisrael.org.il/en/programs/ideation-tnufa-incentive-program/",
    desc: "Premier étage de la fusée IIA. POC, prototypage, dépôt brevet, développement business. ~100 entrepreneurs/an financés.",
    residency: "Le candidat doit être résident israélien.",
    tasks: [
      {t:"Préparer business plan tech 10 pages",done:false},
      {t:"Décrire l'innovation: pipeline IA micro-tâches cinéma",done:false},
      {t:"Budget détaillé 12 mois",done:false},
      {t:"Soumettre sur portail IIA (hébreu)",done:false},
      {t:"Préparer pitch 15 min pour le comité",done:false},
    ],
    docs: ["Business Plan Tech", "Budget 12 mois", "Description Innovation", "CV fondateurs"] },

  { id: "iia-preseed", name: "IIA Startup Fund — Pre-Seed", entity: "IL", cat: "IIA National", amount: "Jusqu'à 1.65M NIS (~410K€) [+10% Zone A]", rate: "60% du tour d'investissement", timing: "Continu, process 4-6 mois", difficulty: 3, priority: 2, deadline: "Continu", status: "todo",
    url: "https://innovationisrael.org.il/programs/preseed/",
    desc: "L'IIA matche 60% de votre tour pre-seed. Max 1.5M NIS (+10% Zone A = 1.65M NIS). NON-DILUTIF. Condition: un investisseur privé pour les 40%.",
    residency: "Société enregistrée en Israël. Zone A = bonus +10%.",
    tasks: [
      {t:"Identifier investisseur: angel/VC",done:false},
      {t:"Préparer dossier technique complet pour IIA",done:false},
      {t:"Due diligence IIA ~2 mois",done:false},
      {t:"Négocier Term Sheet avec investisseur",done:false},
    ],
    docs: ["Deck investisseur", "Term Sheet", "Business plan 3 ans"] },

  { id: "iia-seed", name: "IIA Startup Fund — Seed", entity: "IL", cat: "IIA National", amount: "Jusqu'à 5.5M NIS (~1.37M€) [+10% Zone A]", rate: "50% du tour", timing: "Process ~6 mois", difficulty: 4, priority: 2, deadline: "Continu", status: "todo",
    url: "https://innovationisrael.org.il/programs/startup-fund/",
    desc: "IIA matche 50% de votre Seed. Max 5M NIS (+10% Zone A). Condition: <15M NIS levés au total.",
    residency: "Société IL. Zone A bonus.",
    tasks: [{t:"Lead investor engagé",done:false},{t:"Track record POC/Tnufa",done:false},{t:"Métriques produit",done:false}],
    docs: ["Term Sheet Seed", "Métriques produit", "Projections 5 ans"] },

  { id: "iia-rnd", name: "IIA Fonds R&D", entity: "IL", cat: "IIA National", amount: "Jusqu'à 60% des dépenses R&D en Zone A", rate: "50% + 10% Zone A", timing: "Continu", difficulty: 3, priority: 2, deadline: "Continu", status: "todo",
    url: "https://innovationisrael.org.il/en/programs/rd-fund/",
    desc: "Le 'CIR israélien' en mieux: 50-60% des dépenses R&D remboursées. Remboursement par royalties uniquement si succès (3-5%). Si échec: pas de remboursement.",
    residency: "Société IL en Zone A = bonus.",
    tasks: [{t:"Définir projet R&D éligible",done:false},{t:"Budget R&D détaillé par poste",done:false},{t:"Description technique innovation",done:false}],
    docs: ["Description projet R&D", "Budget R&D", "Plan travail 12-24 mois"] },

  { id: "bilateral-fril", name: "IIA — Bilatéral FR-IL", entity: "IL", cat: "IIA National", amount: "50-60% du budget R&D pendant 3 ans", rate: "50-60%", timing: "Appel annuel", difficulty: 3, priority: 3, deadline: "Vérifier appel 2026", status: "todo",
    url: "https://innovationisrael.org.il/en/programs/bilateral-rd-incentive-program/",
    desc: "Programme conjoint IIA + BPI France. Chaque pays finance sa partie. La SAS FR = le partenaire français.",
    residency: "Société IL + partenaire FR.",
    tasks: [{t:"Identifier projet R&D conjoint FR-IL",done:false},{t:"Aligner dossiers IIA + BPI",done:false},{t:"Trouver timing appel 2026",done:false}],
    docs: ["Dossier technique conjoint", "Budget FR/IL", "Accord collaboration"] },

  { id: "rabinovich", name: "Fondation Rabinovich", entity: "IL", cat: "Cinéma IL", amount: "400K-2M NIS/film (budget ~28M NIS/an)", rate: "Grant sélectif", timing: "Plusieurs sessions/an", difficulty: 4, priority: 2, deadline: "Sessions sur cinema-project.org.il", status: "todo",
    url: "https://cinema-project.org.il/",
    desc: "Plus grand fonds cinéma d'Israël. Fiction, documentaire, animation. 7-8 films/an gros budget.",
    residency: "Résident israélien.",
    tasks: [{t:"Développer projet film complet",done:false},{t:"Identifier réalisateur israélien",done:false},{t:"Soumettre au calendrier Rabinovich",done:false}],
    docs: ["Scénario", "Note intention", "Budget prod", "CV"] },

  { id: "nfct", name: "NFCT (New Fund for Cinema & TV)", entity: "IL", cat: "Cinéma IL", amount: "Variable — développement, production, post-prod", rate: "Max 80% du budget", timing: "2 appels/an", difficulty: 3, priority: 2, deadline: "Appels sur nfct.org.il", status: "todo",
    url: "https://nfct.org.il/",
    desc: "Parcours: développement, production, finalisation. Producteur peut soumettre 5 projets max/appel.",
    residency: "Résidents israéliens de 18+ ans.",
    tasks: [{t:"Vérifier dates sur nfct.org.il",done:false},{t:"Préparer dossier bon parcours",done:false}],
    docs: ["Scénario", "Note intention", "Budget"] },

  // ===== FRANCE =====
  { id: "jei", name: "JEI (Jeune Entreprise Innovante)", entity: "FR", cat: "Fiscalité FR", amount: "~80-160K€/an (exonérations charges sociales)", rate: "Exonération totale charges patronales R&D", timing: "Déclaration à la création + annuelle", difficulty: 2, priority: 1, deadline: "Création SAS", status: "todo",
    url: "https://entreprendre.service-public.fr/vosdroits/F31188",
    desc: "Exonération charges sociales sur salariés R&D + CFE/CVAE. Conditions: <8 ans, <250 salariés, CA<50M€, 20%+ charges en R&D, 50%+ capital = personnes physiques. AVEC le montage 51% physiques / 49% Ltd IL → JEI PRÉSERVÉ.",
    residency: "N/A (France)",
    tasks: [{t:"Emmanuel 25.5% + Éric 25.5% = 51% SAS en direct (CONFIRMER)",done:false},{t:"20%+ charges = R&D",done:false},{t:"Déclarer JEI à l'URSSAF",done:false},{t:"Rescrit JEI (recommandé)",done:false}],
    docs: ["Statuts SAS (51%/49%)", "Rescrit JEI", "Justificatifs R&D"] },

  { id: "cir", name: "CIR (Crédit Impôt Recherche)", entity: "FR", cat: "Fiscalité FR", amount: "30% des dépenses R&D", rate: "30%", timing: "Déclaration IS annuelle", difficulty: 2, priority: 1, deadline: "Annuel", status: "todo",
    url: "https://www.enseignementsup-recherche.gouv.fr/fr/le-credit-d-impot-recherche-cir-46364",
    desc: "30% des dépenses R&D remboursées. La SAS FR doit avoir ses PROPRES projets R&D (distincts de l'IP de la Ltd IL).",
    residency: "N/A",
    tasks: [{t:"Identifier R&D propre SAS FR (workflow IA cinéma, QC auto)",done:false},{t:"Recruter min 1 ingénieur R&D FR",done:false},{t:"Tenir cahier de labo",done:false},{t:"Remplir formulaire 2069-A",done:false}],
    docs: ["Formulaire 2069-A", "Dossier technique CIR", "Cahier de labo", "Fiches de paie R&D"] },

  { id: "c2i", name: "C2I (Crédit Impôt International)", entity: "FR", cat: "CNC", amount: "20% dépenses FR (max 4M€/œuvre)", rate: "20%", timing: "Avant fabrication", difficulty: 3, priority: 2, deadline: "Avant chaque film", status: "todo",
    url: "https://www.cnc.fr/",
    desc: "Films d'initiative ÉTRANGÈRE fabriqués en France. La Ltd IL commande (initiative), la SAS FR exécute.",
    residency: "N/A",
    tasks: [{t:"Film = initiative IL (Ltd = producteur délégué)",done:false},{t:"SAS FR = producteur exécutif",done:false},{t:"Deal memo Ltd ↔ SAS",done:false},{t:"Dossier CNC avant fabrication",done:false}],
    docs: ["Deal memo", "Formulaire C2I CNC", "Devis dépenses FR"] },

  { id: "cia", name: "CIA (Crédit Impôt Audiovisuel)", entity: "FR", cat: "CNC", amount: "25% des dépenses éligibles", rate: "25%", timing: "Agrément avant tournage", difficulty: 3, priority: 2, deadline: "Avant chaque œuvre", status: "todo",
    url: "https://www.cnc.fr/",
    desc: "Oeuvres audiovisuelles d'initiative française. SAS FR = producteur délégué.",
    residency: "N/A",
    tasks: [{t:"SAS FR = producteur délégué",done:false},{t:"Agrément provisoire CNC AVANT tournage",done:false}],
    docs: ["Agrément provisoire CNC", "Budget production"] },

  { id: "cnc-auto", name: "CNC Soutien Automatique", entity: "FR", cat: "CNC", amount: "Variable selon exploitation", rate: "Basé sur recettes", timing: "Post-production", difficulty: 3, priority: 2, deadline: "Après sortie", status: "todo",
    url: "https://www.cnc.fr/",
    desc: "Les recettes génèrent du soutien sur un 'compte producteur' CNC.",
    residency: "N/A",
    tasks: [{t:"Agrément investissements",done:false},{t:"Agrément production",done:false},{t:"Visa exploitation",done:false}],
    docs: ["Agrément investissements", "Agrément production", "Visa"] },

  { id: "cnc-selectif", name: "CNC Avance sur Recettes", entity: "FR", cat: "CNC", amount: "50-500K€/film", rate: "Avance remboursable", timing: "2 sessions/an", difficulty: 4, priority: 3, deadline: "Sessions semestrielles", status: "todo",
    url: "https://www.cnc.fr/",
    desc: "Aide sélective sur dossier artistique. Jury pro.",
    residency: "N/A",
    tasks: [{t:"Projet à fort potentiel artistique",done:false},{t:"Dossier complet + pitcher si convoqué",done:false}],
    docs: ["Scénario final", "Note d'intention", "Budget certifié", "Plan de financement"] },

  { id: "acm", name: "ACM — Aide Cinémas du Monde", entity: "FR", cat: "CNC", amount: "50-200K€/film", rate: "Grant sélectif", timing: "Continu", difficulty: 3, priority: 2, deadline: "Continu", status: "todo",
    url: "https://www.cnc.fr/",
    desc: "Coprod internationale FR + monde. Réalisateur étranger (israélien OK). SAS FR = coproducteur FR.",
    residency: "N/A",
    tasks: [{t:"Film coprod FR-IL avec réalisateur israélien",done:false},{t:"Dépôt sur CNC MesAides",done:false}],
    docs: ["Contrat coprod FR-IL", "Scénario", "Budget bilatéral"] },

  { id: "bpi-french", name: "BPI Bourse French Tech", entity: "FR", cat: "BPI", amount: "30-90K€", rate: "Subvention", timing: "Continu", difficulty: 2, priority: 2, deadline: "Continu", status: "todo",
    url: "https://www.bpifrance.fr/",
    desc: "PME innovante <5 ans. Faisabilité technique et économique.",
    residency: "N/A",
    tasks: [{t:"Dossier innovation + caractère innovant",done:false},{t:"Budget faisabilité 12-18 mois",done:false}],
    docs: ["Dossier innovation BPI", "Budget", "Business plan"] },

  { id: "bpi-2030", name: "BPI France 2030 IA", entity: "FR", cat: "BPI", amount: "200K-500K€+", rate: "Subvention + avance", timing: "Appels ponctuels", difficulty: 4, priority: 2, deadline: "Appels (veille)", status: "todo",
    url: "https://www.bpifrance.fr/france-2030",
    desc: "Gros financement projets IA ambitieux.",
    residency: "N/A",
    tasks: [{t:"Veille appels France 2030 IA",done:false},{t:"Dossier candidature (6-8 semaines)",done:false}],
    docs: ["Réponse appel France 2030", "Dossier technique", "Plan emplois"] },

  { id: "sofica", name: "SOFICA", entity: "FR", cat: "Financement privé", amount: "Investissement privé défiscalisé", rate: "N/A", timing: "Automne chaque année", difficulty: 3, priority: 3, deadline: "Automne", status: "todo",
    url: "https://www.cnc.fr/",
    desc: "Sociétés de financement du cinéma. Réduction IR 48% pour investisseurs.",
    residency: "N/A",
    tasks: [{t:"Identifier SOFICA actives",done:false},{t:"Présenter projets SAS FR",done:false}],
    docs: ["Projets films packagés", "Business plan"] },

  { id: "regions", name: "Aides Régionales (IDF, etc.)", entity: "FR", cat: "Régional", amount: "20-100K€/film", rate: "Grant sélectif", timing: "3-4 sessions/an", difficulty: 2, priority: 3, deadline: "Sessions", status: "todo",
    url: "https://www.filmfrance.net/",
    desc: "Chaque région a son fonds cinéma. IDF = le plus gros.",
    residency: "N/A",
    tasks: [{t:"Identifier régions pertinentes + calendriers",done:false},{t:"Dossier par région + retombées locales",done:false}],
    docs: ["Dossier régional", "Devis dépenses locales"] },
]

// ==================== INSTITUTIONS ====================
const INIT_INSTITUTIONS: Institution[] = [
  // VCs Israel
  {id:"i-jvp",name:"JVP — Jerusalem Venture Partners",cat:"VC Israel",type:"VC",focus:"Media, cyber, AI, data. Basée à JÉRUSALEM!",stage:"Seed → Growth",ticket:"$2M-15M",url:"https://www.jvp.com/",contact:"Erel Margalit (fondateur), via site web",what_to_send:"Deck, vidéo démo, métriques traction",why:"BASÉE À JÉRUSALEM + focus média/IA = alignement parfait. JVP a un Media Lab à JLM.",status:"todo"},
  {id:"i-pitango",name:"Pitango Venture Capital",cat:"VC Israel",type:"VC",focus:"Software, AI, deep tech. Plus grosse VC israélienne.",stage:"Seed → Late",ticket:"$1M-20M",url:"https://www.pitango.com/",contact:"Via site web, referral recommandé",what_to_send:"Deck, business plan, métriques produit, équipe",why:"Grosse capacité, expérience SaaS consumer. Prestige pour next rounds.",status:"todo"},
  {id:"i-aleph",name:"Aleph VC",cat:"VC Israel",type:"VC",focus:"Consumer tech, plateformes, marketplace",stage:"Seed → Series A",ticket:"$1M-10M",url:"https://aleph.vc/",contact:"Eden Shochat (fondateur), Michael Eisenberg",what_to_send:"Deck, north star metric, vision consumer",why:"Spécialistes consumer tech + plateforme. LUMIO = leur sweet spot.",status:"todo"},
  {id:"i-ourcrowd",name:"OurCrowd",cat:"Plateforme IL",type:"Crowdfunding accrédité",focus:"Multi-sectoriel, AI, media, entertainment",stage:"Seed → Series B",ticket:"$500K-5M (agrégé)",url:"https://www.ourcrowd.com/",contact:"Via plateforme, candidature en ligne",what_to_send:"Deck, vidéo pitch, métriques, cap table",why:"Basée à JÉRUSALEM! Réseau énorme d'investisseurs qualifiés.",status:"todo"},
  {id:"i-iangels",name:"iAngels",cat:"Plateforme IL",type:"Syndicate angels",focus:"New media, AI, fintech, consumer",stage:"Seed",ticket:"$200K-2M",url:"https://www.iangels.com/",contact:"Mor Assia, Shelly Hod Moyal",what_to_send:"Deck, pitch vidéo, proof traction early",why:"Investissent activement dans New Media + AI.",status:"todo"},
  {id:"i-disruptive",name:"Disruptive AI VC",cat:"VC Israel",type:"VC AI",focus:"AI, ML, automation, AI appliquée",stage:"Seed → Series A",ticket:"$500K-5M",url:"https://disruptive.vc/",contact:"Via site web",what_to_send:"Deck technique AI, benchmark vs concurrents, IP défendable",why:"Spécialisé AI uniquement. Pipeline IA cinéma = innovation défendable.",status:"todo"},
  {id:"i-nfx",name:"NFX (Gigi Levy-Weiss)",cat:"VC Israel",type:"VC",focus:"Marketplace, network effects, gaming, media",stage:"Pre-Seed → Seed",ticket:"$1M-5M",url:"https://www.nfx.com/",contact:"Gigi Levy-Weiss (co-fondateur israélien)",what_to_send:"Deck centré sur network effects, viralité, DAU/MAU",why:"Gigi = légende israélienne du gaming/media (ex-CEO 888).",status:"todo"},
  {id:"i-viola",name:"Viola Ventures",cat:"VC Israel",type:"VC",focus:"Enterprise SaaS, AI, deep tech",stage:"Series A → Growth",ticket:"$5M-30M",url:"https://viola-group.com/",contact:"Via site web + referral",what_to_send:"Deck, ARR metrics, unit economics, pipeline",why:"Pour Series A+. Grosse capacité.",status:"todo"},
  {id:"i-magma",name:"Magma Venture Partners",cat:"VC Israel",type:"VC",focus:"Early-stage, consumer, AI",stage:"Seed → Series A",ticket:"$1M-5M",url:"https://www.magmavc.com/",contact:"Modi Rosen, Yahal Zilka",what_to_send:"Deck, product demo, early traction",why:"Forte orientation consumer + AI early stage.",status:"todo"},
  {id:"i-vanleer",name:"Van Leer Xenia — Incubateur JLM",cat:"Incubateur",type:"Incubateur tech IIA",focus:"ICT, digital health, AI (basée JÉRUSALEM)",stage:"Ideation → Seed",ticket:"Jusqu'à 6.5M NIS (85% IIA + 15% incubateur)",url:"https://www.vanleer.co.il/",contact:"Uri Hoshen (DG), via site web",what_to_send:"Concept tech innovant, équipe, POC plan",why:"JÉRUSALEM + financé par IIA. 85% du budget en grant non-dilutif!",status:"todo"},

  // Angels Israel
  {id:"i-yossi",name:"Yossi Vardi (Super Angel IL)",cat:"Angel Israel",type:"Angel investor",focus:"Internet, media, consumer, 80+ investissements",stage:"Pre-Seed → Seed",ticket:"$50K-500K",url:"https://www.linkedin.com/in/yossivardi/",contact:"Réseaux, conférences (DLD, MIXiii), intro via réseau",what_to_send:"Pitch personnel court + deck 10 slides",why:"LE super-angel israélien. Légende vivante. Son nom ouvre toutes les portes.",status:"todo"},
  {id:"i-dov",name:"Dov Moran (Angel)",cat:"Angel Israel",type:"Angel investor",focus:"Hardware, consumer tech, innovation",stage:"Seed",ticket:"$100K-1M",url:"https://www.linkedin.com/in/dovmoran/",contact:"Via réseau tech IL",what_to_send:"Deck + démo produit",why:"Inventeur du USB. Crédibilité tech énorme.",status:"todo"},
  {id:"i-eden-list",name:"Liste Angels d'Eden Shochat (500+)",cat:"Angel Israel",type:"Base de données angels",focus:"500+ angels israéliens, tous secteurs",stage:"Pre-Seed → Seed",ticket:"$25K-500K individuel",url:"https://github.com/AdenShohat/Israeli-Angel-Investors",contact:"GitHub public — liste avec emails/LinkedIn",what_to_send:"Email court + deck attaché. Personnaliser chaque approche.",why:"LA référence. 500+ contacts avec préférences d'investissement détaillées.",status:"todo"},

  // Accelerateurs Israel
  {id:"i-masschallenge",name:"MassChallenge Israel (Jérusalem)",cat:"Accélérateur",type:"Programme accélération",focus:"Multi-sectoriel, media, consumer, social impact",stage:"Early Stage",ticket:"Non-dilutif! Prix cash 50K-200K$",url:"https://masschallenge.org/programs-israel/",contact:"Candidature en ligne, sessions annuelles",what_to_send:"Application form + pitch vidéo + traction",why:"Programme à JÉRUSALEM! Non-dilutif. + ouvre droit au grant post-accélérateur JNEXT.",status:"todo"},
  {id:"i-siftech",name:"Siftech — Accélérateur Jérusalem",cat:"Accélérateur",type:"Programme accélération JLM",focus:"Tech startups basées à Jérusalem",stage:"Ideation → MVP",ticket:"Mentorat + accès réseau + droit à JNEXT post-accelerator",url:"https://siftech.org.il/",contact:"Via site + réseau JNEXT",what_to_send:"Application, concept, équipe",why:"Spécifiquement Jérusalem. Ouvre l'écosystème JLM et le bonus JNEXT.",status:"todo"},
  {id:"i-8200",name:"8200 EISP (Alumni Accelerator)",cat:"Accélérateur",type:"Programme accélération",focus:"Cyber, AI, tech",stage:"Early Stage",ticket:"Non-dilutif, réseau 8200",url:"https://www.8200eisp.com/",contact:"Candidature annuelle",what_to_send:"Application + pitch",why:"Le réseau le plus puissant d'Israël.",status:"todo"},
  {id:"i-junction",name:"JUNCTION JLM — Hub innovation",cat:"Hub Jérusalem",type:"Hub innovation",focus:"Coworking + communauté startups Jérusalem",stage:"Tous",ticket:"Espace de travail + networking + événements",url:"https://www.thejunction.org.il/",contact:"Via site web",what_to_send:"Demande d'adhésion",why:"Le hub tech de Jérusalem. Networking, événements, accès à l'écosystème local.",status:"todo"},

  // Fonds Cinéma Israel
  {id:"i-filmfund-il",name:"Israel Film Fund",cat:"Fonds Cinéma",type:"Fonds de soutien",focus:"Films de fiction longs métrages israéliens",stage:"Développement → Production → Post-production",ticket:"Variable selon parcours",url:"https://www.filmfund.org.il/",contact:"Candidature en ligne, sessions 2x/an",what_to_send:"Scénario, Note intention réalisateur, Budget, Plan distribution",why:"Fonds principal du cinéma israélien. Prestige + ouvre Rabinovich/NFCT.",status:"todo"},
  {id:"i-maakor",name:"Fonds Maakor",cat:"Fonds Cinéma",type:"Fonds",focus:"Films + séries TV, documentaires, animation",stage:"Dev → Prod → Post",ticket:"Variable",url:"https://www.makor-fund.co.il/",contact:"Candidature sur site",what_to_send:"Scénario + note intention + budget + équipe",why:"Complément au Film Fund. Finance aussi le développement de séries.",status:"todo"},
  {id:"i-gesher",name:"Gesher Multicultural Film Fund",cat:"Fonds Cinéma",type:"Fonds multiculturel",focus:"Films diversité culturelle israélienne",stage:"Dev → Prod",ticket:"50K-300K NIS",url:"https://www.gesfrund.org/",contact:"Candidature, vérifier dates",what_to_send:"Scénario + dimension multiculturelle",why:"Angle multi-culturel FR-IL = bonne porte d'entrée.",status:"todo"},
  {id:"i-avi-chai",name:"Fondation Avi Chai",cat:"Fondation",type:"Philanthropie",focus:"Culture juive, éducation, identité, cinéma",stage:"Projet par projet",ticket:"Grants variables",url:"https://avichai.org.il/",contact:"Via site web",what_to_send:"Proposition liée à la culture/identité juive",why:"Si contenu touche à l'identité juive/israélienne. Budget philanthropique important.",status:"todo"},

  // Banques Israel
  {id:"i-poalim",name:"Bank HaPoalim HiTech",cat:"Banque",type:"Prêts tech",focus:"Startups tech, venture lending",stage:"Post-seed (avec investisseurs)",ticket:"Prêts 500K-5M NIS",url:"https://www.poalimhitech.co.il/",contact:"poalim.hitech@bankhapoalim.co.il",what_to_send:"Business plan, preuve d'investisseurs, projections",why:"Premier à développer une division hi-tech dédiée. Venture lending complémentaire aux grants.",status:"todo"},
  {id:"i-leumi",name:"Leumi Tech",cat:"Banque",type:"Prêts tech",focus:"Venture lending, startups tech",stage:"Post-seed",ticket:"Variables",url:"https://www.leumi.co.il/",contact:"Via succursale tech",what_to_send:"Business plan + investisseurs",why:"Deuxième option bancaire pour le venture lending.",status:"todo"},

  // France — BPI
  {id:"i-bpi-creation",name:"BPI Création (Prêt d'Honneur)",cat:"BPI France",type:"Prêt d'honneur",focus:"Startups innovantes <3 ans",stage:"Création",ticket:"10-45K€ (sans garantie, sans intérêt)",url:"https://www.bpifrance.fr/",contact:"bpifrance.fr + réseau Initiative/Réseau Entreprendre",what_to_send:"Business plan, statuts, CV fondateurs",why:"Premier financement SAS FR. Sans garantie ni intérêt. Effet levier bancaire.",status:"todo"},
  {id:"i-bpi-deeptech",name:"BPI Bourse French Tech / DeepTech",cat:"BPI France",type:"Subvention",focus:"Deeptech, IA, innovation de rupture",stage:"Faisabilité → POC",ticket:"30-90K€ (subvention pure)",url:"https://www.bpifrance.fr/catalogue-offres/soutien-a-linnovation/bourse-french-tech",contact:"bpifrance.fr, conseiller régional",what_to_send:"Dossier innovation, caractère deeptech, budget faisabilité",why:"Subvention pure pour valider la faisabilité technique. Pipeline IA cinéma = deeptech.",status:"todo"},
  {id:"i-bpi-aide-innov",name:"BPI Aide à l'Innovation",cat:"BPI France",type:"Avance remboursable + subvention",focus:"Innovation, développement expérimental",stage:"Développement",ticket:"200K-3M€ (mix subvention + avance)",url:"https://www.bpifrance.fr/",contact:"Conseiller BPI régional",what_to_send:"Dossier technique détaillé, business plan, budget R&D",why:"Plus gros financement BPI hors France 2030. Mix subvention + avance remboursable.",status:"todo"},
  {id:"i-bpi-garantie",name:"BPI Garantie Création",cat:"BPI France",type:"Garantie bancaire",focus:"Garantie jusqu'à 60% du prêt bancaire",stage:"Création",ticket:"Garantie (pas d'argent direct)",url:"https://www.bpifrance.fr/",contact:"Via banque partenaire",what_to_send:"Demande via banque",why:"Facilite l'obtention de prêts bancaires pour la SAS FR.",status:"todo"},
  {id:"i-ifcic",name:"IFCIC (Garantie Cinéma)",cat:"BPI France",type:"Garantie + prêts",focus:"Industries culturelles et créatives",stage:"Production",ticket:"Garantie 50-70% + prêts production",url:"https://www.ifcic.fr/",contact:"ifcic.fr",what_to_send:"Dossier production film, plan de financement",why:"Spécialisé cinéma. Garantie + prêts de production. Essentiel pour la SAS FR productrice.",status:"todo"},
]

// ==================== HELPER FUNCTIONS ====================
const catColor = (cat: string) => {
  if (cat === 'FATAL') return 'bg-red-500/15 text-red-400 border-red-500/30'
  if (cat === 'RISQUE') return 'bg-yellow-500/15 text-yellow-600 border-yellow-500/30'
  if (cat === 'ASTUCE') return 'bg-green-500/15 text-green-600 border-green-500/30'
  return 'bg-white/[0.05] text-white/50 border-white/10'
}

const catIcon = (cat: string) => {
  if (cat === 'FATAL') return <AlertTriangle className="h-4 w-4 text-red-400" />
  if (cat === 'RISQUE') return <Shield className="h-4 w-4 text-yellow-600" />
  if (cat === 'ASTUCE') return <Star className="h-4 w-4 text-green-600" />
  return null
}

const entityBadge = (entity: string) => {
  if (entity === 'IL') return <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">Israel</span>
  if (entity === 'FR') return <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">France</span>
  return <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20">FR + IL</span>
}

const difficultyStars = (d: number) => '★'.repeat(d) + '☆'.repeat(5 - d)

const statusBadge = (s: string) => {
  if (s === 'done') return <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">Fait</span>
  if (s === 'in-progress') return <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">En cours</span>
  return <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-white/50 border border-white/10">A faire</span>
}

const instCatIcon = (cat: string) => {
  if (cat.includes('VC')) return <Briefcase className="h-4 w-4 text-violet-400" />
  if (cat.includes('Angel')) return <Users className="h-4 w-4 text-amber-600" />
  if (cat.includes('ccélérateur') || cat.includes('Hub')) return <GraduationCap className="h-4 w-4 text-cyan-600" />
  if (cat.includes('Cinéma') || cat.includes('Fonds') || cat.includes('Fondation')) return <Film className="h-4 w-4 text-rose-600" />
  if (cat.includes('Banque')) return <Building2 className="h-4 w-4 text-emerald-600" />
  if (cat.includes('BPI')) return <Landmark className="h-4 w-4 text-blue-600" />
  return <Globe2 className="h-4 w-4 text-white/50" />
}

// ==================== TABS ====================
type TabId = 'structure' | 'subsidies' | 'institutions'

const TABS: { id: TabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'structure', label: 'Structure FR-IL', icon: Scale },
  { id: 'subsidies', label: 'Subventions', icon: Banknote },
  { id: 'institutions', label: 'Institutions & Fonds', icon: Building2 },
]

// ==================== MAIN COMPONENT ====================
export default function PilotagePage() {
  const [tab, setTab] = useState<TabId>('structure')
  const [search, setSearch] = useState('')
  const [entityFilter, setEntityFilter] = useState<string>('ALL')
  const [catFilter, setCatFilter] = useState<string>('ALL')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  // Filtered data
  const filteredIssues = useMemo(() => {
    return INIT_STRUCTURE_ISSUES.filter(i => {
      if (search && !i.item.toLowerCase().includes(search.toLowerCase()) && !i.desc.toLowerCase().includes(search.toLowerCase())) return false
      if (entityFilter !== 'ALL' && i.entity !== entityFilter) return false
      if (catFilter !== 'ALL' && i.cat !== catFilter) return false
      return true
    })
  }, [search, entityFilter, catFilter])

  const filteredSubsidies = useMemo(() => {
    return INIT_SUBSIDIES.filter(s => {
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.desc.toLowerCase().includes(search.toLowerCase())) return false
      if (entityFilter !== 'ALL' && s.entity !== entityFilter) return false
      if (catFilter !== 'ALL' && s.cat !== catFilter) return false
      return true
    })
  }, [search, entityFilter, catFilter])

  const filteredInstitutions = useMemo(() => {
    return INIT_INSTITUTIONS.filter(i => {
      if (search && !i.name.toLowerCase().includes(search.toLowerCase()) && !i.focus.toLowerCase().includes(search.toLowerCase())) return false
      if (catFilter !== 'ALL' && i.cat !== catFilter) return false
      return true
    })
  }, [search, catFilter])

  // Dynamic category options per tab
  const catOptions = useMemo(() => {
    if (tab === 'structure') return ['ALL', 'FATAL', 'RISQUE', 'ASTUCE']
    if (tab === 'subsidies') return ['ALL', ...Array.from(new Set(INIT_SUBSIDIES.map(s => s.cat)))]
    return ['ALL', ...Array.from(new Set(INIT_INSTITUTIONS.map(i => i.cat)))]
  }, [tab])

  // Stats
  const totalSubsidyPotential = INIT_SUBSIDIES.length
  const fatalCount = INIT_STRUCTURE_ISSUES.filter(i => i.cat === 'FATAL').length
  const risqueCount = INIT_STRUCTURE_ISSUES.filter(i => i.cat === 'RISQUE').length
  const astuceCount = INIT_STRUCTURE_ISSUES.filter(i => i.cat === 'ASTUCE').length
  const ilSubsidies = INIT_SUBSIDIES.filter(s => s.entity === 'IL').length
  const frSubsidies = INIT_SUBSIDIES.filter(s => s.entity === 'FR').length

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3 font-playfair">
          <Landmark className="h-7 w-7 text-[#E50914]" />
          Pilotage &amp; Subventions
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Structure juridique FR-IL, subventions disponibles et institutions de financement.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Points fatals</p>
          <p className="text-xl font-bold text-red-400">{fatalCount}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Risques</p>
          <p className="text-xl font-bold text-yellow-600">{risqueCount}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Astuces</p>
          <p className="text-xl font-bold text-green-600">{astuceCount}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Subventions</p>
          <p className="text-xl font-bold text-[#E50914]">{totalSubsidyPotential}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-[10px] text-white/50 uppercase tracking-wider">Israel</p>
          <p className="text-xl font-bold text-blue-600">{ilSubsidies}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <p className="text-[10px] text-white/50 uppercase tracking-wider">France</p>
          <p className="text-xl font-bold text-indigo-600">{frSubsidies}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.03] border border-white/10 rounded-xl p-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setCatFilter('ALL') }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 justify-center ${
              tab === t.id
                ? 'bg-[#E50914]/10 text-[#E50914] shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
                : 'text-white/50 hover:text-white/80 hover:bg-white/[0.05]'
            }`}
          >
            <t.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white/80 placeholder:text-white/40 focus:outline-none focus:border-[#E50914]/30 transition-colors"
          />
        </div>
        {(tab === 'structure' || tab === 'subsidies') && (
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <select
              value={entityFilter}
              onChange={e => setEntityFilter(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white/60 appearance-none cursor-pointer focus:outline-none focus:border-[#E50914]/30"
            >
              <option value="ALL">Tous pays</option>
              <option value="IL">Israel</option>
              <option value="FR">France</option>
              <option value="BOTH">FR + IL</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40 pointer-events-none" />
          </div>
        )}
        <div className="relative">
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            className="pl-4 pr-8 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white/60 appearance-none cursor-pointer focus:outline-none focus:border-[#E50914]/30 min-w-[160px]"
          >
            {catOptions.map(c => (
              <option key={c} value={c}>{c === 'ALL' ? 'Toutes catégories' : c}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40 pointer-events-none" />
        </div>
      </div>

      {/* ========= TAB: STRUCTURE ========= */}
      {tab === 'structure' && (
        <div className="space-y-3">
          {filteredIssues.length === 0 && (
            <div className="text-center py-12 text-white/50">
              <Scale className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Aucun élément trouvé</p>
            </div>
          )}
          {filteredIssues.map(issue => {
            const isExpanded = expandedIds.has(issue.id)
            return (
              <div
                key={issue.id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/15 transition-all"
              >
                <button
                  onClick={() => toggleExpand(issue.id)}
                  className="w-full p-4 flex items-start gap-3 text-left"
                >
                  <span className="mt-0.5 shrink-0">{catIcon(issue.cat)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${catColor(issue.cat)}`}>
                        {issue.cat}
                      </span>
                      {entityBadge(issue.entity)}
                      {statusBadge(issue.status)}
                    </div>
                    <h3 className="font-medium text-sm text-white">{issue.item}</h3>
                    {!isExpanded && (
                      <p className="text-xs text-white/50 mt-1 line-clamp-1">{issue.desc}</p>
                    )}
                  </div>
                  <ChevronRight className={`h-4 w-4 text-white/40 shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="bg-white/[0.03] rounded-lg p-3">
                      <p className="text-[10px] font-medium text-white/50 uppercase mb-1">Description</p>
                      <p className="text-sm text-white/50">{issue.desc}</p>
                    </div>
                    <div className="bg-[#E50914]/[0.04] border border-[#E50914]/10 rounded-lg p-3">
                      <p className="text-[10px] font-medium text-[#E50914]/60 uppercase mb-1">Action requise</p>
                      <p className="text-sm text-white/60">{issue.action}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ========= TAB: SUBSIDIES ========= */}
      {tab === 'subsidies' && (
        <div className="space-y-3">
          {filteredSubsidies.length === 0 && (
            <div className="text-center py-12 text-white/50">
              <Banknote className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Aucune subvention trouvée</p>
            </div>
          )}
          {filteredSubsidies.map(sub => {
            const isExpanded = expandedIds.has(sub.id)
            const completedTasks = sub.tasks.filter(t => t.done).length
            const progressPct = sub.tasks.length > 0 ? (completedTasks / sub.tasks.length) * 100 : 0
            return (
              <div
                key={sub.id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/15 transition-all"
              >
                <button
                  onClick={() => toggleExpand(sub.id)}
                  className="w-full p-4 flex items-start gap-3 text-left"
                >
                  <div className="mt-0.5 shrink-0">
                    {sub.entity === 'IL' ? <MapPin className="h-4 w-4 text-blue-600" /> : <MapPin className="h-4 w-4 text-indigo-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-white/50 border border-white/10">{sub.cat}</span>
                      {entityBadge(sub.entity)}
                      {statusBadge(sub.status)}
                      <span className="text-[10px] text-amber-600" title={`Difficulté ${sub.difficulty}/5`}>{difficultyStars(sub.difficulty)}</span>
                    </div>
                    <h3 className="font-medium text-sm text-white">{sub.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[#E50914] font-medium">{sub.amount}</span>
                      {sub.tasks.length > 0 && (
                        <span className="text-[10px] text-white/50">{completedTasks}/{sub.tasks.length} tâches</span>
                      )}
                    </div>
                    {sub.tasks.length > 0 && (
                      <div className="mt-2 h-1 bg-white/[0.05] rounded-full overflow-hidden w-full max-w-[200px]">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#FF2D2D] transition-all" style={{ width: `${progressPct}%` }} />
                      </div>
                    )}
                  </div>
                  <ChevronRight className={`h-4 w-4 text-white/40 shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="bg-white/[0.03] rounded-lg p-3">
                      <p className="text-[10px] font-medium text-white/50 uppercase mb-1">Description</p>
                      <p className="text-sm text-white/50">{sub.desc}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-white/[0.03] rounded-lg p-3">
                        <p className="text-[10px] font-medium text-white/50 uppercase mb-1">Taux</p>
                        <p className="text-sm text-white/50">{sub.rate}</p>
                      </div>
                      <div className="bg-white/[0.03] rounded-lg p-3">
                        <p className="text-[10px] font-medium text-white/50 uppercase mb-1">Timing</p>
                        <p className="text-sm text-white/50">{sub.timing}</p>
                      </div>
                      <div className="bg-white/[0.03] rounded-lg p-3">
                        <p className="text-[10px] font-medium text-white/50 uppercase mb-1">Deadline</p>
                        <p className="text-sm text-white/50">{sub.deadline}</p>
                      </div>
                    </div>

                    {sub.residency && (
                      <div className="bg-blue-500/[0.04] border border-blue-500/10 rounded-lg p-3">
                        <p className="text-[10px] font-medium text-blue-600/60 uppercase mb-1">Conditions de résidence</p>
                        <p className="text-sm text-white/50">{sub.residency}</p>
                      </div>
                    )}

                    {sub.tasks.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-medium text-white/50 uppercase">Tâches</p>
                        {sub.tasks.map((task, idx) => (
                          <div key={idx} className="flex items-start gap-2.5">
                            <span className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[10px] ${
                              task.done ? 'bg-[#E50914] border-[#E50914] text-white' : 'border-white/15'
                            }`}>
                              {task.done && <CheckCircle className="h-3 w-3" />}
                            </span>
                            <span className={`text-sm ${task.done ? 'text-white/50 line-through' : 'text-white/50'}`}>{task.t}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {sub.docs.length > 0 && (
                      <div>
                        <p className="text-[10px] font-medium text-white/50 uppercase mb-1.5">Documents requis</p>
                        <div className="flex gap-1.5 flex-wrap">
                          {sub.docs.map((doc, i) => (
                            <span key={i} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-white/[0.03] border border-white/10 text-white/50">
                              <FileText className="h-2.5 w-2.5" />{doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {sub.url && (
                      <a href={sub.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#E50914] hover:underline">
                        <ExternalLink className="h-3 w-3" /> Site officiel
                      </a>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ========= TAB: INSTITUTIONS ========= */}
      {tab === 'institutions' && (
        <div className="space-y-3">
          {filteredInstitutions.length === 0 && (
            <div className="text-center py-12 text-white/50">
              <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Aucune institution trouvée</p>
            </div>
          )}
          {filteredInstitutions.map(inst => {
            const isExpanded = expandedIds.has(inst.id)
            return (
              <div
                key={inst.id}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/15 transition-all"
              >
                <button
                  onClick={() => toggleExpand(inst.id)}
                  className="w-full p-4 flex items-start gap-3 text-left"
                >
                  <span className="mt-0.5 shrink-0">{instCatIcon(inst.cat)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-white/50 border border-white/10">{inst.cat}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">{inst.type}</span>
                      {statusBadge(inst.status)}
                    </div>
                    <h3 className="font-medium text-sm text-white">{inst.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[#E50914] font-medium">{inst.ticket}</span>
                      <span className="text-xs text-white/50">{inst.stage}</span>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-white/40 shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="bg-white/[0.03] rounded-lg p-3">
                      <p className="text-[10px] font-medium text-white/50 uppercase mb-1">Focus</p>
                      <p className="text-sm text-white/50">{inst.focus}</p>
                    </div>

                    <div className="bg-[#E50914]/[0.04] border border-[#E50914]/10 rounded-lg p-3">
                      <p className="text-[10px] font-medium text-[#E50914]/60 uppercase mb-1">Pourquoi c&apos;est pertinent</p>
                      <p className="text-sm text-white/60">{inst.why}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white/[0.03] rounded-lg p-3">
                        <p className="text-[10px] font-medium text-white/50 uppercase mb-1">Contact</p>
                        <p className="text-sm text-white/50">{inst.contact}</p>
                      </div>
                      <div className="bg-white/[0.03] rounded-lg p-3">
                        <p className="text-[10px] font-medium text-white/50 uppercase mb-1">Quoi envoyer</p>
                        <p className="text-sm text-white/50">{inst.what_to_send}</p>
                      </div>
                    </div>

                    {inst.url && (
                      <a href={inst.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-[#E50914] hover:underline">
                        <ExternalLink className="h-3 w-3" /> Site web
                      </a>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
