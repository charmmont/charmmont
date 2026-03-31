'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type {
  Question, QuestionType, ToolType,
  ValuesExerciseContent, WheelOfLifeContent, BeliefMappingContent,
  MoodTrackerContent, ReflectionJournalContent, GamifiedChallengeContent,
  ChallengeDay,
} from '@/lib/types'

const TOOL_TYPES: { value: ToolType; label: string; description: string }[] = [
  { value: 'onboarding_questionnaire', label: 'Onboarding Questionnaire', description: 'Intake form for new clients' },
  { value: 'self_discovery_questionnaire', label: 'Self-Discovery Questionnaire', description: 'Open-ended reflective questions' },
  { value: 'values_exercise', label: 'Values Exercise', description: 'Identify and rank personal values' },
  { value: 'wheel_of_life', label: 'Wheel of Life', description: 'Rate satisfaction across life areas' },
  { value: 'belief_mapping', label: 'Belief Mapping', description: 'Surface limiting and empowering beliefs' },
  { value: 'mood_tracker', label: 'Mood & Pattern Tracker', description: 'Daily or weekly mood logging' },
  { value: 'reflection_journal', label: 'Reflection Journal', description: 'Prompted journaling between sessions' },
  { value: 'gamified_challenge', label: 'Gamified Challenge', description: 'Day-by-day structured challenge' },
]

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: 'short_text', label: 'Short text' },
  { value: 'long_text', label: 'Long text' },
  { value: 'multiple_choice', label: 'Multiple choice' },
  { value: 'slider', label: 'Slider (1–10)' },
  { value: 'date', label: 'Date' },
]

const DEFAULT_VALUES = [
  'Authenticity', 'Courage', 'Creativity', 'Family', 'Freedom',
  'Gratitude', 'Growth', 'Health', 'Honesty', 'Joy',
  'Kindness', 'Love', 'Loyalty', 'Peace', 'Purpose',
  'Resilience', 'Respect', 'Security', 'Service', 'Wisdom',
]

const DEFAULT_WHEEL_AREAS = [
  'Career & Purpose', 'Finances', 'Health & Wellbeing', 'Family & Friends',
  'Romantic Relationship', 'Personal Growth', 'Fun & Recreation', 'Physical Environment',
]

const DEFAULT_BELIEF_PROMPTS = [
  'I am someone who…',
  'My biggest obstacle is…',
  'What I believe about success is…',
  'What I believe about myself is…',
  'The story I tell myself most often is…',
]

function generateId() {
  return Math.random().toString(36).slice(2)
}

// ── Shared input styles ───────────────────────────────────────────────────────
const inputCls = 'w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors'
const smallInputCls = 'border border-[#2D4A3E]/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#2D4A3E] transition-colors'

// ── Sub-builders ──────────────────────────────────────────────────────────────

