import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Invoice' }

const STATUS_STYLES: Record<string, string> = {
  sent:    'bg-blue-100 text-blue-700',
  paid:    'bg-[#2D4A3E]/10 text-[#2D4A3E]',
  overdue: 'bg-red-100 text-red-600',
}

export default async function ClientInvoiceDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'practitioner') redirect('/portal/dashboard')

  const { data: clientRecord } = await supabase
    .from('clients').select('id').eq('profile_id', user.id).single()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', id)
    .eq('client_id', clientRecord?.id ?? '')
    .neq('status', 'draft')
    .single()

  if (!invoice) notFound()

  const lineItems: any[] = invoice.line_items ?? []
  const subtotal = Number(invoice.subtotal)
  const vatRate = Number(invoice.vat_rate)
  const vatAmount = subtotal * (vatRate / 100)
  const total = Number(invoice.total)

  return (
    <PortalShell role="client" name={profile?.full_name ?? user.email ?? ''}>
      <Link
        href="/portal/my-space/invoices"
        className="text-sm text-[#6B6B65] hover:text-[#2D4A3E] transition-colors inline-flex items-center gap-2 mb-8"
      >
        ← My Invoices
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <span className={`text-sm px-3 py-1 rounded-full mr-auto ${STATUS_STYLES[invoice.status] ?? 'bg-[#6B6B65]/10 text-[#6B6B65]'}`}>
          {invoice.status}
          {invoice.status === 'paid' && invoice.paid_at && (
            <> · Paid {new Date(invoice.paid_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</>
          )}
        </span>
        <a
          href={`/portal/invoices/${invoice.id}/print`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm bg-[#2D4A3E] text-white px-4 py-2 rounded-full hover:bg-[#7A9E8E] transition-colors"
        >
          Download PDF
        </a>
      </div>

      {/* Invoice document */}
      <div className="bg-white rounded-2xl p-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-2xl font-semibold text-[#2D4A3E]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
              Deepbloom
            </p>
            <p className="text-sm text-[#6B6B65] mt-1">hello@deepbloom.me</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold font-mono text-[#1C1C1A]">{invoice.invoice_number}</p>
            <p className="text-xs text-[#6B6B65] mt-1">
              {new Date(invoice.invoice_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            {invoice.due_date && invoice.status !== 'paid' && (
              <p className="text-xs text-[#6B6B65]">
                Due {new Date(invoice.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>

        {/* Line items */}
        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="border-b border-[#2D4A3E]/20">
              <th className="text-left text-xs text-[#6B6B65] font-medium py-2 pr-4">Description</th>
              <th className="text-center text-xs text-[#6B6B65] font-medium py-2 w-14">Qty</th>
              <th className="text-right text-xs text-[#6B6B65] font-medium py-2 px-4 w-24">Unit</th>
              <th className="text-right text-xs text-[#6B6B65] font-medium py-2 pl-4 w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((line: any, i: number) => (
              <tr key={i} className="border-b border-[#2D4A3E]/5">
                <td className="py-3 pr-4 text-[#1C1C1A]">{line.description}</td>
                <td className="py-3 text-center text-[#6B6B65]">{line.quantity}</td>
                <td className="py-3 px-4 text-right text-[#6B6B65]">£{Number(line.unit_price).toFixed(2)}</td>
                <td className="py-3 pl-4 text-right font-medium">£{(line.quantity * line.unit_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-52 space-y-2 text-sm">
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

        {invoice.notes && (
          <div className="mt-8 pt-6 border-t border-[#2D4A3E]/10">
            <p className="text-xs font-medium text-[#6B6B65] uppercase tracking-wide mb-2">Notes</p>
            <p className="text-sm text-[#6B6B65] whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-[#2D4A3E]/10 text-xs text-[#6B6B65] text-center">
          Thank you for working with Deepbloom · deepbloom.me
        </div>
      </div>
    </PortalShell>
  )
}
