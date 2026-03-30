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

  const { data: clientRecord } = await supabase
    .from('clients')
    .select('*')
    .eq('profile_id', user.id)
    .single()

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('client_id', clientRecord?.id)
    .order('session_date', { ascending: false })
    .limit(3)

  const { data: allAssignments } = await supabase
    .from('tool_assignments')
    .select('*, tools(name, description, type)')
    .eq('client_id', clientRecord?.id)
    .order('assigned_at', { ascending: false })

  const activeAssignments = (allAssignments ?? []).filter((a: any) => a.status !== 'completed')
  const completedCount = (allAssignments ?? []).filter((a: any) => a.status === 'completed').length

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <PortalShell role="client" name={profile?.full_name ?? user.email ?? ''}>
      {/* Welcome */}
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-[#1C1C1A]"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Welcome back, {firstName}.
        </h1>
        {clientRecord?.programme && (
          <p className="text-[#6B6B65] text-sm mt-1">{clientRecord.programme}</p>
        )}
      </div>

      {/* Progress snapshot */}
      {(sessions?.length ?? 0) > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Sessions', value: sessions?.length ?? 0 },
            { label: 'Tools completed', value: completedCount },
            { label: 'Tools to do', value: activeAssignments.length },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 text-center">
              <p
                className="text-2xl font-semibold text-[#2D4A3E]"
                style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
              >
                {s.value}
              </p>
              <p className="text-xs text-[#6B6B65] mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Active tools */}
        <div className="bg-white rounded-2xl">
          <div className="px-6 py-5 border-b border-[#2D4A3E]/10 flex items-center justify-between">
            <h2
              className="font-semibold text-[#1C1C1A] text-sm"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Your tools
            </h2>
            <Link
              href="/portal/my-space/tools"
              className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors"
            >
              View all →
            </Link>
          </div>
          {activeAssignments.length > 0 ? (
            <div className="divide-y divide-[#2D4A3E]/10">
              {activeAssignments.slice(0, 4).map((a: any) => (
                <Link
                  key={a.id}
                  href="/portal/my-space/tools"
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#FAF7F2] transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1A] group-hover:text-[#2D4A3E] transition-colors">
                      {a.tools?.name}
                    </p>
                    {a.due_date && (
                      <p className="text-xs text-[#6B6B65] mt-0.5">
                        Due {new Date(a.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                    a.status === 'in_progress' ? 'bg-amber-100 text-amber-700' : 'bg-[#6B6B65]/10 text-[#6B6B65]'
                  }`}>
                    {a.status === 'in_progress' ? 'In progress' : 'To do'}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-[#6B6B65] italic">No active tools right now.</p>
            </div>
          )}
        </div>

        {/* Recent sessions */}
        <div className="bg-white rounded-2xl">
          <div className="px-6 py-5 border-b border-[#2D4A3E]/10 flex items-center justify-between">
            <h2
              className="font-semibold text-[#1C1C1A] text-sm"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Recent sessions
            </h2>
            <Link
              href="/portal/my-space/sessions"
              className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors"
            >
              View all →
            </Link>
          </div>
          {sessions && sessions.length > 0 ? (
            <div className="divide-y divide-[#2D4A3E]/10">
              {sessions.map((s: any) => (
                <Link
                  key={s.id}
                  href="/portal/my-space/sessions"
                  className="block px-6 py-4 hover:bg-[#FAF7F2] transition-colors"
                >
                  <p className="text-sm font-medium text-[#1C1C1A]">
                    {new Date(s.session_date).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                  {s.notes_shared && (
                    <p className="text-xs text-[#6B6B65] mt-1 line-clamp-2 leading-relaxed">{s.notes_shared}</p>
                  )}
                  {(s.next_steps || s.homework) && (
                    <p className="text-xs text-[#2D4A3E] mt-1.5">
                      {s.next_steps ? `Next: ${s.next_steps}` : `Homework: ${s.homework}`}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-[#6B6B65] italic">No sessions yet.</p>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  )
}
