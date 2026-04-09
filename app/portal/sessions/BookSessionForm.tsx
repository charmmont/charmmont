'use client'

import { useState, useTransition } from 'react'
import { bookSession } from './actions'

interface Props {
  clients: any[]
}

const DURATIONS = [30, 45, 60, 90]

export default function BookSessionForm({ clients }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const form = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        await bookSession(form)
        setOpen(false)
      } catch {
        setError('Something went wrong. Please try again.')
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-[#2D4A3E] text-white px-4 py-2 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors"
      >
        + Book session
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 bg-black/20 overflow-y-auto py-8">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg my-auto">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg font-semibold text-[#1C1C1A]"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                Book a session
              </h2>
              <button onClick={() => setOpen(false)} className="text-[#6B6B65] hover:text-[#2D4A3E]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Client */}
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Client</label>
                <select
                  name="client_id"
                  required
                  className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] bg-white"
                >
                  <option value="">Select a client</option>
                  {clients.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.profiles?.full_name ?? c.id}</option>
                  ))}
                </select>
              </div>

              {/* Programme */}
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Programme</label>
                <select
                  name="programme"
                  className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] bg-white"
                >
                  <option value="">— Select —</option>
                  <option value="first_root">The First Root</option>
                  <option value="becoming">The Becoming</option>
                  <option value="in_full_bloom">In Full Bloom</option>
                </select>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Date</label>
                  <input
                    type="date"
                    name="session_date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Time</label>
                  <input
                    type="time"
                    name="session_time"
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E]"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Duration</label>
                <div className="flex gap-2 flex-wrap">
                  {DURATIONS.map((d) => (
                    <label key={d} className="cursor-pointer">
                      <input type="radio" name="duration_minutes" value={d} defaultChecked={d === 60} className="sr-only peer" />
                      <span className="block px-3 py-1.5 rounded-full text-sm border border-[#2D4A3E]/20 text-[#6B6B65] peer-checked:bg-[#2D4A3E] peer-checked:text-white peer-checked:border-[#2D4A3E] transition-colors cursor-pointer">
                        {d}m
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery */}
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Delivery</label>
                <select
                  name="session_type"
                  className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] bg-white"
                >
                  <option value="video">Video</option>
                  <option value="phone">Phone</option>
                  <option value="in_person">In person</option>
                </select>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#2D4A3E] text-white py-3 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
              >
                {isPending ? 'Booking…' : 'Book session'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
