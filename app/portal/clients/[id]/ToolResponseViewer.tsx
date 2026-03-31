'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'

interface Props {
  assignment: any
}

const TOOL_TYPE_LABELS: Record<string, string> = {
  onboarding_questionnaire: 'Onboarding Questionnaire',
  self_discovery_questionnaire: 'Self-Discovery Questionnaire',
  values_exercise: 'Values Exercise',
  wheel_of_life: 'Wheel of Life',
  belief_mapping: 'Belief Mapping',
  mood_tracker: 'Mood & Pattern Tracker',
  reflection_journal: 'Reflection Journal',
  gamified_challenge: 'Gamified Challenge',
}

export default function ToolResponseViewer({ assignment }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<{
    response: any | null
    moodEntries: any[]
    journalEntries: any[]
  } | null>(null)

  const tool = assignment.tools
  const toolType: string = tool?.type ?? ''
  const content = tool?.content ?? (tool?.questions ? { questions: tool.questions } : null)

  async function loadData() {
    if (data) { setExpanded(!expanded); return }
    setLoading(true)
    setExpanded(true)
    const supabase = createClient()

    const [{ data: response }, { data: moodEntries }, { data: journalEntries }] = await Promise.all([
      supabase
        .from('tool_responses')
        .select('*')
        .eq('assignment_id', assignment.id)
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from('mood_entries')
        .select('*')
        .eq('assignment_id', assignment.id)
        .order('logged_at', { ascending: true }),
      supabase
        .from('journal_entries')
        .select('*')
        .eq('assignment_id', assignment.id)
        .order('created_at', { ascending: false }),
    ])

    setData({ response: response ?? null, moodEntries: moodEntries ?? [], journalEntries: journalEntries ?? [] })
    setLoading(false)
  }

  if (assignment.status !== 'completed' && assignment.status !== 'in_progress') return null

  return (
    <div className="mt-3">
      <button
        onClick={loadData}
        className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors flex items-center gap-1"
      >
        {loading ? 'Loading…' : expanded ? '▲ Hide response' : '▼ View response'}
      </button>

      {expanded && data && (
        <div className="mt-4 border-t border-[#2D4A3E]/10 pt-4">
          {/* Questionnaires */}
          {(toolType === 'onboarding_questionnaire' || toolType === 'self_discovery_questionnaire') && data.response && (
            <div className="space-y-3">
              {(content?.questions ?? []).map((q: any, idx: number) => (
                <div key={q.id}>
                  <p className="text-xs text-[#6B6B65] mb-0.5">{idx + 1}. {q.text}</p>
                  <p className="text-sm text-[#1C1C1A]">{String(data.response.responses[q.id] ?? '—')}</p>
                </div>
              ))}
            </div>
          )}

          {/* Values */}
          {toolType === 'values_exercise' && data.response && (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-[#6B6B65] mb-2">Top {content?.rank_top ?? 5} values (ranked)</p>
                <ol className="space-y-1">
                  {(data.response.responses.ranked ?? []).map((v: string, i: number) => (
                    <li key={v} className="flex items-center gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-[#2D4A3E] text-white text-xs flex items-center justify-center">{i + 1}</span>
                      {v}
                    </li>
                  ))}
                </ol>
              </div>
              {(content?.reflection_prompts ?? []).length > 0 && data.response.responses.reflections && (
                <div className="space-y-3">
                  <p className="text-xs text-[#6B6B65]">Reflections</p>
                  {(content?.reflection_prompts ?? []).map((p: string, i: number) => (
                    <div key={i}>
                      <p className="text-xs text-[#6B6B65] italic mb-0.5">{p}</p>
                      <p className="text-sm text-[#1C1C1A]">{data.response.responses.reflections[String(i)] ?? '—'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wheel of Life */}
          {toolType === 'wheel_of_life' && data.response && (
            <div className="space-y-4">
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart data={(content?.areas ?? []).map((a: string) => ({ area: a, score: data.response.responses.scores?.[a] ?? 0 }))}>
                  <PolarGrid stroke="#2D4A3E20" />
                  <PolarAngleAxis dataKey="area" tick={{ fontSize: 10, fill: '#6B6B65' }} />
                  <Radar dataKey="score" stroke="#2D4A3E" fill="#2D4A3E" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {(content?.areas ?? []).map((area: string) => (
                  <div key={area} className="flex items-center gap-3 text-sm">
                    <span className="w-32 shrink-0 text-xs text-[#6B6B65]">{area}</span>
                    <div className="flex-1 bg-[#2D4A3E]/10 rounded-full h-1.5">
                      <div
                        className="bg-[#2D4A3E] h-1.5 rounded-full"
                        style={{ width: `${((data.response.responses.scores?.[area] ?? 0) / 10) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#2D4A3E] w-4 text-right">{data.response.responses.scores?.[area] ?? '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Belief Mapping */}
          {toolType === 'belief_mapping' && data.response && (
            <div className="space-y-3">
              {(content?.prompts ?? []).map((p: string, idx: number) => (
                <div key={idx}>
                  <p className="text-xs text-[#6B6B65] italic mb-0.5">{p}</p>
                  <p className="text-sm text-[#1C1C1A]">{data.response.responses.answers?.[idx] ?? '—'}</p>
                </div>
              ))}
            </div>
          )}

          {/* Mood Tracker */}
          {toolType === 'mood_tracker' && data.moodEntries.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#6B6B65]">{data.moodEntries.length} entries logged</p>
                {data.moodEntries.length > 0 && (
                  <p className="text-xs text-[#6B6B65]">
                    Avg: <span className="font-medium text-[#2D4A3E]">
                      {(data.moodEntries.reduce((sum, e) => sum + e.mood_rating, 0) / data.moodEntries.length).toFixed(1)}
                    </span>
                  </p>
                )}
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={data.moodEntries.map((e) => ({
                  date: new Date(e.entry_date ?? e.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
                  score: e.mood_rating,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D4A3E10" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B6B65' }} />
                  <YAxis domain={[1, 10]} tick={{ fontSize: 10, fill: '#6B6B65' }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #2D4A3E20', fontSize: 11 }} />
                  <Line type="monotone" dataKey="score" stroke="#2D4A3E" strokeWidth={2} dot={{ r: 3, fill: '#2D4A3E' }} name="Mood" />
                </LineChart>
              </ResponsiveContainer>
              {data.moodEntries.some((e) => e.reflection) && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {data.moodEntries.filter((e) => e.reflection).slice(0, 5).map((e) => (
                    <div key={e.id} className="text-xs text-[#6B6B65]">
                      <span className="font-medium text-[#2D4A3E]">{new Date(e.entry_date ?? e.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                      {' · '}Score {e.mood_rating}{' · '}{e.reflection}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reflection Journal */}
          {toolType === 'reflection_journal' && (
            <div>
              {content?.is_private ? (
                <p className="text-xs text-[#6B6B65] italic">This is a private journal — entries are only visible to the client.</p>
              ) : data.journalEntries.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {data.journalEntries.map((entry) => (
                    <div key={entry.id} className="border-l-2 border-[#2D4A3E]/20 pl-4">
                      <p className="text-xs text-[#6B6B65] mb-1">
                        {new Date(entry.created_at).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </p>
                      <p className="text-sm text-[#1C1C1A] whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#6B6B65] italic">No journal entries yet.</p>
              )}
            </div>
          )}

          {/* Gamified Challenge */}
          {toolType === 'gamified_challenge' && data.response && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#6B6B65]">
                  {(data.response.responses.completed_days ?? []).length}/{content?.duration_days ?? 0} days completed
                </p>
                <div className="flex-1 mx-4 bg-[#2D4A3E]/10 rounded-full h-2">
                  <div
                    className="bg-[#2D4A3E] h-2 rounded-full"
                    style={{ width: `${((data.response.responses.completed_days?.length ?? 0) / (content?.duration_days ?? 1)) * 100}%` }}
                  />
                </div>
              </div>
              {Object.keys(data.response.responses.notes ?? {}).length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {Object.entries(data.response.responses.notes as Record<string, string>).map(([day, note]) => (
                    note ? (
                      <div key={day} className="text-xs text-[#6B6B65]">
                        <span className="font-medium text-[#2D4A3E]">Day {day}:</span> {note}
                      </div>
                    ) : null
                  ))}
                </div>
              )}
            </div>
          )}

          {/* No data */}
          {assignment.status === 'in_progress' && !data.response && data.moodEntries.length === 0 && data.journalEntries.length === 0 && (
            <p className="text-xs text-[#6B6B65] italic">In progress — no responses yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
