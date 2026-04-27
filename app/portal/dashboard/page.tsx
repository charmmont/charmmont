import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'

export const metadata: Metadata = { title: 'Dashboard' }


export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  const [t, locale] = await Promise.all([getTranslations('Dashboard'), getLocale()])

  const today = new Date().toISOString().split('T')[0]
  const startOfWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  const dateLang = locale === 'es' ? 'es-ES' : 'en-GB'

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

  const { data: upcomingSessions } = await supabase
    .from('sessions')
    .select('*, clients(id, profiles(full_name))')
    .gte('session_date', today)
    .in('status', ['booked', 'confirmed'])
    .order('scheduled_at', { ascending: true, nullsFirst: false })
    .order('session_date', { ascending: true })
    .limit(8)

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

  type FeedItem = { type: 'session' | 'tool'; label: string; sub: string; href: string; date: string }
  const feed: FeedItem[] = [
    ...(recentSessions ?? []).map((s: any) => ({
      type: 'session' as const,
      label: t('feed_session', { name: s.clients?.profiles?.full_name ?? 'Unknown' }),
      sub: t('feed_session_sub'),
      href: `/portal/clients/${s.clients?.id}`,
      date: s.session_date,
    })),
    ...(recentCompletions ?? []).map((a: any) => ({
      type: 'tool' as const,
      label: t('feed_completion', { name: a.clients?.profiles?.full_name ?? 'Client', tool: a.tools?.name ?? 'a tool' }),
      sub: t('feed_tool_sub'),
      href: `/portal/clients/${a.clients?.id}`,
      date: (a.completed_at as string).split('T')[0],
    })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8)

  const stats = [
    { label: t('stat_active_clients'), value: activeClients ?? 0, href: '/portal/clients' },
    { label: t('stat_sessions_week'), value: sessionsThisWeek ?? 0, href: '/portal/sessions' },
    { label: t('stat_sessions_month'), value: sessionsThisMonth ?? 0, href: '/portal/sessions' },
    { label: t('stat_pending_tools'), value: pendingTools ?? 0, href: '/portal/toolbox' },
  ]

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Ayelen'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('greeting_morning') : hour < 17 ? t('greeting_afternoon') : t('greeting_evening')

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-semibold text-[#1C1C1A]"
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            {greeting}, {firstName}.
          </h1>
          <p className="text-[#6B6B65] text-sm mt-1">
            {new Date().toLocaleDateString(dateLang, { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/portal/sessions"
            className="border border-[#2D4A3E]/20 text-[#2D4A3E] px-4 py-2 rounded-full text-sm hover:bg-[#2D4A3E]/5 transition-colors"
          >
            {t('log_session')}
          </Link>
          <Link
            href="/portal/clients"
            className="bg-[#2D4A3E] text-white px-4 py-2 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors"
          >
            {t('new_client')}
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
              style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
            >
              {s.value}
            </p>
            <p className="text-[#6B6B65] text-sm mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming sessions */}
        <div className="bg-white rounded-2xl">
          <div className="px-6 py-5 border-b border-[#2D4A3E]/10 flex items-center justify-between">
            <h2
              className="font-semibold text-[#1C1C1A] text-sm"
              style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
            >
              {t('upcoming_title')}
            </h2>
            <Link href="/portal/sessions" className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors">
              {t('view_all')}
            </Link>
          </div>
          {upcomingSessions && upcomingSessions.length > 0 ? (
            <div className="divide-y divide-[#2D4A3E]/10">
              {upcomingSessions.map((s: any) => {
                const programmeLabel =
                  s.programme === 'first_root' ? t('programme_first_root') :
                  s.programme === 'becoming' ? t('programme_becoming') :
                  s.programme === 'in_full_bloom' ? t('programme_in_full_bloom') :
                  s.session_type?.replace('_', '-') ?? 'Session'
                const programmePill =
                  s.programme === 'first_root' ? 'bg-[#7A9E8E]/15 text-[#2D4A3E]' :
                  s.programme === 'becoming' ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]' :
                  'bg-[#6B6B65]/10 text-[#6B6B65]'
                const isToday = s.session_date === today
                const timeLabel = s.scheduled_at
                  ? new Date(s.scheduled_at).toLocaleTimeString(dateLang, { hour: '2-digit', minute: '2-digit' })
                  : null
                return (
                  <Link
                    key={s.id}
                    href={`/portal/clients/${s.clients?.id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#FAF7F2] transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="text-center shrink-0 w-10">
                        <p className={`text-[10px] font-semibold uppercase tracking-wide ${isToday ? 'text-[#2D4A3E]' : 'text-[#6B6B65]'}`}>
                          {isToday ? t('today') : new Date(s.session_date).toLocaleDateString(dateLang, { weekday: 'short' })}
                        </p>
                        <p className="text-base font-semibold text-[#1C1C1A] leading-tight">
                          {new Date(s.session_date).getDate()}
                        </p>
                        {timeLabel && <p className="text-[10px] text-[#6B6B65]">{timeLabel}</p>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1C1C1A] truncate">
                          {s.clients?.profiles?.full_name ?? 'Client'}
                        </p>
                        <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${programmePill}`}>
                          {programmeLabel}
                        </span>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-[#6B6B65] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-[#6B6B65] italic">{t('no_upcoming')}</p>
              <Link
                href="/portal/sessions"
                className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors mt-3 inline-block"
              >
                {t('book_session')}
              </Link>
            </div>
          )}
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-2xl">
          <div className="px-6 py-5 border-b border-[#2D4A3E]/10">
            <h2
              className="font-semibold text-[#1C1C1A] text-sm"
              style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
            >
              {t('activity_title')}
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
                      {item.sub} · {new Date(item.date).toLocaleDateString(dateLang, { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="px-6 py-8 text-center">
              <p className="text-sm text-[#6B6B65] italic">{t('no_activity')}</p>
              <Link
                href="/portal/clients"
                className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors mt-3 inline-block"
              >
                {t('invite_client')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  )
}
