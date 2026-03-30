import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

function statusBadge(status: string) {
  if (status === 'active') return 'bg-[#2D4A3E]/10 text-[#2D4A3E]'
  if (status === 'paused') return 'bg-amber-100 text-amber-700'
  return 'bg-[#6B6B65]/10 text-[#6B6B65]'
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  const today = new Date().toISOString().split('T')[0]
  const startOfWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

  const [
    { count: activeClients },
    { count: sessionsThisWeek },
    { count: sessionsThisMonth },
    { count: pendingTools },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('sessions').select('*', { count: 'exact', head: true }).gte('session_date', startOfWeek),
    supabase.from('sessions').select('*', { count: 'exact', head: true }).gte('session_date', startOfMonth),
    supabase.from('tool_assignments').select('*', { count: 'exact', head: true }).in('status', ['assigned', 'in_progress']),
  ])

  // Today's sessions
  const { data: todaysSessions } = await supabase
    .from('sessions')
    .select('*, clients(id, profiles(full_name))')
    .eq('session_date', today)
    .order('created_at', { ascending: true })

  // Recent activity: last 8 sessions + last 5 tool completions
  const { data: recentSessions } = await supabase
    .from('sessions')
    .select('id, session_date, session_type, clients(id, profiles(full_name))')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentCompletions } = await supabase
    .from('tool_assignments')
    .select('id, completed_at, tools(name), clients(id, profiles(full_name))')
    .eq('status', 'completed')
    .not('completed_at', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(5)

  // Merge activity feed
  type FeedItem = { type: 'session' | 'tool'; label: string; sub: string; href: string; date: string }
  const feed: FeedItem[] = [
    ...(recentSessions ?? []).map((s: any) => ({
      type: 'session' as const,
      label: `Session with ${s.clients?.profiles?.full_name ?? 'Unknown'}`,
      sub: s.session_type?.replace('_', '-') ?? 'session',
      href: `/portal/clients/${s.clients?.id}`,
      date: s.session_date,
    })),
    ...(recentCompletions ?? []).map((a: any) => ({
      type: 'tool' as const,
      label: `${a.clients?.profiles?.full_name ?? 'Client'} completed ${a.tools?.name ?? 'a tool'}`,
      sub: 'tool completed',
      href: `/portal/clients/${a.clients?.id}`,
      date: (a.completed_at as string).split('T')[0],
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8)

  const stats = [
    { label: 'Active clients', value: activeClients ?? 0, href: '/portal/clients' },
    { label: 'Sessions this week', value: sessionsThisWeek ?? 0, href: '/portal/sessions' },
    { label: 'Sessions this month', value: sessionsThisMonth ?? 0, href: '/portal/sessions' },
    { label: 'Pending tools', value: pendingTools ?? 0, href: '/portal/toolbox' },
  ]

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Ayelen'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-semibold text-[#1C1C1A]"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            {greeting}, {firstName}.
          </h1>
          <p className="text-[#6B6B65] text-sm mt-1">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/portal/sessions"
            className="border border-[#2D4A3E]/20 text-[#2D4A3E] px-4 py-2 rounded-full text-sm hover:bg-[#2D4A3E]/5 transition-colors"
          >
            + Log session
          </Link>
          <Link
            href="/portal/clients"
            className="bg-[#2D4A3E] text-white px-4 py-2 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors"
          >
            + New client
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white rounded-2xl p-6 hover:shadow-sm transition-shadow"
          >
            <p
              className="text-3xl font-semibold text-[#2D4A3E]"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              {s.value}
            </p>
            <p className="text-[#6B6B65] text-sm mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's schedule */}
        <div className="bg-white rounded-2xl">
          <div className="px-6 py-5 border-b border-[#2D4A3E]/10 flex items-center justify-between">
            <h2
              className="font-semibold text-[#1C1C1A] text-sm"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Today
            </h2>
            <span className="text-xs text-[#6B6B65]">
              {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          {todaysSessions && todaysSessions.length > 0 ? (
            <div className="divide-y divide-[#2D4A3E]/10">
              {todaysSessions.map((s: any) => (
                <Link
                  key={s.id}
                  href={`/portal/clients/${s.clients?.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-[#FAF7F2] transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1C1C1A]">
                      {s.clients?.profiles?.full_name ?? 'Client'}
                    </p>
                    <p className="text-xs text-[#6B6B65] mt-0.5 capitalize">
                      {s.session_type?.replace('_', '-') ?? 'Session'}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-[#6B6B65]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-[#6B6B65] italic">No sessions today.</p>
              <Link
                href="/portal/sessions"
                className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors mt-3 inline-block"
              >
                Log a session →
              </Link>
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-2xl">
          <div className="px-6 py-5 border-b border-[#2D4A3E]/10">
            <h2
              className="font-semibold text-[#1C1C1A] text-sm"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              Recent activity
            </h2>
          </div>
          {feed.length > 0 ? (
            <div className="divide-y divide-[#2D4A3E]/10">
              {feed.map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-start gap-3 px-6 py-4 hover:bg-[#FAF7F2] transition-colors"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs ${
                    item.type === 'session' ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]' : 'bg-[#7A9E8E]/20 text-[#7A9E8E]'
                  }`}>
                    {item.type === 'session' ? '📋' : '✓'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-[#1C1C1A] leading-snug">{item.label}</p>
                    <p className="text-xs text-[#6B6B65] mt-0.5 capitalize">
                      {item.sub} · {new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-[#6B6B65] italic">No activity yet.</p>
              <Link
                href="/portal/clients"
                className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors mt-3 inline-block"
              >
                Invite your first client →
              </Link>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  )
}
