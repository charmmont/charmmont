import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default function PrivacyPage() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-[700px] mx-auto">
        <h1
          className="text-4xl font-semibold text-[#1C1C1A] mb-8"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Privacy Policy
        </h1>
        <div className="space-y-6 text-[#6B6B65] text-base leading-[1.8]">
          <p>
            Deepbloom is committed to protecting your privacy. This policy explains how we collect,
            use, and protect your personal data.
          </p>
          <h2
            className="text-xl font-semibold text-[#1C1C1A] mt-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            What we collect
          </h2>
          <p>
            We may collect your name, email address, and any information you share through contact
            forms or during coaching sessions. We do not collect any data without your knowledge or
            consent.
          </p>
          <h2
            className="text-xl font-semibold text-[#1C1C1A] mt-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            How we use your data
          </h2>
          <p>
            Your data is used only to deliver our coaching services, respond to your enquiries, and
            improve your experience on this site. We will never sell or share your personal data
            with third parties for marketing purposes.
          </p>
          <h2
            className="text-xl font-semibold text-[#1C1C1A] mt-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Your rights
          </h2>
          <p>
            You have the right to access, correct, or delete the personal data we hold about you.
            To make a request, please contact us at{' '}
            <a href="mailto:hello@deepbloom.me" className="text-[#2D4A3E] hover:underline">
              hello@deepbloom.me
            </a>
            .
          </p>
          <h2
            className="text-xl font-semibold text-[#1C1C1A] mt-8"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Cookies
          </h2>
          <p>
            This site uses minimal cookies for authentication purposes only. No tracking or
            advertising cookies are used.
          </p>
          <p className="text-xs text-[#6B6B65] mt-12">Last updated: March 2025</p>
        </div>
      </div>
    </section>
  )
}
