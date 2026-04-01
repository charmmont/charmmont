'use client'

import Link from 'next/link'

function LogoMark({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path
        d="M14 3.5 Q21 8 21 13.5 Q21 22 14 24 Q7 22 7 13.5 Q7 8 14 3.5Z"
        stroke="var(--color-pine)"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M14 24 L14 13.5 Q11 17 7 15.5"
        stroke="var(--color-pine)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M14 13.5 Q17.5 10 21 11.5"
        stroke="var(--color-sage)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="14" cy="13.5" r="1.8" fill="var(--color-sage)" opacity="0.65" />
    </svg>
  )
}

export default function Footer() {
  const links = [
    { href: '/about', label: 'About' },
    { href: '/work-with-me', label: 'Work With Me' },
    { href: '/the-understory', label: 'The Understory' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <footer style={{
      background: 'var(--color-bg-card)',
      borderTop: '1px solid var(--color-border)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '18px 60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <LogoMark size={20} />
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15,
            fontWeight: 700,
            color: 'var(--color-pine)',
            letterSpacing: '-0.02em',
          }}>
            Deepbloom
          </span>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontStyle: 'italic',
            color: 'var(--color-text-secondary)',
          }}>
            Root deep, bloom safe.
          </span>
        </div>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-pine)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          color: 'var(--color-text-secondary)',
          flexShrink: 0,
        }}>
          © 2026 Deepbloom
        </span>
      </div>
    </footer>
  )
}
