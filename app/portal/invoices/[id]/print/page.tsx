import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import InvoicePrintTrigger from './InvoicePrintTrigger'

interface Props {
  params: Promise<{ id: string }>
}

export default async function InvoicePrintPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  // Allow both practitioner and the invoice's client
  const { data: profile } = await supabase
    .from('profiles').select('role, full_name').eq('id', user.id).single()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, clients(id, profile_id, profiles(full_name, email))')
    .eq('id', id)
    .single()

  if (!invoice) notFound()

  // Access check: practitioner or the client whose invoice this is
  const isPractitioner = profile?.role === 'practitioner'
  const isOwner = (invoice as any).clients?.profile_id === user.id
  if (!isPractitioner && !isOwner) notFound()

  const lineItems: any[] = invoice.line_items ?? []
  const subtotal = Number(invoice.subtotal)
  const vatRate = Number(invoice.vat_rate)
  const vatAmount = subtotal * (vatRate / 100)
  const total = Number(invoice.total)
  const clientName = (invoice as any).clients?.profiles?.full_name ?? 'Client'
  const clientEmail = (invoice as any).clients?.profiles?.email ?? ''

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Invoice {invoice.invoice_number} — Deepbloom</title>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: Georgia, serif;
            background: #FAF7F2;
            color: #1C1C1A;
            font-size: 13px;
            line-height: 1.5;
          }
          .page {
            max-width: 720px;
            margin: 0 auto;
            padding: 48px 40px;
            background: #fff;
            min-height: 100vh;
          }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 48px; }
          .brand { font-size: 26px; font-weight: 700; color: #2D4A3E; }
          .brand-sub { font-size: 13px; color: #6B6B65; margin-top: 4px; }
          .inv-number { font-size: 22px; font-weight: 700; font-family: monospace; text-align: right; }
          .inv-date { font-size: 12px; color: #6B6B65; text-align: right; margin-top: 4px; }
          .bill-to { margin-bottom: 32px; }
          .label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #6B6B65; margin-bottom: 6px; }
          .bill-name { font-weight: 600; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th { text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6B6B65; padding: 8px 0; border-bottom: 1px solid #2D4A3E30; }
          th.r, td.r { text-align: right; }
          th.c, td.c { text-align: center; }
          td { padding: 10px 0; border-bottom: 1px solid #2D4A3E10; font-size: 13px; }
          .totals { display: flex; justify-content: flex-end; }
          .totals-inner { width: 200px; }
          .total-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 13px; }
          .total-row.main { font-size: 16px; font-weight: 700; color: #2D4A3E; border-top: 1px solid #2D4A3E20; padding-top: 10px; margin-top: 4px; }
          .notes { margin-top: 40px; padding-top: 24px; border-top: 1px solid #2D4A3E15; }
          .notes-body { font-size: 13px; color: #6B6B65; white-space: pre-wrap; }
          .footer { margin-top: 56px; text-align: center; font-size: 11px; color: #6B6B65; }
          .screen-bar { display: flex; align-items: center; justify-content: space-between; padding: 12px 24px; background: #2D4A3E; color: #fff; font-size: 13px; }
          .screen-bar a { color: #fff; text-decoration: none; opacity: 0.7; }
          .screen-bar button { background: rgba(255,255,255,0.2); color: #fff; border: none; cursor: pointer; padding: 6px 16px; border-radius: 100px; font-size: 13px; }
          @media print {
            .screen-bar { display: none; }
            body { background: #fff; }
            .page { padding: 24px; }
          }
        `}</style>
      </head>
      <body>
        <InvoicePrintTrigger />

        {/* Screen-only bar */}
        <div className="screen-bar">
          <span>Invoice {invoice.invoice_number}</span>
          <button onClick={() => {}} id="print-btn">Save as PDF / Print</button>
        </div>

        <div className="page">
          {/* Header */}
          <div className="header">
            <div>
              <div className="brand">Deepbloom</div>
              <div className="brand-sub">{profile?.full_name}</div>
              <div className="brand-sub">hello@deepbloom.me</div>
            </div>
            <div>
              <div className="inv-number">{invoice.invoice_number}</div>
              <div className="inv-date">
                Issued {new Date(invoice.invoice_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              {invoice.due_date && (
                <div className="inv-date">
                  Due {new Date(invoice.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              )}
            </div>
          </div>

          {/* Bill to */}
          <div className="bill-to">
            <div className="label">Bill to</div>
            <div className="bill-name">{clientName}</div>
            {clientEmail && <div style={{ color: '#6B6B65' }}>{clientEmail}</div>}
          </div>

          {/* Line items */}
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th className="c" style={{ width: 60 }}>Qty</th>
                <th className="r" style={{ width: 100 }}>Unit price</th>
                <th className="r" style={{ width: 100 }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((line: any, i: number) => (
                <tr key={i}>
                  <td>{line.description}</td>
                  <td className="c" style={{ color: '#6B6B65' }}>{line.quantity}</td>
                  <td className="r" style={{ color: '#6B6B65' }}>£{Number(line.unit_price).toFixed(2)}</td>
                  <td className="r" style={{ fontWeight: 500 }}>£{(line.quantity * line.unit_price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="totals">
            <div className="totals-inner">
              <div className="total-row">
                <span style={{ color: '#6B6B65' }}>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              {vatRate > 0 && (
                <div className="total-row">
                  <span style={{ color: '#6B6B65' }}>VAT ({vatRate}%)</span>
                  <span>£{vatAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="total-row main">
                <span>Total</span>
                <span>£{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="notes">
              <div className="label">Notes</div>
              <div className="notes-body">{invoice.notes}</div>
            </div>
          )}

          <div className="footer">
            Thank you for working with Deepbloom · deepbloom.me
          </div>
        </div>
      </body>
    </html>
  )
}
