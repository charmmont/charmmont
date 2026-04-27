'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ContactPage() {
  const t = useTranslations('Contact')
  const [state, setState] = useState<FormState>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = t('field_name_error')
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = t('field_email_error')
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      errs.message = t('field_message_error')
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

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    background: 'var(--color-bg)',
    border: `1.5px solid ${hasError ? '#e57373' : 'var(--color-border)'}`,
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    fontWeight: 300,
    color: 'var(--color-text-primary)',
    outline: 'none',
    boxSizing: 'border-box',
  })

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--color-bg)' }}>

      {/* ── Opening hero ── */}
      <section className="pub-hero" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 60px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: 760, textAlign: 'center', animation: 'fadeUp 0.9s ease both' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(34px, 4vw, 52px)',
              fontWeight: 900,
              color: 'var(--color-text-primary)',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              marginBottom: 28,
            }}>
              {t('title_pre')} <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>{t('title_em')}</em>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88 }}>
              {t('sub')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="hero-divider" style={{ display: 'flex', justifyContent: 'center', paddingBottom: 80 }}>
        <div style={{ width: 80, height: 1, background: 'var(--color-border)' }} />
      </div>

      {/* ── Form card ── */}
      <section className="pub-section-x" style={{ padding: '0 60px 72px' }}>
        <div className="card-inner" style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-2xl)', padding: '48px 52px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>

          {state === 'success' ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(45,74,62,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <svg width={22} height={22} fill="none" stroke="var(--color-pine)" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 8 }}>
                {t('success_title')}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)' }}>
                {t('success_body')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label htmlFor="name" style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                  {t('field_name')}
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t('field_name_placeholder')}
                  style={inputStyle(!!errors.name)}
                />
                {errors.name && <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#e57373', marginTop: 4 }}>{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                  {t('field_email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={t('field_email_placeholder')}
                  style={inputStyle(!!errors.email)}
                />
                {errors.email && <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#e57373', marginTop: 4 }}>{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="message" style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                  {t('field_message')}
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={t('field_message_placeholder')}
                  style={{ ...inputStyle(!!errors.message), resize: 'none' }}
                />
                {errors.message && <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#e57373', marginTop: 4 }}>{errors.message}</p>}
              </div>

              {state === 'error' && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#e57373' }}>
                  {t('error_generic')}
                </p>
              )}

              <button
                type="submit"
                disabled={state === 'submitting'}
                style={{
                  padding: '13px 36px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-pine)',
                  color: 'var(--color-text-inverse)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 600,
                  border: 'none',
                  cursor: state === 'submitting' ? 'default' : 'pointer',
                  opacity: state === 'submitting' ? 0.6 : 1,
                  boxShadow: '0 5px 22px rgba(45,74,62,0.28)',
                  alignSelf: 'flex-start',
                }}
              >
                {state === 'submitting' ? t('submitting') : t('submit')}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  )
}
