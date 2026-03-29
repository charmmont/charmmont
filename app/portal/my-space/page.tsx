import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Space' }

export default async function MySpacePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'practitioner') redirect('/portal/dashboard')

  // Get client record
  const { data: clientRecord } = await supabase
    .from('clients')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  // Get upcoming/recent sessions
  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('client_id', clientRecord?.id)
    .order('session_date', { ascending: false })
    .limit(3)

  // Get assigned tools
  const { data: assignments } = await supabase
    .from('tool_assignments')
    .select('*, tools(name, description, type)')
    .eq('client_id', clientRecord?.id)
    .neq('status', 'completed')
    .order('assigned_at', { ascending: false })

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <PortalShell role="client" name={profile?.full_name ?? user.email ?? ''}>
      <div className="mb-10">
        <h1
          className="text-2xl font-semibold text-[#1C1C1A]"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Welcome back, {firstName}.
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent session */}
        <div className="bg-white rounded-2xl p-6">
          <h2
            className="font-semibold text-[#1C1C1A] mb-4"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Recent sessions
          </h2>
          {sessions && sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((s: any) => (
                <div key={s.id} className="border-l-2 border-[#7A9E8E] pl-4">
                  <p className="text-sm font-medium text-[#1C1C1A]">
                    {new Date(s.session_date).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long',
                    })}
                  </p>
                  {s.notes_shared && (
                    <p className="text-xs text-[#6B6B65] mt-1 line-clamp-2">{s.notes_shared}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6B6B65] italic">No sessions yet.</p>
          )}
          <Link
            href="/portal/my-space/sessions"
            className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors mt-4 inline-block"
          >
            View all sessions →
          </Link>
        </div>

        {/* Active tools */}
        <div className="bg-white rounded-2xl p-6">
          <h2
            className="font-semibold text-[#1C1C1A] mb-4"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Active tools
          </h2>
          {assignments && assignments.length > 0 ? (
            <div className="space-y-3">
              {assignments.map((a: any) => (
                <Link
                  key={a.id}
                  href={`/portal/my-space/tools`}
                  className="flex items-center justify-between group"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1A] group-hover:text-[#2D4A3E] transition-colors">
                      {a.tools?.name}
                    </p>
                    <p className="text-xs text-[#6B6B65] mt-0.5">
                      {a.tools?.type?.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    a.status === 'in_progress'
                      ? 'bg-[#7A9E8E]/20 text-[#7A9E8E]'
                      : 'bg-[#6B6B65]/10 text-[#6B6B65]'
                  }`}>
                    {a.status.replace('_', ' ')}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6B6B65] italic">No active tools assigned yet.</p>
          )}
          <Link
            href="/portal/my-space/tools"
            className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors mt-4 inline-block"
          >
            View all tools →
          </Link>
        </div>
      </div>
    </PortalShell>
  )
}
