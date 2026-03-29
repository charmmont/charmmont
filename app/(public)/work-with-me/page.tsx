'use client'

import { useState } from 'react'
import Link from 'next/link'

const faqs = [
  {
    q: 'How do I know if I\'m ready?',
    a: 'If you\'re asking this question, part of you already is. Readiness isn\'t about having it figured out — it\'s about being willing to look. The First Root is the best place to start.',
  },
  {
    q: 'How long is the programme?',
    a: 'The Becoming is shaped around you. There is no fixed number of sessions — we begin where you are and work at a pace that serves your growth. Most clients work with me for several months, with sessions every one to two weeks.',
  },
  {
    q: 'Is this therapy?',
    a: 'No. Therapeutic coaching is not the same as therapy, and I am not a therapist. Coaching is forward-focused — we work with your history to understand it, but the compass always points toward who you\'re becoming. If I believe you need clinical support, I will say so honestly.',
  },
  {
    q: 'What happens in a session?',
    a: 'Sessions are one hour, held online via video. We begin wherever you are that week — what\'s present, what\'s alive, what\'s sitting with you. From there, we go deep. You can expect honesty, care, and work that actually moves something.',
  },
  {
    q: 'What if I\'ve tried coaching before and it didn\'t work?',
    a: 'That\'s worth talking about — and it often tells us something important about where the real work is. Coaching that stays on the surface rarely changes anything lasting. This is different. But I\'d encourage you to bring that experience to The First Root and let\'s explore it together.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#2D4A3E]/10">
      <button
        className="w-full text-left py-6 flex items-start justify-between gap-4 group"
        onClick={() => setOpen(!open)}
      >
        <span
          className="text-[#1C1C1A] text-base font-medium group-hover:text-[#2D4A3E] transition-colors"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          {q}
        </span>
        <span className="text-[#2D4A3E] mt-0.5 shrink-0 text-lg leading-none">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="pb-6 text-[#6B6B65] text-base leading-[1.8]">
          {a}
        </div>
      )}
    </div>
  )
}

export default function WorkWithMePage() {
  return (
    <>
      {/* Opening */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-semibold text-[#1C1C1A] leading-tight mb-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Work With Me
          </h1>
          <p className="text-xl text-[#6B6B65] leading-[1.8] max-w-2xl">
            This is for the person who senses there&apos;s more. More depth, more honesty, more freedom
            in who they are and how they move through the world. You don&apos;t need to have it figured
            out. You just need to be ready to look.
          </p>
        </div>
      </section>

      {/* The Becoming */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.2em] text-[#7A9E8E] uppercase mb-4">The Offer</p>
          <h2
            className="text-3xl md:text-4xl font-semibold text-[#1C1C1A] mb-4"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            The Becoming
          </h2>
          <p className="text-[#6B6B65] text-base mb-8">1:1 Coaching — Online</p>
          <div className="space-y-6 text-[#6B6B65] text-lg leading-[1.8]">
            <p>
              The Becoming is Deepbloom&apos;s core 1:1 coaching programme. It is personal, in-depth work
              — the kind that doesn&apos;t rush, doesn&apos;t skip the difficult parts, and doesn&apos;t settle for
              surface-level insight.
            </p>
            <p>
              We begin with The First Root — a free discovery call to understand where you are, what
              you&apos;re carrying, and what becoming yourself might look like for you. From there, we build
              a programme shaped entirely around you.
            </p>
            <p>Sessions are held online. The pace is yours. The work is ours, together.</p>
          </div>
        </div>
      </section>

      {/* What it isn't */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl font-semibold text-[#1C1C1A] mb-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            What this isn&apos;t
          </h2>
          <div className="space-y-4">
            {[
              'Not a quick fix or a 30-day transformation',
              'Not advice-giving or telling you what to do',
              'Not therapy — but it goes to the places therapy sometimes doesn\'t reach',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="mt-1 w-5 h-5 rounded-full border border-[#2D4A3E]/30 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-[#2D4A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6" />
                  </svg>
                </div>
                <p className="text-[#6B6B65] text-lg">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The client journey */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl font-semibold text-[#1C1C1A] mb-10 text-center"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            The journey
          </h2>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-0">
            {[
              { label: 'The First Root', sub: 'Free discovery call' },
              { label: 'The Becoming', sub: '1:1 Programme' },
              { label: 'In Full Bloom', sub: 'Ongoing' },
            ].map((step, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center flex-1">
                <div className="text-center flex-1 px-4">
                  <div className="w-10 h-10 rounded-full bg-[#2D4A3E] text-white text-sm flex items-center justify-center mx-auto mb-3">
                    {i + 1}
                  </div>
                  <p
                    className="font-semibold text-[#1C1C1A] text-base mb-1"
                    style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                  >
                    {step.label}
                  </p>
                  <p className="text-[#6B6B65] text-sm">{step.sub}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block w-8 text-[#7A9E8E] text-xl shrink-0 mt-4">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl font-semibold text-[#1C1C1A] mb-6"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Investment
          </h2>
          <div className="bg-[#FAF7F2] rounded-2xl p-8">
            <p className="text-[#6B6B65] text-lg italic">
              Pricing details coming soon. Please book a First Root call to discuss what&apos;s right for you.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2
            className="text-2xl font-semibold text-[#1C1C1A] mb-10"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Questions
          </h2>
          <div>
            {faqs.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-[#2D4A3E]">
        <div className="max-w-xl mx-auto text-center">
          <h2
            className="text-3xl font-semibold text-[#FAF7F2] mb-4"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Begin with The First Root
          </h2>
          <p className="text-[#7A9E8E] mb-10">
            A free 30-minute conversation. No commitment.
          </p>
          <Link
            href="/first-root"
            className="inline-block bg-[#FAF7F2] text-[#2D4A3E] px-10 py-4 rounded-full text-base hover:bg-[#7A9E8E] hover:text-white transition-colors"
          >
            Book The First Root
          </Link>
        </div>
      </section>
    </>
  )
}
