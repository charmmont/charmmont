import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'The First Root — Free Discovery Call',
  description:
    'Book your free 30-minute conversation with Ayelen. No commitment. Just a beginning.',
}

export default function FirstRootPage() {
  return (
    <>
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />

      {/* Header */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl font-semibold text-[#1C1C1A] mb-4"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            The First Root
          </h1>
          <p className="text-xl text-[#6B6B65]">
            A free 30-minute conversation. No commitment. Just the beginning.
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#6B6B65] text-lg leading-[1.8] text-center mb-12">
            This is not a sales call. It&apos;s a conversation — a chance for us to understand where you
            are, what&apos;s brought you here, and whether working together feels right. You&apos;ll leave
            with more clarity than you arrived with, whatever you decide.
          </p>

          {/* What to expect */}
          <div className="bg-white rounded-2xl p-8 mb-12">
            <h2
              className="text-xl font-semibold text-[#1C1C1A] mb-6"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              What to expect
            </h2>
            <ul className="space-y-4">
              {[
                '30 minutes, online via video',
                'A space to share what\'s brought you here',
                'Honest conversation about whether Deepbloom is the right fit',
                'No pressure, no obligation',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#2D4A3E] shrink-0" />
                  <span className="text-[#6B6B65] text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Calendly embed */}
          <div
            className="calendly-inline-widget rounded-2xl overflow-hidden"
            data-url="https://calendly.com/deepbloom/first-root?hide_gdpr_banner=1&primary_color=2D4A3E"
            style={{ minWidth: '320px', height: '700px' }}
          />

          {/* Reassurance */}
          <p className="text-center text-[#6B6B65] text-sm mt-8 italic">
            This is a conversation, not a commitment.
          </p>
        </div>
      </section>
    </>
  )
}
