'use client'

import Link from 'next/link'

function LogoMark({ size = 24 }: { size?: number }) {
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
  return (
    <footer style={{
      background: 'var(--color-bg-card)',
      borderTop: '1px solid var(--color-border)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 60px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 32, marginBottom: 40 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
              <LogoMark size={22} />
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 17,
                fontWeight: 700,
                color: 'var(--color-pine)',
                letterSpacing: '-0.02em',
              }}>
                Deepbloom
              </span>
            </div>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              color: 'var(--color-sage)',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
            }}>
              Root deep, bloom safe
            </p>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 28px' }}>
            {[
              { href: '/', label: 'Home' },
              { href: '/about', label: 'About' },
              { href: '/work-with-me', label: 'Work With Me' },
              { href: '/the-understory', label: 'The Understory' },
              { href: '/contact', label: 'Contact' },
              { href: '/privacy', label: 'Privacy Policy' },
            ].map(({ href, label }) => (
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
          </div>

          {/* Social */}
          <div style={{ display: 'flex', gap: 14 }}>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={{ color: 'var(--color-text-secondary)', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-pine)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <svg width={18} height={18} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{ color: 'var(--color-text-secondary)', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-pine)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <svg width={18} height={18} fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <div style={{
          paddingTop: 20,
          borderTop: '1px solid var(--color-border)',
          fontFamily: 'var(--font-body)',
          fontSize: 11,
          color: 'var(--color-text-secondary)',
        }}>
          © 2025 Deepbloom. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
