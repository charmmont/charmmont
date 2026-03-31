'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Props {
  invoice: any
  clients: { id: string; full_name: string }[]
  practitionerName: string
}

const STATUS_STYLES: Record<string, string> = {
  draft:   'bg-[#6B6B65]/10 text-[#6B6B65]',
  sent:    'bg-blue-100 text-blue-700',
  paid:    'bg-[#2D4A3E]/10 text-[#2D4A3E]',
  overdue: 'bg-red-100 text-red-600',
}

const NEXT_STATUSES: Record<string, { label: string; value: string }[]> = {
  draft:   [{ label: 'Mark as sent', value: 'sent' }],
  sent:    [{ label: 'Mark as paid', value: 'paid' }, { label: 'Mark as overdue', value: 'overdue' }],
  overdue: [{ label: 'Mark as paid', value: 'paid' }],
  paid:    [],
}

export default function InvoiceDetailClient({ invoice, clients, practitionerName }: Props) {
  const router = useRouter()
  const [status, setStatus] = useState(invoice.status)
  const [updating, setUpdating] = useState(false)

  const clientName = invoice.clients?.profiles?.full_name ?? 'Client'
  const clientEmail = invoice.clients?.profiles?.email ?? ''
  const lineItems: any[] = invoice.line_items ?? []
  const subtotal = Number(invoice.subtotal)
  const vatRate = Number(invoice.vat_rate)
  const total = Number(invoice.total)
  const vatAmount = subtotal * (vatRate / 100)

  async function updateStatus(newStatus: string) {
    setUpdating(true)
    const supabase = createClient()
    const updates: any = { status: newStatus }
    if (newStatus === 'paid') updates.paid_at = new Date().toISOString()
    await supabase.from('invoices').update(updates).eq('id', invoice.id)
    setStatus(newStatus)
    setUpdating(false)
    router.refresh()
  }

  async function deleteInvoice() {
    if (!confirm('Delete this invoice? This cannot be undone.')) return
    const supabase = createClient()
    await supabase.from('invoices').delete().eq('id', invoice.id)
    router.push('/portal/invoices')
    router.refresh()
  }

  return (
    <div>
      {/* Actions bar — hidden on print */}
      <div className="flex flex-wrap items-center gap-3 mb-8 print:hidden">
        <div className="flex items-center gap-2 mr-auto">
          <span className={`text-sm px-3 py-1 rounded-full ${STATUS_STYLES[status] ?? STATUS_STYLES.draft}`}>
            {status}
          </span>
          {status === 'paid' && invoice.paid_at && (
            <span className="text-xs text-[#6B6B65]">
              Paid {new Date(invoice.paid_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>

        {(NEXT_STATUSES[status] ?? []).map((action) => (
          <button
            key={action.value}
            onClick={() => updateStatus(action.value)}
            disabled={updating}
            className="text-sm border border-[#2D4A3E]/20 text-[#2D4A3E] px-4 py-2 rounded-full hover:bg-[#2D4A3E]/5 transition-colors disabled:opacity-60"
          >
            {action.label}
          </button>
        ))}

        <button
          onClick={() => window.print()}
          className="text-sm bg-[#2D4A3E] text-white px-4 py-2 rounded-full hover:bg-[#7A9E8E] transition-colors"
        >
          Print / Save PDF
        </button>

        <Link
          href={`/portal/invoices/${invoice.id}/edit`}
          className="text-sm text-[#6B6B65] hover:text-[#2D4A3E] transition-colors"
        >
          Edit
        </Link>

        {status === 'draft' && (
          <button
            onClick={deleteInvoice}
            className="text-sm text-red-400 hover:text-red-600 transition-colors"
          >
            Delete
          </button>
        )}
      </div>

      {/* Invoice document — print-friendly */}
      <div className="bg-white rounded-2xl p-10 max-w-2xl print:rounded-none print:shadow-none print:p-0 print:max-w-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1
              className="text-3xl font-semibold text-[#2D4A3E] mb-1"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Deepbloom
            </h1>
            <p className="text-sm text-[#6B6B65]">{practitionerName}</p>
            <p className="text-sm text-[#6B6B65]">hello@deepbloom.me</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#1C1C1A] font-mono">{invoice.invoice_number}</p>
            <p className="text-xs text-[#6B6B65] mt-1">
              Issued {new Date(invoice.invoice_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {invoice.due_date && (
              <p className="text-xs text-[#6B6B65]">
                Due {new Date(invoice.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>

        {/* Bill to */}
        <div className="mb-8">
          <p className="text-xs font-medium text-[#6B6B65] uppercase tracking-wide mb-2">Bill to</p>
          <p className="text-sm font-semibold text-[#1C1C1A]">{clientName}</p>
          {clientEmail && <p className="text-sm text-[#6B6B65]">{clientEmail}</p>}
        </div>

        {/* Line items */}
        <table className="w-full mb-6 text-sm">
          <thead>
            <tr className="border-b border-[#2D4A3E]/20">
              <th className="text-left text-xs text-[#6B6B65] font-medium py-2 pr-4">Description</th>
              <th className="text-center text-xs text-[#6B6B65] font-medium py-2 px-4 w-16">Qty</th>
              <th className="text-right text-xs text-[#6B6B65] font-medium py-2 px-4 w-24">Unit price</th>
              <th className="text-right text-xs text-[#6B6B65] font-medium py-2 pl-4 w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((line: any, idx: number) => (
              <tr key={idx} className="border-b border-[#2D4A3E]/5">
                <td className="py-3 pr-4 text-[#1C1C1A]">{line.description}</td>
                <td className="py-3 px-4 text-center text-[#6B6B65]">{line.quantity}</td>
                <td className="py-3 px-4 text-right text-[#6B6B65]">£{Number(line.unit_price).toFixed(2)}</td>
                <td className="py-3 pl-4 text-right font-medium">£{(line.quantity * line.unit_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-56 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6B6B65]">Subtotal</span>
              <span>£{subtotal.toFixed(2)}</span>
            </div>
            {vatRate > 0 && (
              <div className="flex justify-between">
                <span className="text-[#6B6B65]">VAT ({vatRate}%)</span>
                <span>£{vatAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-base border-t border-[#2D4A3E]/20 pt-2">
              <span>Total</span>
              <span className="text-[#2D4A3E]">£{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-8 pt-6 border-t border-[#2D4A3E]/10">
            <p className="text-xs font-medium text-[#6B6B65] uppercase tracking-wide mb-2">Notes</p>
            <p className="text-sm text-[#6B6B65] whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-[#2D4A3E]/10 text-xs text-[#6B6B65] text-center">
          Thank you for working with Deepbloom · deepbloom.me
        </div>
      </div>
    </div>
  )
}
