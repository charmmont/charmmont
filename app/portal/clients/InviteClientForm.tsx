'use client'

import { useState } from 'react'

const PROGRAMMES = ['The Becoming', 'The First Root', 'Other']

export default function InviteClientForm() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    email: '',
    name: '',
    programme: 'The Becoming',
    programme_other: '',
    start_date: new Date().toISOString().split('T')[0],
    welcome_note: '',
  })
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setInviteStatus('loading')
    setErrMsg('')

    const programme = form.programme === 'Other' ? form.programme_other : form.programme

    try {
      const res = await fetch('/api/portal/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          programme,
          start_date: form.start_date,
          welcome_note: form.welcome_note,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrMsg(data.error ?? 'Something went wrong.')
        setInviteStatus('error')
        return
      }
      setInviteStatus('success')
    } catch {
      setErrMsg('Network error. Please try again.')
      setInviteStatus('error')
    }
  }

  function reset() {
    setOpen(false)
    setForm({
      email: '',
      name: '',
      programme: 'The Becoming',
      programme_other: '',
      start_date: new Date().toISOString().split('T')[0],
      welcome_note: '',
    })
    setInviteStatus('idle')
    setErrMsg('')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-[#2D4A3E] text-white px-4 py-2 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors"
      >
        + Invite new client
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 bg-black/20 overflow-y-auto py-8">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md my-auto">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg font-semibold text-[#1C1C1A]"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Invite a client
              </h2>
              <button onClick={reset} className="text-[#6B6B65] hover:text-[#2D4A3E]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {inviteStatus === 'success' ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-[#2D4A3E]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  ✓
                </div>
                <p className="text-[#2D4A3E] font-medium mb-2">Invite sent.</p>
                <p className="text-[#6B6B65] text-sm mb-6">
                  {form.name} will receive an email to set their password and access their space.
                </p>
                <button
                  onClick={reset}
                  className="bg-[#2D4A3E] text-white px-6 py-2 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Full name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E]"
                    placeholder="Client's full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Email address</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E]"
                    placeholder="client@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Programme</label>
                  <select
                    name="programme"
                    value={form.programme}
                    onChange={handleChange}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] bg-white"
                  >
                    {PROGRAMMES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                {form.programme === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Programme name</label>
                    <input
                      type="text"
                      name="programme_other"
                      value={form.programme_other}
                      onChange={handleChange}
                      className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E]"
                      placeholder="Enter programme name"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Start date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                    Welcome note <span className="text-[#6B6B65] font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="welcome_note"
                    value={form.welcome_note}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] resize-none"
                    placeholder="A personal message to include in the invite email…"
                  />
                </div>
                {errMsg && <p className="text-red-500 text-sm">{errMsg}</p>}
                <button
                  type="submit"
                  disabled={inviteStatus === 'loading'}
                  className="w-full bg-[#2D4A3E] text-white py-3 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
                >
                  {inviteStatus === 'loading' ? 'Sending invite…' : 'Send invite'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
