'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import NotesEditor from './NotesEditor'
import LogSessionForm from '@/app/portal/sessions/LogSessionForm'
import Link from 'next/link'

const TABS = ['Overview', 'Sessions', 'Onboarding', 'Toolbox', 'Documents', 'Invoices', 'Notes'] as const
type Tab = typeof TABS[number]

interface Props {
  client: any
  sessions: any[]
  assignments: any[]
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'active' ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]' :
    status === 'paused' ? 'bg-amber-100 text-amber-700' :
    status === 'completed' ? 'bg-[#7A9E8E]/20 text-[#7A9E8E]' :
    'bg-[#6B6B65]/10 text-[#6B6B65]'
  return <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${cls}`}>{status}</span>
}

function AssignmentStatusBadge({ status }: { status: string }) {
  const cls =
    status === 'completed' ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]' :
    status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
    'bg-[#6B6B65]/10 text-[#6B6B65]'
  return <span className={`text-xs px-2 py-0.5 rounded-full ${cls}`}>{status.replace('_', ' ')}</span>
}

export default function ClientTabs({ client, sessions, assignments }: Props) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  // Overview edit state
  const [editing, setEditing] = useState(false)
  const [overview, setOverview] = useState({
    summary_note: client.summary_note ?? '',
    emergency_contact: client.emergency_contact ?? '',
    flags: client.flags ?? '',
    status: client.status ?? 'active',
  })
  const [saving, setSaving] = useState(false)

  async function saveOverview() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('clients').update(overview).eq('id', client.id)
    setSaving(false)
    setEditing(false)
    router.refresh()
  }

  const onboarding = assignments.filter((a: any) => a.tools?.type === 'onboarding_questionnaire')

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 w-fit overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'bg-[#2D4A3E] text-white'
                : 'text-[#6B6B65] hover:text-[#1C1C1A]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Overview ─────────────────────────────────────────── */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact details */}
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-[#1C1C1A] text-sm">Contact details</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#6B6B65]">Name</dt>
                  <dd className="text-[#1C1C1A] font-medium">{client.profiles?.full_name ?? '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6B6B65]">Email</dt>
                  <dd className="text-[#1C1C1A]">
                    <a href={`mailto:${client.profiles?.email}`} className="hover:text-[#2D4A3E] transition-colors">
                      {client.profiles?.email ?? '—'}
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6B6B65]">Programme</dt>
                  <dd className="text-[#1C1C1A]">{client.programme ?? '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6B6B65]">Start date</dt>
                  <dd className="text-[#1C1C1A]">
                    {client.start_date ? new Date(client.start_date).toLocaleDateString('en-GB') : '—'}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-[#6B6B65]">Status</dt>
                  <dd><StatusBadge status={client.status} /></dd>
                </div>
              </dl>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-semibold text-[#1C1C1A] text-sm mb-4">At a glance</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Sessions', value: sessions.length },
                  { label: 'Tools assigned', value: assignments.length },
                  { label: 'Completed tools', value: assignments.filter((a: any) => a.status === 'completed').length },
                  {
                    label: 'Last session',
                    value: sessions[0]
                      ? new Date(sessions[0].session_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                      : '—',
                  },
                ].map((s) => (
                  <div key={s.label} className="bg-[#FAF7F2] rounded-xl p-4 text-center">
                    <p
                      className="text-xl font-semibold text-[#2D4A3E]"
                      style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
                    >
                      {s.value}
                    </p>
                    <p className="text-xs text-[#6B6B65] mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Editable practitioner fields */}
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#1C1C1A] text-sm">Practitioner notes</h3>
              {editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="text-xs text-[#6B6B65] px-3 py-1.5 rounded-full border border-[#6B6B65]/20 hover:bg-[#FAF7F2] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveOverview}
                    disabled={saving}
                    className="text-xs bg-[#2D4A3E] text-white px-3 py-1.5 rounded-full hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors"
                >
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">Status</label>
                  <select
                    value={overview.status}
                    onChange={(e) => setOverview({ ...overview, status: e.target.value })}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">Summary note</label>
                  <textarea
                    value={overview.summary_note}
                    onChange={(e) => setOverview({ ...overview, summary_note: e.target.value })}
                    rows={4}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] resize-none"
                    placeholder="Overview of this client's journey, goals, and context…"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">Emergency contact</label>
                  <input
                    type="text"
                    value={overview.emergency_contact}
                    onChange={(e) => setOverview({ ...overview, emergency_contact: e.target.value })}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E]"
                    placeholder="Name and phone number"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">
                    Flags / considerations <span className="text-[#6B6B65]/60">(private)</span>
                  </label>
                  <textarea
                    value={overview.flags}
                    onChange={(e) => setOverview({ ...overview, flags: e.target.value })}
                    rows={3}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] resize-none"
                    placeholder="Any special considerations, contraindications, or flags…"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-[#6B6B65] mb-1">Summary note</p>
                  <p className="text-[#1C1C1A] leading-relaxed">
                    {overview.summary_note || <span className="italic text-[#6B6B65]">No summary yet. Click Edit to add one.</span>}
                  </p>
                </div>
                {overview.emergency_contact && (
                  <div>
                    <p className="text-xs text-[#6B6B65] mb-1">Emergency contact</p>
                    <p className="text-[#1C1C1A]">{overview.emergency_contact}</p>
                  </div>
                )}
                {overview.flags && (
                  <div>
                    <p className="text-xs text-[#6B6B65] mb-1">Flags</p>
                    <p className="text-[#1C1C1A] leading-relaxed">{overview.flags}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Sessions ─────────────────────────────────────────── */}
      {activeTab === 'Sessions' && (
        <div>
          <div className="flex justify-end mb-4">
            <LogSessionForm
              clients={[{ id: client.id, profiles: { full_name: client.profiles?.full_name } }]}
              defaultClientId={client.id}
            />
          </div>
          <div className="bg-white rounded-2xl overflow-hidden">
            {sessions.length > 0 ? (
              <div className="divide-y divide-[#2D4A3E]/10">
                {sessions.map((s: any) => (
                  <div key={s.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-sm text-[#1C1C1A]">
                          {new Date(s.session_date).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-[#6B6B65]">{s.duration_minutes} min</span>
                          {s.session_type && (
                            <span className="text-xs text-[#6B6B65] capitalize">
                              · {s.session_type.replace('_', '-')}
                            </span>
                          )}
                          {s.status && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              s.status === 'complete' ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {s.status}
                            </span>
                          )}
                          {s.flag_followup && (
                            <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full">Follow-up</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {s.notes_shared && (
                      <div className="mb-2">
                        <p className="text-xs text-[#6B6B65] mb-1">Shared notes</p>
                        <p className="text-sm text-[#1C1C1A] leading-relaxed">{s.notes_shared}</p>
                      </div>
                    )}
                    {s.notes_practitioner && (
                      <div className="mb-2">
                        <p className="text-xs text-[#6B6B65] mb-1">Private notes</p>
                        <p className="text-sm text-[#1C1C1A] leading-relaxed">{s.notes_practitioner}</p>
                      </div>
                    )}
                    {s.next_steps && (
                      <div className="mb-2">
                        <p className="text-xs text-[#6B6B65] mb-1">Next steps</p>
                        <p className="text-sm text-[#2D4A3E]">{s.next_steps}</p>
                      </div>
                    )}
                    {s.homework && (
                      <div>
                        <p className="text-xs text-[#6B6B65] mb-1">Homework</p>
                        <p className="text-sm text-[#1C1C1A]">{s.homework}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-[#6B6B65] text-sm italic mb-4">No sessions logged yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Onboarding ───────────────────────────────────────── */}
      {activeTab === 'Onboarding' && (
        <div className="bg-white rounded-2xl overflow-hidden">
          {onboarding.length > 0 ? (
            <div className="divide-y divide-[#2D4A3E]/10">
              {onboarding.map((a: any) => (
                <div key={a.id} className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-[#1C1C1A]">{a.tools?.name}</p>
                    <p className="text-xs text-[#6B6B65] mt-0.5">
                      Assigned {new Date(a.assigned_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <AssignmentStatusBadge status={a.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-[#6B6B65] text-sm italic mb-4">No onboarding questionnaires assigned.</p>
              <Link
                href="/portal/toolbox"
                className="text-xs bg-[#2D4A3E] text-white px-4 py-2 rounded-full hover:bg-[#7A9E8E] transition-colors"
              >
                Go to Toolbox →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── Toolbox ──────────────────────────────────────────── */}
      {activeTab === 'Toolbox' && (
        <div>
          <div className="flex justify-end mb-4">
            <Link
              href="/portal/toolbox"
              className="text-xs bg-[#2D4A3E] text-white px-4 py-2 rounded-full hover:bg-[#7A9E8E] transition-colors"
            >
              + Assign tool
            </Link>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden">
            {assignments.length > 0 ? (
              <div className="divide-y divide-[#2D4A3E]/10">
                {assignments.map((a: any) => (
                  <div key={a.id} className="p-6 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-[#1C1C1A]">{a.tools?.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-[#6B6B65] capitalize">
                          {a.tools?.type?.replace(/_/g, ' ')}
                        </span>
                        <span className="text-xs text-[#6B6B65]">
                          · Assigned {new Date(a.assigned_at).toLocaleDateString('en-GB')}
                        </span>
                        {a.due_date && (
                          <span className="text-xs text-[#6B6B65]">
                            · Due {new Date(a.due_date).toLocaleDateString('en-GB')}
                          </span>
                        )}
                      </div>
                    </div>
                    <AssignmentStatusBadge status={a.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-[#6B6B65] text-sm italic mb-4">No tools assigned yet.</p>
                <Link
                  href="/portal/toolbox"
                  className="text-xs bg-[#2D4A3E] text-white px-4 py-2 rounded-full hover:bg-[#7A9E8E] transition-colors"
                >
                  Go to Toolbox →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Documents ────────────────────────────────────────── */}
      {activeTab === 'Documents' && (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-12 h-12 bg-[#FAF7F2] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            📎
          </div>
          <p className="font-semibold text-[#1C1C1A] text-sm mb-2">Documents — Phase 4</p>
          <p className="text-sm text-[#6B6B65] max-w-sm mx-auto">
            Secure file storage for consent forms, programme agreements, and client resources will be available in the next build phase.
          </p>
        </div>
      )}

      {/* ── Invoices ─────────────────────────────────────────── */}
      {activeTab === 'Invoices' && (
        <div className="bg-white rounded-2xl p-12 text-center">
          <div className="w-12 h-12 bg-[#FAF7F2] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            🧾
          </div>
          <p className="font-semibold text-[#1C1C1A] text-sm mb-2">Invoicing — Phase 4</p>
          <p className="text-sm text-[#6B6B65] max-w-sm mx-auto">
            Invoice creation, PDF delivery, and payment tracking will be available in the next build phase.
          </p>
        </div>
      )}

      {/* ── Notes ────────────────────────────────────────────── */}
      {activeTab === 'Notes' && (
        <NotesEditor clientId={client.id} />
      )}
    </div>
  )
}
