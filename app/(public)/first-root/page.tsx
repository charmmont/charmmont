import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'The First Root — Free Discovery Call',
  description:
    'Book your free 30-minute conversation with Ayelen. No commitment. Just a beginning.',
}

export default function FirstRootPage() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--color-bg)' }}>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />

      {/* ── Opening hero ── */}
      <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 60px 80px' }}>
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
              The <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>First Root</em>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88 }}>
              A free 30-minute conversation. No commitment. Just the beginning.
            </p>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 80 }}>
        <div style={{ width: 80, height: 1, background: 'var(--color-border)' }} />
      </div>

      {/* ── Description + What to expect ── */}
      <section style={{ padding: '0 60px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-2xl)', padding: '48px 52px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88, marginBottom: 48, textAlign: 'center' }}>
            This is not a sales call. It&apos;s a conversation — a chance for us to understand where you
            are, what&apos;s brought you here, and whether working together feels right. You&apos;ll leave
            with more clarity than you arrived with, whatever you decide.
          </p>
          <div style={{ height: 1, background: 'var(--color-border)', marginBottom: 48 }} />
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2.8vw, 34px)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.025em',
            marginBottom: 28,
          }}>
            What to <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>expect</em>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              '30 minutes, online via video',
              "A space to share what's brought you here",
              'Honest conversation about whether Deepbloom is the right fit',
              'No pressure, no obligation',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{
                  marginTop: 7,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--color-pine)',
                  flexShrink: 0,
                }} />
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.78 }}>
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Calendly ── */}
      <section style={{ padding: '0 60px 64px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-2xl)', padding: '8px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)', overflow: 'hidden' }}>
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/deepbloom/first-root?hide_gdpr_banner=1&primary_color=2D4A3E"
            style={{ width: '100%', height: '760px' }}
          />
        </div>
      </section>

      {/* ── Final CTA band ── */}
      <section style={{ padding: '0 60px 72px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            background: 'var(--color-pine)', borderRadius: 'var(--radius-2xl)',
            padding: '56px 64px', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.1 }} viewBox="0 0 900 280" preserveAspectRatio="xMidYMid slice">
              <path d="M-40 280 Q120 200 200 160 Q280 120 270 60" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              <path d="M940 280 Q780 200 700 160 Q620 120 630 60" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" />
              {([[180, 92], [680, 105], [430, 28], [78, 188], [810, 195]] as [number, number][]).map(([x, y], i) => (
                <path key={i} d={`M${x} ${y} Q${x + 16} ${y - 24} ${x + 28} ${y} Q${x + 16} ${y + 10} ${x} ${y}Z`} fill="#fff" opacity="0.6" />
              ))}
            </svg>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800, color: 'var(--color-text-inverse)', letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: 16 }}>
                Learn more about <em style={{ fontStyle: 'italic' }}>The Becoming</em>
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'rgba(250,247,242,0.5)', lineHeight: 1.78, maxWidth: 420, margin: '0 auto 34px' }}>
                Explore the full 1:1 coaching programme and what working together looks like.
              </p>
              <a
                href="/work-with-me"
                style={{ display: 'inline-block', padding: '13px 36px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg)', color: 'var(--color-pine)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, textDecoration: 'none', boxShadow: '0 8px 28px rgba(0,0,0,0.18)' }}
              >
                Work with me
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
