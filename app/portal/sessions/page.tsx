import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import LogSessionForm from './LogSessionForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Sessions' }

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
    .limit(50)

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
          <div className="divide-y divide-[#2D4A3E]/10">
            {sessions.map((s: any) => (
              <div key={s.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-medium text-sm text-[#1C1C1A]">
                      {s.clients?.profiles?.full_name ?? 'Unknown client'}
                    </p>
                    <p className="text-xs text-[#6B6B65] mt-0.5">
                      {new Date(s.session_date).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })} · {s.duration_minutes} min
                    </p>
                  </div>
                </div>
                {s.notes_shared && (
                  <p className="text-sm text-[#6B6B65] leading-relaxed mb-2 line-clamp-3">
                    {s.notes_shared}
                  </p>
                )}
                {s.next_steps && (
                  <p className="text-xs text-[#2D4A3E]">Next steps: {s.next_steps}</p>
                )}
              </div>
            ))}
          </div>
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
