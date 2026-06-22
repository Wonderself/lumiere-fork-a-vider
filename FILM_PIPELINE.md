# Lumiere — Film Creation Pipeline (Vision Document)

> **Ce document décrit le workflow complet de création d'un film sur la plateforme Lumière.**
> **De la soumission initiale jusqu'à la distribution finale.**

---

## Vue d'Ensemble

```
SOUMISSION → VALIDATION → DECOMPOSITION IA → DISTRIBUTION TACHES → EXECUTION → VALIDATION → ASSEMBLAGE → DISTRIBUTION
```

---

## 1. Soumission du Projet

### 3 Voies d'Entrée

#### A. Soumission au Vote Communautaire (Blockchain Proof)
- L'utilisateur soumet un scénario (titre, logline, synopsis, genre)
- Le scénario passe par le processus de vote communautaire :
  - SUBMITTED → SHORTLISTED (par l'admin) → VOTING → WINNER
- Votes enregistrés sur blockchain (preuve SHA-256)
- Le gagnant reçoit un prize pool en Lumens
- Le film gagnant entre en production

#### B. Projet SAS Française (Développé en interne)
- Lumière Brothers Pictures (SAS) décide de produire un film
- L'admin crée le film directement dans le système
- Budget défini, phases auto-générées
- Peut être combiné avec tokenization pour le financement

#### C. Client Tiers (Commande payante)
- Un client externe soumet un projet de film
- L'équipe Lumière valide le projet (qualité, faisabilité, budget)
- Contrat signé avec revenue share ou prix fixe
- Le client peut suivre la progression en temps réel

---

## 2. Décomposition par l'IA

### Phases Automatiques
Le film est automatiquement découpé en 9 phases de production :

1. **SCRIPT** — Écriture et finalisation du scénario
2. **STORYBOARD** — Découpage visuel scène par scène
3. **DESIGN** — Personnages, environnements, props
4. **ANIMATION** — Création des animations IA
5. **VFX** — Effets visuels et compositing
6. **SOUND** — Sound design, musique, voix off
7. **EDITING** — Montage et rythme
8. **COLOR** — Étalonnage et colorimétrie
9. **FINAL** — QA, sous-titres, master final

### Découpage en Scènes
- Le film est découpé en scènes numérotées
- Chaque scène commence comme une "bande blanche" vierge
- Au fur et à mesure des micro-tâches, la scène prend vie
- Visualisation de la progression : quelle scène est à quel stade

### Micro-Tâches
Chaque phase contient des dizaines/centaines de micro-tâches :
- **PROMPT_WRITING** — Rédaction de prompts pour l'IA
- **IMAGE_GEN** — Génération d'images
- **VIDEO_REVIEW** — Revue et feedback vidéo
- **CHARACTER_DESIGN** — Conception de personnages
- **ENV_DESIGN** — Conception d'environnements
- **SOUND_DESIGN** — Création sonore
- **DIALOGUE_EDIT** — Édition des dialogues
- **COLOR_GRADE** — Étalonnage
- **COMPOSITING** — Assemblage multicouche
- **TRANSLATION** — Traduction
- **SUBTITLE** — Sous-titrage
- **STUNT_CAPTURE** — Capture de cascades
- **DANCE_CAPTURE** — Capture de danses
- **MOTION_REF** — Références de mouvement
- **CONTINUITY_CHECK** — Vérification de continuité
- **QA_REVIEW** — Contrôle qualité

---

## 3. Séparation Humain / IA

### Tâches Obligatoirement Humaines
Certaines tâches nécessitent impérativement une intervention humaine :
- Cascades (STUNT_CAPTURE) — Mouvement corporel réel
- Danse (DANCE_CAPTURE) — Chorégraphie réelle
- Références de mouvement (MOTION_REF)
- Validation finale qualité (QA_REVIEW)
- Direction artistique (décisions créatives)

### Tâches IA-Assistées
- Génération d'images (avec prompt humain)
- Étalonnage (suggestions IA, validation humaine)
- Sous-titres (génération IA, correction humaine)
- Traduction (IA + relecture)

---

## 4. Attribution des Tâches

### 3 Modes d'Attribution

#### A. "Je le fais moi-même"
- L'utilisateur (admin/producteur) réclame la tâche
- La fait lui-même dans le délai imparti

#### B. Attribution directe (champ libre)
- L'admin attribue la tâche à une personne spécifique
- Champ libre avec email du destinataire
- Notification par email avec les détails de la tâche
- Le destinataire accepte ou refuse

#### C. Via la plateforme (marketplace)
- La tâche est publiée sur la plateforme
- Prix affiché selon la difficulté (50€, 100€, 500€)
- N'importe quel contributeur qualifié peut la réclamer
- Système de matching par compétences et niveau

---

## 5. Exécution des Tâches

### Workflow
1. **Réclamation** — Le contributeur accepte la tâche
2. **Briefing détaillé** — Instructions ultra-détaillées, exemples, références
3. **Exécution** — Le contributeur travaille sur la tâche
4. **Soumission** — Upload du fichier résultat
5. **Délai** — Chaque tâche a un délai défini (variable selon complexité)

### Gestion du Temps
- **Délai par tâche** — Défini individuellement selon la complexité
- **Réattribution automatique** — Si pas fait en X temps, la tâche est libérée et réattribuée
- **Bonus vitesse** — Récompense pour livraison rapide (en réalité : pénalité cachée si trop lent)
- **Timer visible** — Le contributeur voit le temps restant

---

## 6. Validation Multi-Niveaux

### Niveau 1 : Validation IA
- Score automatique (0-100) par l'IA
- Feedback détaillé sur la qualité
- Seuil de confiance configurable (défaut: 70%)
- Si score > seuil : passage au niveau 2
- Si score < seuil : rejeté avec feedback

### Niveau 2 : Validation Équipe
- L'admin/reviewer humain examine la soumission
- Peut valider ou rejeter avec commentaires
- Vérification de cohérence avec le film global

### Niveau 3 : Intégration
- La tâche validée est intégrée au fichier principal du film
- Les annexes sont mises à jour
- La progression du film est recalculée

---

## 7. Statistiques des Créateurs

### Métriques Suivies
- Nombre de tâches complétées
- Taux de validation (positif vs négatif)
- Score moyen des soumissions
- Temps moyen de livraison
- Spécialités (types de tâches les plus réalisées)

### Réputation
- Score de réputation calculé automatiquement
- Événements : deadline respectée, qualité, collaborations
- Badges : ROOKIE → PRO → EXPERT → VIP
- Impact sur l'accès aux tâches premium

---

## 8. Progression du Film

### Visualisation
- **Bande blanche → Film complet** — Le film commence vierge et se remplit
- **Progression par scène** — Chaque scène a son propre pourcentage
- **Progression par phase** — Vue d'ensemble des 9 phases
- **Timeline** — Visualisation temporelle de la production

### Fichiers du Film
- **Fichier principal** — Le film assemblé (mis à jour automatiquement)
- **Annexes** — Scènes individuelles, assets, documents de production
- **Travail incrémental** — Chaque micro-tâche ajoute une pièce au puzzle

---

## 9. Contrats Internationaux

### Optimisation par Pays
- Détection du pays du contributeur
- Proposition du meilleur contrat pour être en règle
- Minimisation des commissions
- Respect des réglementations locales
- Adaptation fiscale automatique

### Types de Contrats
- Freelance (selon pays)
- Auto-entrepreneur (France)
- Contractor (US/UK)
- Adaptations légales par juridiction

---

## 10. Contrôle Total

### Dashboard Admin
- Vue d'ensemble de tous les films en production
- Statut de chaque tâche en temps réel
- Gestion des contributeurs
- Paramètres de la plateforme
- Analytics détaillées

### Paramètres Configurables
- Seuil de confiance IA
- Nombre max de tâches simultanées par utilisateur
- Mode maintenance
- Prix des Lumens
- Récompense par tâche
- Notifications email

---

## Statut Actuel d'Implémentation

### Implémenté
- [x] Système de phases et micro-tâches
- [x] Attribution via plateforme
- [x] Validation IA + humaine
- [x] Blockchain voting pour scénarios
- [x] Contests avec prize pools
- [x] Tokenization et governance
- [x] Statistiques créateurs (points, level, reputation)
- [x] Notifications
- [x] Admin panel complet

### À Développer / Améliorer
- [ ] Décomposition automatique scène par scène (IA avancée)
- [ ] Visualisation "bande blanche → film complet"
- [ ] Attribution directe par email (champ libre)
- [ ] Réattribution automatique si délai dépassé
- [ ] Bonus/pénalité vitesse
- [ ] Contrats internationaux automatiques par pays
- [ ] Timeline de production visuelle
- [ ] Assemblage automatique du film principal
- [ ] 3 voies d'entrée complètes (vote, SAS, client tiers)
