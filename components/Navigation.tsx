'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const links = [
    { href: '/about', label: 'About' },
    { href: '/work-with-me', label: 'Work With Me' },
    { href: '/the-understory', label: 'The Understory' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#2D4A3E]/10' : 'bg-[#FAF7F2]'
      }`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Wordmark */}
          <Link href="/" className="flex flex-col leading-none group">
            <span className="font-serif text-xl font-semibold text-[#2D4A3E] tracking-tight">
              Deepbloom
            </span>
            <span className="text-[10px] text-[#6B6B65] font-body tracking-wider">
              Root deep, bloom safe.
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-[#1C1C1A] hover:text-[#2D4A3E] transition-colors font-body"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/first-root"
              className="bg-[#2D4A3E] text-white text-sm px-5 py-2 rounded-full hover:bg-[#7A9E8E] transition-colors font-body"
            >
              Book a Call
            </Link>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span className="block w-6 h-0.5 bg-[#2D4A3E]" />
            <span className="block w-6 h-0.5 bg-[#2D4A3E]" />
            <span className="block w-4 h-0.5 bg-[#2D4A3E]" />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col">
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#2D4A3E]/10">
            <Link href="/" onClick={() => setMenuOpen(false)} className="flex flex-col leading-none">
              <span className="font-serif text-xl font-semibold text-[#2D4A3E]">Deepbloom</span>
              <span className="text-[10px] text-[#6B6B65] tracking-wider">Root deep, bloom safe.</span>
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-2 text-[#2D4A3E]"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center px-8 gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-3xl text-[#1C1C1A] hover:text-[#2D4A3E] transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/first-root"
              onClick={() => setMenuOpen(false)}
              className="mt-4 self-start bg-[#2D4A3E] text-white text-base px-8 py-3 rounded-full hover:bg-[#7A9E8E] transition-colors"
            >
              Book a Call
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
