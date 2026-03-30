'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signInAction } from './actions'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signInAction, null)

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Wordmark */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center gap-1">
            <span
              className="text-2xl font-semibold text-[#2D4A3E]"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Deepbloom
            </span>
            <span className="text-xs text-[#6B6B65] tracking-wider">Portal</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8">
          <h1
            className="text-xl font-semibold text-[#1C1C1A] mb-6 text-center"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Sign in
          </h1>

          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-sm text-[#1C1C1A] mb-1.5 font-medium" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm outline-none focus:border-[#2D4A3E] transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm text-[#1C1C1A] mb-1.5 font-medium" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-[#1C1C1A] text-sm outline-none focus:border-[#2D4A3E] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {state?.error && (
              <p className="text-red-500 text-sm text-center">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full bg-[#2D4A3E] text-white py-3 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60 mt-2"
            >
              {pending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/portal/reset-password"
              className="text-xs text-[#6B6B65] hover:text-[#2D4A3E] transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-[#6B6B65] mt-6">
          New clients are invited by their practitioner.
        </p>
      </div>
    </div>
  )
}
