import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  // Fetch summary stats
  const [{ count: clientCount }, { count: sessionCount }, { count: toolCount }] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('sessions').select('*', { count: 'exact', head: true }).gte('session_date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]),
    supabase.from('tools').select('*', { count: 'exact', head: true }).eq('status', 'published'),
  ])

  const { data: recentClients } = await supabase
    .from('clients')
    .select('id, status, profiles(full_name, email)')
    .order('created_at', { ascending: false })
    .limit(5)

  const stats = [
    { label: 'Active clients', value: clientCount ?? 0 },
    { label: 'Sessions this week', value: sessionCount ?? 0 },
    { label: 'Published tools', value: toolCount ?? 0 },
  ]

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1
            className="text-2xl font-semibold text-[#1C1C1A]"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Good to see you, {profile?.full_name?.split(' ')[0] ?? 'Ayelen'}.
          </h1>
          <p className="text-[#6B6B65] text-sm mt-1">Here&apos;s what&apos;s happening.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/portal/clients"
            className="bg-[#2D4A3E] text-white px-4 py-2 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors"
          >
            + Invite client
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-6">
            <p
              className="text-3xl font-semibold text-[#2D4A3E]"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              {s.value}
            </p>
            <p className="text-[#6B6B65] text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { href: '/portal/clients', label: 'View all clients', icon: '👤' },
          { href: '/portal/sessions', label: 'Log a session', icon: '📝' },
          { href: '/portal/toolbox', label: 'Manage toolbox', icon: '🧰' },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="bg-white rounded-2xl p-6 flex items-center gap-4 hover:border-[#2D4A3E]/20 border border-transparent transition-colors group"
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-sm font-medium text-[#1C1C1A] group-hover:text-[#2D4A3E] transition-colors">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Recent clients */}
      <div className="bg-white rounded-2xl">
        <div className="p-6 border-b border-[#2D4A3E]/10 flex items-center justify-between">
          <h2
            className="font-semibold text-[#1C1C1A]"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            Recent clients
          </h2>
          <Link href="/portal/clients" className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors">
            View all →
          </Link>
        </div>
        {recentClients && recentClients.length > 0 ? (
          <div className="divide-y divide-[#2D4A3E]/10">
            {recentClients.map((client: any) => (
              <Link
                key={client.id}
                href={`/portal/clients/${client.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-[#FAF7F2] transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-[#1C1C1A]">
                    {client.profiles?.full_name ?? 'Unknown'}
                  </p>
                  <p className="text-xs text-[#6B6B65]">{client.profiles?.email}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  client.status === 'active'
                    ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]'
                    : 'bg-[#6B6B65]/10 text-[#6B6B65]'
                }`}>
                  {client.status}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-[#6B6B65] text-sm italic">
            No clients yet. Invite your first client to get started.
          </div>
        )}
      </div>
    </PortalShell>
  )
}
