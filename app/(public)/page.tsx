import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deepbloom — Root Deep, Bloom Safe',
  description:
    'Deepbloom is a therapeutic coaching practice for people ready to go beneath the surface.',
}

// ── Full-page botanical background ─────────────────────────────────────────
// Positioned absolute on the page wrapper; viewBox spans full page height.

function BotanicalBg() {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0, width: '100%', height: 'auto',
        minHeight: '100%', pointerEvents: 'none', zIndex: 0,
      }}
      viewBox="0 0 1400 3200"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* ── Upper left stem ── */}
      <path
        d="M-60 900 Q80 750 170 700 Q260 648 252 545 Q244 445 315 398 Q386 351 370 270 Q354 189 420 152"
        stroke="var(--color-pine)" strokeWidth="1.6" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 950, strokeDashoffset: 950, animation: 'rootDraw 4.5s ease 0.3s forwards', opacity: 0.13 }}
      />
      <path
        d="M170 700 Q200 670 230 695 Q260 720 248 745"
        stroke="var(--color-pine)" strokeWidth="1" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 200, strokeDashoffset: 200, animation: 'rootDraw 2.5s ease 1s forwards', opacity: 0.1 }}
      />
      <path
        d="M252 545 Q282 525 308 552 Q320 570 310 590"
        stroke="var(--color-pine)" strokeWidth="1" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 180, strokeDashoffset: 180, animation: 'rootDraw 2s ease 1.4s forwards', opacity: 0.1 }}
      />

      {/* ── Upper right stem ── */}
      <path
        d="M1460 -40 Q1330 90 1268 195 Q1206 300 1238 402 Q1270 504 1202 562 Q1134 620 1160 718"
        stroke="var(--color-pine)" strokeWidth="1.8" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: 'rootDraw 5s ease 0.5s forwards', opacity: 0.1 }}
      />
      <path
        d="M1268 195 Q1230 175 1208 212 Q1186 249 1158 236"
        stroke="var(--color-pine)" strokeWidth="1" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 220, strokeDashoffset: 220, animation: 'rootDraw 2.2s ease 1.2s forwards', opacity: 0.09 }}
      />

      {/* ── Mid-page left stem ── */}
      <path
        d="M-40 1400 Q60 1300 120 1240 Q180 1180 162 1090 Q144 1000 210 960"
        stroke="var(--color-pine)" strokeWidth="1.4" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 700, strokeDashoffset: 700, animation: 'rootDraw 4s ease 0.8s forwards', opacity: 0.1 }}
      />
      <path
        d="M120 1240 Q148 1218 165 1242 Q174 1258 164 1276"
        stroke="var(--color-pine)" strokeWidth="0.9" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 140, strokeDashoffset: 140, animation: 'rootDraw 2s ease 1.6s forwards', opacity: 0.08 }}
      />

      {/* ── Mid-page right stem ── */}
      <path
        d="M1460 1500 Q1360 1420 1310 1340 Q1260 1260 1290 1170 Q1320 1080 1268 1020"
        stroke="var(--color-pine)" strokeWidth="1.4" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 680, strokeDashoffset: 680, animation: 'rootDraw 4s ease 0.6s forwards', opacity: 0.09 }}
      />

      {/* ── Lower left stem ── */}
      <path
        d="M-40 2400 Q80 2280 148 2200 Q216 2120 200 2020 Q184 1920 250 1870"
        stroke="var(--color-pine)" strokeWidth="1.3" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 750, strokeDashoffset: 750, animation: 'rootDraw 4.5s ease 1s forwards', opacity: 0.08 }}
      />

      {/* ── Leaf shapes — upper left ── */}
      {([
        [230, 198, 0.3, 1], [218, 192, 0.6, 0.8], [248, 188, 0.9, 0.9],
        [355, 268, 1.1, 1.1], [344, 262, 1.4, 0.85],
      ] as [number, number, number, number][]).map(([x, y, d, s], i) => (
        <path key={`ul${i}`}
          d={`M${x} ${y} Q${x + 20 * s} ${y - 28 * s} ${x + 34 * s} ${y} Q${x + 20 * s} ${y + 11 * s} ${x} ${y}Z`}
          fill="var(--color-sage)"
          style={{ opacity: 0.12, animation: `leafIn 1s ease ${d + 0.4}s both` }}
        />
      ))}

      {/* ── Leaf shapes — upper right ── */}
      {([
        [1194, 132, 0.5, 1], [1208, 126, 0.8, 0.9], [1180, 138, 1.1, 0.85],
        [1166, 538, 1.3, 1.05], [1180, 532, 1.6, 0.9],
      ] as [number, number, number, number][]).map(([x, y, d, s], i) => (
        <path key={`ur${i}`}
          d={`M${x} ${y} Q${x + 20 * s} ${y - 28 * s} ${x + 34 * s} ${y} Q${x + 20 * s} ${y + 11 * s} ${x} ${y}Z`}
          fill="var(--color-sage)"
          style={{ opacity: 0.11, animation: `leafIn 1s ease ${d + 0.4}s both` }}
        />
      ))}

      {/* ── Leaf shapes — mid page ── */}
      {([
        [148, 1188, 0.9, 0.9], [136, 1196, 1.2, 0.8],
        [1278, 1300, 0.7, 1], [1292, 1294, 1.1, 0.85],
      ] as [number, number, number, number][]).map(([x, y, d, s], i) => (
        <path key={`mid${i}`}
          d={`M${x} ${y} Q${x + 20 * s} ${y - 28 * s} ${x + 34 * s} ${y} Q${x + 20 * s} ${y + 11 * s} ${x} ${y}Z`}
          fill="var(--color-sage)"
          style={{ opacity: 0.1, animation: `leafIn 1s ease ${d + 0.6}s both` }}
        />
      ))}

      {/* ── Ring circles ── */}
      {([
        [880, 155, 65, 0],
        [380, 720, 80, 1.5],
        [1190, 760, 55, 2.5],
        [680, 830, 48, 1],
        [1080, 310, 42, 3],
        [240, 1500, 58, 2],
        [1300, 1600, 44, 1.2],
        [600, 2100, 52, 2.8],
        [1100, 2400, 38, 0.8],
      ] as [number, number, number, number][]).map(([cx, cy, r, d], i) => (
        <circle key={`ring${i}`} cx={cx} cy={cy} r={r}
          fill="none" stroke="var(--color-sage)" strokeWidth="0.7"
          style={{ animation: `ripple 8s ease ${d}s infinite`, opacity: 0.14 }}
        />
      ))}

      {/* ── Dot accents ── */}
      {([
        [420, 138], [778, 62], [1056, 228], [156, 380], [1318, 505],
        [540, 798], [920, 742], [280, 1300], [1200, 1450], [460, 1800],
        [1050, 2000], [700, 2300], [180, 2600], [1350, 2800],
      ] as [number, number][]).map(([x, y], i) => (
        <circle key={`dot${i}`} cx={x} cy={y} r="3.5"
          fill="var(--color-sage)"
          style={{ animation: `dotPulse 4s ease ${(i * 0.9) % 5}s infinite`, opacity: 0.2 }}
        />
      ))}
    </svg>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--color-bg)' }}>
      <BotanicalBg />

      {/* ── Hero ── */}
      <section style={{ minHeight: '88vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 60px 0', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: 720, animation: 'fadeUp 0.9s ease both' }}>
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
                textDecoration: 'none', boxShadow: '0 5px 22px rgba(45,74,62,0.28)', display: 'inline-block',
              }}
            >
              Book a Free Call
            </Link>
            <Link
              href="/work-with-me"
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

      {/* ── Divider ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 60px 0', position: 'relative', zIndex: 5 }}>
        <div style={{ height: 1, background: 'var(--color-border)' }} />
      </div>

      {/* ── The Turning Point ── */}
      <section style={{ padding: '80px 60px 0', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: 660, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: 800, color: 'var(--color-text-primary)', lineHeight: 1.22, letterSpacing: '-0.025em', marginBottom: 28 }}>
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

      {/* ── What Deepbloom Is ── */}
      <section style={{ padding: '64px 60px 0', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-2xl)', padding: '48px 52px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <div className="grid md:grid-cols-2" style={{ gap: 56, alignItems: 'center' }}>
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
            <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Photography coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Offer Snapshot ── */}
      <section style={{ padding: '64px 60px 0', position: 'relative', zIndex: 5 }}>
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

      {/* ── About Bridge ── */}
      <section style={{ padding: '64px 60px 0', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-2xl)', padding: '48px 52px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <div className="grid md:grid-cols-2" style={{ gap: 56, alignItems: 'center' }}>
            <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
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
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '64px 60px 0', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.4vw, 30px)', fontWeight: 700, color: 'var(--color-text-secondary)', textAlign: 'center', letterSpacing: '-0.015em', marginBottom: 36 }}>
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

      {/* ── Final CTA band ── */}
      <section style={{ padding: '64px 60px 72px', position: 'relative', zIndex: 5 }}>
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
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, color: 'rgba(250,247,242,0.4)', letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: 16 }}>
              Begin here
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800, color: 'var(--color-text-inverse)', letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: 16 }}>
              Ready to begin?
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'rgba(250,247,242,0.5)', lineHeight: 1.78, maxWidth: 420, margin: '0 auto 34px' }}>
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
        </div>
      </section>

    </div>
  )
}
