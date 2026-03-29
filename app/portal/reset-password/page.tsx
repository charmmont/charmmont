'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Step = 'request' | 'sent' | 'update'

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleRequest(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/set-password`,
    })
    if (err) { setError(err.message); setLoading(false); return }
    setLoading(false)
    setStep('sent')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center gap-1">
            <span
              className="text-2xl font-semibold text-[#2D4A3E]"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Deepbloom
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8">
          {step === 'request' && (
            <>
              <h1
                className="text-xl font-semibold text-[#1C1C1A] mb-6 text-center"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Reset password
              </h1>
              <form onSubmit={handleRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2D4A3E] text-white py-3 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>
            </>
          )}

          {step === 'sent' && (
            <div className="text-center py-4">
              <p
                className="text-xl font-semibold text-[#1C1C1A] mb-3"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Check your email.
              </p>
              <p className="text-[#6B6B65] text-sm">
                A reset link has been sent to {email}. Follow the link to set a new password.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/portal/login"
            className="text-xs text-[#6B6B65] hover:text-[#2D4A3E] transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
