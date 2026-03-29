'use client'

import { useState } from 'react'
import NotesEditor from './NotesEditor'

const TABS = ['Overview', 'Sessions', 'Toolbox', 'Notes'] as const
type Tab = typeof TABS[number]

interface Props {
  client: any
  sessions: any[]
  assignments: any[]
}

export default function ClientTabs({ client, sessions, assignments }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              activeTab === tab
                ? 'bg-[#2D4A3E] text-white'
                : 'text-[#6B6B65] hover:text-[#1C1C1A]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'Overview' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-[#1C1C1A] text-sm">Client details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#6B6B65]">Name</dt>
                <dd className="text-[#1C1C1A] font-medium">{client.profiles?.full_name ?? '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6B6B65]">Email</dt>
                <dd className="text-[#1C1C1A]">{client.profiles?.email ?? '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6B6B65]">Programme</dt>
                <dd className="text-[#1C1C1A]">{client.programme ?? 'The Becoming'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6B6B65]">Start date</dt>
                <dd className="text-[#1C1C1A]">
                  {client.start_date
                    ? new Date(client.start_date).toLocaleDateString('en-GB')
                    : '—'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#6B6B65]">Status</dt>
                <dd>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    client.status === 'active'
                      ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]'
                      : 'bg-[#6B6B65]/10 text-[#6B6B65]'
                  }`}>
                    {client.status}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-semibold text-[#1C1C1A] text-sm mb-4">Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FAF7F2] rounded-xl p-4 text-center">
                <p className="text-2xl font-semibold text-[#2D4A3E]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {sessions.length}
                </p>
                <p className="text-xs text-[#6B6B65] mt-1">Sessions</p>
              </div>
              <div className="bg-[#FAF7F2] rounded-xl p-4 text-center">
                <p className="text-2xl font-semibold text-[#2D4A3E]" style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>
                  {assignments.length}
                </p>
                <p className="text-xs text-[#6B6B65] mt-1">Tools assigned</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sessions */}
      {activeTab === 'Sessions' && (
        <div className="bg-white rounded-2xl overflow-hidden">
          {sessions.length > 0 ? (
            <div className="divide-y divide-[#2D4A3E]/10">
              {sessions.map((s: any) => (
                <div key={s.id} className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm text-[#1C1C1A]">
                      {new Date(s.session_date).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                    <span className="text-xs text-[#6B6B65]">{s.duration_minutes} min</span>
                  </div>
                  {s.notes_shared && (
                    <p className="text-sm text-[#6B6B65] leading-relaxed">{s.notes_shared}</p>
                  )}
                  {s.next_steps && (
                    <p className="text-xs text-[#2D4A3E] mt-2">Next steps: {s.next_steps}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-[#6B6B65] text-sm italic">No sessions logged yet.</div>
          )}
        </div>
      )}

      {/* Toolbox */}
      {activeTab === 'Toolbox' && (
        <div className="bg-white rounded-2xl overflow-hidden">
          {assignments.length > 0 ? (
            <div className="divide-y divide-[#2D4A3E]/10">
              {assignments.map((a: any) => (
                <div key={a.id} className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-[#1C1C1A]">{a.tools?.name}</p>
                    <p className="text-xs text-[#6B6B65] mt-0.5">{a.tools?.type?.replace(/_/g, ' ')}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    a.status === 'completed'
                      ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]'
                      : a.status === 'in_progress'
                      ? 'bg-[#7A9E8E]/20 text-[#7A9E8E]'
                      : 'bg-[#6B6B65]/10 text-[#6B6B65]'
                  }`}>
                    {a.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-[#6B6B65] text-sm italic">No tools assigned yet.</div>
          )}
        </div>
      )}

      {/* Notes */}
      {activeTab === 'Notes' && (
        <NotesEditor clientId={client.id} />
      )}
    </div>
  )
}
