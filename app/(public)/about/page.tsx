import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Ayelen',
  description:
    'I believe every person carries the capacity to bloom into their truest self. Meet Ayelen, founder of Deepbloom.',
}

export default function AboutPage() {
  return (
    <>
      {/* Opening */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h1
            className="text-4xl md:text-5xl font-semibold text-[#1C1C1A] leading-tight mb-0"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            I believe every person carries the capacity to bloom into their truest self.
          </h1>
        </div>
      </section>

      {/* Brand Story */}
      <section className="pb-24 px-6">
        <div className="max-w-2xl mx-auto space-y-8 text-[#6B6B65] text-lg leading-[1.8]">
          <p>
            There&apos;s a version of you that you haven&apos;t fully met yet.
          </p>
          <p>
            You might feel it in quiet moments — a sense that who you are right now isn&apos;t the whole
            story. That somewhere beneath the noise, the habits, the beliefs that shaped you before you
            could choose them — there&apos;s someone waiting to bloom.
          </p>
          <p>I believe that person is already inside you. My work is simply to help you find them.</p>
          <p>
            My name is Ayelen. In my language, it means happiness of the home — and I&apos;ve come to
            understand that phrase not as a destination, but as a way of being. Of feeling truly at home
            in yourself. Grounded in who you are. Free from what no longer serves you. Open to who
            you&apos;re becoming.
          </p>
          <p>
            That journey — the one inward and then outward — is one I know deeply and personally. It has
            taught me that transformation isn&apos;t a performance. It isn&apos;t loud or linear. It happens in the
            quiet, in the honest conversations, in the moments when someone finally feels safe enough to
            tell the truth about where they are and dare to imagine where they could go.
          </p>
          <p>
            Those lessons are the foundation of Deepbloom. A practice rooted in the belief that every
            person deserves a space that is real, non-judgmental and genuinely held — where the work goes
            as deep as it needs to, and where who you&apos;re becoming is always the compass.
          </p>
          <p>This is that space. And it was made for you.</p>
          <p className="text-[#2D4A3E] font-medium italic">Root deep. Bloom safe.</p>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-[#2D4A3E]/10" />
      </div>

      {/* What I Believe */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl font-semibold text-[#1C1C1A] mb-12 text-center"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            What I believe
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              'Real change happens beneath the surface, not on it.',
              'Safety is not a soft extra. It\'s where transformation begins.',
              'You are not a problem to be fixed. You are a person becoming.',
            ].map((belief, i) => (
              <div key={i} className="bg-white rounded-2xl p-8">
                <div className="w-8 h-8 rounded-full bg-[#2D4A3E]/10 flex items-center justify-center mb-6">
                  <span className="text-[#2D4A3E] text-xs font-medium">{i + 1}</span>
                </div>
                <p
                  className="text-[#1C1C1A] text-lg font-semibold leading-snug"
                  style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                >
                  &ldquo;{belief}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* My Approach */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl font-semibold text-[#1C1C1A] mb-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            My approach
          </h2>
          <p className="text-[#6B6B65] text-lg leading-[1.8]">
            Working with me is unhurried. We begin where you are — not where you think you should be.
            Sessions are honest and held. I will not tell you what to do or feel. I will ask the
            questions that matter, sit with you in the difficult parts, and hold you accountable to
            the version of yourself you&apos;re moving toward. Nothing is judged here. Everything is welcome.
          </p>
        </div>
      </section>

      {/* Photo placeholder */}
      <section className="py-0 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#FAF7F2] rounded-2xl h-96 flex items-center justify-center">
            <p className="text-[#6B6B65] text-sm italic">Practitioner photo coming soon</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-xl mx-auto text-center">
          <Link
            href="/first-root"
            className="inline-block bg-[#2D4A3E] text-white px-10 py-4 rounded-full text-base hover:bg-[#7A9E8E] transition-colors"
          >
            Book The First Root
          </Link>
          <p className="text-[#6B6B65] text-sm mt-4">
            A free 30-minute conversation. No commitment.
          </p>
        </div>
      </section>
    </>
  )
}
