'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/lib/types'

interface Props {
  role: UserRole
  name: string
}

// ── Icons ──────────────────────────────────────────────────────────────────

function IconDashboard() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function IconClients() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function IconToolbox() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v4m0 0H3m6 0h12M3 7v13a2 2 0 002 2h14a2 2 0 002-2V7" />
    </svg>
  )
}

function IconInvoice() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  )
}

function IconFolder() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  )
}

function IconHome() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconSignOut() {
  return (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M14 3.5 Q21 8 21 13.5 Q21 22 14 24 Q7 22 7 13.5 Q7 8 14 3.5Z" stroke="var(--color-pine)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M14 24 L14 13.5 Q11 17 7 15.5" stroke="var(--color-pine)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M14 13.5 Q17.5 10 21 11.5" stroke="var(--color-sage)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <circle cx="14" cy="13.5" r="1.8" fill="var(--color-sage)" opacity="0.65" />
    </svg>
  )
}

// ── Nav config ─────────────────────────────────────────────────────────────

const practitionerLinks = [
  { href: '/portal/dashboard',  label: 'Dashboard', Icon: IconDashboard },
  { href: '/portal/clients',    label: 'Clients',   Icon: IconClients },
  { href: '/portal/sessions',   label: 'Sessions',  Icon: IconCalendar },
  { href: '/portal/toolbox',    label: 'Toolbox',   Icon: IconToolbox },
  { href: '/portal/invoices',   label: 'Invoices',  Icon: IconInvoice },
  { href: '/portal/documents',  label: 'Documents', Icon: IconFolder },
]

const clientLinks = [
  { href: '/portal/my-space',           label: 'My Space',  Icon: IconHome },
  { href: '/portal/my-space/sessions',  label: 'Sessions',  Icon: IconCalendar },
  { href: '/portal/my-space/tools',     label: 'My Tools',  Icon: IconStar },
  { href: '/portal/my-space/invoices',  label: 'Invoices',  Icon: IconInvoice },
  { href: '/portal/my-space/documents', label: 'Documents', Icon: IconFolder },
  { href: '/portal/my-space/profile',   label: 'Profile',   Icon: IconUser },
]

// ── Component ──────────────────────────────────────────────────────────────

export default function PortalNav({ role, name }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = role === 'practitioner' ? practitionerLinks : clientLinks

  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
    router.refresh()
  }

  function isActive(href: string) {
    if (href === '/portal/my-space') return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden md:flex"
        style={{
          width: 222,
          flexShrink: 0,
          background: 'var(--color-bg-card)',
          borderRight: '1px solid var(--color-border)',
          padding: '22px 12px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          flexDirection: 'column',
          gap: 2,
          boxShadow: '2px 0 18px rgba(45, 74, 62, 0.04)',
          overflowY: 'auto',
        }}
      >
        {/* Nav items */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {links.map(({ href, label, Icon }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '9px 12px',
                  borderRadius: 11,
                  background: active ? 'var(--color-active)' : 'transparent',
                  border: `1px solid ${active ? 'var(--color-border)' : 'transparent'}`,
                  textDecoration: 'none',
                  transition: 'background 0.18s, border-color 0.18s',
                  color: active ? 'var(--color-pine)' : 'rgba(45,74,62,0.4)',
                }}
                onMouseEnter={e => {
                  if (!active) e.currentTarget.style.background = 'rgba(45,74,62,0.05)'
                }}
                onMouseLeave={e => {
                  if (!active) e.currentTarget.style.background = 'transparent'
                }}
              >
                <span style={{ flexShrink: 0 }}>
                  <Icon />
                </span>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: active ? 600 : 400,
                  color: active ? 'var(--color-pine)' : 'rgba(45,74,62,0.45)',
                }}>
                  {label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* User footer */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 6px 10px' }}>
            <div style={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-pine), var(--color-sage))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: 'var(--color-text-inverse)', fontFamily: 'var(--font-display)', fontSize: 10, fontWeight: 600 }}>
                {initials}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {name}
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 9.5, color: 'var(--color-text-secondary)', textTransform: 'capitalize' }}>
                {role}
              </div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '8px 12px',
              borderRadius: 10,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              fontFamily: 'var(--font-body)',
              fontSize: 11,
              transition: 'background 0.18s, color 0.18s',
              textAlign: 'left',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(45,74,62,0.05)'
              e.currentTarget.style.color = 'var(--color-pine)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'none'
              e.currentTarget.style.color = 'var(--color-text-secondary)'
            }}
          >
            <IconSignOut />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 54,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          background: 'rgba(250, 247, 242, 0.95)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Link
          href={role === 'practitioner' ? '/portal/dashboard' : '/portal/my-space'}
          style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
        >
          <LogoMark size={20} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--color-pine)', letterSpacing: '-0.02em' }}>
            Deepbloom
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--color-pine)' }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" viewBox="0 0 24 24">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
          }}
        >
          {/* Backdrop */}
          <div
            style={{ position: 'absolute', inset: 0, background: 'rgba(28,28,26,0.35)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div
            style={{
              position: 'relative',
              width: 260,
              height: '100%',
              background: 'var(--color-bg-card)',
              display: 'flex',
              flexDirection: 'column',
              padding: '76px 14px 22px',
              boxShadow: 'var(--shadow-lg)',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 22, padding: '0 6px' }}>
              <button onClick={() => setMobileOpen(false)} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', padding: 4 }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {links.map(({ href, label, Icon }) => {
                const active = isActive(href)
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '11px 14px',
                      borderRadius: 12,
                      background: active ? 'var(--color-active)' : 'transparent',
                      border: `1px solid ${active ? 'var(--color-border)' : 'transparent'}`,
                      textDecoration: 'none',
                      color: active ? 'var(--color-pine)' : 'rgba(45,74,62,0.4)',
                    }}
                  >
                    <Icon />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: active ? 600 : 400, color: active ? 'var(--color-pine)' : 'rgba(45,74,62,0.55)' }}>
                      {label}
                    </span>
                  </Link>
                )
              })}
            </nav>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 14, marginTop: 8 }}>
              <button
                onClick={handleSignOut}
                style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '10px 14px', borderRadius: 11, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-body)', fontSize: 12 }}
              >
                <IconSignOut />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
