import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Ayelen',
  description:
    'I believe every person carries the capacity to bloom into their truest self. Meet Ayelen, founder of Deepbloom.',
}

const borderColors = ['var(--color-pine)', 'var(--color-sage)', 'var(--color-sage-light)']

export default function AboutPage() {
  return (
    <>
      {/* Opening */}
      <section style={{ padding: '96px 60px 56px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 9.5, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-sage)', marginBottom: 24 }}>
            The guide
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 900,
            color: 'var(--color-text-primary)',
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
          }}>
            I believe every person carries the capacity to{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>bloom</em>{' '}
            into their truest self.
          </h1>
        </div>
      </section>

      {/* Brand Story */}
      <section style={{ padding: '0 60px 72px' }}>
        <div style={{ maxWidth: 620, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88 }}>
          <p>There&apos;s a version of you that you haven&apos;t fully met yet.</p>
          <p>
            You might feel it in quiet moments — a sense that who you are right now isn&apos;t the whole
            story. That somewhere beneath the noise, the habits, the beliefs that shaped you before you
            could choose them — there&apos;s someone waiting to bloom.
          </p>
          <p>I believe that person is already inside you. My work is simply to help you find them.</p>
          <p>
            My name is Ayelen. In my language, it means happiness of the home — and I&apos;ve come to
            understand that phrase not as a destination, but as a way of being. Of feeling truly at home
            in yourself. Grounded in who you are. Free from what no longer serves you. Open to who
            you&apos;re becoming.
          </p>
          <p>
            That journey — the one inward and then outward — is one I know deeply and personally. It has
            taught me that transformation isn&apos;t a performance. It isn&apos;t loud or linear. It happens in the
            quiet, in the honest conversations, in the moments when someone finally feels safe enough to
            tell the truth about where they are and dare to imagine where they could go.
          </p>
          <p>
            Those lessons are the foundation of Deepbloom. A practice rooted in the belief that every
            person deserves a space that is real, non-judgmental and genuinely held — where the work goes
            as deep as it needs to, and where who you&apos;re becoming is always the compass.
          </p>
          <p>This is that space. And it was made for you.</p>
          <p style={{ color: 'var(--color-pine)', fontStyle: 'italic', fontFamily: 'var(--font-display)', fontSize: 15 }}>
            Root deep. Bloom safe.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 60px' }}>
        <div style={{ height: 1, background: 'var(--color-border)' }} />
      </div>

      {/* What I Believe */}
      <section style={{ padding: '72px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(22px, 2.4vw, 34px)',
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.015em',
            textAlign: 'center',
            marginBottom: 40,
          }}>
            What I believe
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {[
              { text: 'Real change happens beneath the surface, not on it.', label: 'On depth' },
              { text: "Safety is not a soft extra. It's where transformation begins.", label: 'On safety' },
              { text: 'You are not a problem to be fixed. You are a person becoming.', label: 'On you' },
            ].map(({ text, label }, i) => (
              <div
                key={i}
                style={{
                  padding: '20px 22px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderLeft: `3px solid ${borderColors[i]}`,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 9.5, fontWeight: 500, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 12 }}>
                  {label}
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 14, lineHeight: 1.62, color: 'var(--color-text-primary)' }}>
                  &ldquo;{text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* My Approach */}
      <section style={{ padding: '72px 60px', background: 'var(--color-bg-card)' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 9.5, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-sage)', marginBottom: 16 }}>
            The approach
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 3vw, 38px)',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.025em',
            lineHeight: 1.22,
            marginBottom: 24,
          }}>
            My approach
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88 }}>
            Working with me is unhurried. We begin where you are — not where you think you should be.
            Sessions are honest and held. I will not tell you what to do or feel. I will ask the
            questions that matter, sit with you in the difficult parts, and hold you accountable to
            the version of yourself you&apos;re moving toward. Nothing is judged here. Everything is welcome.
          </p>
        </div>
      </section>

      {/* Photo placeholder */}
      <section style={{ background: 'var(--color-bg-card)', padding: '0 60px 72px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            background: 'var(--color-bg)',
            borderRadius: 'var(--radius-2xl)',
            height: 380,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--color-border)',
          }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
              Practitioner photo coming soon
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 60px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
          <Link
            href="/first-root"
            className="hover:-translate-y-0.5 transition-transform"
            style={{
              display: 'inline-block',
              padding: '13px 36px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-pine)',
              color: 'var(--color-text-inverse)',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 5px 22px rgba(45, 74, 62, 0.28)',
              marginBottom: 14,
            }}
          >
            Book The First Root
          </Link>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 14 }}>
            A free 30-minute conversation. No commitment.
          </p>
        </div>
      </section>
    </>
  )
}
