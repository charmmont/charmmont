'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import type {
  QuestionnaireContent, ValuesExerciseContent, WheelOfLifeContent,
  BeliefMappingContent, MoodTrackerContent, ReflectionJournalContent,
  GamifiedChallengeContent, Question, MoodEntry, JournalEntry,
} from '@/lib/types'

interface Props {
  assignment: any
  clientId: string
  clientName: string
  existingResponse: any | null
  moodEntries: MoodEntry[]
  journalEntries: JournalEntry[]
}

function notifyCompleted(assignment: any, clientName: string) {
  fetch('/api/portal/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type:       'tool_completed',
      clientName,
      toolName:   assignment.tools?.name ?? 'Tool',
      toolType:   assignment.tools?.type ?? '',
      clientId:   assignment.client_id,
      assignmentId: assignment.id,
    }),
  }).catch(() => {})
}

// ── Shared ────────────────────────────────────────────────────────────────────
const inputCls = 'w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors'
const btnPrimary = 'bg-[#2D4A3E] text-white py-3 px-6 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60'

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-[#1C1C1A]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
        {title}
      </h1>
      {description && <p className="text-sm text-[#6B6B65] mt-2">{description}</p>}
    </div>
  )
}

// ── 1 & 2: Questionnaire responder ────────────────────────────────────────────
function QuestionnaireResponder({
  assignment, clientId, clientName, existingResponse, content,
}: {
  assignment: any
  clientId: string
  clientName: string
  existingResponse: any
  content: QuestionnaireContent
}) {
  const router = useRouter()
  const [responses, setResponses] = useState<Record<string, string | number>>(
    existingResponse?.responses ?? {}
  )
  const [submitting, setSubmitting] = useState(false)
  const completed = assignment.status === 'completed'
  const questions: Question[] = content.questions ?? []

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const supabase = createClient()
    await supabase.from('tool_responses').insert({ assignment_id: assignment.id, client_id: clientId, responses })
    await supabase.from('tool_assignments').update({ status: 'completed' }).eq('id', assignment.id)
    notifyCompleted(assignment, clientName)
    router.push('/portal/my-space/tools')
    router.refresh()
  }

  if (completed && existingResponse) {
    return (
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-2xl p-6">
            <p className="text-xs text-[#6B6B65] mb-1">{idx + 1}. {q.text}</p>
            <p className="text-sm text-[#1C1C1A]">{String(existingResponse.responses[q.id] ?? '—')}</p>
          </div>
        ))}
        <div className="bg-[#2D4A3E]/5 rounded-2xl p-4 text-sm text-[#2D4A3E] text-center">
          Submitted — thank you.
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {questions.map((q, idx) => (
        <div key={q.id} className="bg-white rounded-2xl p-6">
          <label className="block text-sm font-medium text-[#1C1C1A] mb-3">
            {idx + 1}. {q.text}
            {q.required && <span className="text-red-400 ml-1">*</span>}
          </label>

          {q.type === 'short_text' && (
            <input type="text" value={responses[q.id] as string ?? ''} onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })} required={q.required} className={inputCls} />
          )}
          {q.type === 'long_text' && (
            <textarea rows={4} value={responses[q.id] as string ?? ''} onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })} required={q.required} className={`${inputCls} resize-none`} />
          )}
          {q.type === 'multiple_choice' && (
            <div className="space-y-2">
              {(q.options ?? []).map((opt) => (
                <label key={opt} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name={q.id} value={opt} checked={responses[q.id] === opt} onChange={() => setResponses({ ...responses, [q.id]: opt })} required={q.required} className="accent-[#2D4A3E]" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
          )}
          {q.type === 'slider' && (
            <div>
              <input type="range" min={q.min ?? 1} max={q.max ?? 10} value={responses[q.id] as number ?? 5} onChange={(e) => setResponses({ ...responses, [q.id]: Number(e.target.value) })} className="w-full accent-[#2D4A3E]" />
              <div className="flex justify-between text-xs text-[#6B6B65] mt-1">
                <span>{q.min ?? 1}</span>
                <span className="font-medium text-[#2D4A3E]">{responses[q.id] ?? 5}</span>
                <span>{q.max ?? 10}</span>
              </div>
            </div>
          )}
          {q.type === 'date' && (
            <input type="date" value={responses[q.id] as string ?? ''} onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })} required={q.required} className={inputCls} />
          )}
        </div>
      ))}

      <button type="submit" disabled={submitting} className={`w-full ${btnPrimary}`}>
        {submitting ? 'Submitting…' : 'Submit'}
      </button>
    </form>
  )
}

