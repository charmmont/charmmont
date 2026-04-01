import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deepbloom — Root Deep, Bloom Safe',
  description:
    'Deepbloom is a therapeutic coaching practice for people ready to go beneath the surface.',
}

function BotanicalBg() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}
      viewBox="0 0 1400 860"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Main stems */}
      <path
        d="M-40 860 Q100 720 175 660 Q250 600 242 500 Q234 400 305 355 Q376 310 360 230 Q344 150 420 110"
        stroke="var(--color-pine)" strokeWidth="1.6" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 950, strokeDashoffset: 950, animation: 'rootDraw 4.5s ease 0.3s forwards', opacity: 0.12 }}
      />
      <path
        d="M175 660 Q205 636 232 660 Q248 680 238 704"
        stroke="var(--color-pine)" strokeWidth="1" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 200, strokeDashoffset: 200, animation: 'rootDraw 2.5s ease 1s forwards', opacity: 0.09 }}
      />
      <path
        d="M242 500 Q272 478 298 506 Q314 526 302 548"
        stroke="var(--color-pine)" strokeWidth="1" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 180, strokeDashoffset: 180, animation: 'rootDraw 2s ease 1.4s forwards', opacity: 0.09 }}
      />
      <path
        d="M1460 -30 Q1320 80 1258 180 Q1196 280 1228 382 Q1260 484 1192 542 Q1124 600 1150 700"
        stroke="var(--color-pine)" strokeWidth="1.8" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: 'rootDraw 5s ease 0.5s forwards', opacity: 0.09 }}
      />
      <path
        d="M1258 180 Q1220 160 1198 197 Q1176 234 1148 221"
        stroke="var(--color-pine)" strokeWidth="1" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 220, strokeDashoffset: 220, animation: 'rootDraw 2.2s ease 1.2s forwards', opacity: 0.08 }}
      />
      {/* Leaf shapes */}
      {([
        [230, 188, 0.3, 1], [218, 182, 0.6, 0.8], [248, 178, 0.9, 0.9],
        [355, 255, 1.1, 1.1], [344, 249, 1.4, 0.85],
        [1194, 118, 0.5, 1], [1208, 112, 0.8, 0.9], [1180, 124, 1.1, 0.85],
        [652, 340, 0.7, 0.9], [664, 334, 1.0, 1],
      ] as [number, number, number, number][]).map(([x, y, d, s], i) => (
        <path
          key={i}
          d={`M${x} ${y} Q${x + 20 * s} ${y - 28 * s} ${x + 34 * s} ${y} Q${x + 20 * s} ${y + 11 * s} ${x} ${y}Z`}
          fill="var(--color-sage)"
          style={{ opacity: 0.11, animation: `leafIn 1s ease ${d + 0.4}s both` }}
        />
      ))}
      {/* Ring circles */}
      {([
        [860, 140, 62, 0], [370, 700, 76, 1.5], [1180, 740, 52, 2.5], [670, 800, 45, 1],
      ] as [number, number, number, number][]).map(([cx, cy, r, d], i) => (
        <circle
          key={i} cx={cx} cy={cy} r={r}
          fill="none" stroke="var(--color-sage)" strokeWidth="0.7"
          style={{ animation: `ripple 8s ease ${d}s infinite`, opacity: 0.13 }}
        />
      ))}
      {/* Dot accents */}
      {([
        [420, 128], [778, 54], [1056, 214], [156, 366], [1318, 492], [540, 788],
      ] as [number, number][]).map(([x, y], i) => (
        <circle
          key={i} cx={x} cy={y} r="3.5"
          fill="var(--color-sage)"
          style={{ animation: `dotPulse 4s ease ${i * 1.1}s infinite`, opacity: 0.2 }}
        />
      ))}
    </svg>
  )
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '96px 60px 72px', position: 'relative', overflow: 'hidden' }}>
        <BotanicalBg />
        <div style={{ maxWidth: 720, position: 'relative', zIndex: 5, animation: 'fadeUp 0.9s ease both' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 5vw, 62px)', fontWeight: 900, color: 'var(--color-text-primary)', lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 28 }}>
            The space where the real work of{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>becoming yourself</em>{' '}
            begins.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 300, color: 'var(--color-text-secondary)', maxWidth: 520, lineHeight: 1.88, marginBottom: 40 }}>
            Deepbloom is a therapeutic coaching practice for people ready to go beneath the surface.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link
              href="/first-root"
              className="hover:-translate-y-0.5 transition-transform"
              style={{
                padding: '13px 32px', borderRadius: 'var(--radius-full)',
                background: 'var(--color-pine)', color: 'var(--color-text-inverse)',
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
                textDecoration: 'none', boxShadow: '0 5px 22px rgba(45, 74, 62, 0.28)', display: 'inline-block',
              }}
            >
              Book a Free Call
            </Link>
            <Link
              href="/work-with-me"
              className="hover:bg-[rgba(45,74,62,0.03)] transition-colors"
              style={{
                padding: '13px 32px', borderRadius: 'var(--radius-full)',
                background: 'transparent', border: '1.5px solid var(--color-border)',
                color: 'var(--color-pine)', fontFamily: 'var(--font-body)',
                fontSize: 14, fontWeight: 400, textDecoration: 'none', display: 'inline-block',
              }}
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 60px' }}>
        <div style={{ height: 1, background: 'var(--color-border)' }} />
      </div>

      {/* The Turning Point */}
      <section style={{ padding: '72px 60px' }}>
        <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.22, letterSpacing: '-0.025em', marginBottom: 36 }}>
            Something in you already{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>knows</em>{' '}
            it&apos;s time.
          </h2>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p>
              You can feel it — that quiet sense that who you are right now isn&apos;t the whole story.
              That somewhere beneath the noise, the habits, the beliefs that shaped you before you
              could choose them, there&apos;s someone waiting to emerge.
            </p>
            <p>
              You&apos;re not broken. You&apos;re not behind. You&apos;ve simply been carrying things that were
              never yours to carry forever.
            </p>
            <p>This is the space for the work that changes that.</p>
          </div>
        </div>
      </section>

      {/* What Deepbloom Is */}
      <section style={{ padding: '72px 60px', background: 'var(--color-bg-card)' }}>
        <div className="grid md:grid-cols-2" style={{ maxWidth: 1200, margin: '0 auto', gap: 56, alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 9.5, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-sage)', marginBottom: 16 }}>
              The practice
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.22, letterSpacing: '-0.025em', marginBottom: 20 }}>
              Therapeutic coaching that goes where it{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>needs to go.</em>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88, marginBottom: 28 }}>
              Deepbloom is not about surface-level fixes or performance. It&apos;s about depth —
              honest, unhurried work that reaches the root of old patterns and beliefs, so you
              can finally grow into who you&apos;re becoming. No jargon. No judgement. Just real.
            </p>
            <Link href="/work-with-me" className="hover:text-[var(--color-sage)] transition-colors" style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-pine)', textDecoration: 'none' }}>
              Learn how we work →
            </Link>
          </div>
          <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-2xl)', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Photography coming soon</p>
          </div>
        </div>
      </section>

      {/* The Offer Snapshot */}
      <section style={{ padding: '72px 60px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ background: 'var(--color-pine)', borderRadius: 'var(--radius-2xl)', padding: '48px 52px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 9.5, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-sage)', marginBottom: 12 }}>
              1:1 Therapeutic Coaching
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: 'var(--color-text-inverse)', letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: 8 }}>
              The Becoming
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'rgba(250,247,242,0.75)', lineHeight: 1.88, marginBottom: 36 }}>
              A personal, held programme for people ready to do the deeper work. We go beneath the
              presenting problem — into the patterns, the beliefs, the moments that shaped you —
              and we build something new from there.
            </p>
            <Link href="/work-with-me" style={{ display: 'inline-block', padding: '13px 32px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg)', color: 'var(--color-pine)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, textDecoration: 'none', boxShadow: '0 8px 28px rgba(0,0,0,0.18)' }}>
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* About Bridge */}
      <section style={{ padding: '72px 60px', background: 'var(--color-bg-card)' }}>
        <div className="grid md:grid-cols-2" style={{ maxWidth: 1200, margin: '0 auto', gap: 56, alignItems: 'center' }}>
          <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-2xl)', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Ayelen — Deepbloom</p>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 9.5, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-sage)', marginBottom: 16 }}>
              The guide
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.22, letterSpacing: '-0.025em', marginBottom: 20 }}>
              I&apos;ve <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>walked</em> this path.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88, marginBottom: 16 }}>
              Transformation isn&apos;t a performance. It happens in the quiet, in the honest
              conversations, in the moments when someone finally feels safe enough to tell the
              truth about where they are — and dare to imagine where they could go.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88, marginBottom: 28 }}>
              My name is Ayelen. This practice is built from everything I know about that journey.
            </p>
            <Link href="/about" className="hover:text-[var(--color-sage)] transition-colors" style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-pine)', textDecoration: 'none' }}>
              Read my story →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '72px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.4vw, 30px)', fontWeight: 700, color: 'var(--color-text-secondary)', textAlign: 'center', letterSpacing: '-0.015em', marginBottom: 40 }}>
            What clients say
          </h2>
          <div className="grid md:grid-cols-3" style={{ gap: 18 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', padding: '28px 30px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 14, lineHeight: 1.78, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
                  &ldquo;Testimonials will appear here as they are collected.&rdquo;
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-pine)', fontWeight: 500 }}>—</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '72px 60px', background: 'var(--color-pine)' }}>
        <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800, color: 'var(--color-text-inverse)', letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: 16 }}>
            Ready to begin?
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-sage)', lineHeight: 1.78, marginBottom: 36 }}>
            The First Root is a free 30-minute conversation. No commitment. Just a beginning.
          </p>
          <Link
            href="/first-root"
            className="hover:-translate-y-0.5 transition-transform"
            style={{ display: 'inline-block', padding: '13px 36px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg)', color: 'var(--color-pine)', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, textDecoration: 'none', boxShadow: '0 8px 28px rgba(0,0,0,0.18)' }}
          >
            Book your free call
          </Link>
        </div>
      </section>
    </>
  )
}
