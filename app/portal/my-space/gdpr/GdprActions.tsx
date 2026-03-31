'use client'

import { useState } from 'react'

interface Props {
  name: string
  email: string
}

export default function GdprActions({ name, email }: Props) {
  const [deleteRequesting, setDeleteRequesting] = useState(false)
  const [deleteRequested, setDeleteRequested] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  async function requestDeletion() {
    if (!confirm('Are you sure you want to request deletion of your account and all associated data? Ayelen will be notified and will process this within 30 days.')) return
    setDeleteRequesting(true)
    setDeleteError('')

    const res = await fetch('/api/portal/gdpr/delete-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })

    if (res.ok) {
      setDeleteRequested(true)
    } else {
      setDeleteError('Something went wrong. Please email hello@deepbloom.me directly.')
    }
    setDeleteRequesting(false)
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Data export */}
      <div className="bg-white rounded-2xl p-6">
        <h2
          className="font-semibold text-[#1C1C1A] mb-2"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Download your data
        </h2>
        <p className="text-sm text-[#6B6B65] mb-4">
          Export everything stored about you — profile, sessions, tool responses, mood entries, journal entries, and invoices — as a JSON file.
        </p>
        <a
          href="/api/portal/gdpr/export"
          download
          className="inline-block bg-[#2D4A3E] text-white px-5 py-2.5 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors"
        >
          Download my data
        </a>
      </div>

      {/* Deletion request */}
      <div className="bg-white rounded-2xl p-6">
        <h2
          className="font-semibold text-[#1C1C1A] mb-2"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Request account deletion
        </h2>
        <p className="text-sm text-[#6B6B65] mb-4">
          You can request that your account and all associated data be permanently deleted. This will notify Ayelen, who will process the request within 30 days in accordance with GDPR.
        </p>
        <p className="text-xs text-[#6B6B65] italic mb-4">
          Note: Invoices may be retained for legal and financial record-keeping obligations.
        </p>

        {deleteRequested ? (
          <div className="bg-[#2D4A3E]/10 rounded-xl p-4 text-sm text-[#2D4A3E]">
            Deletion request submitted. Ayelen will be in touch within 30 days.
          </div>
        ) : (
          <>
            {deleteError && <p className="text-red-500 text-sm mb-3">{deleteError}</p>}
            <button
              onClick={requestDeletion}
              disabled={deleteRequesting}
              className="border border-red-300 text-red-500 px-5 py-2.5 rounded-full text-sm hover:bg-red-50 transition-colors disabled:opacity-60"
            >
              {deleteRequesting ? 'Submitting…' : 'Request account deletion'}
            </button>
          </>
        )}
      </div>

      {/* Contact */}
      <div className="bg-white rounded-2xl p-6">
        <h2
          className="font-semibold text-[#1C1C1A] mb-2"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Questions about your data
        </h2>
        <p className="text-sm text-[#6B6B65]">
          For any privacy queries, contact Ayelen directly at{' '}
          <a href="mailto:hello@deepbloom.me" className="text-[#2D4A3E] hover:underline">
            hello@deepbloom.me
          </a>
        </p>
      </div>
    </div>
  )
}
