'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { VAT_RATES, INVOICE_STATUSES, BUSINESS_AGENTS } from '@/data/business-tools'
import {
  FileText, Plus, DollarSign, Loader2, Download,
  Send, CheckCircle2, Clock, AlertTriangle, Bot,
  Calculator, Trash2, Eye,
} from 'lucide-react'

interface InvoiceLine { description: string; quantity: number; unitPrice: number }
interface Invoice {
  id: string; number: string; clientName: string; clientEmail: string
  lines: InvoiceLine[]; vatRate: number; status: string; date: string; dueDate: string
}

export default function InvoicingPage() {
  const [view, setView] = useState<'list' | 'create'>('list')
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [lines, setLines] = useState<InvoiceLine[]>([{ description: '', quantity: 1, unitPrice: 0 }])
  const [selectedVat, setSelectedVat] = useState('fr-standard')
  const [generating, setGenerating] = useState(false)

  const vatConfig = VAT_RATES.find(v => v.id === selectedVat) || VAT_RATES[0]
  const subtotal = lines.reduce((sum, l) => sum + l.quantity * l.unitPrice, 0)
  const vatAmount = subtotal * (vatConfig.rate / 100)
  const total = subtotal + vatAmount

  function addLine() { setLines(p => [...p, { description: '', quantity: 1, unitPrice: 0 }]) }
  function removeLine(i: number) { setLines(p => p.filter((_, idx) => idx !== i)) }
  function updateLine(i: number, field: keyof InvoiceLine, value: string | number) {
    setLines(p => p.map((l, idx) => idx === i ? { ...l, [field]: value } : l))
  }

  function createInvoice() {
    if (!clientName.trim()) { toast.error('Nom client requis'); return }
    if (lines.every(l => !l.description.trim())) { toast.error('Au moins une ligne'); return }
    setGenerating(true)
    setTimeout(() => {
      const now = new Date()
      const due = new Date(Date.now() + 30 * 86400000)
      const inv: Invoice = {
        id: `inv-${Date.now()}`,
        number: `CG-${now.getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`,
        clientName, clientEmail,
        lines: lines.filter(l => l.description.trim()),
        vatRate: vatConfig.rate,
        status: 'draft',
        date: now.toISOString().split('T')[0],
        dueDate: due.toISOString().split('T')[0],
      }
      setInvoices(p => [inv, ...p])
      setClientName(''); setClientEmail(''); setLines([{ description: '', quantity: 1, unitPrice: 0 }])
      setView('list'); setGenerating(false)
      toast.success(`Facture ${inv.number} créée`)
    }, 1000)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)]">Facturation</h1>
          <p className="text-sm text-white/50 mt-1">Devis, factures, TVA automatique, suivi paiements</p>
        </div>
        <button onClick={() => setView(view === 'list' ? 'create' : 'list')} className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] text-white text-xs font-medium rounded-lg hover:bg-[#FF2D2D]">
          {view === 'list' ? <><Plus className="h-4 w-4" />Nouvelle facture</> : 'Retour à la liste'}
        </button>
      </div>

      {/* Agent */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 w-fit">
        <Bot className="h-3.5 w-3.5" style={{ color: BUSINESS_AGENTS[3].color }} />
        <div><p className="text-[10px] font-medium text-white">{BUSINESS_AGENTS[3].name}</p><p className="text-[9px] text-white/50">{BUSINESS_AGENTS[3].role}</p></div>
      </div>

      {/* CREATE */}
      {view === 'create' && (
        <div className="space-y-5 max-w-2xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white">Informations client</h2>
            <div className="grid grid-cols-2 gap-3">
              <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nom / Société *" className="rounded-lg border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none" />
              <input value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="Email" className="rounded-lg border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white">Lignes</h2>
            {lines.map((line, i) => (
              <div key={i} className="flex gap-2 items-end">
                <div className="flex-1"><input value={line.description} onChange={e => updateLine(i, 'description', e.target.value)} placeholder="Description" className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm focus:border-[#E50914] focus:outline-none" /></div>
                <div className="w-20"><input type="number" value={line.quantity} onChange={e => updateLine(i, 'quantity', parseInt(e.target.value) || 1)} className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-center focus:outline-none" /></div>
                <div className="w-28"><input type="number" value={line.unitPrice} onChange={e => updateLine(i, 'unitPrice', parseFloat(e.target.value) || 0)} placeholder="Prix €" className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm text-right focus:outline-none" /></div>
                <p className="w-24 text-sm font-medium text-right text-white">{(line.quantity * line.unitPrice).toFixed(2)} €</p>
                {lines.length > 1 && <button onClick={() => removeLine(i)} className="text-white/50 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>}
              </div>
            ))}
            <button onClick={addLine} className="text-xs text-[#E50914] hover:underline flex items-center gap-1"><Plus className="h-3.5 w-3.5" />Ajouter une ligne</button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="text-xs text-white/50 mb-1 block">TVA</label>
                <select value={selectedVat} onChange={e => setSelectedVat(e.target.value)} className="rounded-lg border border-white/10 px-3 py-2 text-sm">
                  {VAT_RATES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                </select>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs text-white/50">Sous-total: <span className="font-medium text-white">{subtotal.toFixed(2)} €</span></p>
                <p className="text-xs text-white/50">TVA ({vatConfig.rate}%): <span className="font-medium text-white">{vatAmount.toFixed(2)} €</span></p>
                <p className="text-lg font-bold text-[#E50914]">{total.toFixed(2)} €</p>
              </div>
            </div>
            <button onClick={createInvoice} disabled={generating} className="w-full flex items-center justify-center gap-2 py-3 bg-[#E50914] text-white font-semibold rounded-xl disabled:opacity-50">
              {generating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Calculator className="h-5 w-5" />}
              {generating ? 'Création...' : `Créer la facture (${total.toFixed(2)} €)`}
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      {view === 'list' && (
        <div>
          {invoices.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
              <FileText className="h-10 w-10 text-white/50 mx-auto mb-3" />
              <p className="text-sm text-white/50">Aucune facture</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <div className="divide-y divide-white/10">
                {invoices.map(inv => {
                  const st = INVOICE_STATUSES.find(s => s.id === inv.status) || INVOICE_STATUSES[0]
                  const invTotal = inv.lines.reduce((s, l) => s + l.quantity * l.unitPrice, 0) * (1 + inv.vatRate / 100)
                  return (
                    <div key={inv.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03]">
                      <FileText className="h-5 w-5 text-[#E50914]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{inv.number}</p>
                        <p className="text-[10px] text-white/50">{inv.clientName} · {inv.date}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${st.color}15`, color: st.color }}>{st.label}</span>
                      <p className="text-sm font-bold text-white">{invTotal.toFixed(2)} €</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