// ── 3: Values Exercise ─────────────────────────────────────────────────────────
function ValuesResponder({
  assignment, clientId, clientName, existingResponse, content,
}: {
  assignment: any
  clientId: string
  clientName: string
  existingResponse: any
  content: ValuesExerciseContent
}) {
  const router = useRouter()
  const completed = assignment.status === 'completed'
  const [step, setStep] = useState<'select' | 'rank' | 'reflect'>('select')
  const [selected, setSelected] = useState<string[]>(existingResponse?.responses?.selected ?? [])
  const [ranked, setRanked] = useState<string[]>(existingResponse?.responses?.ranked ?? [])
  const [customValue, setCustomValue] = useState('')
  const [customList, setCustomList] = useState<string[]>([])
  const [reflections, setReflections] = useState<Record<string, string>>(existingResponse?.responses?.reflections ?? {})
  const [submitting, setSubmitting] = useState(false)

  const allValues = [...content.values_library, ...customList]

  function toggleSelect(v: string) {
    if (selected.includes(v)) {
      setSelected(selected.filter((x) => x !== v))
    } else {
      setSelected([...selected, v])
    }
  }

  function addCustom() {
    const v = customValue.trim()
    if (!v || allValues.includes(v)) return
    setCustomList([...customList, v])
    setSelected([...selected, v])
    setCustomValue('')
  }

  function moveRank(v: string, dir: -1 | 1) {
    const idx = ranked.indexOf(v)
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= ranked.length) return
    const r = [...ranked]
    ;[r[idx], r[newIdx]] = [r[newIdx], r[idx]]
    setRanked(r)
  }

  function goToRank() {
    setRanked(selected.slice(0, content.rank_top))
    setStep('rank')
  }

  async function handleSubmit() {
    setSubmitting(true)
    const supabase = createClient()
    const responses = { selected, ranked, reflections }
    await supabase.from('tool_responses').insert({ assignment_id: assignment.id, client_id: clientId, responses })
    await supabase.from('tool_assignments').update({ status: 'completed' }).eq('id', assignment.id)
    notifyCompleted(assignment, clientName)
    router.push('/portal/my-space/tools')
    router.refresh()
  }

  if (completed && existingResponse) {
    const r = existingResponse.responses
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6">
          <h2 className="font-semibold text-[#1C1C1A] mb-4">Your top {content.rank_top} values</h2>
          <ol className="space-y-2">
            {(r.ranked ?? []).map((v: string, i: number) => (
              <li key={v} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-[#2D4A3E] text-white text-xs flex items-center justify-center">{i + 1}</span>
                {v}
              </li>
            ))}
          </ol>
        </div>
        {content.reflection_prompts.length > 0 && (
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-[#1C1C1A]">Your reflections</h2>
            {content.reflection_prompts.map((p, i) => (
              <div key={i}>
                <p className="text-xs text-[#6B6B65] mb-1">{p}</p>
                <p className="text-sm text-[#1C1C1A]">{r.reflections?.[String(i)] ?? '—'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (step === 'select') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6">
          <p className="text-sm text-[#6B6B65] mb-4">Choose all values that resonate with you, then rank your top {content.rank_top}.</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {allValues.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => toggleSelect(v)}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  selected.includes(v)
                    ? 'bg-[#2D4A3E] text-white border-[#2D4A3E]'
                    : 'border-[#2D4A3E]/20 text-[#1C1C1A] hover:border-[#2D4A3E]/40'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          {content.allow_custom && (
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())}
                placeholder="Add your own value…"
                className="flex-1 border border-[#2D4A3E]/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2D4A3E]"
              />
              <button onClick={addCustom} className="text-xs bg-[#7A9E8E] text-white px-3 py-2 rounded-lg">Add</button>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-[#6B6B65]">{selected.length} selected</p>
          <button
            onClick={goToRank}
            disabled={selected.length === 0}
            className={btnPrimary}
          >
            Next: Rank your values →
          </button>
        </div>
      </div>
    )
  }

  if (step === 'rank') {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6">
          <p className="text-sm text-[#6B6B65] mb-4">Arrange your top {content.rank_top} values in order of importance. Most important at the top.</p>
          <div className="space-y-2">
            {ranked.map((v, idx) => (
              <div key={v} className="flex items-center gap-3 bg-[#F9F6F1] rounded-xl px-4 py-3">
                <span className="w-6 h-6 rounded-full bg-[#2D4A3E] text-white text-xs flex items-center justify-center shrink-0">{idx + 1}</span>
                <span className="flex-1 text-sm">{v}</span>
                <button onClick={() => moveRank(v, -1)} disabled={idx === 0} className="text-[#6B6B65] hover:text-[#2D4A3E] disabled:opacity-30 text-xs px-1">↑</button>
                <button onClick={() => moveRank(v, 1)} disabled={idx === ranked.length - 1} className="text-[#6B6B65] hover:text-[#2D4A3E] disabled:opacity-30 text-xs px-1">↓</button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between">
          <button onClick={() => setStep('select')} className="text-sm text-[#6B6B65] hover:text-[#2D4A3E]">← Back</button>
          <button
            onClick={() => content.reflection_prompts.length > 0 ? setStep('reflect') : handleSubmit()}
            className={btnPrimary}
          >
            {content.reflection_prompts.length > 0 ? 'Next: Reflect →' : 'Submit'}
          </button>
        </div>
      </div>
    )
  }

  // reflect
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 space-y-5">
        {content.reflection_prompts.map((prompt, idx) => (
          <div key={idx}>
            <label className="block text-sm font-medium text-[#1C1C1A] mb-2">{prompt}</label>
            <textarea
              rows={3}
              value={reflections[String(idx)] ?? ''}
              onChange={(e) => setReflections({ ...reflections, [String(idx)]: e.target.value })}
              className={`${inputCls} resize-none`}
              placeholder="Your reflection…"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button onClick={() => setStep('rank')} className="text-sm text-[#6B6B65] hover:text-[#2D4A3E]">← Back</button>
        <button onClick={handleSubmit} disabled={submitting} className={btnPrimary}>
          {submitting ? 'Saving…' : 'Submit'}
        </button>
      </div>
    </div>
  )
}

// ── 4: Wheel of Life ──────────────────────────────────────────────────────────
function WheelResponder({
  assignment, clientId, clientName, existingResponse, content,
}: {
  assignment: any
  clientId: string
  clientName: string
  existingResponse: any
  content: WheelOfLifeContent
}) {
  const router = useRouter()
  const completed = assignment.status === 'completed'
  const initScores = Object.fromEntries(content.areas.map((a) => [a, existingResponse?.responses?.scores?.[a] ?? 5]))
  const initNotes = existingResponse?.responses?.notes ?? {}
  const [scores, setScores] = useState<Record<string, number>>(initScores)
  const [notes, setNotes] = useState<Record<string, string>>(initNotes)
  const [submitting, setSubmitting] = useState(false)

  const chartData = content.areas.map((a) => ({ area: a, score: scores[a] ?? 5 }))

  async function handleSubmit() {
    setSubmitting(true)
    const supabase = createClient()
    await supabase.from('tool_responses').insert({ assignment_id: assignment.id, client_id: clientId, responses: { scores, notes } })
    await supabase.from('tool_assignments').update({ status: 'completed' }).eq('id', assignment.id)
    notifyCompleted(assignment, clientName)
    router.push('/portal/my-space/tools')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="#2D4A3E20" />
            <PolarAngleAxis dataKey="area" tick={{ fontSize: 11, fill: '#6B6B65' }} />
            <Radar dataKey="score" stroke="#2D4A3E" fill="#2D4A3E" fillOpacity={0.2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {!completed && (
        <div className="bg-white rounded-2xl p-6 space-y-5">
          <p className="text-sm text-[#6B6B65]">Rate your current satisfaction in each area (1 = very low, 10 = thriving).</p>
          {content.areas.map((area) => (
            <div key={area}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-[#1C1C1A]">{area}</label>
                <span className="text-sm font-semibold text-[#2D4A3E]">{scores[area]}</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={scores[area]}
                onChange={(e) => setScores({ ...scores, [area]: Number(e.target.value) })}
                className="w-full accent-[#2D4A3E] mb-2"
              />
              <textarea
                rows={2}
                value={notes[area] ?? ''}
                onChange={(e) => setNotes({ ...notes, [area]: e.target.value })}
                placeholder="Optional note…"
                className={`${inputCls} resize-none text-xs`}
              />
            </div>
          ))}
          <button onClick={handleSubmit} disabled={submitting} className={`w-full ${btnPrimary}`}>
            {submitting ? 'Saving…' : 'Submit my wheel'}
          </button>
        </div>
      )}

      {completed && (
        <div className="bg-white rounded-2xl p-6 space-y-3">
          {content.areas.map((area) => (
            <div key={area} className="flex items-center gap-3">
              <span className="text-sm text-[#1C1C1A] w-40 shrink-0">{area}</span>
              <div className="flex-1 bg-[#2D4A3E]/10 rounded-full h-2">
                <div
                  className="bg-[#2D4A3E] h-2 rounded-full transition-all"
                  style={{ width: `${(scores[area] / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-[#2D4A3E] w-6 text-right">{scores[area]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── 5: Belief Mapping ─────────────────────────────────────────────────────────
function BeliefResponder({
  assignment, clientId, clientName, existingResponse, content,
}: {
  assignment: any
  clientId: string
  clientName: string
  existingResponse: any
  content: BeliefMappingContent
}) {
  const router = useRouter()
  const completed = assignment.status === 'completed'
  const [answers, setAnswers] = useState<Record<number, string>>(existingResponse?.responses?.answers ?? {})
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const supabase = createClient()
    await supabase.from('tool_responses').insert({ assignment_id: assignment.id, client_id: clientId, responses: { answers } })
    await supabase.from('tool_assignments').update({ status: 'completed' }).eq('id', assignment.id)
    notifyCompleted(assignment, clientName)
    router.push('/portal/my-space/tools')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {content.prompts.map((prompt, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6">
          <label className="block text-sm font-medium text-[#1C1C1A] mb-3">{prompt}</label>
          {completed ? (
            <p className="text-sm text-[#1C1C1A]">{answers[idx] ?? '—'}</p>
          ) : (
            <textarea
              rows={4}
              value={answers[idx] ?? ''}
              onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
              className={`${inputCls} resize-none`}
              placeholder="Your response…"
            />
          )}
        </div>
      ))}
      {!completed && (
        <button type="submit" disabled={submitting} className={`w-full ${btnPrimary}`}>
          {submitting ? 'Saving…' : 'Submit'}
        </button>
      )}
    </form>
  )
}

// ── 6: Mood Tracker ───────────────────────────────────────────────────────────
function MoodResponder({
  assignment, clientId, moodEntries, content,
}: {
  assignment: any
  clientId: string
  moodEntries: MoodEntry[]
  content: MoodTrackerContent
}) {
  const [score, setScore] = useState(7)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  // Check if already logged today
  const today = new Date().toISOString().slice(0, 10)
  const alreadyLoggedToday = moodEntries.some((e) => (e.entry_date ?? e.created_at?.slice(0, 10)) === today)

  const chartData = moodEntries.map((e) => ({
    date: new Date(e.entry_date ?? e.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    score: e.mood_rating,
  }))

  async function handleLog() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('mood_entries').insert({
      assignment_id: assignment.id,
      client_id: clientId,
      mood_rating: score,
      reflection: note.trim() || null,
      entry_date: today,
    })
    // Mark in-progress if first entry
    if (assignment.status === 'assigned') {
      await supabase.from('tool_assignments').update({ status: 'in_progress' }).eq('id', assignment.id)
    }
    setSaved(true)
    setNote('')
    router.refresh()
    setSaving(false)
  }

  const moodLabel = (s: number) => s <= 2 ? 'Very low' : s <= 4 ? 'Low' : s <= 6 ? 'Okay' : s <= 8 ? 'Good' : 'Great'

  return (
    <div className="space-y-6">
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl p-6">
          <h2 className="font-semibold text-[#1C1C1A] mb-4" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Your mood over time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D4A3E10" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B6B65' }} />
              <YAxis domain={[1, 10]} tick={{ fontSize: 11, fill: '#6B6B65' }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #2D4A3E20', fontSize: 12 }}
              />
              <Line type="monotone" dataKey="score" stroke="#2D4A3E" strokeWidth={2} dot={{ r: 4, fill: '#2D4A3E' }} name="Mood" />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-[#6B6B65] mt-2 text-center">{moodEntries.length} entries logged</p>
        </div>
      )}

      {alreadyLoggedToday && !saved ? (
        <div className="bg-white rounded-2xl p-6 text-center text-sm text-[#6B6B65]">
          You've already logged your mood today. Come back {content.frequency === 'daily' ? 'tomorrow' : 'next week'}.
        </div>
      ) : saved ? (
        <div className="bg-[#2D4A3E]/5 rounded-2xl p-6 text-center">
          <p className="text-[#2D4A3E] font-medium">Logged! Score: {score} — {moodLabel(score)}</p>
          <button onClick={() => setSaved(false)} className="text-xs text-[#6B6B65] mt-2 hover:text-[#2D4A3E]">Log another</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[#1C1C1A]">How are you feeling?</label>
              <span className="text-2xl font-semibold text-[#2D4A3E]">{score} <span className="text-sm font-normal text-[#6B6B65]">— {moodLabel(score)}</span></span>
            </div>
            <input type="range" min={1} max={10} value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-full accent-[#2D4A3E]" />
            <div className="flex justify-between text-xs text-[#6B6B65] mt-1">
              <span>Very low</span>
              <span>Great</span>
            </div>
          </div>
          {content.custom_question && (
            <div>
              <label className="block text-sm font-medium text-[#1C1C1A] mb-2">{content.custom_question}</label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={`${inputCls} resize-none`}
                placeholder="Optional note…"
              />
            </div>
          )}
          {!content.custom_question && (
            <div>
              <label className="block text-sm font-medium text-[#1C1C1A] mb-2">Note <span className="text-[#6B6B65] font-normal">(optional)</span></label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={`${inputCls} resize-none`}
                placeholder="What's influencing your mood today?"
              />
            </div>
          )}
          <button onClick={handleLog} disabled={saving} className={`w-full ${btnPrimary}`}>
            {saving ? 'Saving…' : 'Log mood'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── 7: Reflection Journal ─────────────────────────────────────────────────────
function JournalResponder({
  assignment, clientId, journalEntries, content,
}: {
  assignment: any
  clientId: string
  journalEntries: JournalEntry[]
  content: ReflectionJournalContent
}) {
  const router = useRouter()
  const [entryContent, setEntryContent] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!entryContent.trim()) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('journal_entries').insert({
      assignment_id: assignment.id,
      client_id: clientId,
      content: entryContent.trim(),
      is_private: content.is_private,
    })
    if (assignment.status === 'assigned') {
      await supabase.from('tool_assignments').update({ status: 'in_progress' }).eq('id', assignment.id)
    }
    setEntryContent('')
    router.refresh()
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4">
        {content.prompt && (
          <div className="bg-[#F9F6F1] rounded-xl p-4">
            <p className="text-sm text-[#6B6B65] italic">{content.prompt}</p>
          </div>
        )}
        <textarea
          rows={8}
          value={entryContent}
          onChange={(e) => setEntryContent(e.target.value)}
          className={`${inputCls} resize-none`}
          placeholder="Begin writing…"
        />
        {content.is_private && (
          <p className="text-xs text-[#6B6B65]">This is a private journal — entries are only visible to you.</p>
        )}
        <button type="submit" disabled={saving || !entryContent.trim()} className={`w-full ${btnPrimary}`}>
          {saving ? 'Saving…' : 'Save entry'}
        </button>
      </form>

      {journalEntries.length > 0 && !content.is_private && (
        <div className="space-y-3">
          <h2 className="font-semibold text-[#1C1C1A]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Previous entries</h2>
          {journalEntries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-2xl p-6">
              <p className="text-xs text-[#6B6B65] mb-2">
                {new Date(entry.created_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <p className="text-sm text-[#1C1C1A] whitespace-pre-wrap">{entry.content}</p>
            </div>
          ))}
        </div>
      )}

      {journalEntries.length > 0 && content.is_private && (
        <div className="text-center text-sm text-[#6B6B65]">
          {journalEntries.length} {journalEntries.length === 1 ? 'entry' : 'entries'} saved.
        </div>
      )}
    </div>
  )
}

// ── 8: Gamified Challenge ─────────────────────────────────────────────────────
function ChallengeResponder({
  assignment, clientId, clientName, existingResponse, content,
}: {
  assignment: any
  clientId: string
  clientName: string
  existingResponse: any
  content: GamifiedChallengeContent
}) {
  const router = useRouter()
  const [completedDays, setCompletedDays] = useState<number[]>(existingResponse?.responses?.completed_days ?? [])
  const [dayNotes, setDayNotes] = useState<Record<number, string>>(existingResponse?.responses?.notes ?? {})
  const [saving, setSaving] = useState(false)

  const allDone = completedDays.length === content.duration_days

  function toggleDay(day: number) {
    if (completedDays.includes(day)) {
      setCompletedDays(completedDays.filter((d) => d !== day))
    } else {
      setCompletedDays([...completedDays, day])
    }
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const responses = { completed_days: completedDays, notes: dayNotes }

    if (existingResponse) {
      await supabase.from('tool_responses').update({ responses }).eq('id', existingResponse.id)
    } else {
      await supabase.from('tool_responses').insert({ assignment_id: assignment.id, client_id: clientId, responses })
    }

    const newStatus = allDone ? 'completed' : completedDays.length > 0 ? 'in_progress' : 'assigned'
    await supabase.from('tool_assignments').update({ status: newStatus }).eq('id', assignment.id)
    if (allDone) notifyCompleted(assignment, clientName)

    router.refresh()
    setSaving(false)
  }

  const pct = Math.round((completedDays.length / content.duration_days) * 100)

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-white rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#1C1C1A]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Your progress</h2>
          <span className="text-sm font-semibold text-[#2D4A3E]">{completedDays.length}/{content.duration_days} days</span>
        </div>
        <div className="bg-[#2D4A3E]/10 rounded-full h-3">
          <div
            className="bg-[#2D4A3E] h-3 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-[#6B6B65] mt-2">{pct}% complete</p>
      </div>

      {allDone && content.completion_message && (
        <div className="bg-[#2D4A3E] text-white rounded-2xl p-6 text-center">
          <p className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Challenge complete!</p>
          <p className="text-sm opacity-90">{content.completion_message}</p>
        </div>
      )}

      {/* Day list */}
      <div className="space-y-3">
        {content.days.map((d) => {
          const done = completedDays.includes(d.day)
          return (
            <div key={d.day} className={`bg-white rounded-2xl p-5 border-2 transition-colors ${done ? 'border-[#2D4A3E]' : 'border-transparent'}`}>
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() => toggleDay(d.day)}
                  className={`w-7 h-7 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                    done ? 'bg-[#2D4A3E] border-[#2D4A3E] text-white' : 'border-[#2D4A3E]/30 hover:border-[#2D4A3E]'
                  }`}
                >
                  {done && <span className="text-xs">✓</span>}
                </button>
                <div className="flex-1">
                  <p className="text-xs text-[#6B6B65] mb-0.5">Day {d.day}</p>
                  {d.title && <p className="text-sm font-medium text-[#1C1C1A]">{d.title}</p>}
                  {d.description && <p className="text-sm text-[#6B6B65] mt-1">{d.description}</p>}
                  <textarea
                    rows={2}
                    value={dayNotes[d.day] ?? ''}
                    onChange={(e) => setDayNotes({ ...dayNotes, [d.day]: e.target.value })}
                    placeholder="Optional note…"
                    className="mt-2 w-full border border-[#2D4A3E]/15 rounded-lg px-3 py-2 text-xs outline-none focus:border-[#2D4A3E] resize-none"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={handleSave} disabled={saving} className={`w-full ${btnPrimary}`}>
        {saving ? 'Saving…' : 'Save progress'}
      </button>
    </div>
  )
}

// ── Main router ───────────────────────────────────────────────────────────────
export default function ToolResponderFull({
  assignment, clientId, clientName, existingResponse, moodEntries, journalEntries,
}: Props) {
  const tool = assignment.tools
  // Prefer content field; fall back to questions for legacy tools
  const content = tool?.content ?? (tool?.questions ? { questions: tool.questions } : null)
  const toolType: string = tool?.type ?? ''

  return (
    <div className="max-w-2xl">
      <SectionHeader
        title={tool?.name ?? 'Tool'}
        description={tool?.description}
      />

      {assignment.note && (
        <div className="bg-[#7A9E8E]/15 rounded-2xl px-5 py-4 mb-6 text-sm text-[#2D4A3E] italic">
          Note from your practitioner: {assignment.note}
        </div>
      )}

      {(toolType === 'onboarding_questionnaire' || toolType === 'self_discovery_questionnaire') && (
        <QuestionnaireResponder assignment={assignment} clientId={clientId} clientName={clientName} existingResponse={existingResponse} content={content ?? { questions: [] }} />
      )}
      {toolType === 'values_exercise' && content && (
        <ValuesResponder assignment={assignment} clientId={clientId} clientName={clientName} existingResponse={existingResponse} content={content as ValuesExerciseContent} />
      )}
      {toolType === 'wheel_of_life' && content && (
        <WheelResponder assignment={assignment} clientId={clientId} clientName={clientName} existingResponse={existingResponse} content={content as WheelOfLifeContent} />
      )}
      {toolType === 'belief_mapping' && content && (
        <BeliefResponder assignment={assignment} clientId={clientId} clientName={clientName} existingResponse={existingResponse} content={content as BeliefMappingContent} />
      )}
      {toolType === 'mood_tracker' && content && (
        <MoodResponder assignment={assignment} clientId={clientId} moodEntries={moodEntries} content={content as MoodTrackerContent} />
      )}
      {toolType === 'reflection_journal' && content && (
        <JournalResponder assignment={assignment} clientId={clientId} journalEntries={journalEntries} content={content as ReflectionJournalContent} />
      )}
      {toolType === 'gamified_challenge' && content && (
        <ChallengeResponder assignment={assignment} clientId={clientId} clientName={clientName} existingResponse={existingResponse} content={content as GamifiedChallengeContent} />
      )}
    </div>
  )
}
