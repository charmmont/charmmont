'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Question, QuestionType, ToolType } from '@/lib/types'

const TOOL_TYPES: { value: ToolType; label: string }[] = [
  { value: 'onboarding_questionnaire', label: 'Onboarding Questionnaire' },
  { value: 'self_discovery_questionnaire', label: 'Self-Discovery Questionnaire' },
  { value: 'values_exercise', label: 'Values Exercise' },
  { value: 'wheel_of_life', label: 'Wheel of Life' },
  { value: 'belief_mapping', label: 'Belief Mapping' },
  { value: 'mood_tracker', label: 'Mood & Pattern Tracker' },
  { value: 'reflection_journal', label: 'Reflection Journal' },
  { value: 'gamified_challenge', label: 'Gamified Challenge' },
]

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'short_text', label: 'Short text' },
  { value: 'long_text', label: 'Long text' },
  { value: 'multiple_choice', label: 'Multiple choice' },
  { value: 'slider', label: 'Slider (1–10)' },
  { value: 'date', label: 'Date' },
]

function generateId() {
  return Math.random().toString(36).slice(2)
}

interface Props {
  initialTool?: any
}

export default function ToolBuilder({ initialTool }: Props) {
  const router = useRouter()
  const [name, setName] = useState(initialTool?.name ?? '')
  const [description, setDescription] = useState(initialTool?.description ?? '')
  const [type, setType] = useState<ToolType>(initialTool?.type ?? 'self_discovery_questionnaire')
  const [status, setStatus] = useState<'draft' | 'published'>(initialTool?.status ?? 'draft')
  const [questions, setQuestions] = useState<Question[]>(initialTool?.questions ?? [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function addQuestion() {
    setQuestions([
      ...questions,
      { id: generateId(), text: '', type: 'long_text', required: false },
    ])
  }

  function updateQuestion(id: string, updates: Partial<Question>) {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  function removeQuestion(id: string) {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  function moveQuestion(id: string, dir: -1 | 1) {
    const idx = questions.findIndex((q) => q.id === id)
    if (idx < 0) return
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= questions.length) return
    const updated = [...questions]
    ;[updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]]
    setQuestions(updated)
  }

  async function handleSave(publishStatus: 'draft' | 'published') {
    if (!name.trim()) { setError('Tool name is required.'); return }
    setError('')
    setSaving(true)
    const supabase = createClient()

    if (initialTool?.id) {
      const { error: err } = await supabase.from('tools').update({
        name, description, type, status: publishStatus, questions,
      }).eq('id', initialTool.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('tools').insert({
        name, description, type, status: publishStatus, questions,
      })
      if (err) { setError(err.message); setSaving(false); return }
    }

    router.push('/portal/toolbox')
    router.refresh()
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="text-sm text-[#6B6B65] hover:text-[#2D4A3E] transition-colors"
        >
          ← Back
        </button>
        <h1
          className="text-2xl font-semibold text-[#1C1C1A]"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          {initialTool ? 'Edit tool' : 'Create tool'}
        </h1>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Tool name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
              placeholder="e.g. Onboarding Intake Form"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors resize-none"
              placeholder="What is this tool for? This is shown to clients."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ToolType)}
              className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors bg-white"
            >
              {TOOL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Questions */}
        <div className="bg-white rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="font-semibold text-[#1C1C1A]"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Questions
            </h2>
            <button
              onClick={addQuestion}
              className="text-xs bg-[#2D4A3E] text-white px-3 py-1.5 rounded-full hover:bg-[#7A9E8E] transition-colors"
            >
              + Add question
            </button>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-8 text-[#6B6B65] text-sm italic">
              No questions yet. Add your first question above.
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="border border-[#2D4A3E]/10 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-xs text-[#6B6B65] mt-3 w-5 shrink-0">{idx + 1}.</span>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                      className="flex-1 border border-[#2D4A3E]/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
                      placeholder="Question text..."
                    />
                  </div>
                  <div className="flex items-center gap-3 pl-8 flex-wrap">
                    <select
                      value={q.type}
                      onChange={(e) => updateQuestion(q.id, { type: e.target.value as QuestionType })}
                      className="border border-[#2D4A3E]/20 rounded-lg px-3 py-1.5 text-xs bg-white outline-none focus:border-[#2D4A3E] transition-colors"
                    >
                      {QUESTION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <label className="flex items-center gap-1.5 text-xs text-[#6B6B65]">
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={(e) => updateQuestion(q.id, { required: e.target.checked })}
                        className="accent-[#2D4A3E]"
                      />
                      Required
                    </label>
                    <div className="flex gap-1 ml-auto">
                      <button
                        onClick={() => moveQuestion(q.id, -1)}
                        disabled={idx === 0}
                        className="text-[#6B6B65] hover:text-[#2D4A3E] disabled:opacity-30 text-xs px-1"
                      >↑</button>
                      <button
                        onClick={() => moveQuestion(q.id, 1)}
                        disabled={idx === questions.length - 1}
                        className="text-[#6B6B65] hover:text-[#2D4A3E] disabled:opacity-30 text-xs px-1"
                      >↓</button>
                      <button
                        onClick={() => removeQuestion(q.id)}
                        className="text-red-400 hover:text-red-600 text-xs px-1"
                      >✕</button>
                    </div>
                  </div>
                  {q.type === 'multiple_choice' && (
                    <div className="pl-8 mt-3">
                      <p className="text-xs text-[#6B6B65] mb-2">Options (one per line)</p>
                      <textarea
                        rows={3}
                        value={(q.options ?? []).join('\n')}
                        onChange={(e) => updateQuestion(q.id, { options: e.target.value.split('\n') })}
                        className="w-full border border-[#2D4A3E]/20 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#2D4A3E] transition-colors resize-none"
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="flex-1 border border-[#2D4A3E]/20 text-[#2D4A3E] py-3 rounded-full text-sm hover:bg-[#2D4A3E]/5 transition-colors disabled:opacity-60"
          >
            Save as draft
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving}
            className="flex-1 bg-[#2D4A3E] text-white py-3 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}
