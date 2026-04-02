import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
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
            }}>
              Privacy <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>Policy</em>
            </h1>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="hero-divider" style={{ display: 'flex', justifyContent: 'center', paddingBottom: 80 }}>
        <div style={{ width: 80, height: 1, background: 'var(--color-border)' }} />
      </div>

      {/* ── Content card ── */}
      <section className="pub-section-x" style={{ padding: '0 60px 72px' }}>
        <div className="card-inner" style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-2xl)', padding: '48px 52px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88 }}>
            <p>
              Deepbloom is committed to protecting your privacy. This policy explains how we collect,
              use, and protect your personal data.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginTop: 16 }}>
              What we collect
            </h2>
            <p>
              We may collect your name, email address, and any information you share through contact
              forms or during coaching sessions. We do not collect any data without your knowledge or
              consent.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginTop: 16 }}>
              How we use your data
            </h2>
            <p>
              Your data is used only to deliver our coaching services, respond to your enquiries, and
              improve your experience on this site. We will never sell or share your personal data
              with third parties for marketing purposes.
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginTop: 16 }}>
              Your rights
            </h2>
            <p>
              You have the right to access, correct, or delete the personal data we hold about you.
              To make a request, please contact us at{' '}
              <a href="mailto:hello@deepbloom.me" style={{ color: 'var(--color-pine)', textDecoration: 'none' }}>
                hello@deepbloom.me
              </a>
              .
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginTop: 16 }}>
              Cookies
            </h2>
            <p>
              This site uses minimal cookies for authentication purposes only. No tracking or
              advertising cookies are used.
            </p>

            <div style={{ height: 1, background: 'var(--color-border)', marginTop: 16 }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', color: 'var(--color-text-secondary)' }}>
              Last updated: March 2025
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
