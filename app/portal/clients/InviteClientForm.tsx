'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function InviteClientForm() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrMsg('')

    try {
      const res = await fetch('/api/portal/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrMsg(data.error ?? 'Something went wrong.')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setErrMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  function reset() {
    setOpen(false)
    setEmail('')
    setName('')
    setStatus('idle')
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
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

            {status === 'success' ? (
              <div className="text-center py-6">
                <p className="text-[#2D4A3E] font-medium mb-2">Invite sent.</p>
                <p className="text-[#6B6B65] text-sm mb-6">
                  {name} will receive an email to set their password and access the portal.
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
                    placeholder="Client name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
                    placeholder="client@email.com"
                  />
                </div>
                {errMsg && <p className="text-red-500 text-sm">{errMsg}</p>}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#2D4A3E] text-white py-3 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
                >
                  {status === 'loading' ? 'Sending invite...' : 'Send invite'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
