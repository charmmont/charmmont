'use client'

import { useState } from 'react'
import Link from 'next/link'

const faqs = [
  {
    q: "How do I know if I'm ready?",
    a: "If you're asking this question, part of you already is. Readiness isn't about having it figured out — it's about being willing to look. The First Root is the best place to start.",
  },
  {
    q: 'How long is the programme?',
    a: "The Becoming is shaped around you. There is no fixed number of sessions — we begin where you are and work at a pace that serves your growth. Most clients work with me for several months, with sessions every one to two weeks.",
  },
  {
    q: 'Is this therapy?',
    a: "No. Therapeutic coaching is not the same as therapy, and I am not a therapist. Coaching is forward-focused — we work with your history to understand it, but the compass always points toward who you're becoming. If I believe you need clinical support, I will say so honestly.",
  },
  {
    q: 'What happens in a session?',
    a: "Sessions are one hour, held online via video. We begin wherever you are that week — what's present, what's alive, what's sitting with you. From there, we go deep. You can expect honesty, care, and work that actually moves something.",
  },
  {
    q: "What if I've tried coaching before and it didn't work?",
    a: "That's worth talking about — and it often tells us something important about where the real work is. Coaching that stays on the surface rarely changes anything lasting. This is different. But I'd encourage you to bring that experience to The First Root and let's explore it together.",
  },
]

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
  return (
    <>
      {/* Opening */}
      <section style={{ padding: '96px 60px 72px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 9.5, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-sage)', marginBottom: 24 }}>
            Begin here
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(34px, 4vw, 52px)',
            fontWeight: 900,
            color: 'var(--color-text-primary)',
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            marginBottom: 28,
          }}>
            Work With Me
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88, maxWidth: 580 }}>
            This is for the person who senses there&apos;s more. More depth, more honesty, more freedom
            in who they are and how they move through the world. You don&apos;t need to have it figured
            out. You just need to be ready to look.
          </p>
        </div>
      </section>

      {/* The Becoming */}
      <section style={{ padding: '72px 60px', background: 'var(--color-bg-card)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 9.5, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-sage)', marginBottom: 16 }}>
            The offer
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(26px, 3.5vw, 44px)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.025em',
            lineHeight: 1.08,
            marginBottom: 8,
          }}>
            The Becoming
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 28, letterSpacing: '0.01em' }}>
            1:1 Coaching — Online
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88 }}>
            <p>
              The Becoming is Deepbloom&apos;s core 1:1 coaching programme. It is personal, in-depth work
              — the kind that doesn&apos;t rush, doesn&apos;t skip the difficult parts, and doesn&apos;t settle for
              surface-level insight.
            </p>
            <p>
              We begin with The First Root — a free discovery call to understand where you are, what
              you&apos;re carrying, and what becoming yourself might look like for you. From there, we build
              a programme shaped entirely around you.
            </p>
            <p>Sessions are held online. The pace is yours. The work is ours, together.</p>
          </div>
        </div>
      </section>

      {/* What it isn't */}
      <section style={{ padding: '72px 60px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2.8vw, 34px)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.015em',
            lineHeight: 1.22,
            marginBottom: 32,
          }}>
            What this isn&apos;t
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Not a quick fix or a 30-day transformation',
              "Not advice-giving or telling you what to do",
              "Not therapy — but it goes to the places therapy sometimes doesn't reach",
            ].map((item, i) => (
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

      {/* The client journey */}
      <section style={{ padding: '72px 60px', background: 'var(--color-bg-card)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2.8vw, 34px)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.015em',
            textAlign: 'center',
            marginBottom: 48,
          }}>
            The journey
          </h2>
          <div className="flex flex-col md:flex-row items-center md:items-start" style={{ gap: 0 }}>
            {[
              { label: 'The First Root', sub: 'Free discovery call' },
              { label: 'The Becoming', sub: '1:1 Programme' },
              { label: 'In Full Bloom', sub: 'Ongoing' },
            ].map((step, i) => (
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

      {/* Investment */}
      <section style={{ padding: '72px 60px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2.8vw, 34px)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.015em',
            marginBottom: 24,
          }}>
            Investment
          </h2>
          <div style={{
            background: 'var(--color-bg-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px 32px',
            border: '1px solid var(--color-border)',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.62 }}>
              Pricing details coming soon. Please book a First Root call to discuss what&apos;s right for you.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '72px 60px', background: 'var(--color-bg-card)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2.8vw, 34px)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.015em',
            marginBottom: 32,
          }}>
            Questions
          </h2>
          <div>
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 60px', background: 'var(--color-pine)' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(26px, 3.5vw, 44px)',
            fontWeight: 800,
            color: 'var(--color-text-inverse)',
            letterSpacing: '-0.025em',
            lineHeight: 1.08,
            marginBottom: 14,
          }}>
            Begin with The First Root
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-sage)', lineHeight: 1.78, marginBottom: 36 }}>
            A free 30-minute conversation. No commitment.
          </p>
          <Link
            href="/first-root"
            style={{
              display: 'inline-block',
              padding: '13px 36px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-bg)',
              color: 'var(--color-pine)',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
            }}
          >
            Book The First Root
          </Link>
        </div>
      </section>
    </>
  )
}
