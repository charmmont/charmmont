'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Props {
  tool: any
  clients: any[]
  practitionerId: string
}

export default function AssignToolForm({ tool, clients, practitionerId }: Props) {
  const router = useRouter()
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [dueDate, setDueDate] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  function toggleClient(id: string) {
    setSelectedClients((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault()
    if (selectedClients.length === 0) {
      setError('Please select at least one client.')
      return
    }
    setError('')
    setStatus('loading')
    const supabase = createClient()

    const assignments = selectedClients.map((clientId) => ({
      tool_id: tool.id,
      client_id: clientId,
      assigned_by: practitionerId,
      due_date: dueDate || null,
      note: note || null,
      status: 'assigned',
    }))

    const { data: inserted, error: err } = await supabase
      .from('tool_assignments')
      .insert(assignments)
      .select('id, client_id')
    if (err) { setError(err.message); setStatus('error'); return }

    // Send notification emails (fire-and-forget, never blocks UI)
    for (const row of inserted ?? []) {
      const client = clients.find((c: any) => c.id === row.client_id)
      if (client?.profiles?.email) {
        fetch('/api/portal/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'tool_assigned',
            clientEmail:  client.profiles.email,
            clientName:   client.profiles.full_name ?? 'there',
            toolName:     tool.name,
            note:         note || null,
            assignmentId: row.id,
            clientId:     row.client_id,
          }),
        }).catch(() => {})
      }
    }

    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="max-w-md text-center py-12">
        <p
          className="text-2xl font-semibold text-[#2D4A3E] mb-3"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Tool assigned.
        </p>
        <p className="text-[#6B6B65] text-sm mb-8">
          The selected client(s) will now see this tool in their portal.
        </p>
        <Link
          href="/portal/toolbox"
          className="bg-[#2D4A3E] text-white px-6 py-2.5 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors"
        >
          Back to toolbox
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-md">
      <Link
        href="/portal/toolbox"
        className="text-sm text-[#6B6B65] hover:text-[#2D4A3E] transition-colors inline-flex items-center gap-2 mb-8"
      >
        ← Toolbox
      </Link>

      <h1
        className="text-2xl font-semibold text-[#1C1C1A] mb-2"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        Assign tool
      </h1>
      <p className="text-[#6B6B65] text-sm mb-8">{tool.name}</p>

      <form onSubmit={handleAssign} className="space-y-6">
        {/* Client selection */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="font-semibold text-[#1C1C1A] text-sm mb-4">Select client(s)</h2>
          {clients.length === 0 ? (
            <p className="text-[#6B6B65] text-sm italic">No active clients yet.</p>
          ) : (
            <div className="space-y-2">
              {clients.map((c: any) => (
                <label key={c.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedClients.includes(c.id)}
                    onChange={() => toggleClient(c.id)}
                    className="accent-[#2D4A3E] w-4 h-4"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1A]">{c.profiles?.full_name}</p>
                    <p className="text-xs text-[#6B6B65]">{c.profiles?.email}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Due date (optional)</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Note to client (optional)</label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors resize-none"
              placeholder="A message for the client about this tool..."
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-[#2D4A3E] text-white py-3 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
        >
          {status === 'loading' ? 'Assigning...' : 'Assign tool'}
        </button>
      </form>
    </div>
  )
}
