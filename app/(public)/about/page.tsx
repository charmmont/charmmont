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
    <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--color-bg)' }}>

      {/* ── Opening hero ── */}
      <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 60px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: 760, textAlign: 'center', animation: 'fadeUp 0.9s ease both' }}>
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
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 80 }}>
        <div style={{ width: 80, height: 1, background: 'var(--color-border)' }} />
      </div>

      {/* ── Brand Story ── */}
      <section style={{ padding: '0 60px 72px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            background: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-2xl)',
            padding: '48px 52px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88 }}>
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
          </div>
        </div>
      </section>

      {/* ── What I Believe ── */}
      <section style={{ padding: '0 60px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 2.4vw, 34px)',
              fontWeight: 700,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.025em',
            }}>
              What I <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>believe</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {[
              { text: 'Real change happens beneath the surface, not on it.', label: 'On depth' },
              { text: "Safety is not a soft extra. It's where transformation begins.", label: 'On safety' },
              { text: 'You are not a problem to be fixed. You are a person becoming.', label: 'On you' },
            ].map(({ text, label }, i) => (
              <div
                key={i}
                style={{
                  padding: '28px 24px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-border)',
                  borderLeft: `3px solid ${borderColors[i]}`,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  boxShadow: 'var(--shadow-card)',
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

      {/* ── My Approach + Photo ── */}
      <section style={{ padding: '64px 60px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-2xl)', padding: '48px 52px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <div className="grid md:grid-cols-2" style={{ gap: 56, alignItems: 'center' }}>
            <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Practitioner photo coming soon</p>
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(24px, 3vw, 38px)',
                fontWeight: 800,
                color: 'var(--color-text-primary)',
                letterSpacing: '-0.025em',
                lineHeight: 1.22,
                marginBottom: 20,
              }}>
                My <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>approach</em>
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88 }}>
                Working with me is unhurried. We begin where you are — not where you think you should be.
                Sessions are honest and held. I will not tell you what to do or feel. I will ask the
                questions that matter, sit with you in the difficult parts, and hold you accountable to
                the version of yourself you&apos;re moving toward. Nothing is judged here. Everything is welcome.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA band ── */}
      <section style={{ padding: '64px 60px 72px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
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
                Book The First Root
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'rgba(250,247,242,0.5)', lineHeight: 1.78, maxWidth: 420, margin: '0 auto 34px' }}>
                A free 30-minute conversation. No commitment.
              </p>
              <Link
                href="/first-root"
                className="hover:-translate-y-0.5 transition-transform"
                style={{ display: 'inline-block', padding: '13px 36px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg)', color: 'var(--color-pine)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, textDecoration: 'none', boxShadow: '0 8px 28px rgba(0,0,0,0.18)' }}
              >
                Book a Free Call
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
