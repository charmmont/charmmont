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

const practitionerLinks = [
  { href: '/portal/dashboard', label: 'Dashboard' },
  { href: '/portal/clients', label: 'Clients' },
  { href: '/portal/sessions', label: 'Sessions' },
  { href: '/portal/toolbox', label: 'Toolbox' },
]

const clientLinks = [
  { href: '/portal/my-space', label: 'My Space' },
  { href: '/portal/my-space/sessions', label: 'Sessions' },
  { href: '/portal/my-space/tools', label: 'My Tools' },
  { href: '/portal/my-space/profile', label: 'Profile' },
]

export default function PortalNav({ role, name }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = role === 'practitioner' ? practitionerLinks : clientLinks

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/portal/login')
    router.refresh()
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#2D4A3E]/10 h-14">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <Link
            href={role === 'practitioner' ? '/portal/dashboard' : '/portal/my-space'}
            className="flex items-center gap-3"
          >
            <span
              className="text-lg font-semibold text-[#2D4A3E]"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Deepbloom
            </span>
            <span className="hidden sm:block text-xs text-[#6B6B65] border border-[#6B6B65]/20 px-2 py-0.5 rounded-full">
              {role === 'practitioner' ? 'Practitioner' : 'My Space'}
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm transition-colors ${
                  pathname === href
                    ? 'text-[#2D4A3E] font-medium'
                    : 'text-[#6B6B65] hover:text-[#2D4A3E]'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-[#6B6B65] truncate max-w-[120px]">{name}</span>
            <button
              onClick={handleSignOut}
              className="text-xs text-[#6B6B65] hover:text-[#2D4A3E] transition-colors hidden md:block"
            >
              Sign out
            </button>
            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-5 h-5 text-[#2D4A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="h-14 px-6 flex items-center justify-between border-b border-[#2D4A3E]/10">
            <span
              className="text-lg font-semibold text-[#2D4A3E]"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Deepbloom
            </span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <svg className="w-5 h-5 text-[#2D4A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex flex-col px-8 pt-10 gap-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`text-2xl font-semibold ${
                  pathname === href ? 'text-[#2D4A3E]' : 'text-[#1C1C1A]'
                }`}
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                {label}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="mt-6 text-left text-sm text-[#6B6B65]"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </>
  )
}
