'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  clients: any[]
  defaultClientId?: string
}

const DURATIONS = [15, 30, 45, 60, 75, 90]

export default function LogSessionForm({ clients, defaultClientId }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    client_id: defaultClientId ?? '',
    session_date: new Date().toISOString().split('T')[0],
    duration_minutes: 60,
    session_type: 'video',
    notes_practitioner: '',
    notes_shared: '',
    next_steps: '',
    homework: '',
    flag_followup: false,
    status: 'complete',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.client_id) return
    setStatus('loading')
    const supabase = createClient()
    const { error } = await supabase.from('sessions').insert({
      client_id: form.client_id,
      session_date: form.session_date,
      duration_minutes: Number(form.duration_minutes),
      session_type: form.session_type,
      notes_practitioner: form.notes_practitioner,
      notes_shared: form.notes_shared,
      next_steps: form.next_steps,
      homework: form.homework,
      flag_followup: form.flag_followup,
      status: form.status,
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
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 bg-black/20 overflow-y-auto py-8">
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
              {/* Client */}
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Client</label>
                <select
                  name="client_id"
                  value={form.client_id}
                  onChange={handleChange}
                  required
                  className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] bg-white"
                >
                  <option value="">Select a client</option>
                  {clients.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.profiles?.full_name ?? c.id}</option>
                  ))}
                </select>
              </div>

              {/* Date + Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Date</label>
                  <input
                    type="date"
                    name="session_date"
                    value={form.session_date}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Type</label>
                  <select
                    name="session_type"
                    value={form.session_type}
                    onChange={handleChange}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] bg-white"
                  >
                    <option value="video">Video</option>
                    <option value="phone">Phone</option>
                    <option value="in_person">In person</option>
                  </select>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Duration</label>
                <div className="flex gap-2 flex-wrap">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setForm({ ...form, duration_minutes: d })}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                        form.duration_minutes === d
                          ? 'bg-[#2D4A3E] text-white border-[#2D4A3E]'
                          : 'border-[#2D4A3E]/20 text-[#6B6B65] hover:border-[#2D4A3E]/40'
                      }`}
                    >
                      {d}m
                    </button>
                  ))}
                  <input
                    type="number"
                    name="duration_minutes"
                    value={DURATIONS.includes(form.duration_minutes) ? '' : form.duration_minutes}
                    onChange={handleChange}
                    min={5}
                    max={240}
                    placeholder="Custom"
                    className="w-20 border border-[#2D4A3E]/20 rounded-full px-3 py-1.5 text-sm outline-none focus:border-[#2D4A3E] text-center"
                  />
                </div>
              </div>

              {/* Private notes */}
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                  Private notes <span className="text-[#6B6B65] font-normal">(not visible to client)</span>
                </label>
                <textarea
                  name="notes_practitioner"
                  value={form.notes_practitioner}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] resize-none"
                  placeholder="Clinical observations, your reflections…"
                />
              </div>

              {/* Shared notes */}
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                  Shared notes <span className="text-[#6B6B65] font-normal">(visible to client)</span>
                </label>
                <textarea
                  name="notes_shared"
                  value={form.notes_shared}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] resize-none"
                  placeholder="Summary for the client to read back…"
                />
              </div>

              {/* Next steps */}
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Next steps</label>
                <textarea
                  name="next_steps"
                  value={form.next_steps}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] resize-none"
                  placeholder="What to focus on before the next session…"
                />
              </div>

              {/* Homework */}
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Homework</label>
                <textarea
                  name="homework"
                  value={form.homework}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] resize-none"
                  placeholder="Exercises, practices, or things to try…"
                />
              </div>

              {/* Status + flag */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-[#1C1C1A] cursor-pointer">
                  <input
                    type="checkbox"
                    name="flag_followup"
                    checked={form.flag_followup}
                    onChange={handleChange}
                    className="rounded accent-[#2D4A3E]"
                  />
                  Flag for follow-up
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="border border-[#2D4A3E]/20 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2D4A3E] bg-white"
                >
                  <option value="complete">Mark complete</option>
                  <option value="draft">Save as draft</option>
                </select>
              </div>

              {status === 'error' && (
                <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#2D4A3E] text-white py-3 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
              >
                {status === 'loading' ? 'Saving…' : 'Log session'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
