'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Question } from '@/lib/types'

interface Props {
  assignment: any
  clientId: string
}

export default function ToolResponder({ assignment, clientId }: Props) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [responses, setResponses] = useState<Record<string, string | number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(assignment.status === 'completed')

  const tool = assignment.tools
  const questions: Question[] = tool?.questions ?? []

  function setResponse(id: string, value: string | number) {
    setResponses({ ...responses, [id]: value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const supabase = createClient()

    // Save response
    await supabase.from('tool_responses').insert({
      assignment_id: assignment.id,
      client_id: clientId,
      responses,
    })

    // Update assignment status
    await supabase.from('tool_assignments')
      .update({ status: 'completed' })
      .eq('id', assignment.id)

    setSubmitted(true)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {/* Header */}
      <button
        className="w-full p-6 text-left flex items-center justify-between group"
        onClick={() => !submitted && setExpanded(!expanded)}
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3
              className="font-semibold text-[#1C1C1A] group-hover:text-[#2D4A3E] transition-colors"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              {tool?.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              submitted
                ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]'
                : assignment.status === 'in_progress'
                ? 'bg-[#7A9E8E]/20 text-[#7A9E8E]'
                : 'bg-[#6B6B65]/10 text-[#6B6B65]'
            }`}>
              {submitted ? 'completed' : assignment.status.replace('_', ' ')}
            </span>
          </div>
          {tool?.description && (
            <p className="text-sm text-[#6B6B65]">{tool.description}</p>
          )}
          {assignment.note && (
            <p className="text-xs text-[#7A9E8E] mt-1 italic">Note from practitioner: {assignment.note}</p>
          )}
        </div>
        {!submitted && (
          <span className="text-[#2D4A3E] ml-4 shrink-0 text-lg">
            {expanded ? '−' : '+'}
          </span>
        )}
      </button>

      {/* Form */}
      {expanded && !submitted && questions.length > 0 && (
        <form onSubmit={handleSubmit} className="px-6 pb-6 border-t border-[#2D4A3E]/10 pt-4">
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id}>
                <label className="block text-sm font-medium text-[#1C1C1A] mb-2">
                  {idx + 1}. {q.text}
                  {q.required && <span className="text-red-400 ml-1">*</span>}
                </label>

                {q.type === 'short_text' && (
                  <input
                    type="text"
                    value={responses[q.id] as string ?? ''}
                    onChange={(e) => setResponse(q.id, e.target.value)}
                    required={q.required}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
                  />
                )}

                {q.type === 'long_text' && (
                  <textarea
                    rows={4}
                    value={responses[q.id] as string ?? ''}
                    onChange={(e) => setResponse(q.id, e.target.value)}
                    required={q.required}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors resize-none"
                  />
                )}

                {q.type === 'multiple_choice' && (
                  <div className="space-y-2">
                    {(q.options ?? []).map((opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name={q.id}
                          value={opt}
                          checked={responses[q.id] === opt}
                          onChange={() => setResponse(q.id, opt)}
                          required={q.required}
                          className="accent-[#2D4A3E]"
                        />
                        <span className="text-sm text-[#1C1C1A]">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'slider' && (
                  <div>
                    <input
                      type="range"
                      min={q.min ?? 1}
                      max={q.max ?? 10}
                      value={responses[q.id] as number ?? 5}
                      onChange={(e) => setResponse(q.id, Number(e.target.value))}
                      className="w-full accent-[#2D4A3E]"
                    />
                    <div className="flex justify-between text-xs text-[#6B6B65] mt-1">
                      <span>{q.min ?? 1}</span>
                      <span className="font-medium text-[#2D4A3E]">{responses[q.id] ?? 5}</span>
                      <span>{q.max ?? 10}</span>
                    </div>
                  </div>
                )}

                {q.type === 'date' && (
                  <input
                    type="date"
                    value={responses[q.id] as string ?? ''}
                    onChange={(e) => setResponse(q.id, e.target.value)}
                    required={q.required}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full bg-[#2D4A3E] text-white py-3 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
          >
            {submitting ? 'Submitting...' : 'Submit responses'}
          </button>
        </form>
      )}

      {submitted && (
        <div className="px-6 pb-6 pt-0 border-t border-[#2D4A3E]/10">
          <p className="text-sm text-[#2D4A3E] pt-4">
            Completed. Your responses have been shared with your practitioner.
          </p>
        </div>
      )}
    </div>
  )
}
