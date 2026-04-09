'use client'

import { useState, useTransition } from 'react'
import { confirmSession, cancelSession, rescheduleSession } from './actions'

interface Props {
  sessionId: string
  sessionDate: string
  sessionTime: string | null
  status: string
}

export default function SessionActions({ sessionId, sessionDate, sessionTime, status }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showReschedule, setShowReschedule] = useState(false)
  const [newDate, setNewDate] = useState(sessionDate)
  const [newTime, setNewTime] = useState(
    sessionTime ? new Date(sessionTime).toTimeString().slice(0, 5) : ''
  )

  function handleConfirm() {
    startTransition(() => confirmSession(sessionId))
  }

  function handleCancel() {
    if (!confirm('Cancel this session?')) return
    startTransition(() => cancelSession(sessionId))
  }

  function handleReschedule(e: React.FormEvent) {
    e.preventDefault()
    const form = new FormData()
    form.append('session_id', sessionId)
    form.append('session_date', newDate)
    form.append('session_time', newTime)
    startTransition(async () => {
      await rescheduleSession(form)
      setShowReschedule(false)
    })
  }

  if (status === 'cancelled') {
    return <span className="text-xs text-[#6B6B65]">Cancelled</span>
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      {/* Confirm */}
      {status === 'booked' && (
        <button
          onClick={handleConfirm}
          disabled={isPending}
          className="text-xs px-3 py-1.5 rounded-full bg-[#2D4A3E] text-white hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
        >
          Confirm held
        </button>
      )}
      {status === 'confirmed' && (
        <span className="text-xs px-2 py-1 rounded-full bg-[#2D4A3E]/10 text-[#2D4A3E] font-medium">
          Confirmed
        </span>
      )}

      {/* Reschedule */}
      {status === 'booked' && (
        <button
          onClick={() => setShowReschedule(true)}
          disabled={isPending}
          className="text-xs px-3 py-1.5 rounded-full border border-[#2D4A3E]/20 text-[#2D4A3E] hover:bg-[#2D4A3E]/5 transition-colors disabled:opacity-60"
        >
          Reschedule
        </button>
      )}

      {/* Cancel */}
      {(status === 'booked' || status === 'confirmed') && (
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="text-xs px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
      )}

      {/* Reschedule modal */}
      {showReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/20">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3
              className="text-base font-semibold text-[#1C1C1A] mb-4"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Reschedule session
            </h3>
            <form onSubmit={handleReschedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">New date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  required
                  className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">New time</label>
                <input
                  type="time"
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReschedule(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#2D4A3E]/20 text-sm text-[#6B6B65] hover:bg-[#FAF7F2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-2.5 rounded-full bg-[#2D4A3E] text-white text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
                >
                  {isPending ? 'Saving…' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
