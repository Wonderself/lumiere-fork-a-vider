'use client'

import { useState } from 'react'
import { exportPersonalDataAction, requestAccountDeletionAction } from '@/app/actions/account'

export function AccountSettings() {
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    setExportError(null)
    try {
      const result = await exportPersonalDataAction()
      if (result.error) {
        setExportError(result.error)
        return
      }
      if (result.data) {
        // Download as JSON file
        const blob = new Blob([JSON.stringify(result.data, null, 2)], {
          type: 'application/json',
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `cinegen-donnees-personnelles-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch {
      setExportError('Une erreur est survenue lors de l\'exportation.')
    } finally {
      setExporting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteEmail.trim()) {
      setDeleteError('Veuillez entrer votre email.')
      return
    }
    setDeleting(true)
    setDeleteError(null)
    try {
      const result = await requestAccountDeletionAction(deleteEmail)
      if (result.error) {
        setDeleteError(result.error)
        return
      }
      if (result.success) {
        setDeleteSuccess(true)
        // Redirect to home after a delay
        setTimeout(() => {
          window.location.href = '/'
        }, 3000)
      }
    } catch {
      setDeleteError('Une erreur est survenue.')
    } finally {
      setDeleting(false)
    }
  }

  if (deleteSuccess) {
    return (
      <div className="bg-white/5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-6">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-500/10 mb-4">
            <svg className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Compte supprim&eacute;</h3>
          <p className="text-sm text-white/50">
            Vos donn&eacute;es personnelles ont &eacute;t&eacute; anonymis&eacute;es. Vous allez &ecirc;tre redirig&eacute;...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ── Data Export Card ── */}
      <div className="bg-white/5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-white/10 p-6 hover:shadow-md transition-shadow duration-300">
        <h3
          className="text-lg font-semibold text-white mb-2"
        >
          Exporter mes donn&eacute;es
        </h3>
        <p className="text-sm text-white/50 mb-4 leading-relaxed">
          T&eacute;l&eacute;chargez une copie de toutes vos donn&eacute;es personnelles au format JSON
          (RGPD Art. 20 — Droit &agrave; la portabilit&eacute;).
        </p>
        {exportError && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/15 text-sm text-red-400">
            {exportError}
          </div>
        )}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="
            inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
            bg-[#E50914]/10 text-[#E50914] border border-[#E50914]/20
            hover:bg-[#E50914]/20 hover:border-[#E50914]/30
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200 cursor-pointer
          "
        >
          {exporting ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Exportation en cours...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter mes donn&eacute;es
            </>
          )}
        </button>
      </div>

      {/* ── Account Deletion Card ── */}
      <div className="bg-white/5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.3)] border border-red-500/20 p-6 hover:shadow-md transition-shadow duration-300">
        <h3
          className="text-lg font-semibold text-white mb-2"
        >
          Supprimer mon compte
        </h3>
        <p className="text-sm text-white/50 mb-4 leading-relaxed">
          Cette action est <strong className="text-red-600">irr&eacute;versible</strong>. Vos donn&eacute;es personnelles
          seront anonymis&eacute;es. Vos contributions aux films seront conserv&eacute;es de mani&egrave;re anonyme
          (RGPD Art. 17 — Droit &agrave; l&apos;effacement).
        </p>

        {!showDeleteDialog ? (
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="
              inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
              text-red-400 border border-red-500/20 bg-red-500/10
              hover:bg-red-500/15 hover:border-red-500/30
              transition-all duration-200 cursor-pointer
            "
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Supprimer mon compte
          </button>
        ) : (
          <div className="space-y-4 p-4 rounded-xl bg-red-500/10 border border-red-500/15">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-red-300 mb-1">
                  Confirmez la suppression
                </p>
                <p className="text-xs text-red-400/80 mb-3">
                  Entrez votre adresse email pour confirmer. Cette action est d&eacute;finitive.
                </p>
                <input
                  type="email"
                  value={deleteEmail}
                  onChange={(e) => setDeleteEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="
                    w-full px-3 py-2 rounded-lg text-sm
                    border border-red-500/20 bg-white/5 text-white
                    placeholder:text-white/50
                    focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/30
                  "
                />
              </div>
            </div>

            {deleteError && (
              <div className="px-3 py-2 rounded-lg bg-red-500/15 border border-red-500/20 text-sm text-red-400">
                {deleteError}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting || !deleteEmail.trim()}
                className="
                  inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                  bg-red-600 text-white
                  hover:bg-red-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200 cursor-pointer
                "
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Suppression...
                  </>
                ) : (
                  'Confirmer la suppression'
                )}
              </button>
              <button
                onClick={() => {
                  setShowDeleteDialog(false)
                  setDeleteEmail('')
                  setDeleteError(null)
                }}
                className="
                  px-4 py-2 rounded-lg text-sm font-medium
                  text-white/60 hover:text-white/90
                  transition-colors duration-200 cursor-pointer
                "
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
