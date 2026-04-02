import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deepbloom — Root Deep, Bloom Safe',
  description:
    'Deepbloom is a therapeutic coaching practice for people ready to go beneath the surface.',
}

// ── Full-page botanical background ─────────────────────────────────────────

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
        d="M-60 900 Q50 780 100 700 Q150 620 140 540 Q130 460 175 380 Q220 300 175 200 Q120 80 10 -20"
        stroke="var(--color-pine)" strokeWidth="1.6" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 950, strokeDashoffset: 950, animation: 'rootDraw 4.5s ease 0.3s forwards', opacity: 0.13 }}
      />
      <path
        d="M100 700 Q128 678 150 703 Q160 719 148 735"
        stroke="var(--color-pine)" strokeWidth="1" strokeLinecap="round" fill="none"
        style={{ strokeDasharray: 200, strokeDashoffset: 200, animation: 'rootDraw 2.5s ease 1s forwards', opacity: 0.1 }}
      />
      <path
        d="M140 540 Q168 520 188 545 Q198 562 186 578"
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

      {/* ── Leaf shapes — upper left, right-side ── */}
      {/*
        Verified bboxes (no overlap):
        node-1  (102,692,0.85): x[102,131] y[668,701]
        node-2  (142,532,0.85): x[142,171] y[508,541]
        stem-mid(174,374,0.82): x[174,202] y[351,383]
        stem-up (174,192,0.82): x[174,202] y[169,201]
        top     (104,130,0.78): x[104,130] y[108,139]  — brought down from y=38
      */}
      {([
        [102, 692, 0.3, 0.85],
        [142, 532, 0.8, 0.85],
        [174, 374, 1.3, 0.82],
        [174, 192, 1.5, 0.82],
        [104, 130, 1.8, 0.78],
      ] as [number, number, number, number][]).map(([x, y, d, s], i) => (
        <path key={`ul-r${i}`}
          d={`M${x} ${y} Q${x + 20 * s} ${y - 28 * s} ${x + 34 * s} ${y} Q${x + 20 * s} ${y + 11 * s} ${x} ${y}Z`}
          fill="var(--color-sage)"
          style={{ opacity: 0.12, animation: `leafIn 1s ease ${d + 0.4}s both` }}
        />
      ))}
      {/* ── Leaf shapes — upper left, left-side (mirrored bilateral) ── */}
      {/*
        Verified bboxes — right ends at x≥102/142, left ends at x≤100/140 → 2-unit gap:
        node-1  (100,714,0.78): x[78,100]  — right x starts 102, no x overlap ✓
        node-2  (140,552,0.78): x[118,140] — right x starts 142, no x overlap ✓
        stem-up (182,222,0.75): x[161,182] — right ends y=201, left starts y=206, no y overlap ✓
      */}
      {([
        [100, 714, 0.5, 0.78],
        [140, 552, 1.0, 0.78],
        [182, 222, 1.6, 0.75],
      ] as [number, number, number, number][]).map(([x, y, d, s], i) => (
        <path key={`ul-l${i}`}
          d={`M${x} ${y} Q${x - 16 * s} ${y - 22 * s} ${x - 28 * s} ${y} Q${x - 16 * s} ${y + 9 * s} ${x} ${y}Z`}
          fill="var(--color-sage)"
          style={{ opacity: 0.10, animation: `leafIn 1s ease ${d + 0.4}s both` }}
        />
      ))}

      {/* ── Leaf shapes — upper right ── */}
      {/* upper-right: spaced so x-ranges never overlap between adjacent leaves */}
      {([
        [1232, 152, 0.5, 0.95], // x:[1232,1264] y:[125,163]
        [1190, 175, 0.8, 0.9],  // x:[1190,1221] — 1221<1232 ✓
        [1162, 228, 1.1, 0.85], // x:[1162,1191] — separate node
        [1158, 545, 1.3, 0.85], // x:[1158,1187] y:[521,554] — lower node
        [1120, 572, 1.6, 0.8],  // x:[1120,1147] — 1147<1158 ✓
      ] as [number, number, number, number][]).map(([x, y, d, s], i) => (
        <path key={`ur${i}`}
          d={`M${x} ${y} Q${x + 20 * s} ${y - 28 * s} ${x + 34 * s} ${y} Q${x + 20 * s} ${y + 11 * s} ${x} ${y}Z`}
          fill="var(--color-sage)"
          style={{ opacity: 0.11, animation: `leafIn 1s ease ${d + 0.4}s both` }}
        />
      ))}

      {/* ── Leaf shapes — mid page ── */}
      {/* mid: spaced so x-ranges never overlap between adjacent leaves */}
      {([
        [115, 1235, 0.9, 0.9],   // x:[115,146] y:[1210,1245]
        [155, 1210, 1.2, 0.85],  // x:[155,184] — 146<155 ✓
        [1255, 1328, 0.7, 1.0],  // x:[1255,1289] y:[1300,1339]
        [1295, 1302, 1.1, 0.85], // x:[1295,1324] — 1289<1295 ✓
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
      <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 60px 80px', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: 700, textAlign: 'center', animation: 'fadeUp 0.9s ease both' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(38px, 5vw, 62px)', fontWeight: 900, color: 'var(--color-text-primary)', lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 28 }}>
              The space where the real work of{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>becoming yourself</em>{' '}
              begins.
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88, marginBottom: 40 }}>
              Deepbloom is a therapeutic coaching practice for people ready to go beneath the surface.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
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
        </div>
      </section>

      {/* ── Divider ── */}
      <div style={{ position: 'relative', zIndex: 5, display: 'flex', justifyContent: 'center', paddingBottom: 80 }}>
        <div style={{ width: 80, height: 1, background: 'var(--color-border)' }} />
      </div>

      {/* ── You don't need to have it figured out ── */}
      <section style={{ padding: '80px 60px 0', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Heading block — centered */}
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 52px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 900, color: 'var(--color-text-primary)', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20 }}>
              You don&apos;t need to have it figured out to{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>begin.</em>
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88 }}>
              Beneath the noise, the habits, the beliefs that shaped you before you could choose them —
              there&apos;s someone waiting to bloom. Deepbloom creates the space to find them.
            </p>
          </div>

          {/* Offer cards — 2 col, centered */}
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
            {/* The First Root */}
            <div style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', padding: '28px 30px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--color-pine)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.04em', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
                  Start here
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
                The First Root
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
                Free Discovery Call
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.78, marginBottom: 24, flex: 1 }}>
                A 30-minute conversation — no commitment, no agenda. Just an honest talk about where you are and what&apos;s possible.
              </p>
              <Link href="/first-root" className="hover:text-[var(--color-sage)] transition-colors" style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-pine)', textDecoration: 'none' }}>
                Book now →
              </Link>
            </div>

            {/* The Becoming */}
            <div style={{ background: 'var(--color-bg-card)', borderRadius: 'var(--radius-xl)', padding: '28px 30px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--color-bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width={22} height={22} viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path d="M14 3.5 Q21 8 21 13.5 Q21 22 14 24 Q7 22 7 13.5 Q7 8 14 3.5Z" stroke="var(--color-pine)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
                    <path d="M14 24 L14 13.5 Q11 17 7 15.5" stroke="var(--color-pine)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                    <path d="M14 13.5 Q17.5 10 21 11.5" stroke="var(--color-sage)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
                  </svg>
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10.5, fontWeight: 500, color: 'var(--color-text-secondary)', letterSpacing: '0.04em', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
                  Most chosen
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: 4 }}>
                The Becoming
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 500, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: 16 }}>
                Core 1:1 Programme
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.78, marginBottom: 24, flex: 1 }}>
                Deep, unhurried coaching that goes where it needs to go — into the patterns, the beliefs, the story you&apos;ve been living.
              </p>
              <Link href="/work-with-me" className="hover:text-[var(--color-sage)] transition-colors" style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: 'var(--color-pine)', textDecoration: 'none' }}>
                Learn more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Deepbloom Is ── */}
      <section style={{ padding: '64px 60px 0', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-2xl)', padding: '48px 52px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <div className="grid md:grid-cols-2" style={{ gap: 56, alignItems: 'center' }}>
            <div>
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

      {/* ── About Bridge ── */}
      <section style={{ padding: '64px 60px 0', position: 'relative', zIndex: 5 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-2xl)', padding: '48px 52px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <div className="grid md:grid-cols-2" style={{ gap: 56, alignItems: 'center' }}>
            <div style={{ background: 'var(--color-bg)', borderRadius: 'var(--radius-xl)', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--color-border)' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Ayelen — Deepbloom</p>
            </div>
            <div>
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

      {/* ── Final CTA band ── */}
      <section style={{ padding: '64px 60px 72px', position: 'relative', zIndex: 5 }}>
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
        </div>
      </section>

    </div>
  )
}
