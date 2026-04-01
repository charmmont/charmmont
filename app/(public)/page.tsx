import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deepbloom — Root Deep, Bloom Safe',
  description:
    'Deepbloom is a therapeutic coaching practice for people ready to go beneath the surface.',
}

// ── Botanical SVG layer ────────────────────────────────────────────────────

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
          style={{ opacity: 0.12, animation: `leafIn 1s ease ${d + 0.4}s both` }}
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

// ── Floating portal preview card ───────────────────────────────────────────

function PortalCard() {
  return (
    <div style={{ position: 'relative', height: 440 }} className="hidden md:block">
      {/* Main card */}
      <div style={{
        position: 'absolute', top: 0, left: '4%', right: '7%',
        background: 'var(--color-bg-card)',
        borderRadius: 22,
        border: '1px solid var(--color-border)',
        padding: 26,
        animation: 'floatA 7s ease-in-out infinite',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Client header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-pine), var(--color-sage))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ color: 'var(--color-text-inverse)', fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700 }}>S</span>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>
              Welcome back, Sarah
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 1 }}>
              Session 4 of 10 · The Becoming
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Journey progress
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: 'var(--color-pine)' }}>40%</span>
          </div>
          <div style={{ height: 5, background: 'var(--color-progress-bg)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <div style={{ width: '40%', height: '100%', background: 'var(--color-progress)', borderRadius: 'var(--radius-sm)' }} />
          </div>
        </div>

        {/* Next session */}
        <div style={{ background: 'var(--color-bg)', borderRadius: 13, padding: '13px 16px', marginBottom: 12, border: '1px solid var(--color-border)' }}>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            Next Session
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
            Thursday, 3 April · 10:00am
          </div>
        </div>

        {/* Active tool */}
        <div style={{ background: 'var(--color-tag-bg)', borderRadius: 13, padding: '13px 16px', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
                Active Tool
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                Wheel of Life
              </div>
            </div>
            <svg width="42" height="42" viewBox="0 0 42 42">
              <circle cx="21" cy="21" r="16" fill="none" stroke="var(--color-progress-bg)" strokeWidth="3.5" />
              <circle cx="21" cy="21" r="16" fill="none" stroke="var(--color-progress)" strokeWidth="3.5"
                strokeDasharray="60.3 100.5" strokeDashoffset="25" strokeLinecap="round"
                transform="rotate(-90 21 21)" />
              <text x="21" y="25" textAnchor="middle" fontSize="8.5" fill="var(--color-pine)" fontFamily="DM Sans" fontWeight="600">60%</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Floating quote card */}
      <div style={{
        position: 'absolute', bottom: 24, right: -14,
        background: 'var(--color-pine)',
        borderRadius: 16,
        padding: '16px 18px',
        animation: 'floatB 6.5s ease-in-out 1.2s infinite',
        boxShadow: '0 14px 42px rgba(45,74,62,0.35)',
        maxWidth: 210,
        zIndex: 2,
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 12.5, lineHeight: 1.55, color: 'rgba(250,247,242,0.85)', marginBottom: 7 }}>
          &ldquo;I finally feel like myself again.&rdquo;
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, color: 'rgba(250,247,242,0.4)' }}>
          — Sarah, The Becoming
        </div>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 60px 60px', minHeight: '90vh' }}>
        <BotanicalBg />

        <div style={{ position: 'relative', zIndex: 5, maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 68, alignItems: 'center', minHeight: 'calc(90vh - 140px)' }}>

          {/* Left column */}
          <div style={{ animation: 'fadeUp 0.9s ease both', animationFillMode: 'both' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28,
              padding: '6px 16px', borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--color-border)', background: 'var(--color-tag-bg)',
            }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-sage)' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, fontWeight: 500, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--color-tag-text)' }}>
                Therapeutic Coaching · Online
              </span>
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(40px, 4.8vw, 64px)',
              fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em',
              color: 'var(--color-text-primary)', marginBottom: 24,
            }}>
              The space where your{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>true self</em>{' '}
              takes root.
            </h1>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 16.5, fontWeight: 300,
              color: 'var(--color-text-secondary)', lineHeight: 1.82, maxWidth: 430, marginBottom: 40,
            }}>
              Deepbloom is therapeutic coaching for people ready to go beneath the surface — honest, unhurried work to release old patterns and bloom into who you&apos;re becoming.
            </p>

            <div style={{ display: 'flex', gap: 12, marginBottom: 44 }}>
              <Link
                href="/first-root"
                className="hover:-translate-y-0.5 transition-transform"
                style={{
                  padding: '13px 28px', borderRadius: 'var(--radius-full)',
                  background: 'var(--color-pine)', color: 'var(--color-text-inverse)',
                  fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 5px 22px rgba(45,74,62,0.28)',
                  display: 'inline-block',
                }}
              >
                Book The First Root →
              </Link>
              <Link
                href="/work-with-me"
                style={{
                  padding: '13px 26px', borderRadius: 'var(--radius-full)',
                  background: 'transparent', border: '1.5px solid var(--color-border)',
                  color: 'var(--color-pine)',
                  fontFamily: 'var(--font-body)', fontSize: 13.5,
                  textDecoration: 'none', display: 'inline-block',
                }}
              >
                Learn more
              </Link>
            </div>

            {/* Mini stats */}
            <div style={{ display: 'flex', gap: 32 }}>
              {([['1:1', 'Personalised'], ['Online', 'Anywhere'], ['GDPR', 'Compliant']] as [string, string][]).map(([n, l]) => (
                <div key={n}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--color-pine)', letterSpacing: '-0.01em' }}>{n}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.09em', marginTop: 3 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — floating cards */}
          <div style={{ animation: 'slideRight 0.9s ease 0.15s both', animationFillMode: 'both' }}>
            <PortalCard />
          </div>
        </div>
      </section>

      {/* ── Turning point ── */}
      <section style={{ padding: '72px 60px', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: 660, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 22,
            padding: '5px 14px', borderRadius: 'var(--radius-full)', background: 'var(--color-tag-bg)',
          }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-sage)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-tag-text)' }}>
              Something in you already knows
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 3.6vw, 48px)',
            fontWeight: 800, color: 'var(--color-text-primary)',
            letterSpacing: '-0.025em', lineHeight: 1.12, marginBottom: 22,
          }}>
            You don&apos;t need to have it figured out to{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>begin.</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.82, maxWidth: 520, margin: '0 auto' }}>
            Beneath the noise, the habits, the beliefs that shaped you before you could choose them — there&apos;s someone waiting to bloom. Deepbloom creates the space to find them.
          </p>
        </div>
      </section>

      {/* ── Offer cards ── */}
      <section style={{ padding: '0 60px 72px', position: 'relative', zIndex: 5 }}>
        <div className="grid md:grid-cols-3" style={{ gap: 18 }}>
          {([
            {
              title: 'The Becoming', sub: 'Core 1:1 Programme', tag: 'Most chosen',
              desc: "Deep, unhurried coaching that goes where it needs to go — into the patterns, the beliefs, the story you've been living.",
              cta: 'Learn more →', href: '/work-with-me', color: 'var(--color-pine)',
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2 Q19 7 19 12.5 Q19 21 12 23 Q5 21 5 12.5 Q5 7 12 2Z" stroke="var(--color-pine)" strokeWidth="1.3" fill="rgba(45,74,62,0.07)" />
                  <path d="M12 23 L12 12.5 Q9.5 16 6 14.5" stroke="var(--color-pine)" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              ),
            },
            {
              title: 'The First Root', sub: 'Free Discovery Call', tag: 'Start here',
              desc: 'A 30-minute conversation — no commitment, no agenda. Just an honest talk about where you are and what\'s possible.',
              cta: 'Book now →', href: '/first-root', color: 'var(--color-sage)',
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8.5" stroke="var(--color-sage)" strokeWidth="1.3" fill="rgba(122,158,142,0.09)" />
                  <path d="M12 3.5 L12 12 M12 12 L17 7.5" stroke="var(--color-sage)" strokeWidth="1.4" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="2" fill="var(--color-sage)" opacity="0.65" />
                </svg>
              ),
            },
            {
              title: 'The Toolbox', sub: 'Self-Discovery Tools', tag: 'Included',
              desc: 'Wheel of Life, Belief Mapping, Mood Tracking, Reflection Journals — therapeutic instruments built for your journey.',
              cta: 'Explore →', href: '/work-with-me', color: 'var(--color-sage-light)',
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 20 Q7 8.5 12 6.5 Q17 8.5 19 20" stroke="var(--color-sage-light)" strokeWidth="1.3" fill="rgba(168,196,184,0.12)" strokeLinecap="round" />
                  <path d="M3 21.5 Q12 18 21 21.5" stroke="var(--color-sage-light)" strokeWidth="1.3" strokeLinecap="round" />
                  <circle cx="12" cy="6.5" r="1.8" fill="var(--color-sage-light)" opacity="0.65" />
                </svg>
              ),
            },
          ] as const).map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group hover:-translate-y-1.5 transition-transform"
              style={{
                background: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-xl)',
                padding: '28px 30px',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)',
                textDecoration: 'none',
                display: 'block',
                transition: 'transform 0.28s, box-shadow 0.28s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'var(--color-tag-bg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'iconFloat 3s ease-in-out infinite',
                  animationFillMode: 'both',
                }}>
                  {card.icon}
                </div>
                <div style={{
                  padding: '4px 12px', borderRadius: 'var(--radius-full)',
                  background: 'var(--color-tag-bg)', color: 'var(--color-tag-text)',
                  fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500,
                }}>
                  {card.tag}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 5, letterSpacing: '-0.01em' }}>
                {card.title}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: 14 }}>
                {card.sub}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.75, marginBottom: 18 }}>
                {card.desc}
              </p>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, fontWeight: 500, color: card.color }}>
                {card.cta}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── About bridge ── */}
      <section style={{ padding: '0 60px 72px', position: 'relative', zIndex: 5 }}>
        <div style={{
          background: 'var(--color-bg-card)',
          borderRadius: 'var(--radius-2xl)',
          padding: '48px 52px',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <div className="grid md:grid-cols-2" style={{ gap: 56, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '5px 14px', borderRadius: 'var(--radius-full)', background: 'var(--color-tag-bg)' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-sage)' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--color-tag-text)' }}>The guide</span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3vw, 40px)',
                fontWeight: 800, color: 'var(--color-text-primary)',
                letterSpacing: '-0.025em', lineHeight: 1.12, marginBottom: 20,
              }}>
                I&apos;ve walked{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>this path.</em>
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.82, marginBottom: 18 }}>
                My name is Ayelen — it means &ldquo;happiness of the home&rdquo; in Mapuche. That phrase has become the compass of my practice: not the performance of happiness, but the deep, grounded sense of being truly at home in yourself.
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.82, marginBottom: 28 }}>
                That journey — inward and then outward — is one I know personally. It taught me that real transformation happens in the quiet, in honest conversations, and in the moments when someone finally feels safe enough to begin.
              </p>
              <Link
                href="/about"
                style={{
                  display: 'inline-block', padding: '11px 24px',
                  borderRadius: 'var(--radius-full)', background: 'transparent',
                  border: '1.5px solid var(--color-border)', color: 'var(--color-pine)',
                  fontFamily: 'var(--font-body)', fontSize: 13, textDecoration: 'none',
                }}
              >
                Read my story →
              </Link>
            </div>

            {/* Belief blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {([
                ['"Real change happens beneath the surface, not on it."', 'var(--color-pine)'],
                ['"Safety is not a soft extra. It\'s where transformation begins."', 'var(--color-sage)'],
                ['"You are not a problem to be fixed. You are a person becoming."', 'var(--color-sage-light)'],
              ] as [string, string][]).map(([quote, borderColor], i) => (
                <div key={i} style={{
                  padding: '16px 20px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderLeft: `3px solid ${borderColor}`,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13.5, lineHeight: 1.62, color: 'var(--color-text-primary)', marginBottom: 8 }}>
                    {quote}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, color: 'var(--color-text-secondary)' }}>— Ayelen</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA band ── */}
      <section style={{ padding: '0 60px 72px', position: 'relative', zIndex: 5 }}>
        <div style={{
          background: 'var(--color-pine)',
          borderRadius: 'var(--radius-2xl)',
          padding: '56px 64px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Botanical accent in CTA */}
          <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.1 }} viewBox="0 0 900 280" preserveAspectRatio="xMidYMid slice">
            <path d="M-40 280 Q120 200 200 160 Q280 120 270 60" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M940 280 Q780 200 700 160 Q620 120 630 60" stroke="#fff" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            {[[180, 92], [680, 105], [430, 28], [78, 188], [810, 195]].map(([x, y], i) => (
              <path key={i} d={`M${x} ${y} Q${x + 16} ${y - 24} ${x + 28} ${y} Q${x + 16} ${y + 10} ${x} ${y}Z`} fill="#fff" opacity="0.6" />
            ))}
          </svg>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, color: 'rgba(250,247,242,0.4)', letterSpacing: '0.13em', textTransform: 'uppercase', marginBottom: 16 }}>
              Begin here
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 50px)',
              fontWeight: 800, color: 'var(--color-text-inverse)',
              letterSpacing: '-0.025em', lineHeight: 1.08, marginBottom: 18,
            }}>
              Ready to root deep<br />and{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>bloom safe?</em>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'rgba(250,247,242,0.5)', lineHeight: 1.78, maxWidth: 420, margin: '0 auto 34px' }}>
              The First Root is a free 30-minute conversation. No commitment. Just the beginning of something real.
            </p>
            <Link
              href="/first-root"
              className="hover:-translate-y-0.5 transition-transform"
              style={{
                display: 'inline-block', padding: '14px 34px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-bg)', color: 'var(--color-pine)',
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
              }}
            >
              Book The First Root
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
