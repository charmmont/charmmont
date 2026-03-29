'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  clients: any[]
}

export default function LogSessionForm({ clients }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    client_id: '',
    session_date: new Date().toISOString().split('T')[0],
    duration_minutes: 60,
    notes_practitioner: '',
    notes_shared: '',
    next_steps: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.client_id) return
    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.from('sessions').insert({
      ...form,
      duration_minutes: Number(form.duration_minutes),
    })
    if (error) { setStatus('error'); return }
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-[#2D4A3E] text-white px-4 py-2 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors"
      >
        + Log session
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20 overflow-y-auto py-8">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg my-auto">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg font-semibold text-[#1C1C1A]"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Log a session
              </h2>
              <button onClick={() => setOpen(false)} className="text-[#6B6B65] hover:text-[#2D4A3E]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Client</label>
                <select
                  name="client_id"
                  value={form.client_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors bg-white"
                >
                  <option value="">Select a client</option>
                  {clients.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.profiles?.full_name ?? c.id}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Date</label>
                  <input
                    type="date"
                    name="session_date"
                    value={form.session_date}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Duration (min)</label>
                  <input
                    type="number"
                    name="duration_minutes"
                    value={form.duration_minutes}
                    onChange={handleChange}
                    min={15}
                    max={180}
                    required
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Private notes</label>
                <textarea
                  name="notes_practitioner"
                  value={form.notes_practitioner}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors resize-none"
                  placeholder="Not visible to client..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Shared notes</label>
                <textarea
                  name="notes_shared"
                  value={form.notes_shared}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors resize-none"
                  placeholder="Visible to client..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Next steps / homework</label>
                <textarea
                  name="next_steps"
                  value={form.next_steps}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors resize-none"
                  placeholder="Actions for next session..."
                />
              </div>

              {status === 'error' && (
                <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#2D4A3E] text-white py-3 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
              >
                {status === 'loading' ? 'Saving...' : 'Log session'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
