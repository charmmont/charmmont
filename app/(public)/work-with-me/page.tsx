'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderBottom: '1px solid var(--color-border)' }}>
      <button
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '22px 0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(!open)}
      >
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 16,
          fontWeight: 600,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.01em',
          lineHeight: 1.4,
        }}>
          {q}
        </span>
        <span style={{ color: 'var(--color-pine)', fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div style={{ paddingBottom: 22, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88 }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function WorkWithMePage() {
  const t = useTranslations('WorkWithMe')

  const faqs = [
    { q: t('faq1_q'), a: t('faq1_a') },
    { q: t('faq2_q'), a: t('faq2_a') },
    { q: t('faq3_q'), a: t('faq3_a') },
    { q: t('faq4_q'), a: t('faq4_a') },
    { q: t('faq5_q'), a: t('faq5_a') },
  ]

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
              {t('intro')}
            </p>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="hero-divider" style={{ display: 'flex', justifyContent: 'center', paddingBottom: 80 }}>
        <div style={{ width: 80, height: 1, background: 'var(--color-border)' }} />
      </div>

      {/* ── The journey ── */}
      <section className="pub-section-x" style={{ padding: '0 60px 64px' }}>
        <div className="card-inner" style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-2xl)', padding: '48px 52px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2.8vw, 34px)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.025em',
            textAlign: 'center',
            marginBottom: 48,
          }}>
            {t('journey_title_pre')} <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>{t('journey_title_em')}</em>
          </h2>
          <div className="journey-steps flex flex-col md:flex-row items-center md:items-start" style={{ gap: 0, maxWidth: 640, margin: '0 auto' }}>
            {([
              { label: t('offer1_title'), sub: t('offer1_label') },
              { label: t('offer2_title'), sub: t('offer2_label') },
              { label: t('offer3_title'), sub: t('offer3_label') },
            ] as { label: string; sub: string }[]).map((step, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center" style={{ flex: 1 }}>
                <div style={{ textAlign: 'center', flex: 1, padding: '0 16px' }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'var(--color-pine)',
                    color: 'var(--color-text-inverse)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--color-text-primary)', marginBottom: 4, letterSpacing: '-0.01em' }}>
                    {step.label}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-secondary)' }}>
                    {step.sub}
                  </p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block" style={{ color: 'var(--color-sage)', fontSize: 18, flexShrink: 0, marginTop: 14 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The offer + What it isn't ── */}
      <section className="pub-section-x" style={{ padding: '0 60px 64px' }}>
        <div className="card-inner" style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-2xl)', padding: '48px 52px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(26px, 3.5vw, 44px)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.025em',
            lineHeight: 1.08,
            marginBottom: 8,
          }}>
            {t('becoming_title')}
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 28, letterSpacing: '0.01em' }}>
            {t('becoming_sub')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88, marginBottom: 48 }}>
            <p>{t('becoming_body1')}</p>
            <p>{t('becoming_body2')}</p>
            <p>{t('becoming_body3')}</p>
          </div>
          {/* Divider */}
          <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 48 }} />
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2.8vw, 34px)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.025em',
            lineHeight: 1.22,
            marginBottom: 32,
          }}>
            {t('not_title_pre')} <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>{t('not_title_em')}</em>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[t('not1'), t('not2'), t('not3')].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  marginTop: 2,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(45,74,62,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width={10} height={10} fill="none" stroke="var(--color-pine)" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6" />
                  </svg>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.78 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Investment ── */}
      <section className="pub-section-x" style={{ padding: '0 60px 64px' }}>
        <div className="card-inner" style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-2xl)', padding: '48px 52px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2.8vw, 34px)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.025em',
            marginBottom: 24,
          }}>
            {t('investment_title')}
          </h2>
          <div style={{
            background: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px 32px',
            border: '1px solid var(--color-border)',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.62 }}>
              {t('investment_body')}
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pub-section-x" style={{ padding: '0 60px 64px' }}>
        <div className="card-inner" style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-2xl)', padding: '48px 52px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2.8vw, 34px)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.025em',
            marginBottom: 32,
          }}>
            {t('faq_title')}
          </h2>
          <div>
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA band ── */}
      <section className="pub-section-x" style={{ padding: '64px 60px 72px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="cta-band" style={{
            background: 'var(--color-pine)', borderRadius: 'var(--radius-2xl)',
            padding: '56px 64px', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Botanical accent inside CTA */}
            <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.1 }} viewBox="0 0 900 280" preserveAspectRatio="xMidYMid slice">
              <path d="M-40 280 Q120 200 200 160 Q280 120 270 60" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              <path d="M940 280 Q780 200 700 160 Q620 120 630 60" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              {([[180, 92], [680, 105], [430, 28], [78, 188], [810, 195]] as [number, number][]).map(([x, y], i) => (
                <path key={i} d={`M${x} ${y} Q${x + 16} ${y - 24} ${x + 28} ${y} Q${x + 16} ${y + 10} ${x} ${y}Z`} fill="#fff" opacity="0.6" />
              ))}
            </svg>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800, color: 'var(--color-text-inverse)', letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: 16 }}>
                {t('cta_title')}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'rgba(250,247,242,0.5)', lineHeight: 1.78, maxWidth: 420, margin: '0 auto 34px' }}>
                {t('cta_sub')}
              </p>
              <Link
                href="/first-root"
                className="hover:-translate-y-0.5 transition-transform"
                style={{ display: 'inline-block', padding: '13px 36px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg)', color: 'var(--color-pine)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, textDecoration: 'none', boxShadow: '0 8px 28px rgba(0,0,0,0.18)' }}
              >
                {t('cta_button')}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
