'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

function LogoMark({ size = 28 }: { size?: number }) {
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

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const links = [
    { href: '/about', label: 'About' },
    { href: '/work-with-me', label: 'Work With Me' },
    { href: '/the-understory', label: 'The Understory' },
  ]

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          height: 66,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 60px',
          background: scrolled ? 'rgba(250, 247, 242, 0.92)' : 'var(--color-bg)',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--color-border)' : 'transparent'}`,
          transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
        }}
      >
        {/* Wordmark */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <LogoMark size={28} />
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--color-pine)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}>
              Deepbloom
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 9,
              color: 'var(--color-sage)',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              marginTop: 2,
            }}>
              Root deep, bloom safe
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 32 }}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 400,
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
          <Link
            href="/first-root"
            style={{
              padding: '11px 26px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-pine)',
              color: 'var(--color-text-inverse)',
              fontFamily: 'var(--font-body)',
              fontSize: 13.5,
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.01em',
              boxShadow: '0 5px 22px rgba(45, 74, 62, 0.28)',
              transition: 'transform 0.22s, box-shadow 0.22s',
              display: 'inline-block',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 10px 32px rgba(45, 74, 62, 0.38)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 5px 22px rgba(45, 74, 62, 0.28)'
            }}
          >
            Book a Free Call
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
          }}
        >
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--color-pine)', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--color-pine)', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 14, height: 1.5, background: 'var(--color-pine)', borderRadius: 2 }} />
        </button>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 200,
          background: 'var(--color-bg)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            height: 66,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <Link href="/" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <LogoMark size={24} />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--color-pine)', letterSpacing: '-0.02em' }}>
                Deepbloom
              </span>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--color-pine)' }}
            >
              <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 32px', gap: 32 }}>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 30,
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  textDecoration: 'none',
                  letterSpacing: '-0.02em',
                }}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/first-root"
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: 8,
                alignSelf: 'flex-start',
                padding: '13px 32px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-pine)',
                color: 'var(--color-text-inverse)',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Book a Free Call
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
