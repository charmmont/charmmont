'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'
import NotesEditor from './NotesEditor'
import LogSessionForm from '@/app/portal/sessions/LogSessionForm'
import ToolResponseViewer from './ToolResponseViewer'
import DocumentUpload from '@/app/portal/documents/DocumentUpload'
import Link from 'next/link'

const TAB_KEYS = ['Overview', 'Sessions', 'Onboarding', 'Toolbox', 'Documents', 'Invoices', 'Notes'] as const
type Tab = typeof TAB_KEYS[number]

interface Props {
  client: any
  sessions: any[]
  assignments: any[]
  invoices: any[]
  documents: any[]
  locale: string
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

const STATUS_STYLES_INV: Record<string, string> = {
  draft:   'bg-[#6B6B65]/10 text-[#6B6B65]',
  sent:    'bg-blue-100 text-blue-700',
  paid:    'bg-[#2D4A3E]/10 text-[#2D4A3E]',
  overdue: 'bg-red-100 text-red-600',
}

const FILE_ICONS: Record<string, string> = {
  'application/pdf': '📄',
  'application/msword': '📝',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
  'image/jpeg': '🖼', 'image/png': '🖼',
}

export default function ClientTabs({ client, sessions, assignments, invoices, documents, locale }: Props) {
  const t = useTranslations('ClientDetail')
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  const dateLang = locale === 'es' ? 'es-ES' : 'en-GB'

  const TABS: { key: Tab; label: string }[] = [
    { key: 'Overview',   label: t('tab_overview') },
    { key: 'Sessions',   label: t('tab_sessions') },
    { key: 'Onboarding', label: t('tab_onboarding') },
    { key: 'Toolbox',    label: t('tab_toolbox') },
    { key: 'Documents',  label: t('tab_documents') },
    { key: 'Invoices',   label: t('tab_invoices') },
    { key: 'Notes',      label: t('tab_notes') },
  ]

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
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === key
                ? 'bg-[#2D4A3E] text-white'
                : 'text-[#6B6B65] hover:text-[#1C1C1A]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Overview ─────────────────────────────────────────── */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact details */}
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h3 className="font-semibold text-[#1C1C1A] text-sm">{t('contact_title')}</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#6B6B65]">{t('field_name')}</dt>
                  <dd className="text-[#1C1C1A] font-medium">{client.profiles?.full_name ?? '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6B6B65]">{t('field_email')}</dt>
                  <dd className="text-[#1C1C1A]">
                    <a href={`mailto:${client.profiles?.email}`} className="hover:text-[#2D4A3E] transition-colors">
                      {client.profiles?.email ?? '—'}
                    </a>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6B6B65]">{t('field_programme')}</dt>
                  <dd className="text-[#1C1C1A]">{client.programme ?? '—'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#6B6B65]">{t('field_start_date')}</dt>
                  <dd className="text-[#1C1C1A]">
                    {client.start_date ? new Date(client.start_date).toLocaleDateString(dateLang) : '—'}
                  </dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt className="text-[#6B6B65]">{t('field_status')}</dt>
                  <dd><StatusBadge status={client.status} /></dd>
                </div>
              </dl>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl p-6">
              <h3 className="font-semibold text-[#1C1C1A] text-sm mb-4">{t('glance_title')}</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: t('glance_sessions'), value: sessions.length },
                  { label: t('glance_tools_assigned'), value: assignments.length },
                  { label: t('glance_tools_completed'), value: assignments.filter((a: any) => a.status === 'completed').length },
                  {
                    label: t('glance_last_session'),
                    value: sessions[0]
                      ? new Date(sessions[0].session_date).toLocaleDateString(dateLang, { day: 'numeric', month: 'short' })
                      : '—',
                  },
                ].map((s) => (
                  <div key={s.label} className="bg-[#FAF7F2] rounded-xl p-4 text-center">
                    <p
                      className="text-xl font-semibold text-[#2D4A3E]"
                      style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
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
              <h3 className="font-semibold text-[#1C1C1A] text-sm">{t('practitioner_notes_title')}</h3>
              {editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="text-xs text-[#6B6B65] px-3 py-1.5 rounded-full border border-[#6B6B65]/20 hover:bg-[#FAF7F2] transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={saveOverview}
                    disabled={saving}
                    className="text-xs bg-[#2D4A3E] text-white px-3 py-1.5 rounded-full hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
                  >
                    {saving ? t('saving') : t('save')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors"
                >
                  {t('edit')}
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">{t('field_status_label')}</label>
                  <select
                    value={overview.status}
                    onChange={(e) => setOverview({ ...overview, status: e.target.value })}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] bg-white"
                  >
                    <option value="active">{t('status_active')}</option>
                    <option value="paused">{t('status_paused')}</option>
                    <option value="completed">{t('status_completed')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">{t('field_summary')}</label>
                  <textarea
                    value={overview.summary_note}
                    onChange={(e) => setOverview({ ...overview, summary_note: e.target.value })}
                    rows={4}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] resize-none"
                    placeholder={t('field_summary_placeholder')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">{t('field_emergency')}</label>
                  <input
                    type="text"
                    value={overview.emergency_contact}
                    onChange={(e) => setOverview({ ...overview, emergency_contact: e.target.value })}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E]"
                    placeholder={t('field_emergency_placeholder')}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#6B6B65] mb-1.5">
                    {t('field_flags')} <span className="text-[#6B6B65]/60">{t('field_flags_private')}</span>
                  </label>
                  <textarea
                    value={overview.flags}
                    onChange={(e) => setOverview({ ...overview, flags: e.target.value })}
                    rows={3}
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] resize-none"
                    placeholder={t('field_flags_placeholder')}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs text-[#6B6B65] mb-1">{t('field_summary')}</p>
                  <p className="text-[#1C1C1A] leading-relaxed">
                    {overview.summary_note || <span className="italic text-[#6B6B65]">{t('no_summary')}</span>}
                  </p>
                </div>
                {overview.emergency_contact && (
                  <div>
                    <p className="text-xs text-[#6B6B65] mb-1">{t('field_emergency')}</p>
                    <p className="text-[#1C1C1A]">{overview.emergency_contact}</p>
                  </div>
                )}
                {overview.flags && (
                  <div>
                    <p className="text-xs text-[#6B6B65] mb-1">{t('field_flags')}</p>
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
                          {new Date(s.session_date).toLocaleDateString(dateLang, {
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
                            <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full">{t('follow_up')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {s.notes_shared && (
                      <div className="mb-2">
                        <p className="text-xs text-[#6B6B65] mb-1">{t('notes_shared')}</p>
                        <p className="text-sm text-[#1C1C1A] leading-relaxed">{s.notes_shared}</p>
                      </div>
                    )}
                    {s.notes_practitioner && (
                      <div className="mb-2">
                        <p className="text-xs text-[#6B6B65] mb-1">{t('notes_private')}</p>
                        <p className="text-sm text-[#1C1C1A] leading-relaxed">{s.notes_practitioner}</p>
                      </div>
                    )}
                    {s.next_steps && (
                      <div className="mb-2">
                        <p className="text-xs text-[#6B6B65] mb-1">{t('next_steps')}</p>
                        <p className="text-sm text-[#2D4A3E]">{s.next_steps}</p>
                      </div>
                    )}
                    {s.homework && (
                      <div>
                        <p className="text-xs text-[#6B6B65] mb-1">{t('homework')}</p>
                        <p className="text-sm text-[#1C1C1A]">{s.homework}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-[#6B6B65] text-sm italic mb-4">{t('no_sessions')}</p>
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
                      {t('assigned', { date: new Date(a.assigned_at).toLocaleDateString(dateLang) })}
                    </p>
                  </div>
                  <AssignmentStatusBadge status={a.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-[#6B6B65] text-sm italic mb-4">{t('no_onboarding')}</p>
              <Link
                href="/portal/toolbox"
                className="text-xs bg-[#2D4A3E] text-white px-4 py-2 rounded-full hover:bg-[#7A9E8E] transition-colors"
              >
                {t('go_toolbox')}
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
              {t('assign_tool')}
            </Link>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden">
            {assignments.length > 0 ? (
              <div className="divide-y divide-[#2D4A3E]/10">
                {assignments.map((a: any) => (
                  <div key={a.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-[#1C1C1A]">{a.tools?.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="text-xs text-[#6B6B65] capitalize">
                            {a.tools?.type?.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs text-[#6B6B65]">
                            · {t('assigned', { date: new Date(a.assigned_at).toLocaleDateString(dateLang) })}
                          </span>
                          {a.due_date && (
                            <span className="text-xs text-[#6B6B65]">
                              · {t('due', { date: new Date(a.due_date).toLocaleDateString(dateLang) })}
                            </span>
                          )}
                        </div>
                        <ToolResponseViewer assignment={a} />
                      </div>
                      <AssignmentStatusBadge status={a.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-[#6B6B65] text-sm italic mb-4">{t('no_tools')}</p>
                <Link
                  href="/portal/toolbox"
                  className="text-xs bg-[#2D4A3E] text-white px-4 py-2 rounded-full hover:bg-[#7A9E8E] transition-colors"
                >
                  {t('go_toolbox')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Documents ────────────────────────────────────────── */}
      {activeTab === 'Documents' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <DocumentUpload clientId={client.id} />
          </div>
          {documents.length > 0 ? (
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="divide-y divide-[#2D4A3E]/10">
                {documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-center gap-4 p-5">
                    <span className="text-xl shrink-0">{FILE_ICONS[doc.file_type ?? ''] ?? '📎'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1C1C1A]">{doc.label ?? doc.file_name}</p>
                      <p className="text-xs text-[#6B6B65] mt-0.5">
                        {new Date(doc.created_at).toLocaleDateString(dateLang, { day: 'numeric', month: 'short', year: 'numeric' })}
                        {doc.is_shared
                          ? <span className="ml-2 text-[#7A9E8E]">{t('visible_client')}</span>
                          : <span className="ml-2">{t('internal_only')}</span>
                        }
                      </p>
                    </div>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors"
                    >
                      {t('download')}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-sm text-[#6B6B65] italic">{t('no_documents')}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Invoices ─────────────────────────────────────────── */}
      {activeTab === 'Invoices' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Link
              href={`/portal/invoices/new?client=${client.id}`}
              className="text-xs bg-[#2D4A3E] text-white px-4 py-2 rounded-full hover:bg-[#7A9E8E] transition-colors"
            >
              {t('new_invoice')}
            </Link>
          </div>
          {invoices.length > 0 ? (
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="divide-y divide-[#2D4A3E]/10">
                {invoices.map((inv: any) => (
                  <Link
                    key={inv.id}
                    href={`/portal/invoices/${inv.id}`}
                    className="flex items-center justify-between p-5 hover:bg-[#FAF7F2] transition-colors group"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-[#1C1C1A] font-mono">{inv.invoice_number}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES_INV[inv.status] ?? STATUS_STYLES_INV.draft}`}>
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B6B65]">
                        {new Date(inv.invoice_date).toLocaleDateString(dateLang, { day: 'numeric', month: 'short', year: 'numeric' })}
                        {inv.due_date && inv.status !== 'paid' && (
                          <> · {t('due', { date: new Date(inv.due_date).toLocaleDateString(dateLang, { day: 'numeric', month: 'short' }) })}</>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#1C1C1A]">£{Number(inv.total).toFixed(2)}</p>
                      <p className="text-xs text-[#6B6B65] group-hover:text-[#2D4A3E] transition-colors">{t('view')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center">
              <p className="text-sm text-[#6B6B65] italic">{t('no_invoices')}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Notes ────────────────────────────────────────────── */}
      {activeTab === 'Notes' && (
        <NotesEditor clientId={client.id} />
      )}
    </div>
  )
}
