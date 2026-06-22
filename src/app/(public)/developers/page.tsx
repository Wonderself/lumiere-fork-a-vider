import { Code2, Globe, Film, Users, BarChart3, ChevronRight, Copy, ExternalLink, Zap, Shield, Clock } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Developers — CINEGENY',
  description: 'Documentation de l\'API publique CINEGENY. Integrez films, contributeurs et statistiques dans vos applications.',
}

type Endpoint = {
  method: 'GET' | 'POST'
  path: string
  description: string
  params?: { name: string; type: string; required: boolean; description: string }[]
  response: string
}

const BASE_URL = 'https://cinegeny.studio/api/v1'

const endpoints: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/films',
    description: 'Liste tous les films publics avec pagination, filtres par genre/statut et tri.',
    params: [
      { name: 'page', type: 'number', required: false, description: 'Numero de page (defaut: 1)' },
      { name: 'limit', type: 'number', required: false, description: 'Resultats par page (1-50, defaut: 20)' },
      { name: 'genre', type: 'string', required: false, description: 'Filtrer par genre (DRAMA, COMEDY, ACTION, etc.)' },
      { name: 'status', type: 'string', required: false, description: 'Filtrer par statut (IN_PRODUCTION, RELEASED, etc.)' },
      { name: 'sort', type: 'string', required: false, description: 'Tri: recent (defaut), title, progress' },
    ],
    response: `{
  "data": [
    {
      "id": "clx...",
      "title": "Le Dernier Spectacle",
      "slug": "le-dernier-spectacle",
      "genre": "DRAMA",
      "status": "IN_PRODUCTION",
      "synopsis": "Un ancien projectionniste...",
      "coverImageUrl": "/images/films/...",
      "progressPct": 35,
      "phasesCount": 10,
      "tasksCount": 47,
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 20,
    "totalPages": 1
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/films/:id',
    description: 'Detail d\'un film par ID ou slug. Inclut les phases de production et les compteurs.',
    params: [
      { name: 'id', type: 'string', required: true, description: 'ID unique ou slug du film' },
    ],
    response: `{
  "data": {
    "id": "clx...",
    "title": "Le Dernier Spectacle",
    "slug": "le-dernier-spectacle",
    "genre": "DRAMA",
    "catalog": "CINEGENY_ORIGINAL",
    "status": "IN_PRODUCTION",
    "synopsis": "...",
    "coverImageUrl": "...",
    "trailerUrl": null,
    "progressPct": 35,
    "estimatedBudget": 50000,
    "createdAt": "2026-01-15T10:00:00.000Z",
    "phases": [
      {
        "id": "...",
        "phaseName": "PRE_PRODUCTION",
        "status": "COMPLETED",
        "order": 1,
        "tasksCount": 8
      }
    ],
    "counts": {
      "tasks": 47,
      "scenarios": 3
    }
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/stats',
    description: 'Statistiques publiques de la plateforme. Donnees en cache (5 min TTL via Redis).',
    response: `{
  "data": {
    "films": 20,
    "tasksCompleted": 156,
    "contributors": 42,
    "scenarios": 18,
    "timestamp": "2026-02-24T14:30:00.000Z"
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/contributors',
    description: 'Classement des contributeurs verifies par Lumens. Inclut competences et score de reputation.',
    params: [
      { name: 'page', type: 'number', required: false, description: 'Numero de page (defaut: 1)' },
      { name: 'limit', type: 'number', required: false, description: 'Resultats par page (1-50, defaut: 20)' },
    ],
    response: `{
  "data": [
    {
      "id": "clx...",
      "displayName": "Alice Martin",
      "avatarUrl": null,
      "role": "CONTRIBUTOR",
      "level": "EXPERT",
      "lumens": 2450,
      "reputationScore": 92,
      "skills": ["acting", "voice", "editing"],
      "tasksCompleted": 34
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}`,
  },
]

function MethodBadge({ method }: { method: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${
      method === 'GET' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
      'bg-blue-500/10 text-blue-400 border border-blue-500/20'
    }`}>
      {method}
    </span>
  )
}

export default function DevelopersPage() {
  return (
    <div className="min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-blue-500/[0.03] blur-[200px]" />
      </div>

      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-500/[0.06] border border-blue-500/15 text-blue-400 text-xs sm:text-sm font-medium mb-7">
            <Code2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            API v1 — REST
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight"
          >
            API{' '}
            <span className="text-shimmer">Developers</span>
          </h1>
          <p className="text-white/40 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Integrez les donnees de CINEGENY dans vos applications.
            API publique, sans authentification requise, JSON standard.
          </p>

          {/* Features */}
          <div className="inline-flex flex-wrap justify-center gap-4 mb-10">
            {[
              { icon: Globe, label: 'REST JSON', desc: 'Format standard' },
              { icon: Shield, label: 'Sans auth', desc: 'Acces libre' },
              { icon: Clock, label: 'Cache Redis', desc: '5 min TTL' },
              { icon: Zap, label: 'Pagination', desc: 'Performant' },
            ].map((feat) => (
              <div key={feat.label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <feat.icon className="h-4 w-4 text-white/30" />
                <div className="text-left">
                  <div className="text-xs font-medium text-white/70">{feat.label}</div>
                  <div className="text-[10px] text-white/30">{feat.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Base URL */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <span className="text-xs text-white/30">Base URL</span>
            <code className="text-sm text-[#E50914] font-mono">{BASE_URL}</code>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-8">
          {endpoints.map((endpoint) => (
            <div
              key={endpoint.path}
              id={endpoint.path.replace(/[/:]/g, '-').slice(1)}
              className="group rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.1] transition-all duration-300"
            >
              {/* Endpoint Header */}
              <div className="flex items-center gap-3 px-5 sm:px-7 py-4 sm:py-5 border-b border-white/[0.04]">
                <MethodBadge method={endpoint.method} />
                <code className="text-sm sm:text-base text-white/80 font-mono">{endpoint.path}</code>
              </div>

              <div className="px-5 sm:px-7 py-5 sm:py-6 space-y-5">
                <p className="text-sm text-white/50 leading-relaxed">{endpoint.description}</p>

                {/* Parameters */}
                {endpoint.params && endpoint.params.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Parametres</h4>
                    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/[0.04]">
                            <th className="text-left px-4 py-2.5 text-[11px] text-white/30 font-medium uppercase tracking-wider">Nom</th>
                            <th className="text-left px-4 py-2.5 text-[11px] text-white/30 font-medium uppercase tracking-wider">Type</th>
                            <th className="text-left px-4 py-2.5 text-[11px] text-white/30 font-medium uppercase tracking-wider hidden sm:table-cell">Requis</th>
                            <th className="text-left px-4 py-2.5 text-[11px] text-white/30 font-medium uppercase tracking-wider">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {endpoint.params.map((param) => (
                            <tr key={param.name} className="border-b border-white/[0.03] last:border-0">
                              <td className="px-4 py-2.5">
                                <code className="text-xs text-[#E50914] font-mono">{param.name}</code>
                              </td>
                              <td className="px-4 py-2.5">
                                <span className="text-xs text-blue-400/70">{param.type}</span>
                              </td>
                              <td className="px-4 py-2.5 hidden sm:table-cell">
                                {param.required ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">requis</span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/10">optionnel</span>
                                )}
                              </td>
                              <td className="px-4 py-2.5 text-xs text-white/40">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Response Example */}
                <div>
                  <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">Exemple de reponse</h4>
                  <div className="relative rounded-xl bg-black/40 border border-white/[0.06] overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
                      <span className="text-[10px] text-white/30 font-mono">application/json</span>
                    </div>
                    <pre className="p-4 text-xs text-white/60 font-mono overflow-x-auto leading-relaxed">
                      <code>{endpoint.response}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <div className="my-16 h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />

        <div className="rounded-2xl sm:rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <div className="px-5 sm:px-7 py-5 sm:py-6 border-b border-white/[0.04]">
            <h3 className="text-lg font-bold text-white font-playfair">
              Quick Start
            </h3>
          </div>
          <div className="px-5 sm:px-7 py-5 sm:py-6 space-y-5">
            <div>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">JavaScript / TypeScript</h4>
              <div className="rounded-xl bg-black/40 border border-white/[0.06] overflow-hidden">
                <div className="px-4 py-2 border-b border-white/[0.06]">
                  <span className="text-[10px] text-white/30 font-mono">fetch</span>
                </div>
                <pre className="p-4 text-xs text-white/60 font-mono overflow-x-auto leading-relaxed">
                  <code>{`// Liste des films
const res = await fetch('${BASE_URL}/films?limit=5&genre=DRAMA')
const { data, pagination } = await res.json()

console.log(data) // Film[]
console.log(pagination.total) // nombre total

// Detail d'un film par slug
const film = await fetch('${BASE_URL}/films/le-dernier-spectacle')
const { data: filmDetail } = await film.json()

// Statistiques de la plateforme
const stats = await fetch('${BASE_URL}/stats')
const { data: platformStats } = await stats.json()`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-3">cURL</h4>
              <div className="rounded-xl bg-black/40 border border-white/[0.06] overflow-hidden">
                <div className="px-4 py-2 border-b border-white/[0.06]">
                  <span className="text-[10px] text-white/30 font-mono">terminal</span>
                </div>
                <pre className="p-4 text-xs text-white/60 font-mono overflow-x-auto leading-relaxed">
                  <code>{`curl -s ${BASE_URL}/films | jq .
curl -s ${BASE_URL}/stats | jq .
curl -s "${BASE_URL}/contributors?limit=5" | jq .`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Limits & Notes */}
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <h4 className="text-sm font-semibold text-white/70 mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-400" />
              Rate Limiting
            </h4>
            <p className="text-xs text-white/40 leading-relaxed">
              L&apos;API est publique et n&apos;a pas de limite stricte actuellement.
              Un rate limiting sera ajoute dans une version future.
              Merci de ne pas depasser 60 requetes par minute.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <h4 className="text-sm font-semibold text-white/70 mb-2 flex items-center gap-2">
              <Code2 className="h-4 w-4 text-green-400" />
              Formats & Erreurs
            </h4>
            <p className="text-xs text-white/40 leading-relaxed">
              Toutes les reponses sont en JSON. En cas d&apos;erreur,
              le format est <code className="text-[#E50914]">{`{ "error": "message" }`}</code> avec le code HTTP
              correspondant (404, 500, etc.).
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#E50914] hover:bg-[#FF2D2D] text-white font-semibold transition-all duration-500 text-sm shadow-lg shadow-[#E50914]/20 hover:shadow-[#E50914]/30 hover:scale-[1.02]"
            >
              <Zap className="h-4 w-4" />
              Creer un Compte
            </Link>
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-white/[0.08] hover:border-[#E50914]/30 text-white/50 hover:text-white font-semibold transition-all duration-500 text-sm hover:bg-white/[0.02]"
            >
              Voir la Roadmap
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
