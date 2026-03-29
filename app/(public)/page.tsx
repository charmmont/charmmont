import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Deepbloom — Root Deep, Bloom Safe',
  description:
    'Deepbloom is a therapeutic coaching practice for people ready to go beneath the surface.',
}

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-[90vh] flex flex-col justify-center px-6 max-w-6xl mx-auto py-24">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.2em] text-[#7A9E8E] uppercase mb-6 font-body">
            Root Deep, Bloom Safe.
          </p>
          <h1
            className="text-5xl md:text-7xl font-semibold text-[#1C1C1A] leading-[1.1] mb-6"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            The space where the real work of becoming yourself begins.
          </h1>
          <p className="text-lg md:text-xl text-[#6B6B65] max-w-xl leading-relaxed mb-10">
            Deepbloom is a therapeutic coaching practice for people ready to go beneath the surface.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/first-root"
              className="bg-[#2D4A3E] text-white px-8 py-3.5 rounded-full text-base hover:bg-[#7A9E8E] transition-colors"
            >
              Book a Free Call
            </Link>
            <Link
              href="/work-with-me"
              className="border border-[#2D4A3E] text-[#2D4A3E] px-8 py-3.5 rounded-full text-base hover:bg-[#2D4A3E] hover:text-white transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-[#2D4A3E]/10" />
      </div>

      {/* The Turning Point */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-semibold text-[#1C1C1A] mb-10 leading-tight"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Something in you already knows it&apos;s time.
          </h2>
          <div className="space-y-6 text-[#6B6B65] text-lg leading-[1.8] text-left">
            <p>
              You can feel it — that quiet sense that who you are right now isn&apos;t the whole story.
              That somewhere beneath the noise, the habits, the beliefs that shaped you before you
              could choose them, there&apos;s someone waiting to emerge.
            </p>
            <p>
              You&apos;re not broken. You&apos;re not behind. You&apos;ve simply been carrying things that were
              never yours to carry forever.
            </p>
            <p>This is the space for the work that changes that.</p>
          </div>
        </div>
      </section>

      {/* What Deepbloom Is */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2
                className="text-3xl md:text-4xl font-semibold text-[#1C1C1A] mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Therapeutic coaching that goes where it needs to go.
              </h2>
              <p className="text-[#6B6B65] text-lg leading-[1.8] mb-8">
                Deepbloom is not about surface-level fixes or performance. It&apos;s about depth —
                honest, unhurried work that reaches the root of old patterns and beliefs, so you
                can finally grow into who you&apos;re becoming. No jargon. No judgement. Just real.
              </p>
              <Link
                href="/work-with-me"
                className="text-[#2D4A3E] text-sm hover:text-[#7A9E8E] transition-colors inline-flex items-center gap-2"
              >
                Learn how we work <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="bg-[#FAF7F2] rounded-2xl h-80 flex items-center justify-center">
              <p className="text-[#6B6B65] text-sm italic">Photography coming soon</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Offer Snapshot */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#2D4A3E] rounded-2xl p-10 md:p-14 text-center">
            <h2
              className="text-3xl md:text-4xl font-semibold text-[#FAF7F2] mb-2"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              The Becoming
            </h2>
            <p className="text-[#7A9E8E] text-base mb-8">1:1 Therapeutic Coaching</p>
            <p className="text-[#FAF7F2]/80 text-lg leading-[1.8] mb-10">
              A personal, held programme for people ready to do the deeper work. We go beneath the
              presenting problem — into the patterns, the beliefs, the moments that shaped you —
              and we build something new from there.
            </p>
            <Link
              href="/work-with-me"
              className="inline-block bg-[#FAF7F2] text-[#2D4A3E] px-8 py-3.5 rounded-full text-base hover:bg-[#7A9E8E] hover:text-white transition-colors"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* About Bridge */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="bg-[#FAF7F2] rounded-2xl h-80 flex items-center justify-center order-2 md:order-1">
              <p className="text-[#6B6B65] text-sm italic">Ayelen — Deepbloom</p>
            </div>
            <div className="order-1 md:order-2">
              <h2
                className="text-3xl md:text-4xl font-semibold text-[#1C1C1A] mb-6 leading-tight"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                I&apos;ve walked this path.
              </h2>
              <p className="text-[#6B6B65] text-lg leading-[1.8] mb-6">
                Transformation isn&apos;t a performance. It happens in the quiet, in the honest
                conversations, in the moments when someone finally feels safe enough to tell the
                truth about where they are — and dare to imagine where they could go.
              </p>
              <p className="text-[#6B6B65] text-lg leading-[1.8] mb-8">
                My name is Ayelen. This practice is built from everything I know about that journey.
              </p>
              <Link
                href="/about"
                className="text-[#2D4A3E] text-sm hover:text-[#7A9E8E] transition-colors inline-flex items-center gap-2"
              >
                Read my story <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-2xl font-semibold text-center text-[#6B6B65] mb-12"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            What clients say
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-8">
                <p className="text-[#6B6B65] text-base leading-[1.8] mb-6 italic">
                  &ldquo;Testimonials will appear here as they are collected.&rdquo;
                </p>
                <p className="text-[#2D4A3E] text-sm font-medium">—</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-[#2D4A3E]">
        <div className="max-w-xl mx-auto text-center">
          <h2
            className="text-3xl md:text-4xl font-semibold text-[#FAF7F2] mb-4"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Ready to begin?
          </h2>
          <p className="text-[#7A9E8E] text-lg mb-10">
            The First Root is a free 30-minute conversation. No commitment. Just a beginning.
          </p>
          <Link
            href="/first-root"
            className="inline-block bg-[#FAF7F2] text-[#2D4A3E] px-10 py-4 rounded-full text-base hover:bg-[#7A9E8E] hover:text-white transition-colors"
          >
            Book your free call
          </Link>
        </div>
      </section>
    </>
  )
}
