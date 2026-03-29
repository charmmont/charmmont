import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Sessions' }

export default async function MySessionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'practitioner') redirect('/portal/dashboard')

  const { data: clientRecord } = await supabase
    .from('clients').select('id').eq('profile_id', user.id).single()

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('client_id', clientRecord?.id)
    .order('session_date', { ascending: false })

  return (
    <PortalShell role="client" name={profile?.full_name ?? user.email ?? ''}>
      <Link
        href="/portal/my-space"
        className="text-sm text-[#6B6B65] hover:text-[#2D4A3E] transition-colors inline-flex items-center gap-2 mb-8"
      >
        ← My Space
      </Link>

      <h1
        className="text-2xl font-semibold text-[#1C1C1A] mb-8"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        My Sessions
      </h1>

      <div className="bg-white rounded-2xl overflow-hidden">
        {sessions && sessions.length > 0 ? (
          <div className="divide-y divide-[#2D4A3E]/10">
            {sessions.map((s: any) => (
              <div key={s.id} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <p className="font-medium text-sm text-[#1C1C1A]">
                    {new Date(s.session_date).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </p>
                  <span className="text-xs text-[#6B6B65]">{s.duration_minutes} min</span>
                </div>
                {s.notes_shared ? (
                  <p className="text-sm text-[#6B6B65] leading-relaxed">{s.notes_shared}</p>
                ) : (
                  <p className="text-sm text-[#6B6B65] italic">No shared notes for this session.</p>
                )}
                {s.next_steps && (
                  <div className="mt-3 p-3 bg-[#FAF7F2] rounded-lg">
                    <p className="text-xs font-medium text-[#2D4A3E] mb-1">Next steps</p>
                    <p className="text-xs text-[#6B6B65]">{s.next_steps}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center text-[#6B6B65] text-sm italic">
            No sessions yet.
          </div>
        )}
      </div>
    </PortalShell>
  )
}