function QuestionBuilder({
  questions,
  setQuestions,
}: {
  questions: Question[]
  setQuestions: (q: Question[]) => void
}) {
  function addQuestion() {
    setQuestions([...questions, { id: generateId(), text: '', type: 'long_text', required: false }])
  }

  function update(id: string, updates: Partial<Question>) {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  function remove(id: string) {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  function move(id: string, dir: -1 | 1) {
    const idx = questions.findIndex((q) => q.id === id)
    if (idx < 0) return
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= questions.length) return
    const updated = [...questions]
    ;[updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]]
    setQuestions(updated)
  }

  return (
    <div className="bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[#1C1C1A]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
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
                  onChange={(e) => update(q.id, { text: e.target.value })}
                  className="flex-1 border border-[#2D4A3E]/20 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
                  placeholder="Question text…"
                />
              </div>
              <div className="flex items-center gap-3 pl-8 flex-wrap">
                <select
                  value={q.type}
                  onChange={(e) => update(q.id, { type: e.target.value as QuestionType })}
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
                    onChange={(e) => update(q.id, { required: e.target.checked })}
                    className="accent-[#2D4A3E]"
                  />
                  Required
                </label>
                <div className="flex gap-1 ml-auto">
                  <button onClick={() => move(q.id, -1)} disabled={idx === 0} className="text-[#6B6B65] hover:text-[#2D4A3E] disabled:opacity-30 text-xs px-1">↑</button>
                  <button onClick={() => move(q.id, 1)} disabled={idx === questions.length - 1} className="text-[#6B6B65] hover:text-[#2D4A3E] disabled:opacity-30 text-xs px-1">↓</button>
                  <button onClick={() => remove(q.id)} className="text-red-400 hover:text-red-600 text-xs px-1">✕</button>
                </div>
              </div>
              {q.type === 'multiple_choice' && (
                <div className="pl-8 mt-3">
                  <p className="text-xs text-[#6B6B65] mb-2">Options (one per line)</p>
                  <textarea
                    rows={3}
                    value={(q.options ?? []).join('\n')}
                    onChange={(e) => update(q.id, { options: e.target.value.split('\n') })}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#2D4A3E] transition-colors resize-none"
                    placeholder={'Option 1\nOption 2\nOption 3'}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ValuesBuilder({
  content,
  setContent,
}: {
  content: ValuesExerciseContent
  setContent: (c: ValuesExerciseContent) => void
}) {
  const [newValue, setNewValue] = useState('')

  function addValue() {
    const v = newValue.trim()
    if (!v || content.values_library.includes(v)) return
    setContent({ ...content, values_library: [...content.values_library, v] })
    setNewValue('')
  }

  function removeValue(v: string) {
    setContent({ ...content, values_library: content.values_library.filter((x) => x !== v) })
  }

  function updatePrompt(idx: number, text: string) {
    const prompts = [...content.reflection_prompts]
    prompts[idx] = text
    setContent({ ...content, reflection_prompts: prompts })
  }

  function addPrompt() {
    setContent({ ...content, reflection_prompts: [...content.reflection_prompts, ''] })
  }

  function removePrompt(idx: number) {
    setContent({ ...content, reflection_prompts: content.reflection_prompts.filter((_, i) => i !== idx) })
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-[#1C1C1A]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Values Library
        </h2>
        <p className="text-xs text-[#6B6B65]">Client will choose from this list. Add or remove values as needed.</p>
        <div className="flex flex-wrap gap-2">
          {content.values_library.map((v) => (
            <span key={v} className="flex items-center gap-1 bg-[#2D4A3E]/8 text-[#2D4A3E] text-xs px-3 py-1.5 rounded-full">
              {v}
              <button onClick={() => removeValue(v)} className="text-[#2D4A3E]/50 hover:text-red-500 ml-1">✕</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addValue())}
            placeholder="Add a value…"
            className={`flex-1 ${smallInputCls}`}
          />
          <button onClick={addValue} className="text-xs bg-[#2D4A3E] text-white px-3 py-2 rounded-lg hover:bg-[#7A9E8E] transition-colors">Add</button>
        </div>
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm text-[#1C1C1A]">
            <input
              type="checkbox"
              checked={content.allow_custom}
              onChange={(e) => setContent({ ...content, allow_custom: e.target.checked })}
              className="accent-[#2D4A3E]"
            />
            Allow client to add custom values
          </label>
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#1C1C1A]">Rank top</label>
            <input
              type="number"
              min={1}
              max={20}
              value={content.rank_top}
              onChange={(e) => setContent({ ...content, rank_top: Number(e.target.value) })}
              className={`w-16 ${smallInputCls} text-center`}
            />
            <span className="text-sm text-[#6B6B65]">values</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#1C1C1A]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
            Reflection Prompts
          </h2>
          <button onClick={addPrompt} className="text-xs bg-[#2D4A3E] text-white px-3 py-1.5 rounded-full hover:bg-[#7A9E8E] transition-colors">
            + Add prompt
          </button>
        </div>
        <p className="text-xs text-[#6B6B65]">Optional prompts shown after values are ranked.</p>
        {content.reflection_prompts.map((p, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={p}
              onChange={(e) => updatePrompt(idx, e.target.value)}
              className={`flex-1 ${smallInputCls}`}
              placeholder="e.g. What does this value mean to you?"
            />
            <button onClick={() => removePrompt(idx)} className="text-red-400 hover:text-red-600 text-sm px-2">✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function WheelBuilder({
  content,
  setContent,
}: {
  content: WheelOfLifeContent
  setContent: (c: WheelOfLifeContent) => void
}) {
  const [newArea, setNewArea] = useState('')

  function addArea() {
    const a = newArea.trim()
    if (!a || content.areas.includes(a)) return
    setContent({ ...content, areas: [...content.areas, a] })
    setNewArea('')
  }

  function removeArea(a: string) {
    setContent({ ...content, areas: content.areas.filter((x) => x !== a) })
  }

  function updateArea(idx: number, val: string) {
    const areas = [...content.areas]
    areas[idx] = val
    setContent({ ...content, areas })
  }

  return (
    <div className="bg-white rounded-2xl p-6 space-y-4">
      <h2 className="font-semibold text-[#1C1C1A]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
        Life Areas
      </h2>
      <p className="text-xs text-[#6B6B65]">Client will rate each area from 1–10. Results render as a radar chart.</p>
      <div className="space-y-2">
        {content.areas.map((area, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <span className="text-xs text-[#6B6B65] w-5">{idx + 1}.</span>
            <input
              type="text"
              value={area}
              onChange={(e) => updateArea(idx, e.target.value)}
              className={`flex-1 ${smallInputCls}`}
            />
            <button onClick={() => removeArea(area)} className="text-red-400 hover:text-red-600 text-sm px-2">✕</button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newArea}
          onChange={(e) => setNewArea(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArea())}
          placeholder="Add life area…"
          className={`flex-1 ${smallInputCls}`}
        />
        <button onClick={addArea} className="text-xs bg-[#2D4A3E] text-white px-3 py-2 rounded-lg hover:bg-[#7A9E8E] transition-colors">Add</button>
      </div>
    </div>
  )
}

function BeliefBuilder({
  content,
  setContent,
}: {
  content: BeliefMappingContent
  setContent: (c: BeliefMappingContent) => void
}) {
  function updatePrompt(idx: number, val: string) {
    const prompts = [...content.prompts]
    prompts[idx] = val
    setContent({ ...content, prompts })
  }

  function addPrompt() {
    setContent({ ...content, prompts: [...content.prompts, ''] })
  }

  function removePrompt(idx: number) {
    setContent({ ...content, prompts: content.prompts.filter((_, i) => i !== idx) })
  }

  function move(idx: number, dir: -1 | 1) {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= content.prompts.length) return
    const prompts = [...content.prompts]
    ;[prompts[idx], prompts[newIdx]] = [prompts[newIdx], prompts[idx]]
    setContent({ ...content, prompts })
  }

  return (
    <div className="bg-white rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[#1C1C1A]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Belief Prompts
        </h2>
        <button onClick={addPrompt} className="text-xs bg-[#2D4A3E] text-white px-3 py-1.5 rounded-full hover:bg-[#7A9E8E] transition-colors">
          + Add prompt
        </button>
      </div>
      <p className="text-xs text-[#6B6B65]">Each prompt gets a free-text response. Client will work through them in order.</p>
      <div className="space-y-3">
        {content.prompts.map((p, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <span className="text-xs text-[#6B6B65] w-5">{idx + 1}.</span>
            <input
              type="text"
              value={p}
              onChange={(e) => updatePrompt(idx, e.target.value)}
              className={`flex-1 ${smallInputCls}`}
              placeholder="Prompt text…"
            />
            <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-[#6B6B65] hover:text-[#2D4A3E] disabled:opacity-30 text-xs px-1">↑</button>
            <button onClick={() => move(idx, 1)} disabled={idx === content.prompts.length - 1} className="text-[#6B6B65] hover:text-[#2D4A3E] disabled:opacity-30 text-xs px-1">↓</button>
            <button onClick={() => removePrompt(idx)} className="text-red-400 hover:text-red-600 text-sm px-1">✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function MoodBuilder({
  content,
  setContent,
}: {
  content: MoodTrackerContent
  setContent: (c: MoodTrackerContent) => void
}) {
  return (
    <div className="bg-white rounded-2xl p-6 space-y-5">
      <h2 className="font-semibold text-[#1C1C1A]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
        Tracker Settings
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Frequency</label>
          <select
            value={content.frequency}
            onChange={(e) => setContent({ ...content, frequency: e.target.value as 'daily' | 'weekly' })}
            className={`${inputCls} bg-white`}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Duration (days)</label>
          <input
            type="number"
            min={7}
            max={90}
            value={content.duration_days}
            onChange={(e) => setContent({ ...content, duration_days: Number(e.target.value) })}
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Custom question <span className="text-[#6B6B65] font-normal">(optional)</span></label>
        <input
          type="text"
          value={content.custom_question ?? ''}
          onChange={(e) => setContent({ ...content, custom_question: e.target.value || null })}
          className={inputCls}
          placeholder="e.g. What drove your mood today?"
        />
      </div>
      <div className="bg-[#2D4A3E]/5 rounded-xl p-4 text-xs text-[#6B6B65]">
        Client logs a mood score (1–10) each {content.frequency === 'daily' ? 'day' : 'week'} for {content.duration_days} days. Results render as a line chart.
      </div>
    </div>
  )
}

function JournalBuilder({
  content,
  setContent,
}: {
  content: ReflectionJournalContent
  setContent: (c: ReflectionJournalContent) => void
}) {
  return (
    <div className="bg-white rounded-2xl p-6 space-y-5">
      <h2 className="font-semibold text-[#1C1C1A]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
        Journal Settings
      </h2>
      <div>
        <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Reflection prompt</label>
        <textarea
          rows={4}
          value={content.prompt}
          onChange={(e) => setContent({ ...content, prompt: e.target.value })}
          className={`${inputCls} resize-none`}
          placeholder="e.g. What are you most proud of this week? What felt challenging, and what did you learn from it?"
        />
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={content.is_private}
          onChange={(e) => setContent({ ...content, is_private: e.target.checked })}
          className="accent-[#2D4A3E] w-4 h-4"
        />
        <div>
          <p className="text-sm font-medium text-[#1C1C1A]">Private journal</p>
          <p className="text-xs text-[#6B6B65]">When enabled, entries are not visible to you — for client reflection only.</p>
        </div>
      </label>
    </div>
  )
}

function ChallengeBuilder({
  content,
  setContent,
}: {
  content: GamifiedChallengeContent
  setContent: (c: GamifiedChallengeContent) => void
}) {
  function updateDay(day: number, updates: Partial<ChallengeDay>) {
    setContent({
      ...content,
      days: content.days.map((d) => (d.day === day ? { ...d, ...updates } : d)),
    })
  }

  function setDuration(days: number) {
    const clamped = Math.max(1, Math.min(90, days))
    const newDays: ChallengeDay[] = Array.from({ length: clamped }, (_, i) => {
      const existing = content.days.find((d) => d.day === i + 1)
      return existing ?? { day: i + 1, title: '', description: '' }
    })
    setContent({ ...content, duration_days: clamped, days: newDays })
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-[#1C1C1A]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Challenge Settings
        </h2>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-[#1C1C1A]">Duration</label>
          <div className="flex gap-2">
            {[7, 14, 21, 30].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  content.duration_days === d
                    ? 'bg-[#2D4A3E] text-white border-[#2D4A3E]'
                    : 'border-[#2D4A3E]/20 text-[#2D4A3E] hover:bg-[#2D4A3E]/5'
                }`}
              >
                {d} days
              </button>
            ))}
            <input
              type="number"
              min={1}
              max={90}
              value={content.duration_days}
              onChange={(e) => setDuration(Number(e.target.value))}
              className={`w-20 ${smallInputCls} text-center`}
              placeholder="Custom"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Completion message</label>
          <textarea
            rows={2}
            value={content.completion_message}
            onChange={(e) => setContent({ ...content, completion_message: e.target.value })}
            className={`${inputCls} resize-none`}
            placeholder="e.g. You did it! Take a moment to celebrate how far you've come."
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-[#1C1C1A]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
          Day-by-day content
        </h2>
        <p className="text-xs text-[#6B6B65]">Leave a day blank to use a simple checkbox — add content for a richer experience.</p>
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {content.days.map((d) => (
            <div key={d.day} className="border border-[#2D4A3E]/10 rounded-xl p-4">
              <p className="text-xs font-semibold text-[#2D4A3E] mb-2">Day {d.day}</p>
              <input
                type="text"
                value={d.title}
                onChange={(e) => updateDay(d.day, { title: e.target.value })}
                className={`${inputCls} mb-2`}
                placeholder="Day title (optional)"
              />
              <textarea
                rows={2}
                value={d.description}
                onChange={(e) => updateDay(d.day, { description: e.target.value })}
                className={`${inputCls} resize-none`}
                placeholder="Instructions or context for this day…"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main ToolBuilder ───────────────────────────────────────────────────────────

interface Props {
  initialTool?: any
}

export default function ToolBuilder({ initialTool }: Props) {
  const router = useRouter()
  const [name, setName] = useState(initialTool?.name ?? '')
  const [description, setDescription] = useState(initialTool?.description ?? '')
  const [type, setType] = useState<ToolType>(initialTool?.type ?? 'self_discovery_questionnaire')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Questionnaire state
  const [questions, setQuestions] = useState<Question[]>(
    initialTool?.content?.questions ?? initialTool?.questions ?? []
  )

  // Values state
  const [valuesContent, setValuesContent] = useState<ValuesExerciseContent>(() => ({
    values_library: initialTool?.content?.values_library ?? DEFAULT_VALUES,
    allow_custom: initialTool?.content?.allow_custom ?? true,
    rank_top: initialTool?.content?.rank_top ?? 5,
    reflection_prompts: initialTool?.content?.reflection_prompts ?? [],
  }))

  // Wheel state
  const [wheelContent, setWheelContent] = useState<WheelOfLifeContent>(() => ({
    areas: initialTool?.content?.areas ?? DEFAULT_WHEEL_AREAS,
  }))

  // Belief state
  const [beliefContent, setBeliefContent] = useState<BeliefMappingContent>(() => ({
    prompts: initialTool?.content?.prompts ?? DEFAULT_BELIEF_PROMPTS,
  }))

  // Mood state
  const [moodContent, setMoodContent] = useState<MoodTrackerContent>(() => ({
    frequency: initialTool?.content?.frequency ?? 'daily',
    duration_days: initialTool?.content?.duration_days ?? 30,
    custom_question: initialTool?.content?.custom_question ?? null,
  }))

  // Journal state
  const [journalContent, setJournalContent] = useState<ReflectionJournalContent>(() => ({
    prompt: initialTool?.content?.prompt ?? '',
    is_private: initialTool?.content?.is_private ?? false,
  }))

  // Challenge state
  const [challengeContent, setChallengeContent] = useState<GamifiedChallengeContent>(() => {
    const dur = initialTool?.content?.duration_days ?? 7
    const existingDays = initialTool?.content?.days ?? []
    const days: ChallengeDay[] = Array.from({ length: dur }, (_, i) => {
      const existing = existingDays.find((d: ChallengeDay) => d.day === i + 1)
      return existing ?? { day: i + 1, title: '', description: '' }
    })
    return {
      duration_days: dur,
      days,
      completion_message: initialTool?.content?.completion_message ?? '',
    }
  })

  function buildContent() {
    switch (type) {
      case 'onboarding_questionnaire':
      case 'self_discovery_questionnaire':
        return { questions }
      case 'values_exercise':
        return valuesContent
      case 'wheel_of_life':
        return wheelContent
      case 'belief_mapping':
        return beliefContent
      case 'mood_tracker':
        return moodContent
      case 'reflection_journal':
        return journalContent
      case 'gamified_challenge':
        return challengeContent
    }
  }

  async function handleSave(publishStatus: 'draft' | 'published') {
    if (!name.trim()) { setError('Tool name is required.'); return }
    setError('')
    setSaving(true)
    const supabase = createClient()
    const content = buildContent()
    const payload = { name, description, type, status: publishStatus, content }

    if (initialTool?.id) {
      const { error: err } = await supabase.from('tools').update(payload).eq('id', initialTool.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('tools').insert(payload)
      if (err) { setError(err.message); setSaving(false); return }
    }

    router.push('/portal/toolbox')
    router.refresh()
  }

  const isQuestionnaire = type === 'onboarding_questionnaire' || type === 'self_discovery_questionnaire'
  const typeInfo = TOOL_TYPES.find((t) => t.value === type)

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
        {/* Meta */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Tool name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              placeholder="e.g. Onboarding Intake Form"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="What is this tool for? This is shown to clients."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ToolType)}
              className={`${inputCls} bg-white`}
            >
              {TOOL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {typeInfo && (
              <p className="text-xs text-[#6B6B65] mt-1.5">{typeInfo.description}</p>
            )}
          </div>
        </div>

        {/* Type-specific builder */}
        {isQuestionnaire && (
          <QuestionBuilder questions={questions} setQuestions={setQuestions} />
        )}
        {type === 'values_exercise' && (
          <ValuesBuilder content={valuesContent} setContent={setValuesContent} />
        )}
        {type === 'wheel_of_life' && (
          <WheelBuilder content={wheelContent} setContent={setWheelContent} />
        )}
        {type === 'belief_mapping' && (
          <BeliefBuilder content={beliefContent} setContent={setBeliefContent} />
        )}
        {type === 'mood_tracker' && (
          <MoodBuilder content={moodContent} setContent={setMoodContent} />
        )}
        {type === 'reflection_journal' && (
          <JournalBuilder content={journalContent} setContent={setJournalContent} />
        )}
        {type === 'gamified_challenge' && (
          <ChallengeBuilder content={challengeContent} setContent={setChallengeContent} />
        )}

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
            {saving ? 'Saving…' : 'Publish'}
          </button>
        </div>
      </div>
    </div>
  )
}
