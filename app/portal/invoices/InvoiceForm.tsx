'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface LineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
}

interface Props {
  clients: { id: string; full_name: string }[]
  initialInvoice?: any
}

const VAT_RATES = [0, 5, 20]

function generateId() {
  return Math.random().toString(36).slice(2)
}

function generateInvoiceNumber() {
  const year = new Date().getFullYear()
  const rand = Math.floor(1000 + Math.random() * 9000)
  return `INV-${year}-${rand}`
}

export default function InvoiceForm({ clients, initialInvoice }: Props) {
  const router = useRouter()
  const isEdit = !!initialInvoice

  const [clientId, setClientId] = useState(initialInvoice?.client_id ?? (clients[0]?.id ?? ''))
  const [invoiceNumber] = useState(initialInvoice?.invoice_number ?? generateInvoiceNumber())
  const [invoiceDate, setInvoiceDate] = useState(
    initialInvoice?.invoice_date ?? new Date().toISOString().slice(0, 10)
  )
  const [dueDate, setDueDate] = useState(
    initialInvoice?.due_date ?? (() => {
      const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().slice(0, 10)
    })()
  )
  const [lineItems, setLineItems] = useState<LineItem[]>(
    initialInvoice?.line_items?.length > 0
      ? initialInvoice.line_items
      : [{ id: generateId(), description: '', quantity: 1, unit_price: 0 }]
  )
  const [vatRate, setVatRate] = useState<number>(initialInvoice?.vat_rate ?? 0)
  const [notes, setNotes] = useState(initialInvoice?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const subtotal = lineItems.reduce((sum, l) => sum + l.quantity * l.unit_price, 0)
  const vatAmount = subtotal * (vatRate / 100)
  const total = subtotal + vatAmount

  function addLine() {
    setLineItems([...lineItems, { id: generateId(), description: '', quantity: 1, unit_price: 0 }])
  }

  function updateLine(id: string, updates: Partial<LineItem>) {
    setLineItems(lineItems.map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }

  function removeLine(id: string) {
    if (lineItems.length === 1) return
    setLineItems(lineItems.filter((l) => l.id !== id))
  }

  async function handleSave(status: 'draft' | 'sent') {
    if (!clientId) { setError('Please select a client.'); return }
    const hasEmptyLine = lineItems.some((l) => !l.description.trim())
    if (hasEmptyLine) { setError('All line items must have a description.'); return }
    setError('')
    setSaving(true)

    const supabase = createClient()
    const payload = {
      client_id: clientId,
      invoice_number: invoiceNumber,
      invoice_date: invoiceDate,
      due_date: dueDate || null,
      line_items: lineItems,
      subtotal,
      vat_rate: vatRate,
      total,
      notes: notes.trim() || null,
      status,
    }

    if (isEdit) {
      const { error: err } = await supabase.from('invoices').update(payload).eq('id', initialInvoice.id)
      if (err) { setError(err.message); setSaving(false); return }
      router.push(`/portal/invoices/${initialInvoice.id}`)
    } else {
      const { data, error: err } = await supabase.from('invoices').insert(payload).select('id').single()
      if (err) { setError(err.message); setSaving(false); return }
      router.push(`/portal/invoices/${data.id}`)
    }
    router.refresh()
  }

  const inputCls = 'border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors'

  return (
    <div className="max-w-2xl space-y-6">
      {/* Meta */}
      <div className="bg-white rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">Invoice number</label>
            <p className="text-sm font-mono text-[#1C1C1A] py-3">{invoiceNumber}</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className={`w-full ${inputCls} bg-white`}
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.full_name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">Invoice date</label>
            <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className={`w-full ${inputCls}`} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">Due date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={`w-full ${inputCls}`} />
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-[#1C1C1A]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Line items
          </h2>
          <button
            onClick={addLine}
            className="text-xs bg-[#2D4A3E] text-white px-3 py-1.5 rounded-full hover:bg-[#7A9E8E] transition-colors"
          >
            + Add line
          </button>
        </div>

        <div className="space-y-3 mb-4">
          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_100px_28px] gap-3 text-xs text-[#6B6B65] font-medium pb-1">
            <span>Description</span>
            <span>Qty</span>
            <span>Unit price (£)</span>
            <span />
          </div>
          {lineItems.map((line) => (
            <div key={line.id} className="grid grid-cols-[1fr_80px_100px_28px] gap-3 items-center">
              <input
                type="text"
                value={line.description}
                onChange={(e) => updateLine(line.id, { description: e.target.value })}
                className={`${inputCls} py-2`}
                placeholder="e.g. Coaching session"
              />
              <input
                type="number"
                min={0.5}
                step={0.5}
                value={line.quantity}
                onChange={(e) => updateLine(line.id, { quantity: Number(e.target.value) })}
                className={`${inputCls} py-2 text-center`}
              />
              <input
                type="number"
                min={0}
                step={0.01}
                value={line.unit_price}
                onChange={(e) => updateLine(line.id, { unit_price: Number(e.target.value) })}
                className={`${inputCls} py-2`}
                placeholder="0.00"
              />
              <button
                onClick={() => removeLine(line.id)}
                disabled={lineItems.length === 1}
                className="text-red-400 hover:text-red-600 disabled:opacity-20 text-sm"
              >✕</button>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-[#2D4A3E]/10 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#6B6B65]">Subtotal</span>
            <span className="font-medium">£{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6B6B65]">VAT</span>
              <select
                value={vatRate}
                onChange={(e) => setVatRate(Number(e.target.value))}
                className="border border-[#2D4A3E]/20 rounded-lg px-2 py-1 text-xs bg-white outline-none focus:border-[#2D4A3E]"
              >
                {VAT_RATES.map((r) => (
                  <option key={r} value={r}>{r === 0 ? 'No VAT' : `${r}%`}</option>
                ))}
              </select>
            </div>
            <span className="text-sm font-medium">£{vatAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold border-t border-[#2D4A3E]/10 pt-2">
            <span>Total</span>
            <span className="text-[#2D4A3E]">£{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl p-6">
        <label className="block text-sm font-medium text-[#1C1C1A] mb-2">Notes <span className="text-[#6B6B65] font-normal">(optional)</span></label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={`w-full ${inputCls} resize-none`}
          placeholder="Payment instructions, bank details, thank you note…"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => handleSave('draft')}
          disabled={saving}
          className="flex-1 border border-[#2D4A3E]/20 text-[#2D4A3E] py-3 rounded-full text-sm hover:bg-[#2D4A3E]/5 transition-colors disabled:opacity-60"
        >
          Save as draft
        </button>
        <button
          onClick={() => handleSave('sent')}
          disabled={saving}
          className="flex-1 bg-[#2D4A3E] text-white py-3 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : isEdit ? 'Save & mark sent' : 'Create & mark sent'}
        </button>
      </div>
    </div>
  )
}
