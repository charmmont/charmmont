'use client'

import { useState } from 'react'
import type { Metadata } from 'next'

// Note: metadata can't be exported from a 'use client' component
// so we handle it via a server wrapper or just set the title in the head

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  const [state, setState] = useState<FormState>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Please enter your name.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address.'
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      errs.message = 'Please enter a message (at least 10 characters).'
    }
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    setState('submitting')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setState('success')
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  return (
    <>
      <section className="py-24 px-6">
        <div className="max-w-xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-semibold text-[#1C1C1A] mb-4"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Get in touch
          </h1>
          <p className="text-xl text-[#6B6B65] mb-12">
            For anything that isn&apos;t a booking — questions, press, or just a hello.
          </p>

          {state === 'success' ? (
            <div className="bg-white rounded-2xl p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-[#2D4A3E]/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6 text-[#2D4A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p
                className="text-xl font-semibold text-[#1C1C1A] mb-2"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Thank you.
              </p>
              <p className="text-[#6B6B65]">I&apos;ll be in touch within 48 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label className="block text-sm text-[#1C1C1A] mb-2 font-medium" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-[#1C1C1A] text-base outline-none focus:border-[#2D4A3E] transition-colors ${
                    errors.name ? 'border-red-400' : 'border-[#2D4A3E]/20'
                  }`}
                  placeholder="Your name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm text-[#1C1C1A] mb-2 font-medium" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-[#1C1C1A] text-base outline-none focus:border-[#2D4A3E] transition-colors ${
                    errors.email ? 'border-red-400' : 'border-[#2D4A3E]/20'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm text-[#1C1C1A] mb-2 font-medium" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`w-full bg-white border rounded-xl px-4 py-3 text-[#1C1C1A] text-base outline-none focus:border-[#2D4A3E] transition-colors resize-none ${
                    errors.message ? 'border-red-400' : 'border-[#2D4A3E]/20'
                  }`}
                  placeholder="What would you like to say?"
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              {state === 'error' && (
                <p className="text-red-500 text-sm">
                  Something went wrong. Please try again or email directly.
                </p>
              )}

              <button
                type="submit"
                disabled={state === 'submitting'}
                className="w-full bg-[#2D4A3E] text-white py-3.5 rounded-full text-base hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
              >
                {state === 'submitting' ? 'Sending...' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  )
}
