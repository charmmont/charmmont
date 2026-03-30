import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import LogSessionForm from './LogSessionForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sessions' }

const typeLabel: Record<string, string> = {
  video: 'Video',
  phone: 'Phone',
  in_person: 'In person',
}

export default async function SessionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*, clients(id, profiles(full_name))')
    .order('session_date', { ascending: false })
    .limit(100)

  const { data: clients } = await supabase
    .from('clients')
    .select('id, profiles(full_name)')
    .eq('status', 'active')

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl font-semibold text-[#1C1C1A]"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Sessions
        </h1>
        <LogSessionForm clients={clients ?? []} />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        {sessions && sessions.length > 0 ? (
          <>
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[1fr_140px_100px_100px_80px] gap-4 px-6 py-3 border-b border-[#2D4A3E]/10 text-xs font-medium text-[#6B6B65] uppercase tracking-wider">
              <span>Client</span>
              <span>Date</span>
              <span>Duration</span>
              <span>Type</span>
              <span>Status</span>
            </div>
            <div className="divide-y divide-[#2D4A3E]/10">
              {sessions.map((s: any) => (
                <div key={s.id} className="px-6 py-4">
                  {/* Mobile */}
                  <div className="md:hidden">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium text-sm text-[#1C1C1A]">
                          {s.clients?.profiles?.full_name ?? 'Unknown'}
                        </p>
                        <p className="text-xs text-[#6B6B65] mt-0.5">
                          {new Date(s.session_date).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                          {' · '}{s.duration_minutes}m
                          {s.session_type ? ` · ${typeLabel[s.session_type] ?? s.session_type}` : ''}
                        </p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        {s.flag_followup && (
                          <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full">Follow-up</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          s.status === 'complete' ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {s.status ?? 'complete'}
                        </span>
                      </div>
                    </div>
                    {s.notes_shared && (
                      <p className="text-sm text-[#6B6B65] line-clamp-2 leading-relaxed">{s.notes_shared}</p>
                    )}
                  </div>

                  {/* Desktop */}
                  <div className="hidden md:grid grid-cols-[1fr_140px_100px_100px_80px] gap-4 items-center">
                    <div>
                      <p className="font-medium text-sm text-[#1C1C1A]">
                        {s.clients?.profiles?.full_name ?? 'Unknown'}
                      </p>
                      {s.notes_shared && (
                        <p className="text-xs text-[#6B6B65] mt-0.5 line-clamp-1">{s.notes_shared}</p>
                      )}
                    </div>
                    <p className="text-sm text-[#6B6B65]">
                      {new Date(s.session_date).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-[#6B6B65]">{s.duration_minutes} min</p>
                    <p className="text-sm text-[#6B6B65]">
                      {typeLabel[s.session_type] ?? '—'}
                    </p>
                    <div className="flex flex-col gap-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${
                        s.status === 'complete' ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {s.status ?? 'complete'}
                      </span>
                      {s.flag_followup && (
                        <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full w-fit">Follow-up</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-16 text-center">
            <p className="text-[#6B6B65] text-sm italic mb-6">No sessions logged yet.</p>
            <LogSessionForm clients={clients ?? []} />
          </div>
        )}
      </div>
    </PortalShell>
  )
}
