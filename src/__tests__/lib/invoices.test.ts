import { describe, it, expect } from 'vitest'
import {
  generateInvoiceNumber,
  generateInvoice,
  buildInvoiceData,
  PLATFORM_INFO,
} from '@/lib/invoices'

describe('generateInvoiceNumber', () => {
  it('returns string in correct format', () => {
    const num = generateInvoiceNumber('abc123def456')
    expect(num).toMatch(/^LB-\d{4}-\d{4}-[A-Z0-9]{6}$/)
  })

  it('uses last 6 chars of payment ID', () => {
    const num = generateInvoiceNumber('xyzABC123456')
    expect(num).toContain('123456')
  })

  it('uppercases the suffix', () => {
    const num = generateInvoiceNumber('abcdefabcdef')
    expect(num.split('-')[3]).toBe(num.split('-')[3].toUpperCase())
  })
})

describe('generateInvoice', () => {
  const sampleData = {
    invoiceNumber: 'LB-2026-0225-ABC123',
    date: '2026-02-25',
    platformName: 'CINEGENY Studio SAS',
    platformAddress: 'Paris, France',
    platformSiret: '000 000 000 00000',
    platformVat: 'FR00000000000',
    contributorName: 'Jean Dupont',
    contributorEmail: 'jean@test.com',
    contributorId: 'user-123',
    taskTitle: 'Scene VFX Compositing',
    filmTitle: 'MERCI',
    amount: 250,
    currency: 'EUR',
    method: 'STRIPE',
    status: 'PAID' as const,
    paidAt: '2026-02-25',
  }

  it('includes invoice header', () => {
    const invoice = generateInvoice(sampleData)
    expect(invoice).toContain('FACTURE / INVOICE')
  })

  it('includes invoice number', () => {
    const invoice = generateInvoice(sampleData)
    expect(invoice).toContain('LB-2026-0225-ABC123')
  })

  it('includes platform info', () => {
    const invoice = generateInvoice(sampleData)
    expect(invoice).toContain('CINEGENY Studio SAS')
    expect(invoice).toContain('Paris, France')
  })

  it('includes contributor info', () => {
    const invoice = generateInvoice(sampleData)
    expect(invoice).toContain('Jean Dupont')
    expect(invoice).toContain('jean@test.com')
  })

  it('includes task and film', () => {
    const invoice = generateInvoice(sampleData)
    expect(invoice).toContain('Scene VFX Compositing')
    expect(invoice).toContain('MERCI')
  })

  it('includes amount with 2 decimals', () => {
    const invoice = generateInvoice(sampleData)
    expect(invoice).toContain('250.00 EUR')
  })

  it('shows PAYÉE for PAID status', () => {
    const invoice = generateInvoice(sampleData)
    expect(invoice).toContain('PAYÉE')
  })

  it('shows EN ATTENTE for PENDING status', () => {
    const invoice = generateInvoice({ ...sampleData, status: 'PENDING', paidAt: undefined })
    expect(invoice).toContain('EN ATTENTE')
  })

  it('includes TVA auto-liquidation note', () => {
    const invoice = generateInvoice(sampleData)
    expect(invoice).toContain('auto-liquidation')
  })
})

describe('buildInvoiceData', () => {
  it('builds complete invoice data', () => {
    const data = buildInvoiceData({
      paymentId: 'pay-abc123def456',
      contributorName: 'Marie',
      contributorEmail: 'marie@test.com',
      contributorId: 'uid-1',
      taskTitle: 'Montage',
      filmTitle: 'KETER',
      amount: 500,
      method: 'STRIPE',
      status: 'PAID',
      paidAt: new Date('2026-02-25'),
    })

    expect(data.platformName).toBe(PLATFORM_INFO.name)
    expect(data.contributorName).toBe('Marie')
    expect(data.amount).toBe(500)
    expect(data.currency).toBe('EUR')
    expect(data.invoiceNumber).toMatch(/^LB-/)
    expect(data.paidAt).toBe('2026-02-25')
  })

  it('handles null paidAt', () => {
    const data = buildInvoiceData({
      paymentId: 'pay-abc123def456',
      contributorName: 'X',
      contributorEmail: 'x@t.com',
      contributorId: 'uid',
      taskTitle: 'T',
      filmTitle: 'F',
      amount: 10,
      method: 'LUMENS',
      status: 'PENDING',
      paidAt: null,
    })
    expect(data.paidAt).toBeUndefined()
  })
})

describe('PLATFORM_INFO', () => {
  it('has required fields', () => {
    expect(PLATFORM_INFO.name).toBe('CINEGENY Studio SAS')
    expect(PLATFORM_INFO.address).toBeDefined()
    expect(PLATFORM_INFO.siret).toBeDefined()
    expect(PLATFORM_INFO.vat).toBeDefined()
  })
})
